import { describe, expect, it } from 'vitest';
import { aggregate, defaultFilters } from './aggregation';
import { createBpEntry } from './bp-repository';
import { appendEvent } from './event-log';
import { exportEventsCsv, exportSessionsCsv } from './export';
import type { Identity, ParticipantData } from './participant';
import { createEmptyParticipant } from './participant';
import { buildPilotDataset, localRecord } from './pilot-dataset';
import { STORAGE_KEYS, getStorageAdapter } from './storage-adapter';
import { demoPilotRecords } from '../demo/demo-data';
import { toIsoDate } from '../domain/dates';
import type { TrainingPlan, TrainingSession } from '../domain/types';

/** B.11.9: Anonymisierung von Dashboard und Standardexport (§26). */

const CONTACT = 'kontakt-platzhalter@example.invalid';
const NOTE = 'Freitextnotiz aus dem Tagebuch';

const identity: Identity = {
  accessCode: 'WS-2026-A1B2',
  pilotId: 'P-001',
  contact: CONTACT,
  activatedAt: '2026-03-02T08:00:00.000Z',
};

const plan: TrainingPlan = {
  startDate: '2026-03-02',
  trainingDays: ['mon', 'wed', 'fri'],
  preferredDaytime: 'evening',
  preciseTimes: null,
  routineCue: null,
  createdAt: '2026-03-02T08:00:00.000Z',
};

const session: TrainingSession = {
  id: 'ses_1',
  date: '2026-03-02',
  programWeek: 1,
  variant: 'light',
  targetSeconds: 30,
  optionalTargetSeconds: 60,
  sets: [
    {
      index: 0,
      heldSeconds: 30,
      targetReached: true,
      optionalStarted: false,
      optionalTargetReached: false,
      stoppedEarly: false,
    },
  ],
  feedback: { completion: 'full', exertion: 'fitting', complaints: false, wellbeing: 'good' },
  startedAt: '2026-03-02T18:00:00.000Z',
  endedAt: '2026-03-02T18:12:00.000Z',
  aborted: false,
  checkin: { mood: 'good', wish: 'suggest' },
  deviation: 'none',
};

function seedLocalState(): ParticipantData {
  const participant: ParticipantData = {
    ...createEmptyParticipant(),
    profile: {
      birthYear: 1975,
      heightCm: 174,
      weightKg: 78,
      sex: 'female',
      waistCm: 88,
      dailyActivity: 'sitting',
    },
    plan,
    sessions: [session],
    onboardingStartedAt: '2026-03-02T07:45:00.000Z',
    onboardingCompletedAt: '2026-03-02T08:00:00.000Z',
    bpConsent: true,
  };
  const storage = getStorageAdapter();
  storage.write(STORAGE_KEYS.identity, identity);
  storage.write(STORAGE_KEYS.participant, participant);
  createBpEntry({
    date: '2026-03-03',
    time: '07:15',
    systolic: 147,
    diastolic: 93,
    pulse: 71,
    note: NOTE,
    daypart: 'morning',
  });
  appendEvent('session_started', {
    sessionId: 'ses_1',
    variant: 'light',
    targetSeconds: 30,
    deviation: 'none',
  });
  appendEvent('bp_entry_created', {});
  return participant;
}

describe('Auswertungsdatensatz (§26 «Datenschutzgrenze»)', () => {
  it('enthaelt weder Zugangscode noch Kontaktangabe', () => {
    seedLocalState();
    const record = localRecord();
    expect(record).not.toBeNull();
    const serialized = JSON.stringify(record);
    expect(serialized).not.toContain(CONTACT);
    expect(serialized).not.toContain(identity.accessCode);
    expect(record?.pilotId).toBe('P-001');
  });

  it('enthaelt vom Blutdrucktagebuch nur die Anzahl der Eintraege', () => {
    seedLocalState();
    const record = localRecord();
    expect(record?.bpEntryCount).toBe(1);
    const serialized = JSON.stringify(record);
    expect(serialized).not.toContain('147');
    expect(serialized).not.toContain(NOTE);
  });
});

describe('Standardexport (§26 «Export»)', () => {
  it('enthaelt keine Namen, Kontaktangaben, Notizen oder Blutdruckwerte', () => {
    seedLocalState();
    const records = buildPilotDataset();
    const sessionsCsv = exportSessionsCsv(records);
    const eventsCsv = exportEventsCsv(records);

    for (const csv of [sessionsCsv, eventsCsv]) {
      expect(csv).not.toContain(CONTACT);
      expect(csv).not.toContain(NOTE);
      expect(csv).not.toContain('147');
      expect(csv).not.toContain('93');
      expect(csv).not.toContain(identity.accessCode);
    }
  });

  it('enthaelt die vorgeschriebenen Spalten und die Pilot-ID', () => {
    seedLocalState();
    const csv = exportSessionsCsv(buildPilotDataset());
    const header = csv.split('\n')[0];
    for (const column of [
      'pilot_id',
      'programmwoche',
      'variante',
      'zielzeit_sekunden',
      'haltezeit_gesamt_sekunden',
      'durchfuehrung',
      'belastung',
      'wohlbefinden',
      'beschwerden',
      'lernkarten_geoeffnet',
      'erinnerungen_aktiv',
      'blutdruck_eintraege_anzahl',
    ]) {
      expect(header).toContain(column);
    }
    expect(csv).toContain('P-001');
  });

  it('pseudonymisiert Einheiten-Kennungen im Ereignisexport', () => {
    seedLocalState();
    const csv = exportEventsCsv(buildPilotDataset());
    expect(csv).not.toContain('ses_1');
    expect(csv).toContain('S1');
  });

  it('enthaelt kein Geburtsjahr und keine Koerpermasse', () => {
    seedLocalState();
    const csv = exportSessionsCsv(buildPilotDataset());
    expect(csv).not.toContain('1975');
    expect(csv).not.toContain('174');
    expect(csv).not.toContain('88');
  });
});

describe('Mindestgruppengroesse im Dashboard (B.13.7)', () => {
  const today = toIsoDate(new Date());

  it('meldet zu wenige Daten unterhalb des Schwellenwerts', () => {
    seedLocalState();
    const metrics = aggregate(buildPilotDataset(), defaultFilters, today, 5);
    expect(metrics.participantCount).toBe(1);
    expect(metrics.sufficientData).toBe(false);
  });

  it('gibt Werte ab dem Schwellenwert frei', () => {
    seedLocalState();
    const records = buildPilotDataset(demoPilotRecords());
    const metrics = aggregate(records, defaultFilters, today, 5);
    expect(metrics.participantCount).toBeGreaterThanOrEqual(5);
    expect(metrics.sufficientData).toBe(true);
    expect(metrics.sessionsTotal).toBeGreaterThan(0);
  });

  it('respektiert einen konfigurierten hoeheren Schwellenwert', () => {
    seedLocalState();
    const records = buildPilotDataset(demoPilotRecords());
    expect(aggregate(records, defaultFilters, today, 99).sufficientData).toBe(false);
  });

  it('filtert nach Programmwoche und Variante', () => {
    seedLocalState();
    const records = buildPilotDataset(demoPilotRecords());
    const onlyLight = aggregate(
      records,
      { ...defaultFilters, variant: 'light' },
      today,
      1,
    );
    expect(onlyLight.standardVariantSessions).toBe(0);
    expect(onlyLight.lightVariantSessions).toBeGreaterThan(0);

    const week1 = aggregate(records, { ...defaultFilters, programWeek: 1 }, today, 1);
    expect(week1.sessionsTotal).toBeGreaterThan(0);
    expect(week1.sessionsTotal).toBeLessThan(
      aggregate(records, defaultFilters, today, 1).sessionsTotal,
    );
  });
});
