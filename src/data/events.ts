import type {
  CheckinMood,
  CheckinWish,
  Exertion,
  IsoDateTime,
  PreferredDaytime,
  SessionCompletion,
  SessionDeviation,
  TrainingVariant,
  Weekday,
  Wellbeing,
} from '../domain/types';
import type { ProgramStartChoice } from '../domain/progress';

/**
 * Ereignismodell fuer die Pilotauswertung (spec.md §27).
 *
 * Gespeichert werden ausschliesslich Daten, die fuer die Auswertung benoetigt
 * werden. Insbesondere enthaelt kein Ereignis Blutdruckzahlen, Freitexte,
 * Namen oder Kontaktangaben.
 *
 * Die Vollstaendigkeit dieser Liste wird durch `event-model.test.ts` erzwungen.
 */
export const appEventTypes = [
  'consent_completed',
  'onboarding_started',
  'onboarding_completed',
  'welcome_carousel_completed',
  'training_plan_created',
  'session_checkin_completed',
  'session_started',
  'light_variant_selected',
  'standard_variant_selected',
  'personal_target_reached',
  'optional_target_started',
  'optional_target_reached',
  'set_stopped_early',
  'session_paused',
  'session_completed',
  'session_partially_completed',
  'session_abandoned',
  'post_session_feedback_completed',
  'learning_card_opened',
  'notification_enabled',
  'notification_disabled',
  'bp_diary_opt_in',
  'bp_entry_created',
  'bp_entry_edited',
  'bp_entry_deleted',
  'program_week_completed',
  'program_completed',
] as const;

export type AppEventType = (typeof appEventTypes)[number];

export type NotificationChannel = 'training' | 'blood-pressure' | 'system';

/** Nutzlast je Ereignistyp. Jeder Typ muss hier vertreten sein. */
export interface AppEventPayloads {
  consent_completed: Record<string, never>;
  onboarding_started: Record<string, never>;
  onboarding_completed: Record<string, never>;
  welcome_carousel_completed: Record<string, never>;
  training_plan_created: {
    trainingDays: Weekday[];
    preferredDaytime: PreferredDaytime;
    /** Gewaehlte Startwoche (§14, B.13.1). Rein kalendarisch, ohne Personenbezug. */
    startChoice: ProgramStartChoice;
  };
  session_checkin_completed: {
    mood: CheckinMood;
    wish: CheckinWish;
    suggestedVariant: TrainingVariant;
  };
  session_started: {
    sessionId: string;
    variant: TrainingVariant;
    targetSeconds: number;
    deviation: SessionDeviation;
  };
  light_variant_selected: { sessionId: string };
  standard_variant_selected: { sessionId: string };
  personal_target_reached: { sessionId: string; setIndex: number; targetSeconds: number };
  optional_target_started: { sessionId: string; setIndex: number };
  optional_target_reached: {
    sessionId: string;
    setIndex: number;
    optionalTargetSeconds: number;
  };
  set_stopped_early: { sessionId: string; setIndex: number; heldSeconds: number };
  session_paused: { sessionId: string; phase: string };
  session_completed: { sessionId: string; setsReached: number };
  session_partially_completed: { sessionId: string; setsReached: number };
  session_abandoned: { sessionId: string; setsReached: number; phase: string };
  post_session_feedback_completed: {
    sessionId: string;
    completion: SessionCompletion;
    exertion: Exertion;
    complaints: boolean;
    wellbeing: Wellbeing;
  };
  learning_card_opened: { cardId: string };
  notification_enabled: { channel: NotificationChannel };
  notification_disabled: { channel: NotificationChannel };
  bp_diary_opt_in: Record<string, never>;
  bp_entry_created: Record<string, never>;
  bp_entry_edited: Record<string, never>;
  bp_entry_deleted: Record<string, never>;
  program_week_completed: { week: number; sessions: number };
  program_completed: { sessionsTotal: number };
}

export interface AppEventBase {
  id: string;
  at: IsoDateTime;
  /** Programmwoche zum Zeitpunkt des Ereignisses, sofern bekannt. */
  programWeek: number | null;
  /** Kennzeichnung synthetischer Demodaten (B.10). */
  demo?: boolean;
}

export type AppEvent = {
  [K in AppEventType]: AppEventBase & { type: K; payload: AppEventPayloads[K] };
}[AppEventType];

/**
 * Laufzeit-Gegenstueck zu `AppEventPayloads`: dokumentiert die je Ereignis
 * gespeicherten Felder und macht die Vollstaendigkeit pruefbar.
 */
export const eventPayloadFields: Record<AppEventType, readonly string[]> = {
  consent_completed: [],
  onboarding_started: [],
  onboarding_completed: [],
  welcome_carousel_completed: [],
  training_plan_created: ['trainingDays', 'preferredDaytime', 'startChoice'],
  session_checkin_completed: ['mood', 'wish', 'suggestedVariant'],
  session_started: ['sessionId', 'variant', 'targetSeconds', 'deviation'],
  light_variant_selected: ['sessionId'],
  standard_variant_selected: ['sessionId'],
  personal_target_reached: ['sessionId', 'setIndex', 'targetSeconds'],
  optional_target_started: ['sessionId', 'setIndex'],
  optional_target_reached: ['sessionId', 'setIndex', 'optionalTargetSeconds'],
  set_stopped_early: ['sessionId', 'setIndex', 'heldSeconds'],
  session_paused: ['sessionId', 'phase'],
  session_completed: ['sessionId', 'setsReached'],
  session_partially_completed: ['sessionId', 'setsReached'],
  session_abandoned: ['sessionId', 'setsReached', 'phase'],
  post_session_feedback_completed: [
    'sessionId',
    'completion',
    'exertion',
    'complaints',
    'wellbeing',
  ],
  learning_card_opened: ['cardId'],
  notification_enabled: ['channel'],
  notification_disabled: ['channel'],
  bp_diary_opt_in: [],
  bp_entry_created: [],
  bp_entry_edited: [],
  bp_entry_deleted: [],
  program_week_completed: ['week', 'sessions'],
  program_completed: ['sessionsTotal'],
};

/** Felder, die in keinem Ereignis vorkommen duerfen (§26 «Datenschutzgrenze»). */
export const forbiddenEventFields = [
  'name',
  'firstName',
  'lastName',
  'email',
  'contact',
  'note',
  'systolic',
  'diastolic',
  'pulse',
  'birthYear',
  'birthDate',
  'weightKg',
  'heightCm',
  'waistCm',
] as const;
