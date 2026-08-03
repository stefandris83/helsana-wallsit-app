import type { LearningCardId, LearningTopic } from '../content/learning-cards';
import { learningCardIds, learningCardTopics } from '../content/learning-cards';
import type { Barrier, ClockTime, PreferredDaytime, Profile, Questionnaire } from './types';

/**
 * Regelbasierte Personalisierung (spec.md §13). Kein generatives Modell,
 * keine Diagnostik, keine medizinische Empfehlung.
 *
 * Zulaessige Wirkbereiche: Reihenfolge der Lernkarten, Formulierung der
 * Motivationshinweise, Sichtbarkeit des naechsten Trainings, vorgeschlagene
 * Erinnerungszeit, Wiedereinstiegshinweise, leichte oder normale Variante.
 */

export type MotivationKey =
  | 'default'
  | 'barrier-time'
  | 'barrier-forget'
  | 'barrier-motivation'
  | 'barrier-tired'
  | 'barrier-physical'
  | 'barrier-how-to-start'
  | 'support-plan'
  | 'support-progress'
  | 'support-knowledge'
  | 'low-confidence'
  | 'high-confidence';

export interface PersonalizationResult {
  /** Reihenfolge der Lernkarten (§22 «Reihenfolge der Lernkarten»). */
  learningOrder: LearningCardId[];
  /** true, wenn die Reihenfolge von der Standardreihenfolge abweicht. */
  learningOrderPersonalized: boolean;
  /** Motivationshinweis auf der Startseite. */
  motivation: MotivationKey;
  /** Lernkarte auf der Startseite hervorheben. */
  highlightLearningCard: boolean;
  /** Naechstes geplantes Training prominent zeigen. */
  emphasizeNextSession: boolean;
  /** Erinnerungseinstellung prominent zeigen. */
  emphasizeReminders: boolean;
  /** Wiedereinstieg und kleine Schritte betonen. */
  emphasizeSmallSteps: boolean;
}

const LOW_CONFIDENCE_MAX = 4;
const HIGH_CONFIDENCE_MIN = 8;

const barrierMotivation: Record<Barrier, MotivationKey> = {
  time: 'barrier-time',
  forget: 'barrier-forget',
  motivation: 'barrier-motivation',
  tired: 'barrier-tired',
  physical: 'barrier-physical',
  'how-to-start': 'barrier-how-to-start',
};

/**
 * Zusaetzliche Signale fuer die Reihenfolge der Lernkarten.
 *
 * REGULATORISCHE GRENZE (§3, §22): Zulaessig sind ausschliesslich nicht
 * medizinische Angaben. Blutdruckwerte, Tagebucheintraege, die Frage nach
 * Beschwerden (§12 Frage 3) sowie Gewicht, Taillenumfang, Geburtsjahr und
 * Geschlecht fliessen bewusst nicht ein — eine Priorisierung aufgrund solcher
 * Angaben waere eine implizite Bewertung.
 */
export interface LearningOrderContext {
  /** Nur `dailyActivity` wird ausgewertet (§11: nicht medizinische Priorisierung). */
  profile?: Pick<Profile, 'dailyActivity'> | null;
  /** Bereits geoeffnete Karten rutschen ans Ende, bleiben aber erreichbar. */
  openedCardIds?: readonly string[];
}

/** Gewichtete Themen aus den Onboarding-Antworten. Hoeheres Gewicht zuerst. */
function topicWeights(
  questionnaire: Questionnaire,
  context: LearningOrderContext,
): Map<LearningTopic, number> {
  const weights = new Map<LearningTopic, number>();
  const add = (topic: LearningTopic, weight: number) => {
    weights.set(topic, (weights.get(topic) ?? 0) + weight);
  };

  // Huerden (§12 Frage 6). Die erstgenannte Huerde wiegt schwerer.
  questionnaire.barriers.forEach((barrier, position) => {
    const weight = position === 0 ? 3 : 2;
    for (const topic of barrierTopics[barrier]) {
      add(topic, weight);
    }
  });

  // Wandsitz-Erfahrung (§12 Frage 2).
  if (questionnaire.wallsitExperience === 'never') {
    add('einstieg', 2);
  } else if (questionnaire.wallsitExperience === 'regular') {
    add('kraft', 1);
    add('ausdauer', 1);
  }

  // Aktivitaetsniveau (§12 Frage 1). Wer viel bewegt ist, sieht andere Hebel zuerst.
  if (questionnaire.activityLevel === 'rarely') {
    add('einstieg', 2);
    add('kurze-routinen', 1);
  } else if (questionnaire.activityLevel === 'one-to-two') {
    add('kurze-routinen', 1);
  } else {
    add('ernaehrung', 2);
    add('messen', 1);
  }

  // Wunsch nach Gesundheitswissen (§12 Frage 7).
  if (questionnaire.support === 'knowledge') {
    add('messen', 1);
  }

  // Alltagstaetigkeit aus dem Profil (§11, ausdruecklich nicht medizinisch).
  const dailyActivity = context.profile?.dailyActivity;
  if (dailyActivity === 'sitting') {
    add('bewegung', 2);
    add('kurze-routinen', 1);
  } else if (dailyActivity === 'active') {
    add('ernaehrung', 1);
  }

  return weights;
}

const barrierTopics: Record<Barrier, ReadonlyArray<LearningTopic>> = {
  time: ['kurze-routinen', 'sofort-wirkung'],
  forget: ['kurze-routinen'],
  motivation: ['sofort-wirkung', 'erholung'],
  tired: ['schlaf', 'erholung'],
  physical: ['einstieg', 'sicherheit'],
  'how-to-start': ['einstieg', 'kraft'],
};

export function orderLearningCards(
  questionnaire: Questionnaire | null,
  context: LearningOrderContext = {},
): LearningCardId[] {
  const base = [...learningCardIds];
  const opened = new Set(context.openedCardIds ?? []);

  const byTopic = questionnaire
    ? (() => {
        const weights = topicWeights(questionnaire, context);
        if (weights.size === 0) return base;
        const score = (id: LearningCardId): number =>
          learningCardTopics[id].reduce((sum, topic) => sum + (weights.get(topic) ?? 0), 0);
        return base
          .map((id, index) => ({ id, index, score: score(id) }))
          .sort((a, b) => (b.score === a.score ? a.index - b.index : b.score - a.score))
          .map((entry) => entry.id);
      })()
    : base;

  if (opened.size === 0) return byTopic;

  // Gelesene Karten ans Ende, relative Reihenfolge bleibt erhalten.
  return [...byTopic.filter((id) => !opened.has(id)), ...byTopic.filter((id) => opened.has(id))];
}

export function personalize(
  questionnaire: Questionnaire | null,
  context: LearningOrderContext = {},
): PersonalizationResult {
  if (!questionnaire) {
    return {
      learningOrder: orderLearningCards(null, context),
      learningOrderPersonalized: false,
      motivation: 'default',
      highlightLearningCard: false,
      emphasizeNextSession: false,
      emphasizeReminders: false,
      emphasizeSmallSteps: false,
    };
  }

  const primaryBarrier = questionnaire.barriers[0];
  let motivation: MotivationKey = 'default';
  if (primaryBarrier) {
    motivation = barrierMotivation[primaryBarrier];
  } else if (questionnaire.support === 'plan') {
    motivation = 'support-plan';
  } else if (questionnaire.support === 'progress') {
    motivation = 'support-progress';
  } else if (questionnaire.support === 'knowledge') {
    motivation = 'support-knowledge';
  }

  if (questionnaire.confidence <= LOW_CONFIDENCE_MAX) {
    motivation = 'low-confidence';
  } else if (questionnaire.confidence >= HIGH_CONFIDENCE_MIN && motivation === 'default') {
    motivation = 'high-confidence';
  }

  const learningOrder = orderLearningCards(questionnaire, context);

  return {
    learningOrder,
    learningOrderPersonalized: learningOrder.some((id, index) => id !== learningCardIds[index]),
    motivation,
    highlightLearningCard: questionnaire.support === 'knowledge',
    emphasizeNextSession:
      questionnaire.support === 'plan' || questionnaire.barriers.includes('forget'),
    emphasizeReminders:
      questionnaire.support === 'reminders' || questionnaire.barriers.includes('forget'),
    emphasizeSmallSteps: questionnaire.confidence <= LOW_CONFIDENCE_MAX,
  };
}

const daytimeDefaults: Record<PreferredDaytime, ClockTime> = {
  morning: '07:30',
  midday: '12:15',
  evening: '18:00',
  varies: '18:00',
};

/** Vorgeschlagene Erinnerungszeit aus der bevorzugten Tageszeit (§13). */
export function suggestReminderTime(daytime: PreferredDaytime): ClockTime {
  return daytimeDefaults[daytime];
}

/**
 * Vermeidet eine zeitliche Ueberschneidung von Blutdruck- und Trainings-
 * erinnerung (§23 «Erinnerung zur Messung»). Rein zeitliche Regel, ohne Bezug
 * auf Messwerte.
 */
export function overlapsTrainingTime(
  reminderTime: ClockTime,
  trainingTime: ClockTime | null,
  toleranceMinutes = 60,
): boolean {
  if (!trainingTime) return false;
  const [rh, rm] = reminderTime.split(':').map(Number);
  const [th, tm] = trainingTime.split(':').map(Number);
  const diff = Math.abs((rh ?? 0) * 60 + (rm ?? 0) - ((th ?? 0) * 60 + (tm ?? 0)));
  return diff <= toleranceMinutes;
}
