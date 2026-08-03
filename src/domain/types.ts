/** Gemeinsame Domaenentypen. Enthaelt keine kundensichtbaren Texte. */

export type TrainingVariant = 'light' | 'standard';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const weekdayOrder: readonly Weekday[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
] as const;

/** Datum als lokale ISO-Kalenderangabe `YYYY-MM-DD`. */
export type IsoDate = string;

/** Zeitpunkt als ISO-8601-Zeichenkette. */
export type IsoDateTime = string;

/** Uhrzeit als `HH:MM`. */
export type ClockTime = string;

// ---------------------------------------------------------------- Profil (§11)

export type Sex = 'female' | 'male' | 'diverse' | 'unspecified';
export type DailyActivity = 'sitting' | 'mixed' | 'active' | 'unspecified';

export interface Profile {
  birthYear: number;
  heightCm: number;
  weightKg: number;
  sex: Sex;
  waistCm: number | null;
  dailyActivity: DailyActivity;
}

// -------------------------------------------------------- Startfragebogen (§12)

export type ActivityLevel = 'rarely' | 'one-to-two' | 'three-to-four' | 'five-plus';
export type WallsitExperience = 'never' | 'tried' | 'regular';
export type ComplaintLevel = 'none' | 'mild' | 'strong' | 'unsure';
export type PreferredDaytime = 'morning' | 'midday' | 'evening' | 'varies';
export type Barrier = 'time' | 'forget' | 'motivation' | 'tired' | 'physical' | 'how-to-start';
export type SupportPreference = 'feedback' | 'plan' | 'reminders' | 'knowledge' | 'progress';

export interface Questionnaire {
  activityLevel: ActivityLevel;
  wallsitExperience: WallsitExperience;
  complaints: ComplaintLevel;
  trainingDays: Weekday[];
  preferredDaytime: PreferredDaytime;
  preciseTimes: Partial<Record<Weekday, ClockTime>> | null;
  barriers: Barrier[];
  support: SupportPreference;
  confidence: number;
  remindersWanted: boolean;
  reminderTime: ClockTime | null;
}

// ------------------------------------------------------------ Wochenplan (§14)

export interface TrainingPlan {
  /** Tag der Planerstellung. Woche 1 ist die Kalenderwoche dieses Datums (B.13.1). */
  startDate: IsoDate;
  trainingDays: Weekday[];
  preferredDaytime: PreferredDaytime;
  preciseTimes: Partial<Record<Weekday, ClockTime>> | null;
  /** Freiwilliger Wenn-dann-Plan (§21 A). */
  routineCue: string | null;
  createdAt: IsoDateTime;
}

// -------------------------------------------------------------- Check-in (§16)

export type CheckinMood = 'good' | 'tired' | 'not-fit' | 'complaints';
export type CheckinWish = 'light' | 'standard' | 'suggest';

export interface CheckinAnswers {
  mood: CheckinMood;
  wish: CheckinWish;
}

// -------------------------------------------------------- Trainingseinheit (§18/§19)

export interface SetResult {
  /** 0-basierter Index des Satzes. */
  index: number;
  /** Tatsaechlich gehaltene Sekunden. */
  heldSeconds: number;
  /** Zwischenziel erreicht — allein massgeblich fuer den Erfolg (§18). */
  targetReached: boolean;
  /** Freiwillige Zusatzphase wurde begonnen. */
  optionalStarted: boolean;
  /** Freiwilliges Zusatzziel wurde erreicht. */
  optionalTargetReached: boolean;
  /** Satz wurde vor dem Zwischenziel beendet. */
  stoppedEarly: boolean;
}

export type SessionCompletion = 'full' | 'partial' | 'none';

/**
 * Abweichung vom empfohlenen Rhythmus beim Start einer Einheit (§14).
 * `none` = im Plan; alle uebrigen Werte entstehen, wenn die Person einen
 * Hinweis bewusst uebersteuert hat.
 */
export type SessionDeviation =
  | 'none'
  | 'rest-day'
  | 'consecutive-day'
  | 'weekly-goal-reached'
  | 'already-trained-today';
export type Exertion = 'easy' | 'fitting' | 'hard';
export type Wellbeing = 'good' | 'neutral' | 'bad';

export interface SessionFeedback {
  completion: SessionCompletion;
  exertion: Exertion;
  complaints: boolean;
  wellbeing: Wellbeing;
}

export interface TrainingSession {
  id: string;
  date: IsoDate;
  programWeek: number;
  variant: TrainingVariant;
  targetSeconds: number;
  optionalTargetSeconds: number | null;
  sets: SetResult[];
  feedback: SessionFeedback;
  startedAt: IsoDateTime;
  endedAt: IsoDateTime;
  /** true, wenn die Einheit ueber «Training abbrechen» beendet wurde. */
  aborted: boolean;
  checkin: CheckinAnswers;
  /** Abweichung vom empfohlenen Rhythmus beim Start (§14). */
  deviation: SessionDeviation;
  /** Kennzeichnung synthetischer Demodaten (B.10). */
  demo?: boolean;
}

// ------------------------------------------------------ Blutdrucktagebuch (§23)

export type BpDaypart = 'morning' | 'evening' | 'unspecified';

export interface BpEntry {
  id: string;
  date: IsoDate;
  time: ClockTime;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  note: string | null;
  daypart: BpDaypart;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  demo?: boolean;
}
