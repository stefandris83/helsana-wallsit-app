import type { IsoDate, SessionDeviation, TrainingPlan, TrainingSession } from './types';
import { addDays } from './dates';
import { countsAsDone, getProgramWeek, isTrainingDay, sessionsInWeek, weeklyGoal } from './progress';

/**
 * Sanftes Tor vor dem Start einer Einheit (spec.md §14, §12 Frage 4).
 *
 * Das Programm sieht drei Einheiten pro Woche mit je einem freien Tag dazwischen
 * vor. Die App weist auf Abweichungen hin, verhindert sie aber nie: jeder Fall
 * ist uebersteuerbar. Damit bleibt die App beschreibend statt vorschreibend
 * (§3) und der Pilot kann das tatsaechliche Verhalten messen (§32).
 *
 * Die Bewertung stuetzt sich ausschliesslich auf Wochenplan und
 * Trainingshistorie — keine Blutdruck- und keine Profildaten (CLAUDE.md B.6).
 */

export type StartGateKind =
  | 'open'
  | 'rest-day'
  | 'consecutive-day'
  | 'weekly-goal-reached'
  | 'already-trained-today';

export interface StartGate {
  kind: StartGateKind;
  /** Datum der letzten durchgefuehrten Einheit, sofern relevant. */
  lastSessionDate: IsoDate | null;
  /** Bereits durchgefuehrte Einheiten in der laufenden Programmwoche. */
  sessionsThisWeek: number;
  weeklyGoal: number;
}

export function evaluateStartGate(
  plan: TrainingPlan,
  sessions: readonly TrainingSession[],
  today: IsoDate,
): StartGate {
  const done = [...sessions].filter(countsAsDone).sort((a, b) => a.date.localeCompare(b.date));
  const lastSessionDate = done.at(-1)?.date ?? null;
  const week = getProgramWeek(plan, today);
  const sessionsThisWeek = sessionsInWeek(plan, sessions, week).length;
  const goal = weeklyGoal(plan, week);
  const base = { lastSessionDate, sessionsThisWeek, weeklyGoal: goal };

  // Reihenfolge: der konkreteste Hinweis gewinnt.
  if (done.some((session) => session.date === today)) {
    return { ...base, kind: 'already-trained-today' };
  }
  if (sessionsThisWeek >= goal) {
    return { ...base, kind: 'weekly-goal-reached' };
  }
  if (lastSessionDate !== null && addDays(lastSessionDate, 1) === today) {
    return { ...base, kind: 'consecutive-day' };
  }
  if (!isTrainingDay(plan, today)) {
    return { ...base, kind: 'rest-day' };
  }
  return { ...base, kind: 'open' };
}

/** true, wenn der Start eine Rueckfrage ausloest. */
export function needsConfirmation(gate: StartGate): boolean {
  return (
    gate.kind === 'already-trained-today' ||
    gate.kind === 'weekly-goal-reached' ||
    gate.kind === 'consecutive-day'
  );
}

/** Abweichung, die beim Start der Einheit protokolliert wird. */
export function deviationOf(gate: StartGate): SessionDeviation {
  return gate.kind === 'open' ? 'none' : gate.kind;
}
