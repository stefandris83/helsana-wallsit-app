import { describe, expect, it } from 'vitest';
import { createBpEntry } from './bp-repository';
import { appendEvent } from './event-log';
import type { Identity, ParticipantData } from './participant';
import { createEmptyParticipant } from './participant';
import { localRecord } from './pilot-dataset';
import { parseSharedReport } from './report-import';
import { REPORT_SCHEMA, buildSharedReport, reportFileName } from './report-sharing';
import { STORAGE_KEYS, getStorageAdapter } from './storage-adapter';
import type { Profile, TrainingPlan, TrainingSession } from '../domain/types';

/**
 * Freiwillig geteilter Ergebnisbericht: der Bericht darf ausschliesslich die
 * Daten enthalten, die im Dashboard ohnehin zulaessig sind (§26, B.13.6).
 */

const CONTACT = 'kontakt-platzhalter@example.invalid';
const NOTE = 'Freitextnotiz aus dem Tagebuch';

const identity: Identity = {
  accessCode: 'WS-2026-A1B2',
  pilotId: 'P-001',
  contact: CONTACT,
  activatedAt: '2026-03-02T08:00:00.000Z',
};

const profile: Profile = {
  birthYear: 1979,
  heightCm: 178,
  weightKg: 82,
  sex: 'female',
  waistCm: 91,
  dailyActivity: 'sitting',
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
      heldSeconds: 34,
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
  const storage = getStorageAdapter();
  storage.clearAll();
  const participant: ParticipantData = {
    ...createEmptyParticipant(),
    profile,
    plan,
    sessions: [session],
    safetyConfirmed: true,
    bpConsent: true,
    onboardingStartedAt: '2026-03-02T07:30:00.000Z',
    onboardingCompletedAt: '2026-03-02T08:00:00.000Z',
    learningCardsOpened: ['card-1'],
  };
  storage.write(STORAGE_KEYS.identity, identity);
  storage.write(STORAGE_KEYS.participant, participant);
  createBpEntry({
    date: '2026-03-02',
    time: '07:15',
    systolic: 128,
    diastolic: 84,
    pulse: 62,
    daypart: 'morning',
    note: NOTE,
  });
  appendEvent('session_completed', { sessionId: 'ses_1', setsReached: 4 }, { programWeek: 1 });
  return participant;
}

describe('Ergebnisbericht', () => {
  it('enthaelt keine Identitaetsdaten, keine Blutdruckwerte und keine Freitexte', () => {
    seedLocalState();
    const record = localRecord();
    expect(record).not.toBeNull();

    const report = buildSharedReport(record!);
    const serialised = JSON.stringify(report);

    expect(serialised).not.toContain(CONTACT);
    expect(serialised).not.toContain(identity.accessCode);
    expect(serialised).not.toContain(NOTE);
    // Einzelne Blutdruckzahlen duerfen nicht auftauchen, nur die Anzahl.
    expect(serialised).not.toContain('128');
    expect(serialised).not.toContain('"systolic"');
    expect(report.bpEntryCount).toBe(1);
  });

  it('entfernt die Profilangaben vor dem Versand', () => {
    seedLocalState();
    const report = buildSharedReport(localRecord()!);
    const serialised = JSON.stringify(report);

    expect(report.participant.profile).toBeNull();
    expect(serialised).not.toContain('1979');
    expect(serialised).not.toContain('"heightCm"');
    expect(serialised).not.toContain('"weightKg"');
  });

  it('behaelt die auswertungsrelevanten Nutzungsdaten', () => {
    seedLocalState();
    const report = buildSharedReport(localRecord()!);

    expect(report.pilotId).toBe('P-001');
    expect(report.participant.sessions).toHaveLength(1);
    expect(report.participant.sessions[0]?.sets[0]?.heldSeconds).toBe(34);
    expect(report.participant.learningCardsOpened).toEqual(['card-1']);
    expect(report.events.some((event) => event.type === 'session_completed')).toBe(true);
  });

  it('bildet einen Dateinamen aus Pilotnummer und Zeitpunkt', () => {
    seedLocalState();
    const report = buildSharedReport(localRecord()!, new Date('2026-03-02T18:30:00.000Z'));
    expect(reportFileName(report)).toBe('P-001-2026-03-02T18-30-00-000Z.json');
  });
});

describe('Einlesen geteilter Berichte', () => {
  it('liest einen erzeugten Bericht wieder ein', () => {
    seedLocalState();
    const report = buildSharedReport(localRecord()!);
    const parsed = parseSharedReport(JSON.parse(JSON.stringify(report)));

    expect(parsed).not.toBeNull();
    expect(parsed!.pilotId).toBe('P-001');
    expect(parsed!.participant.sessions).toHaveLength(1);
    expect(parsed!.bpEntryCount).toBe(1);
  });

  it('weist fremde oder beschaedigte Dateien zurueck', () => {
    expect(parseSharedReport(null)).toBeNull();
    expect(parseSharedReport({ schema: 'etwas-anderes' })).toBeNull();
    expect(parseSharedReport({ schema: REPORT_SCHEMA, pilotId: '' })).toBeNull();
    expect(parseSharedReport({ schema: REPORT_SCHEMA, pilotId: 'P-002' })).toBeNull();
  });

  it('uebernimmt keine untergeschobenen Profil- oder Blutdruckfelder', () => {
    const parsed = parseSharedReport({
      schema: REPORT_SCHEMA,
      pilotId: 'P-002',
      bpEntryCount: 3,
      participant: {
        ...createEmptyParticipant(),
        profile,
        bpEntries: [{ systolic: 128, diastolic: 84 }],
        note: NOTE,
      },
      events: [],
    });

    expect(parsed).not.toBeNull();
    expect(parsed!.participant.profile).toBeNull();
    expect(JSON.stringify(parsed)).not.toContain(NOTE);
    expect(JSON.stringify(parsed)).not.toContain('"systolic"');
  });
});
