import type { ConsentState } from '../domain/access';
import { emptyConsent } from '../domain/access';
import type { MilestoneId } from '../domain/milestones';
import type { TimerState } from '../domain/timer-engine';
import type {
  CheckinAnswers,
  ClockTime,
  IsoDate,
  IsoDateTime,
  Profile,
  Questionnaire,
  SessionDeviation,
  TrainingPlan,
  TrainingSession,
  TrainingVariant,
} from '../domain/types';

/** Identitaetsdaten — technisch und im Datenmodell von Nutzungsdaten getrennt (B.4, §8). */
export interface Identity {
  accessCode: string;
  pilotId: string;
  /** Optionale Kontaktangabe. Erscheint nie im Dashboard oder Export. */
  contact: string | null;
  activatedAt: IsoDateTime;
}

export type ColorModePreference = 'system' | 'light' | 'dark';

export interface ReminderSettings {
  trainingEnabled: boolean;
  trainingTime: ClockTime;
  bpEnabled: boolean;
  bpMorningTime: ClockTime;
  bpEveningTime: ClockTime;
  /** Systembenachrichtigungen des Browsers, nur nach ausdruecklicher Zustimmung. */
  systemNotifications: boolean;
}

export const defaultReminders: ReminderSettings = {
  trainingEnabled: false,
  trainingTime: '18:00',
  bpEnabled: false,
  bpMorningTime: '07:00',
  bpEveningTime: '20:00',
  systemNotifications: false,
};

/** Nutzungsdaten. Enthalten keine Identitaetsdaten. */
export interface ParticipantData {
  consent: ConsentState;
  welcomeCompleted: boolean;
  profile: Profile | null;
  questionnaire: Questionnaire | null;
  safetyConfirmed: boolean;
  plan: TrainingPlan | null;
  sessions: TrainingSession[];
  reminders: ReminderSettings;
  instructionSeen: boolean;
  bpConsent: boolean;
  learningCardsOpened: string[];
  milestonesReached: MilestoneId[];
  onboardingStartedAt: IsoDateTime | null;
  onboardingCompletedAt: IsoDateTime | null;
  colorMode: ColorModePreference;
  demoLoaded: boolean;
  /** Bereits protokollierte Wochenabschluesse, verhindert doppelte Ereignisse. */
  loggedWeekCompletions: number[];
  programCompletionLogged: boolean;
}

export function createEmptyParticipant(): ParticipantData {
  return {
    consent: { ...emptyConsent },
    welcomeCompleted: false,
    profile: null,
    questionnaire: null,
    safetyConfirmed: false,
    plan: null,
    sessions: [],
    reminders: { ...defaultReminders },
    instructionSeen: false,
    bpConsent: false,
    learningCardsOpened: [],
    milestonesReached: [],
    onboardingStartedAt: null,
    onboardingCompletedAt: null,
    colorMode: 'system',
    demoLoaded: false,
    loggedWeekCompletions: [],
    programCompletionLogged: false,
  };
}

/** Laufende Trainingseinheit inklusive Timerzustand (B.7). */
export interface ActiveSession {
  id: string;
  date: IsoDate;
  programWeek: number;
  variant: TrainingVariant;
  checkin: CheckinAnswers;
  deviation: SessionDeviation;
  targetSeconds: number;
  optionalTargetSeconds: number | null;
  startedAt: IsoDateTime;
  timer: TimerState;
  /** Saetze, fuer die das Ereignis «Zwischenziel erreicht» bereits geschrieben wurde. */
  loggedTargetSets: number[];
  /** Saetze, fuer die der Beginn der Zusatzzeit bereits protokolliert wurde. */
  loggedOptionalSets: number[];
  aborted: boolean;
  /** Gesetzt, sobald der Timer beendet ist und die Rueckmeldung ansteht. */
  endedAt: IsoDateTime | null;
}
