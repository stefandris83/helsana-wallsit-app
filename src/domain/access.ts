import type { ComplaintLevel, Profile, Questionnaire, TrainingPlan } from './types';

/**
 * Zugangs- und Freigabelogik an genau einer Stelle (CLAUDE.md B.13.9).
 */

export type OnboardingStage =
  | 'access'
  | 'consent'
  | 'welcome'
  | 'profile'
  | 'questionnaire'
  | 'plan'
  | 'done';

export interface ConsentState {
  voluntary: boolean;
  privacy: boolean;
  noMedicalAdvice: boolean;
  analytics: boolean;
  profileStorage: boolean;
  completedAt: string | null;
}

export const emptyConsent: ConsentState = {
  voluntary: false,
  privacy: false,
  noMedicalAdvice: false,
  analytics: false,
  profileStorage: false,
  completedAt: null,
};

export function isConsentComplete(consent: ConsentState): boolean {
  return (
    consent.voluntary &&
    consent.privacy &&
    consent.noMedicalAdvice &&
    consent.analytics &&
    consent.profileStorage
  );
}

export interface OnboardingInput {
  hasAccess: boolean;
  consent: ConsentState;
  welcomeCompleted: boolean;
  profile: Profile | null;
  questionnaire: Questionnaire | null;
  plan: TrainingPlan | null;
}

export function resolveOnboardingStage(input: OnboardingInput): OnboardingStage {
  if (!input.hasAccess) return 'access';
  if (!isConsentComplete(input.consent)) return 'consent';
  if (!input.welcomeCompleted) return 'welcome';
  if (!input.profile) return 'profile';
  if (!input.questionnaire) return 'questionnaire';
  if (!input.plan) return 'plan';
  return 'done';
}

/** Bei diesen Antworten auf §12 Frage 3 ist eine aktive Bestaetigung noetig. */
export const blockingComplaintLevels: readonly ComplaintLevel[] = ['strong', 'unsure'];

export function isBlockingComplaint(level: ComplaintLevel | null): boolean {
  return level !== null && blockingComplaintLevels.includes(level);
}

export function requiresSafetyConfirmation(questionnaire: Questionnaire | null): boolean {
  if (!questionnaire) return false;
  return isBlockingComplaint(questionnaire.complaints);
}

/**
 * Die aktive Trainingsfunktion ist gesperrt, bis die Person die Abklaerung
 * bestaetigt hat. Das Onboarding selbst kann vollstaendig gespeichert werden.
 */
export function isTrainingUnlocked(
  questionnaire: Questionnaire | null,
  safetyConfirmed: boolean,
): boolean {
  if (!requiresSafetyConfirmation(questionnaire)) return true;
  return safetyConfirmed;
}
