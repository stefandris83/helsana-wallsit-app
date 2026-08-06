import { describe, expect, it } from 'vitest';
import { aggregate, defaultFilters, isFullyCompleted } from './aggregation';
import type { PilotParticipantRecord } from './pilot-dataset';
import { createEmptyParticipant } from './participant';
import { SETS_PER_SESSION } from '../domain/week-matrix';
import type { SessionCompletion, SetResult, TrainingSession } from '../domain/types';

/**
 * Vollstaendig durchgefuehrte Einheiten (§26).
 *
 * Die Kennzahl leitet sich aus dem aufgezeichneten Verlauf ab und ist damit
 * unabhaengig von der Selbstauskunft in der Rueckmeldung nach der Einheit.
 * Beide Groessen stehen im Dashboard nebeneinander.
 */

function set(overrides: Partial<SetResult> = {}): SetResult {
  return {
    index: 0,
    heldSeconds: 45,
    targetReached: true,
    optionalStarted: false,
    optionalTargetReached: false,
    stoppedEarly: false,
    ...overrides,
  };
}

function session(overrides: Partial<TrainingSession> = {}): TrainingSession {
  return {
    id: 'ses_1',
    date: '2026-08-03',
    programWeek: 1,
    variant: 'standard',
    targetSeconds: 40,
    optionalTargetSeconds: null,
    sets: Array.from({ length: SETS_PER_SESSION }, (_, index) => set({ index })),
    feedback: { completion: 'full', exertion: 'fitting', complaints: false, wellbeing: 'good' },
    startedAt: '2026-08-03T18:00:00.000Z',
    endedAt: '2026-08-03T18:12:00.000Z',
    aborted: false,
    checkin: { mood: 'good', wish: 'suggest' },
    deviation: 'none',
    ...overrides,
  };
}

function record(sessions: TrainingSession[]): PilotParticipantRecord {
  return {
    pilotId: 'P-001',
    participant: { ...createEmptyParticipant(), sessions },
    bpEntryCount: 0,
    bpEntries: [],
    events: [],
    demo: false,
  };
}

describe('Vollstaendig durchgefuehrte Einheit', () => {
  it('zaehlt eine Einheit mit vier erreichten Saetzen', () => {
    expect(isFullyCompleted(session())).toBe(true);
  });

  it('zaehlt eine abgebrochene Einheit nicht', () => {
    expect(isFullyCompleted(session({ aborted: true }))).toBe(false);
  });

  it('zaehlt eine Einheit mit zu wenigen Saetzen nicht', () => {
    expect(isFullyCompleted(session({ sets: [set(), set({ index: 1 })] }))).toBe(false);
  });

  it('zaehlt eine Einheit nicht, wenn ein Satz das Zwischenziel verfehlt', () => {
    const sets = Array.from({ length: SETS_PER_SESSION }, (_, index) => set({ index }));
    sets[2] = set({ index: 2, targetReached: false, stoppedEarly: true, heldSeconds: 12 });
    expect(isFullyCompleted(session({ sets }))).toBe(false);
  });

  it('bewertet unabhaengig von der Selbstauskunft', () => {
    // Verlauf vollstaendig, Person meldet «teilweise» — der Verlauf zaehlt.
    const optimistic = session({
      feedback: { completion: 'partial', exertion: 'hard', complaints: false, wellbeing: 'good' },
    });
    expect(isFullyCompleted(optimistic)).toBe(true);

    // Umgekehrt: Person meldet «vollstaendig», der Verlauf zeigt einen Abbruch.
    const sets = Array.from({ length: SETS_PER_SESSION }, (_, index) => set({ index }));
    sets[3] = set({ index: 3, targetReached: false, stoppedEarly: true });
    expect(isFullyCompleted(session({ sets }))).toBe(false);
  });
});

describe('Kennzahl im Dashboard', () => {
  it('weist Verlauf und Selbstauskunft getrennt aus', () => {
    const completions: SessionCompletion[] = ['full', 'full', 'partial'];
    const sessions = completions.map((completion, index) => {
      const sets = Array.from({ length: SETS_PER_SESSION }, (_, setIndex) => set({ index: setIndex }));
      // Nur die letzte Einheit wurde tatsaechlich abgebrochen.
      if (index === 2) sets[1] = set({ index: 1, targetReached: false, stoppedEarly: true });
      return session({
        id: `ses_${index}`,
        sets,
        feedback: { completion, exertion: 'fitting', complaints: false, wellbeing: 'good' },
      });
    });

    const metrics = aggregate([record(sessions)], defaultFilters, '2026-08-10', 1);

    expect(metrics.sessionsTotal).toBe(3);
    expect(metrics.sessionsFullyCompleted).toBe(2);
    expect(metrics.completionSplit).toEqual({ full: 2, partial: 1, none: 0 });
  });
});
