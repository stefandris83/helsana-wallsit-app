import { describe, expect, it } from 'vitest';
import { deviationOf, evaluateStartGate, needsConfirmation } from './session-gate';
import type { TrainingPlan, TrainingSession } from './types';

/**
 * Sanftes Tor vor dem Start einer Einheit (§14, §12 Frage 4).
 * Kein Fall sperrt den Start — jeder ist uebersteuerbar.
 */

// 2026-03-02 ist ein Montag.
const plan: TrainingPlan = {
  startDate: '2026-03-02',
  trainingDays: ['mon', 'wed', 'fri'],
  preferredDaytime: 'evening',
  preciseTimes: null,
  routineCue: null,
  createdAt: '2026-03-02T08:00:00.000Z',
};

function session(date: string, overrides: Partial<TrainingSession> = {}): TrainingSession {
  return {
    id: `ses_${date}`,
    date,
    programWeek: 1,
    variant: 'light',
    targetSeconds: 30,
    optionalTargetSeconds: 60,
    sets: [],
    feedback: { completion: 'full', exertion: 'fitting', complaints: false, wellbeing: 'good' },
    startedAt: `${date}T18:00:00.000Z`,
    endedAt: `${date}T18:12:00.000Z`,
    aborted: false,
    checkin: { mood: 'good', wish: 'suggest' },
    deviation: 'none',
    ...overrides,
  };
}

describe('Tageslage vor dem Start', () => {
  it('gibt an einem geplanten Tag ohne Vorgeschichte frei', () => {
    const gate = evaluateStartGate(plan, [], '2026-03-02');
    expect(gate.kind).toBe('open');
    expect(needsConfirmation(gate)).toBe(false);
    expect(deviationOf(gate)).toBe('none');
  });

  it('erkennt einen Ruhetag ohne Rueckfrage', () => {
    const gate = evaluateStartGate(plan, [], '2026-03-03'); // Dienstag
    expect(gate.kind).toBe('rest-day');
    expect(needsConfirmation(gate)).toBe(false);
    expect(deviationOf(gate)).toBe('rest-day');
  });

  it('fragt nach, wenn gestern trainiert wurde', () => {
    const gate = evaluateStartGate(plan, [session('2026-03-02')], '2026-03-03');
    expect(gate.kind).toBe('consecutive-day');
    expect(needsConfirmation(gate)).toBe(true);
    expect(gate.lastSessionDate).toBe('2026-03-02');
  });

  it('fragt nach, wenn heute bereits trainiert wurde', () => {
    const gate = evaluateStartGate(plan, [session('2026-03-02')], '2026-03-02');
    expect(gate.kind).toBe('already-trained-today');
    expect(needsConfirmation(gate)).toBe(true);
  });

  it('fragt nach, wenn das Wochenziel bereits erreicht ist', () => {
    const sessions = ['2026-03-02', '2026-03-04', '2026-03-06'].map((date) => session(date));
    const gate = evaluateStartGate(plan, sessions, '2026-03-07'); // Samstag
    expect(gate.kind).toBe('weekly-goal-reached');
    expect(gate.sessionsThisWeek).toBe(3);
    expect(gate.weeklyGoal).toBe(3);
    expect(needsConfirmation(gate)).toBe(true);
  });

  it('gibt in der neuen Woche wieder frei', () => {
    const sessions = ['2026-03-02', '2026-03-04', '2026-03-06'].map((date) => session(date));
    const gate = evaluateStartGate(plan, sessions, '2026-03-09'); // Montag darauf
    expect(gate.kind).toBe('open');
    expect(gate.sessionsThisWeek).toBe(0);
  });

  it('gewichtet den heutigen Tag vor dem Wochenziel', () => {
    const sessions = ['2026-03-02', '2026-03-04', '2026-03-06'].map((date) => session(date));
    const gate = evaluateStartGate(plan, sessions, '2026-03-06');
    expect(gate.kind).toBe('already-trained-today');
  });

  it('gewichtet das Wochenziel vor dem Folgetag', () => {
    const sessions = ['2026-03-02', '2026-03-04', '2026-03-06'].map((date) => session(date));
    const gate = evaluateStartGate(plan, sessions, '2026-03-07');
    expect(gate.kind).toBe('weekly-goal-reached');
  });

  it('ignoriert nicht durchgefuehrte Einheiten', () => {
    const skipped = session('2026-03-02', {
      feedback: { completion: 'none', exertion: 'easy', complaints: false, wellbeing: 'bad' },
    });
    expect(evaluateStartGate(plan, [skipped], '2026-03-03').kind).toBe('rest-day');
  });

  it('beruecksichtigt das reduzierte Wochenziel der Startwoche', () => {
    // Start am Donnerstag, geplant Mo/Mi/Fr: Wochenziel 1.
    const midweek: TrainingPlan = { ...plan, startDate: '2026-03-05' };
    const gate = evaluateStartGate(midweek, [session('2026-03-06')], '2026-03-07');
    expect(gate.weeklyGoal).toBe(1);
    expect(gate.kind).toBe('weekly-goal-reached');
  });
});

describe('Protokollierte Abweichung', () => {
  it('bildet jede Tageslage ausser «offen» ab', () => {
    expect(deviationOf(evaluateStartGate(plan, [], '2026-03-02'))).toBe('none');
    expect(deviationOf(evaluateStartGate(plan, [], '2026-03-03'))).toBe('rest-day');
    expect(
      deviationOf(evaluateStartGate(plan, [session('2026-03-02')], '2026-03-03')),
    ).toBe('consecutive-day');
    expect(
      deviationOf(evaluateStartGate(plan, [session('2026-03-02')], '2026-03-02')),
    ).toBe('already-trained-today');
  });
});
