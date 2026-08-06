import { isProgramFinished } from '../domain/progress';
import type {
  ActivityLevel,
  Barrier,
  IsoDate,
  PreferredDaytime,
  SessionCompletion,
  SupportPreference,
  TrainingSession,
  TrainingVariant,
  WallsitExperience,
  Weekday,
} from '../domain/types';
import { isTrainingUnlocked } from '../domain/access';
import { SETS_PER_SESSION } from '../domain/week-matrix';
import type { PilotParticipantRecord } from './pilot-dataset';
import { isActiveRecord } from './pilot-dataset';

/**
 * Aggregation fuer das anonymisierte Pilot-Dashboard (spec.md §26).
 *
 * Es werden ausschliesslich Nutzungsdaten verdichtet. Einzelne Blutdruckwerte,
 * Freitexte, Namen, Kontaktangaben und Geburtsdaten sind im Eingangstyp
 * `PilotParticipantRecord` gar nicht enthalten.
 */

export interface DashboardFilters {
  programWeek: number | 'all';
  from: IsoDate | null;
  to: IsoDate | null;
  participation: 'all' | 'active' | 'inactive';
  variant: TrainingVariant | 'all';
}

export const defaultFilters: DashboardFilters = {
  programWeek: 'all',
  from: null,
  to: null,
  participation: 'all',
  variant: 'all',
};

export interface DistributionEntry<T extends string> {
  key: T;
  count: number;
}

export interface DashboardMetrics {
  /** Anzahl der zugrunde liegenden Personen. */
  participantCount: number;
  /** false, wenn die Mindestgruppengroesse unterschritten ist (B.13.7). */
  sufficientData: boolean;
  activatedIds: number;
  onboardingStarted: number;
  onboardingCompleted: number;
  programsStarted: number;
  activeParticipants: number;
  programsCompleted: number;
  trainingLocked: number;
  sessionsTotal: number;
  sessionsPerWeek: number;
  /**
   * Aus dem Trainingsverlauf abgeleitet, nicht aus der Selbstauskunft: alle
   * vier Saetze aufgezeichnet, jeder bis zum Zwischenziel gehalten, kein
   * Abbruch. Ergaenzt `completionSplit`, das die Antwort aus der Rueckmeldung
   * nach der Einheit zaehlt.
   */
  sessionsFullyCompleted: number;
  completionSplit: Record<SessionCompletion, number>;
  lightVariantSessions: number;
  standardVariantSessions: number;
  optionalTargetSets: number;
  /** Einheiten, die ueber der Wochenempfehlung gestartet wurden (§14). */
  sessionsAboveRecommendation: number;
  averageHoldSeconds: number | null;
  abortPoints: DistributionEntry<string>[];
  learningUsers: number;
  learningCardOpens: DistributionEntry<string>[];
  notificationsEnabled: number;
  bpDiaryUsers: number;
  bpEntries: number;
  activityLevels: DistributionEntry<ActivityLevel>[];
  wallsitExperience: DistributionEntry<WallsitExperience>[];
  barriers: DistributionEntry<Barrier>[];
  support: DistributionEntry<SupportPreference>[];
  trainingDays: DistributionEntry<Weekday>[];
  trainingDaytime: DistributionEntry<PreferredDaytime>[];
  confidenceAverage: number | null;
  exertion: DistributionEntry<string>[];
  wellbeing: DistributionEntry<string>[];
  complaintsReported: number;
}

function tally<T extends string>(values: readonly T[]): DistributionEntry<T>[] {
  const counts = new Map<T, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => (b.count === a.count ? a.key.localeCompare(b.key) : b.count - a.count));
}

function matchesFilters(
  session: TrainingSession,
  record: PilotParticipantRecord,
  filters: DashboardFilters,
): boolean {
  if (filters.variant !== 'all' && session.variant !== filters.variant) return false;
  if (filters.programWeek !== 'all' && session.programWeek !== filters.programWeek) return false;
  if (filters.from && session.date < filters.from) return false;
  if (filters.to && session.date > filters.to) return false;
  void record;
  return true;
}

export function filterRecords(
  records: readonly PilotParticipantRecord[],
  filters: DashboardFilters,
  today: IsoDate,
): PilotParticipantRecord[] {
  if (filters.participation === 'all') return [...records];
  return records.filter((record) =>
    filters.participation === 'active'
      ? isActiveRecord(record, today)
      : !isActiveRecord(record, today),
  );
}

/**
 * Vollstaendig durchgefuehrte Einheit — gemessen am aufgezeichneten Verlauf,
 * nicht an der Selbstauskunft.
 *
 * Massstab sind die Satzergebnisse und nicht die verstrichene Zeit: der Timer
 * rechnet aus Zeitstempeln und laeuft weiter, wenn die Seite im Hintergrund
 * liegt, und die Zielzeit haengt von Woche und Variante ab. Eine feste
 * Mindestdauer waere deshalb in Woche 1 zu lang und in Woche 12 zu kurz.
 * «Zwischenziel erreicht» ist derselbe Erfolgsmassstab wie im Rest der App (§18).
 */
export function isFullyCompleted(session: TrainingSession): boolean {
  if (session.aborted) return false;
  if (session.sets.length < SETS_PER_SESSION) return false;
  return session.sets.every((set) => set.targetReached && !set.stoppedEarly);
}

export function aggregate(
  records: readonly PilotParticipantRecord[],
  filters: DashboardFilters,
  today: IsoDate,
  minGroupSize: number,
): DashboardMetrics {
  const scoped = filterRecords(records, filters, today);
  const sessions = scoped.flatMap((record) =>
    record.participant.sessions
      .filter((session) => matchesFilters(session, record, filters))
      .map((session) => ({ session, record })),
  );

  const completionSplit: Record<SessionCompletion, number> = { full: 0, partial: 0, none: 0 };
  for (const { session } of sessions) {
    completionSplit[session.feedback.completion] += 1;
  }

  const allSets = sessions.flatMap(({ session }) => session.sets);
  const averageHoldSeconds =
    allSets.length === 0
      ? null
      : allSets.reduce((sum, set) => sum + set.heldSeconds, 0) / allSets.length;

  const abortPoints = tally(
    sessions
      .filter(({ session }) => session.aborted || session.feedback.completion !== 'full')
      .map(({ session }) => {
        const reached = session.sets.filter((set) => set.targetReached).length;
        return `set-${Math.min(reached + 1, session.sets.length || reached + 1)}`;
      }),
  );

  const questionnaires = scoped
    .map((record) => record.participant.questionnaire)
    .filter((value): value is NonNullable<typeof value> => value !== null);

  const confidences = questionnaires.map((q) => q.confidence);
  const weeksCovered = new Set(sessions.map(({ session }) => session.programWeek)).size || 1;

  return {
    participantCount: scoped.length,
    sufficientData: scoped.length >= minGroupSize,
    activatedIds: scoped.length,
    onboardingStarted: scoped.filter((r) => r.participant.onboardingStartedAt !== null).length,
    onboardingCompleted: scoped.filter((r) => r.participant.onboardingCompletedAt !== null).length,
    programsStarted: scoped.filter((r) => r.participant.plan !== null).length,
    activeParticipants: scoped.filter((r) => isActiveRecord(r, today)).length,
    programsCompleted: scoped.filter(
      (r) => r.participant.plan !== null && isProgramFinished(r.participant.plan, today),
    ).length,
    trainingLocked: scoped.filter(
      (r) =>
        !isTrainingUnlocked(r.participant.questionnaire, r.participant.safetyConfirmed),
    ).length,
    sessionsTotal: sessions.length,
    sessionsPerWeek: sessions.length === 0 ? 0 : sessions.length / weeksCovered,
    sessionsFullyCompleted: sessions.filter(({ session }) => isFullyCompleted(session)).length,
    completionSplit,
    lightVariantSessions: sessions.filter(({ session }) => session.variant === 'light').length,
    standardVariantSessions: sessions.filter(({ session }) => session.variant === 'standard')
      .length,
    optionalTargetSets: allSets.filter((set) => set.optionalTargetReached).length,
    sessionsAboveRecommendation: sessions.filter(
      ({ session }) =>
        session.deviation === 'weekly-goal-reached' ||
        session.deviation === 'already-trained-today',
    ).length,
    averageHoldSeconds,
    abortPoints,
    learningUsers: scoped.filter((r) => r.participant.learningCardsOpened.length > 0).length,
    learningCardOpens: tally(scoped.flatMap((r) => r.participant.learningCardsOpened)),
    notificationsEnabled: scoped.filter(
      (r) => r.participant.reminders.trainingEnabled || r.participant.reminders.bpEnabled,
    ).length,
    bpDiaryUsers: scoped.filter((r) => r.participant.bpConsent).length,
    bpEntries: scoped.reduce((sum, r) => sum + r.bpEntryCount, 0),
    activityLevels: tally(questionnaires.map((q) => q.activityLevel)),
    wallsitExperience: tally(questionnaires.map((q) => q.wallsitExperience)),
    barriers: tally(questionnaires.flatMap((q) => q.barriers)),
    support: tally(questionnaires.map((q) => q.support)),
    trainingDays: tally(questionnaires.flatMap((q) => q.trainingDays)),
    trainingDaytime: tally(questionnaires.map((q) => q.preferredDaytime)),
    confidenceAverage:
      confidences.length === 0
        ? null
        : confidences.reduce((sum, value) => sum + value, 0) / confidences.length,
    exertion: tally(sessions.map(({ session }) => session.feedback.exertion)),
    wellbeing: tally(sessions.map(({ session }) => session.feedback.wellbeing)),
    complaintsReported: sessions.filter(({ session }) => session.feedback.complaints).length,
  };
}
