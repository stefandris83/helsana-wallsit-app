import type { LearningCardId } from './learning-cards';
import type { ContentId } from './registry';
import type { MilestoneId } from '../domain/milestones';
import type { MotivationKey } from '../domain/personalization';
import type { SuggestionReason } from '../domain/checkin-rules';
import type {
  ActivityLevel,
  Barrier,
  BpDaypart,
  CheckinMood,
  CheckinWish,
  ComplaintLevel,
  DailyActivity,
  Exertion,
  PreferredDaytime,
  SessionCompletion,
  Sex,
  SupportPreference,
  TrainingVariant,
  WallsitExperience,
  Weekday,
  Wellbeing,
} from '../domain/types';

/**
 * Zuordnung von Domaenenwerten zu Content-IDs.
 *
 * Hier stehen ausschliesslich IDs, keine Texte. Damit bleiben Screens und
 * Komponenten frei von kundensichtbaren Literalen (CLAUDE.md B.5).
 */

export const weekdayLabels: Record<Weekday, ContentId> = {
  mon: 'common.weekday.mon',
  tue: 'common.weekday.tue',
  wed: 'common.weekday.wed',
  thu: 'common.weekday.thu',
  fri: 'common.weekday.fri',
  sat: 'common.weekday.sat',
  sun: 'common.weekday.sun',
};

export const weekdayShortLabels: Record<Weekday, ContentId> = {
  mon: 'common.weekday.mon.short',
  tue: 'common.weekday.tue.short',
  wed: 'common.weekday.wed.short',
  thu: 'common.weekday.thu.short',
  fri: 'common.weekday.fri.short',
  sat: 'common.weekday.sat.short',
  sun: 'common.weekday.sun.short',
};

export const daytimeLabels: Record<PreferredDaytime, ContentId> = {
  morning: 'common.daytime.morning',
  midday: 'common.daytime.midday',
  evening: 'common.daytime.evening',
  varies: 'common.daytime.varies',
};

export const variantLabels: Record<TrainingVariant, ContentId> = {
  light: 'common.variant.light',
  standard: 'common.variant.standard',
};

export const sexLabels: Record<Sex, ContentId> = {
  female: 'profile.sex.female',
  male: 'profile.sex.male',
  diverse: 'profile.sex.diverse',
  unspecified: 'common.noAnswer',
};

export const dailyActivityLabels: Record<DailyActivity, ContentId> = {
  sitting: 'profile.dailyActivity.sitting',
  mixed: 'profile.dailyActivity.mixed',
  active: 'profile.dailyActivity.active',
  unspecified: 'common.noAnswer',
};

export const activityLevelLabels: Record<ActivityLevel, ContentId> = {
  rarely: 'questionnaire.q1.rarely',
  'one-to-two': 'questionnaire.q1.oneToTwo',
  'three-to-four': 'questionnaire.q1.threeToFour',
  'five-plus': 'questionnaire.q1.fivePlus',
};

export const wallsitExperienceLabels: Record<WallsitExperience, ContentId> = {
  never: 'questionnaire.q2.never',
  tried: 'questionnaire.q2.tried',
  regular: 'questionnaire.q2.regular',
};

export const complaintLevelLabels: Record<ComplaintLevel, ContentId> = {
  none: 'questionnaire.q3.none',
  mild: 'questionnaire.q3.mild',
  strong: 'questionnaire.q3.strong',
  unsure: 'questionnaire.q3.unsure',
};

export const barrierLabels: Record<Barrier, ContentId> = {
  time: 'questionnaire.q6.time',
  forget: 'questionnaire.q6.forget',
  motivation: 'questionnaire.q6.motivation',
  tired: 'questionnaire.q6.tired',
  physical: 'questionnaire.q6.physical',
  'how-to-start': 'questionnaire.q6.howToStart',
};

export const supportLabels: Record<SupportPreference, ContentId> = {
  feedback: 'questionnaire.q7.feedback',
  plan: 'questionnaire.q7.plan',
  reminders: 'questionnaire.q7.reminders',
  knowledge: 'questionnaire.q7.knowledge',
  progress: 'questionnaire.q7.progress',
};

export const moodLabels: Record<CheckinMood, ContentId> = {
  good: 'checkin.q1.good',
  tired: 'checkin.q1.tired',
  'not-fit': 'checkin.q1.notFit',
  complaints: 'checkin.q1.complaints',
};

export const wishLabels: Record<CheckinWish, ContentId> = {
  light: 'checkin.q2.light',
  standard: 'checkin.q2.standard',
  suggest: 'checkin.q2.suggest',
};

export const suggestionReasonLabels: Record<SuggestionReason, ContentId> = {
  wish: 'checkin.suggestion.reason.wish',
  mood: 'checkin.suggestion.reason.mood',
  'previous-hard': 'checkin.suggestion.reason.previousHard',
  'previous-partial': 'checkin.suggestion.reason.previousPartial',
  'previous-complaints': 'checkin.suggestion.reason.previousComplaints',
  reentry: 'checkin.suggestion.reason.reentry',
  ready: 'checkin.suggestion.reason.ready',
};

export const completionLabels: Record<SessionCompletion, ContentId> = {
  full: 'feedback.q1.full',
  partial: 'feedback.q1.partial',
  none: 'feedback.q1.none',
};

export const exertionLabels: Record<Exertion, ContentId> = {
  easy: 'feedback.q2.easy',
  fitting: 'feedback.q2.fitting',
  hard: 'feedback.q2.hard',
};

export const wellbeingLabels: Record<Wellbeing, ContentId> = {
  good: 'feedback.q4.good',
  neutral: 'feedback.q4.neutral',
  bad: 'feedback.q4.bad',
};

export const daypartLabels: Record<BpDaypart, ContentId> = {
  morning: 'bp.form.daypart.morning',
  evening: 'bp.form.daypart.evening',
  unspecified: 'common.noAnswer',
};

export const motivationLabels: Record<MotivationKey, ContentId> = {
  default: 'motivation.default',
  'barrier-time': 'motivation.barrier.time',
  'barrier-forget': 'motivation.barrier.forget',
  'barrier-motivation': 'motivation.barrier.motivation',
  'barrier-tired': 'motivation.barrier.tired',
  'barrier-physical': 'motivation.barrier.physical',
  'barrier-how-to-start': 'motivation.barrier.howToStart',
  'support-plan': 'motivation.support.plan',
  'support-progress': 'motivation.support.progress',
  'support-knowledge': 'motivation.support.knowledge',
  'low-confidence': 'motivation.lowConfidence',
  'high-confidence': 'motivation.highConfidence',
};

export const milestoneLabels: Record<MilestoneId, ContentId> = {
  'first-session': 'milestone.first-session',
  'first-full-week': 'milestone.first-full-week',
  'five-sessions': 'milestone.five-sessions',
  'ten-sessions': 'milestone.ten-sessions',
  'four-weeks': 'milestone.four-weeks',
  halftime: 'milestone.halftime',
  'eight-weeks': 'milestone.eight-weeks',
  'twelve-weeks': 'milestone.twelve-weeks',
  'program-completed': 'milestone.program-completed',
};

export const learningCardContentIds: Record<LearningCardId, ContentId> = {
  'wandsitz-krafttraining': 'learning.card.wandsitz-krafttraining',
  'bewegung-sofort': 'learning.card.bewegung-sofort',
  'salz-tagesbudget': 'learning.card.salz-tagesbudget',
  'verstecktes-salz': 'learning.card.verstecktes-salz',
  'blutdruck-messen': 'learning.card.blutdruck-messen',
  'kaliumreiche-ernaehrung': 'learning.card.kaliumreiche-ernaehrung',
  ernaehrungsmuster: 'learning.card.ernaehrungsmuster',
  ausdauertraining: 'learning.card.ausdauertraining',
  'atmung-und-stress': 'learning.card.atmung-und-stress',
  alkohol: 'learning.card.alkohol',
  koerpergewicht: 'learning.card.koerpergewicht',
  kaliumsalz: 'learning.card.kaliumsalz',
  schlafapnoe: 'learning.card.schlafapnoe',
  'medikamente-und-alltagsprodukte': 'learning.card.medikamente-und-alltagsprodukte',
};

/**
 * Zusaetzliche Aufzaehlung einer Lernkarte (Handlungsschritte). Der Eintrag
 * liefert `fields.title` und `items`; Karten ohne Eintrag zeigen keinen Block.
 */
export const learningCardStepIds: Partial<Record<LearningCardId, ContentId>> = {
  'blutdruck-messen': 'learning.card.blutdruck-messen.steps',
};
