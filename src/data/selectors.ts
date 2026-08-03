import { isTrainingUnlocked, resolveOnboardingStage } from '../domain/access';
import type { OnboardingStage } from '../domain/access';
import { toIsoDate } from '../domain/dates';
import type { VariantSuggestion } from '../domain/checkin-rules';
import { REENTRY_DAYS, buildCheckinContext, suggestVariant } from '../domain/checkin-rules';
import { computeProgress, needsReentry, nextPlannedDate } from '../domain/progress';
import type { ProgressSummary } from '../domain/progress';
import type { CheckinAnswers, IsoDate } from '../domain/types';
import type { AppState } from './store';

/** Ableitungen aus dem Anwendungszustand. */

export function selectToday(): IsoDate {
  return toIsoDate(new Date());
}

export function selectOnboardingStage(state: AppState): OnboardingStage {
  return resolveOnboardingStage({
    hasAccess: state.identity !== null,
    consent: state.participant.consent,
    welcomeCompleted: state.participant.welcomeCompleted,
    profile: state.participant.profile,
    questionnaire: state.participant.questionnaire,
    plan: state.participant.plan,
  });
}

export function selectTrainingUnlocked(state: AppState): boolean {
  return isTrainingUnlocked(state.participant.questionnaire, state.participant.safetyConfirmed);
}

/**
 * Variantenvorschlag des Check-ins.
 *
 * Es fliessen ausschliesslich `sessions` und die Antworten des Tages ein.
 * Blutdruckdaten (`state.bpEntries`) und Profildaten (`state.participant.profile`)
 * werden bewusst nicht gelesen (CLAUDE.md B.6, spec.md §16); ein Test sichert das ab.
 */
export function selectVariantSuggestion(
  state: AppState,
  answers: CheckinAnswers,
): VariantSuggestion {
  const context = buildCheckinContext(state.participant.sessions, selectToday(), answers);
  return suggestVariant(context);
}

export function selectProgress(state: AppState): ProgressSummary | null {
  if (!state.participant.plan) return null;
  return computeProgress(state.participant.plan, state.participant.sessions, selectToday());
}

export function selectNextPlannedDate(state: AppState): IsoDate | null {
  if (!state.participant.plan) return null;
  return nextPlannedDate(state.participant.plan, selectToday());
}

export function selectNeedsReentry(state: AppState): boolean {
  if (!state.participant.plan) return false;
  return needsReentry(state.participant.sessions, selectToday(), REENTRY_DAYS);
}

export function selectSessionToday(state: AppState) {
  const date = selectToday();
  return state.participant.sessions.find((session) => session.date === date) ?? null;
}
