import type {
  CheckinAnswers,
  IsoDate,
  TrainingSession,
  TrainingVariant,
} from './types';
import { daysBetween } from './dates';

/**
 * Vorschlagslogik des Tages-Check-ins (spec.md §16).
 *
 * WICHTIG (CLAUDE.md B.6, spec.md §16): Die Logik basiert ausschliesslich auf
 * subjektiver Tagesform und Trainingserfahrung. Blutdruckwerte und medizinische
 * Profildaten sind bereits durch die Signatur ausgeschlossen — sie sind kein
 * Bestandteil von `CheckinContext` und koennen daher nicht einfliessen.
 */

/** Ab dieser Anzahl Tage ohne Einheit gilt eine Rueckkehr als Wiedereinstieg. */
export const REENTRY_DAYS = 10;

export type SuggestionReason =
  | 'wish'
  | 'mood'
  | 'previous-hard'
  | 'previous-partial'
  | 'previous-complaints'
  | 'reentry'
  | 'ready';

export interface CheckinContext {
  mood: CheckinAnswers['mood'];
  wish: CheckinAnswers['wish'];
  previousExertion: TrainingSession['feedback']['exertion'] | null;
  previousCompletion: TrainingSession['feedback']['completion'] | null;
  previousComplaints: boolean;
  daysSinceLastSession: number | null;
}

export interface VariantSuggestion {
  variant: TrainingVariant;
  reason: SuggestionReason;
}

/** Leitet den Kontext ausschliesslich aus vergangenen Einheiten ab. */
export function buildCheckinContext(
  sessions: readonly TrainingSession[],
  today: IsoDate,
  answers: CheckinAnswers,
): CheckinContext {
  const sorted = [...sessions].sort((a, b) => a.endedAt.localeCompare(b.endedAt));
  const previous = sorted.at(-1) ?? null;
  return {
    mood: answers.mood,
    wish: answers.wish,
    previousExertion: previous?.feedback.exertion ?? null,
    previousCompletion: previous?.feedback.completion ?? null,
    previousComplaints: previous?.feedback.complaints ?? false,
    daysSinceLastSession: previous ? daysBetween(previous.date, today) : null,
  };
}

export function suggestVariant(context: CheckinContext): VariantSuggestion {
  // Ausdruecklicher Wunsch der Person hat Vorrang (§16 Frage 2).
  if (context.wish === 'light') return { variant: 'light', reason: 'wish' };
  if (context.wish === 'standard') return { variant: 'standard', reason: 'wish' };

  if (context.mood === 'tired' || context.mood === 'not-fit' || context.mood === 'complaints') {
    return { variant: 'light', reason: 'mood' };
  }
  if (context.previousComplaints) {
    return { variant: 'light', reason: 'previous-complaints' };
  }
  if (context.previousExertion === 'hard') {
    return { variant: 'light', reason: 'previous-hard' };
  }
  if (context.previousCompletion === 'partial') {
    return { variant: 'light', reason: 'previous-partial' };
  }
  if (context.daysSinceLastSession !== null && context.daysSinceLastSession >= REENTRY_DAYS) {
    return { variant: 'light', reason: 'reentry' };
  }
  return { variant: 'standard', reason: 'ready' };
}

/** Bei gemeldeten Beschwerden wird nicht direkt gestartet (§16 «Beschwerden»). */
export function blocksDirectStart(answers: CheckinAnswers): boolean {
  return answers.mood === 'complaints';
}
