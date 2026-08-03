import { describe, expect, it } from 'vitest';
import { appEventTypes, eventPayloadFields, forbiddenEventFields } from './events';
import type { AppEventType } from './events';
import { appendEvent, loadEvents } from './event-log';

/** B.11.7: Vollstaendigkeit des Ereignismodells aus §27. */

/** Wortlaut aus spec.md §27, bewusst dupliziert als unabhaengige Referenz. */
const specEventTypes = [
  'consent_completed',
  'onboarding_started',
  'onboarding_completed',
  'welcome_carousel_completed',
  'training_plan_created',
  'session_checkin_completed',
  'session_started',
  'light_variant_selected',
  'standard_variant_selected',
  'personal_target_reached',
  'optional_target_started',
  'optional_target_reached',
  'set_stopped_early',
  'session_paused',
  'session_completed',
  'session_partially_completed',
  'session_abandoned',
  'post_session_feedback_completed',
  'learning_card_opened',
  'notification_enabled',
  'notification_disabled',
  'bp_diary_opt_in',
  'bp_entry_created',
  'bp_entry_edited',
  'bp_entry_deleted',
  'program_week_completed',
  'program_completed',
];

describe('Ereignismodell (§27)', () => {
  it('deckt genau die in der Spezifikation genannten Ereignisse ab', () => {
    expect([...appEventTypes].sort()).toEqual([...specEventTypes].sort());
  });

  it('definiert fuer jeden Ereignistyp die gespeicherten Felder', () => {
    expect(Object.keys(eventPayloadFields).sort()).toEqual([...appEventTypes].sort());
  });

  it('speichert keine personenbezogenen oder medizinischen Felder', () => {
    for (const [type, fields] of Object.entries(eventPayloadFields)) {
      for (const field of fields) {
        expect(
          forbiddenEventFields.includes(field as (typeof forbiddenEventFields)[number]),
          `Ereignis ${type} enthaelt unzulaessiges Feld ${field}`,
        ).toBe(false);
      }
    }
  });

  it('speichert bei Blutdruckereignissen keinerlei Werte', () => {
    const bpEvents: AppEventType[] = [
      'bp_diary_opt_in',
      'bp_entry_created',
      'bp_entry_edited',
      'bp_entry_deleted',
    ];
    for (const type of bpEvents) {
      expect(eventPayloadFields[type]).toEqual([]);
    }
  });
});

describe('Ereignis-Log (B.4)', () => {
  it('haengt Ereignisse an und ueberschreibt nie bestehende', () => {
    appendEvent('onboarding_started', {});
    appendEvent('consent_completed', {});
    appendEvent('session_started', {
      sessionId: 's1',
      variant: 'light',
      targetSeconds: 30,
      deviation: 'none',
    });

    const events = loadEvents();
    expect(events).toHaveLength(3);
    expect(events.map((event) => event.type)).toEqual([
      'onboarding_started',
      'consent_completed',
      'session_started',
    ]);
  });

  it('vergibt eindeutige Kennungen und Zeitstempel', () => {
    appendEvent('onboarding_started', {});
    appendEvent('onboarding_started', {});
    const events = loadEvents();
    expect(new Set(events.map((event) => event.id)).size).toBe(2);
    expect(events.every((event) => !Number.isNaN(Date.parse(event.at)))).toBe(true);
  });

  it('haelt die Programmwoche fest, wenn sie bekannt ist', () => {
    appendEvent(
      'session_started',
      { sessionId: 's1', variant: 'light', targetSeconds: 30, deviation: 'none' },
      { programWeek: 4 },
    );
    expect(loadEvents()[0].programWeek).toBe(4);
  });
});
