import { describe, expect, it } from 'vitest';
import { learningCardIds } from '../content/learning-cards';
import { orderLearningCards, personalize, suggestReminderTime } from './personalization';
import type { Barrier, Profile, Questionnaire, SupportPreference } from './types';

/**
 * Regelbasierte Personalisierung (§13, §22).
 *
 * Geprueft werden Vollstaendigkeit und Determinismus der Reihenfolge sowie die
 * Grenze aus §3: keine Priorisierung aufgrund medizinischer Angaben.
 */

const baseQuestionnaire: Questionnaire = {
  activityLevel: 'one-to-two',
  wallsitExperience: 'tried',
  complaints: 'none',
  trainingDays: ['mon', 'wed', 'fri'],
  preferredDaytime: 'evening',
  preciseTimes: null,
  barriers: [],
  support: 'plan',
  confidence: 6,
  remindersWanted: true,
  reminderTime: '18:00',
};

const questionnaireWith = (patch: Partial<Questionnaire>): Questionnaire => ({
  ...baseQuestionnaire,
  ...patch,
});

const profile: Profile = {
  birthYear: 1975,
  heightCm: 175,
  weightKg: 80,
  sex: 'unspecified',
  waistCm: null,
  dailyActivity: 'mixed',
};

describe('Reihenfolge der Lernkarten (§22)', () => {
  it('liefert ohne Fragebogen die Standardreihenfolge', () => {
    expect(orderLearningCards(null)).toEqual([...learningCardIds]);
  });

  it('enthaelt in jedem Fall alle Karten genau einmal', () => {
    const barriers: Barrier[] = ['time', 'forget', 'motivation', 'tired', 'physical', 'how-to-start'];
    const supports: SupportPreference[] = [
      'feedback',
      'plan',
      'reminders',
      'knowledge',
      'progress',
    ];
    for (const barrier of barriers) {
      for (const support of supports) {
        const order = orderLearningCards(questionnaireWith({ barriers: [barrier], support }));
        expect([...order].sort()).toEqual([...learningCardIds].sort());
      }
    }
  });

  it('ist deterministisch', () => {
    const questionnaire = questionnaireWith({ barriers: ['time', 'tired'] });
    expect(orderLearningCards(questionnaire)).toEqual(orderLearningCards(questionnaire));
  });

  it('stellt bei «zu wenig Zeit» die kurzen Routinen nach vorne', () => {
    const order = orderLearningCards(questionnaireWith({ barriers: ['time'] }));
    expect(order.slice(0, 2)).toContain('bewegung-sofort');
    expect(order.indexOf('bewegung-sofort')).toBeLessThan(order.indexOf('ernaehrungsmuster'));
  });

  it('stellt bei Muedigkeit die Schlafkarte vor die Ernaehrungskarten', () => {
    const order = orderLearningCards(questionnaireWith({ barriers: ['tired'] }));
    expect(order.indexOf('schlafapnoe')).toBeLessThan(order.indexOf('ernaehrungsmuster'));
    expect(order.indexOf('atmung-und-stress')).toBeLessThan(order.indexOf('ernaehrungsmuster'));
  });

  it('stellt ohne Wandsitz-Erfahrung die Einstiegskarte an den Anfang', () => {
    const order = orderLearningCards(
      questionnaireWith({ wallsitExperience: 'never', activityLevel: 'rarely' }),
    );
    expect(order[0]).toBe('wandsitz-krafttraining');
  });

  it('gewichtet bei koerperlichen Huerden die Sicherheitsthemen hoeher', () => {
    const withBarrier = orderLearningCards(questionnaireWith({ barriers: ['physical'] }));
    const withoutBarrier = orderLearningCards(baseQuestionnaire);
    expect(withBarrier.indexOf('kaliumsalz')).toBeLessThan(withoutBarrier.indexOf('kaliumsalz'));
  });

  it('beruecksichtigt die sitzende Alltagstaetigkeit aus dem Profil (§11)', () => {
    // Wer aktiv ist, sieht zuerst die Ernaehrungshebel; wer sitzt, zuerst die Bewegung.
    const questionnaire = questionnaireWith({ activityLevel: 'three-to-four' });
    const withoutProfile = orderLearningCards(questionnaire);
    const sitting = orderLearningCards(questionnaire, {
      profile: { dailyActivity: 'sitting' },
    });

    expect(withoutProfile.indexOf('salz-tagesbudget')).toBeLessThan(
      withoutProfile.indexOf('bewegung-sofort'),
    );
    expect(sitting.indexOf('bewegung-sofort')).toBeLessThan(sitting.indexOf('salz-tagesbudget'));
  });

  it('schiebt gelesene Karten ans Ende, ohne eine zu verlieren', () => {
    const order = orderLearningCards(baseQuestionnaire, {
      openedCardIds: ['wandsitz-krafttraining', 'salz-tagesbudget'],
    });
    expect([...order].sort()).toEqual([...learningCardIds].sort());
    expect(order.slice(-2)).toEqual(['wandsitz-krafttraining', 'salz-tagesbudget']);
  });
});

describe('Grenze der Personalisierung (§3, B.6)', () => {
  it('ist unabhaengig von Gewicht, Groesse, Geburtsjahr und Geschlecht', () => {
    const questionnaire = questionnaireWith({ barriers: ['time'] });
    const lightProfile: Profile = {
      ...profile,
      weightKg: 55,
      heightCm: 160,
      birthYear: 1995,
      sex: 'female',
      waistCm: 70,
    };
    const heavyProfile: Profile = {
      ...profile,
      weightKg: 110,
      heightCm: 190,
      birthYear: 1950,
      sex: 'male',
      waistCm: 115,
    };
    expect(orderLearningCards(questionnaire, { profile: lightProfile })).toEqual(
      orderLearningCards(questionnaire, { profile: heavyProfile }),
    );
  });

  it('ist unabhaengig von der Angabe zu Beschwerden (§12 Frage 3)', () => {
    const none = orderLearningCards(questionnaireWith({ complaints: 'none' }));
    const strong = orderLearningCards(questionnaireWith({ complaints: 'strong' }));
    expect(none).toEqual(strong);
  });
});

describe('personalize (§13)', () => {
  it('meldet eine unveraenderte Reihenfolge als nicht personalisiert', () => {
    const result = personalize(null);
    expect(result.learningOrder).toEqual([...learningCardIds]);
    expect(result.learningOrderPersonalized).toBe(false);
  });

  it('meldet eine abweichende Reihenfolge als personalisiert', () => {
    const result = personalize(questionnaireWith({ barriers: ['tired'] }));
    expect(result.learningOrderPersonalized).toBe(true);
  });

  it('schlaegt die Erinnerungszeit aus der bevorzugten Tageszeit vor', () => {
    expect(suggestReminderTime('morning')).toBe('07:30');
  });
});
