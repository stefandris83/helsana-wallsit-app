import type { ProgressSummary } from './progress';

/** Meilensteine (spec.md §21 F). Keine Punkte, keine Ranglisten, keine Waehrungen. */

export const milestoneIds = [
  'first-session',
  'first-full-week',
  'five-sessions',
  'ten-sessions',
  'four-weeks',
  'halftime',
  'eight-weeks',
  'twelve-weeks',
  'program-completed',
] as const;

export type MilestoneId = (typeof milestoneIds)[number];

const rules: Record<MilestoneId, (summary: ProgressSummary) => boolean> = {
  'first-session': (s) => s.sessionsTotal >= 1,
  'first-full-week': (s) => s.weeksWithGoalReached >= 1,
  'five-sessions': (s) => s.sessionsTotal >= 5,
  'ten-sessions': (s) => s.sessionsTotal >= 10,
  'four-weeks': (s) => s.completedWeeks >= 4,
  halftime: (s) => s.completedWeeks >= 6,
  'eight-weeks': (s) => s.completedWeeks >= 8,
  'twelve-weeks': (s) => s.completedWeeks >= 12,
  'program-completed': (s) => s.programFinished && s.sessionsTotal >= 1,
};

export function evaluateMilestones(summary: ProgressSummary): MilestoneId[] {
  return milestoneIds.filter((id) => rules[id](summary));
}

/** Neu hinzugekommene Meilensteine im Vergleich zum gespeicherten Stand. */
export function newMilestones(
  reached: readonly MilestoneId[],
  alreadyKnown: readonly MilestoneId[],
): MilestoneId[] {
  const known = new Set(alreadyKnown);
  return reached.filter((id) => !known.has(id));
}
