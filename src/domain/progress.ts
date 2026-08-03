import type {
  Exertion,
  IsoDate,
  SessionCompletion,
  TrainingPlan,
  TrainingSession,
  Weekday,
} from './types';
import {
  addDays,
  daysBetween,
  startOfCalendarWeek,
  startOfNextCalendarWeek,
  weekdayOf,
} from './dates';
import { PROGRAM_WEEKS, SESSIONS_PER_WEEK, clampProgramWeek } from './week-matrix';

/**
 * Fortschrittsberechnung (spec.md §20, §21).
 *
 * Die Programmwoche ist die Kalenderwoche von Montag bis Sonntag (revidierter
 * Vorentscheid B.13.1). Woche 1 ist die Kalenderwoche, in der der Wochenplan
 * erstellt wurde; ihr Wochenziel entspricht den ab dem Startdatum noch
 * verbleibenden geplanten Trainingstagen, hoechstens drei und mindestens einer.
 * Ab Woche 2 gilt durchgehend das Wochenziel von drei Einheiten.
 *
 * Verpasste Einheiten werden nicht in die Folgewoche uebertragen.
 */

/** Montag der Programmwoche 1. */
export function programStart(plan: TrainingPlan): IsoDate {
  return startOfCalendarWeek(plan.startDate);
}

export function getProgramWeek(plan: TrainingPlan, today: IsoDate): number {
  const days = Math.max(0, daysBetween(programStart(plan), today));
  return clampProgramWeek(Math.floor(days / 7) + 1);
}

/** Montag der angegebenen Programmwoche. */
export function weekStartDate(plan: TrainingPlan, week: number): IsoDate {
  return addDays(programStart(plan), (clampProgramWeek(week) - 1) * 7);
}

export function isDateInProgramWeek(plan: TrainingPlan, week: number, date: IsoDate): boolean {
  const offset = daysBetween(weekStartDate(plan, week), date);
  return offset >= 0 && offset < 7;
}

/**
 * Wochenziel der angegebenen Programmwoche. In der Startwoche zaehlen nur die
 * ab dem Startdatum noch verbleibenden geplanten Trainingstage, damit die erste
 * Woche erreichbar bleibt.
 */
export function weeklyGoal(plan: TrainingPlan, week: number): number {
  if (clampProgramWeek(week) !== 1) return SESSIONS_PER_WEEK;
  const lastDayOfWeek = addDays(programStart(plan), 6);
  let remaining = 0;
  for (let offset = 0; ; offset += 1) {
    const date = addDays(plan.startDate, offset);
    if (date > lastDayOfWeek) break;
    if (plan.trainingDays.includes(weekdayOf(date))) remaining += 1;
  }
  return Math.min(Math.max(remaining, 1), SESSIONS_PER_WEEK);
}

/** Anzahl vollstaendig vergangener Programmwochen, hoechstens 12. */
export function completedProgramWeeks(plan: TrainingPlan, today: IsoDate): number {
  const days = Math.max(0, daysBetween(programStart(plan), today));
  return Math.min(Math.floor(days / 7), PROGRAM_WEEKS);
}

export function isProgramFinished(plan: TrainingPlan, today: IsoDate): boolean {
  return daysBetween(programStart(plan), today) >= PROGRAM_WEEKS * 7;
}

/** Einheiten, die als durchgefuehrt zaehlen (vollstaendig oder teilweise). */
export function countsAsDone(session: TrainingSession): boolean {
  return session.feedback.completion !== 'none';
}

export function sessionsInWeek(
  plan: TrainingPlan,
  sessions: readonly TrainingSession[],
  week: number,
): TrainingSession[] {
  return sessions.filter(
    (session) => countsAsDone(session) && isDateInProgramWeek(plan, week, session.date),
  );
}

/** Durchgefuehrte Einheiten in der Programmwoche, in der `date` liegt. */
export function sessionsInWeekOf(
  plan: TrainingPlan,
  sessions: readonly TrainingSession[],
  date: IsoDate,
): TrainingSession[] {
  return sessionsInWeek(plan, sessions, getProgramWeek(plan, date));
}

/** Geplante Trainingstage vom Programmstart bis einschliesslich `today`. */
export function plannedDatesUntil(plan: TrainingPlan, today: IsoDate): IsoDate[] {
  const totalDays = Math.min(
    daysBetween(plan.startDate, today),
    daysBetween(plan.startDate, addDays(programStart(plan), PROGRAM_WEEKS * 7 - 1)),
  );
  const dates: IsoDate[] = [];
  for (let offset = 0; offset <= totalDays; offset += 1) {
    const date = addDays(plan.startDate, offset);
    if (plan.trainingDays.includes(weekdayOf(date))) {
      dates.push(date);
    }
  }
  return dates;
}

/**
 * Naechster geplanter Trainingstag ab (einschliesslich) `from`, fruehestens am
 * Startdatum. Liegt der Start in der Zukunft, zaehlen Wochentage davor nicht mit.
 */
export function nextPlannedDate(plan: TrainingPlan, from: IsoDate): IsoDate | null {
  if (plan.trainingDays.length === 0) return null;
  const first = from < plan.startDate ? plan.startDate : from;
  for (let offset = 0; offset < 14; offset += 1) {
    const date = addDays(first, offset);
    if (plan.trainingDays.includes(weekdayOf(date))) return date;
  }
  return null;
}

/**
 * true, solange das Programm noch nicht begonnen hat (§14, B.13.1).
 *
 * Die Person kann im Onboarding waehlen, ob sie in der laufenden oder in der
 * kommenden Kalenderwoche startet. Bis zum Startdatum laeuft keine Programmwoche:
 * es gibt kein Wochenziel zu erfuellen und keine verpasste Einheit.
 */
export function isBeforeProgramStart(plan: TrainingPlan, today: IsoDate): boolean {
  return today < plan.startDate;
}

export function isTrainingDay(plan: TrainingPlan, date: IsoDate): boolean {
  return plan.trainingDays.includes(weekdayOf(date));
}

// ------------------------------------------------------- Wahl der Startwoche (§14)

export type ProgramStartChoice = 'this-week' | 'next-week';

/**
 * Geplante Trainingstage von `from` bis Sonntag derselben Kalenderwoche.
 * Grundlage fuer die Wahl der Startwoche im Onboarding.
 */
export function plannedDatesLeftInCalendarWeek(
  trainingDays: readonly Weekday[],
  from: IsoDate,
): IsoDate[] {
  const lastDay = addDays(startOfCalendarWeek(from), 6);
  const dates: IsoDate[] = [];
  for (let offset = 0; ; offset += 1) {
    const date = addDays(from, offset);
    if (date > lastDay) break;
    if (trainingDays.includes(weekdayOf(date))) dates.push(date);
  }
  return dates;
}

/** Startdatum zur gewaehlten Startwoche: heute oder Montag der Folgewoche. */
export function startDateFor(choice: ProgramStartChoice, today: IsoDate): IsoDate {
  return choice === 'this-week' ? today : startOfNextCalendarWeek(today);
}

/** Leitet aus Startdatum und Bezugstag ab, welche Startwoche gewaehlt wurde. */
export function startChoiceOf(startDate: IsoDate, today: IsoDate): ProgramStartChoice {
  return startOfCalendarWeek(startDate) === startOfCalendarWeek(today) ? 'this-week' : 'next-week';
}

/**
 * Vorauswahl der Startwoche. Bleiben in der laufenden Woche weniger als zwei
 * geplante Trainingstage, beginnt das Programm sinnvoller in der kommenden
 * Kalenderwoche — sonst waere Woche 1 nur eine Restwoche. Rein kalendarische
 * Regel ohne Gesundheitsbezug.
 */
export function suggestStartChoice(
  trainingDays: readonly Weekday[],
  today: IsoDate,
): ProgramStartChoice {
  return plannedDatesLeftInCalendarWeek(trainingDays, today).length >= 2
    ? 'this-week'
    : 'next-week';
}

export interface StreakResult {
  current: number;
  longest: number;
}

/**
 * Serie = aufeinanderfolgende geplante Trainingstage mit durchgefuehrter Einheit.
 * Ein heutiger, noch offener Trainingstag unterbricht die Serie nicht (§21 E).
 */
export function computeStreak(
  plan: TrainingPlan,
  sessions: readonly TrainingSession[],
  today: IsoDate,
): StreakResult {
  const doneDates = new Set(sessions.filter(countsAsDone).map((session) => session.date));
  const planned = plannedDatesUntil(plan, today);

  const flags = planned.map((date) => doneDates.has(date));
  // Ein offener heutiger Trainingstag zaehlt nicht als Unterbruch.
  if (flags.length > 0 && planned[planned.length - 1] === today && !flags[flags.length - 1]) {
    flags.pop();
  }

  let longest = 0;
  let run = 0;
  for (const done of flags) {
    run = done ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  return { current: run, longest };
}

const exertionScore: Record<Exertion, number> = { easy: 1, fitting: 2, hard: 3 };

export interface ProgressSummary {
  programWeek: number;
  completedWeeks: number;
  programFinished: boolean;
  /** Wochenziel der laufenden Programmwoche (in der Startwoche ggf. reduziert). */
  weeklyGoal: number;
  sessionsThisWeek: number;
  /** true, wenn in dieser Woche mehr Einheiten absolviert wurden als empfohlen. */
  weeklyGoalExceeded: boolean;
  sessionsTotal: number;
  completionSplit: Record<SessionCompletion, number>;
  targetsReached: number;
  optionalTargetsReached: number;
  currentStreak: number;
  longestStreak: number;
  /** Mittelwert der empfundenen Belastung: 1 = leicht, 2 = passend, 3 = sehr anstrengend. */
  averageExertion: number | null;
  averageHoldSeconds: number | null;
  weeksWithGoalReached: number;
}

export function computeProgress(
  plan: TrainingPlan,
  sessions: readonly TrainingSession[],
  today: IsoDate,
): ProgressSummary {
  const programWeek = getProgramWeek(plan, today);
  const completedWeeks = completedProgramWeeks(plan, today);
  const done = sessions.filter(countsAsDone);

  const completionSplit: Record<SessionCompletion, number> = { full: 0, partial: 0, none: 0 };
  for (const session of sessions) {
    completionSplit[session.feedback.completion] += 1;
  }

  const allSets = done.flatMap((session) => session.sets);
  const targetsReached = allSets.filter((set) => set.targetReached).length;
  const optionalTargetsReached = allSets.filter((set) => set.optionalTargetReached).length;

  const exertions = sessions.map((session) => exertionScore[session.feedback.exertion]);
  const averageExertion =
    exertions.length === 0
      ? null
      : exertions.reduce((sum, value) => sum + value, 0) / exertions.length;

  const averageHoldSeconds =
    allSets.length === 0
      ? null
      : allSets.reduce((sum, set) => sum + set.heldSeconds, 0) / allSets.length;

  let weeksWithGoalReached = 0;
  for (let week = 1; week <= Math.min(completedWeeks, PROGRAM_WEEKS); week += 1) {
    if (sessionsInWeek(plan, sessions, week).length >= weeklyGoal(plan, week)) {
      weeksWithGoalReached += 1;
    }
  }

  const streak = computeStreak(plan, sessions, today);
  const goal = weeklyGoal(plan, programWeek);
  const sessionsThisWeek = sessionsInWeek(plan, sessions, programWeek).length;

  return {
    programWeek,
    completedWeeks,
    programFinished: isProgramFinished(plan, today),
    weeklyGoal: goal,
    sessionsThisWeek,
    weeklyGoalExceeded: sessionsThisWeek > goal,
    sessionsTotal: done.length,
    completionSplit,
    targetsReached,
    optionalTargetsReached,
    currentStreak: streak.current,
    longestStreak: streak.longest,
    averageExertion,
    averageHoldSeconds,
    weeksWithGoalReached,
  };
}

/** Trifft zu, wenn die Person nach einer Luecke wieder einsteigt (§21 E). */
export function needsReentry(
  sessions: readonly TrainingSession[],
  today: IsoDate,
  reentryDays: number,
): boolean {
  const done = sessions.filter(countsAsDone);
  if (done.length === 0) return false;
  const latest = done.reduce(
    (max, session) => (session.date > max ? session.date : max),
    done[0].date,
  );
  return daysBetween(latest, today) >= reentryDays;
}

export interface DayCell {
  date: IsoDate;
  /** Einheit an diesem Tag durchgefuehrt. */
  done: boolean;
  /** Geplanter Trainingstag laut Wochenplan. */
  planned: boolean;
  isToday: boolean;
  /** Tag liegt vor dem Beginn des Wochenplans. */
  beforeStart: boolean;
}

/** Die sieben Tage einer Programmwoche, Montag bis Sonntag. */
export function buildWeekDays(
  plan: TrainingPlan,
  sessions: readonly TrainingSession[],
  week: number,
  today: IsoDate,
): DayCell[] {
  const doneDates = new Set(sessions.filter(countsAsDone).map((session) => session.date));
  const start = weekStartDate(plan, week);
  return Array.from({ length: 7 }, (_, offset) => {
    const date = addDays(start, offset);
    const beforeStart = date < plan.startDate;
    return {
      date,
      done: doneDates.has(date),
      planned: !beforeStart && isTrainingDay(plan, date),
      isToday: date === today,
      beforeStart,
    };
  });
}
