import { describe, expect, it } from 'vitest';
import { addDays } from './dates';
import { evaluateMilestones, newMilestones } from './milestones';
import {
  computeProgress,
  computeStreak,
  getProgramWeek,
  isBeforeProgramStart,
  isProgramFinished,
  needsReentry,
  nextPlannedDate,
  plannedDatesLeftInCalendarWeek,
  programStart,
  sessionsInWeek,
  startChoiceOf,
  startDateFor,
  suggestStartChoice,
  weeklyGoal,
} from './progress';
import type { SetResult, TrainingPlan, TrainingSession } from './types';

/** B.11.6: Wochenziel, verpasste Einheiten, Serien, Meilensteine. */

// 2026-03-02 ist ein Montag.
const START: string = '2026-03-02';

const plan: TrainingPlan = {
  startDate: START,
  trainingDays: ['mon', 'wed', 'fri'],
  preferredDaytime: 'evening',
  preciseTimes: null,
  routineCue: null,
  createdAt: `${START}T08:00:00.000Z`,
};

function sets(reached: number, optional = 0): SetResult[] {
  return Array.from({ length: 4 }, (_, index) => ({
    index,
    heldSeconds: index < reached ? 45 : 10,
    targetReached: index < reached,
    optionalStarted: index < optional,
    optionalTargetReached: index < optional,
    stoppedEarly: index >= reached,
  }));
}

function session(date: string, overrides: Partial<TrainingSession> = {}): TrainingSession {
  return {
    id: `ses_${date}`,
    date,
    programWeek: getProgramWeek(plan, date),
    variant: 'light',
    targetSeconds: 30,
    optionalTargetSeconds: 60,
    sets: sets(4),
    feedback: { completion: 'full', exertion: 'fitting', complaints: false, wellbeing: 'good' },
    startedAt: `${date}T18:00:00.000Z`,
    endedAt: `${date}T18:12:00.000Z`,
    aborted: false,
    checkin: { mood: 'good', wish: 'suggest' },
    deviation: 'none',
    ...overrides,
  };
}

describe('Programmwoche (B.13.1)', () => {
  it('beginnt mit Woche 1 am Startdatum', () => {
    expect(getProgramWeek(plan, START)).toBe(1);
    expect(getProgramWeek(plan, addDays(START, 6))).toBe(1);
  });

  it('rollt nach jeweils sieben Tagen weiter', () => {
    expect(getProgramWeek(plan, addDays(START, 7))).toBe(2);
    expect(getProgramWeek(plan, addDays(START, 13))).toBe(2);
    expect(getProgramWeek(plan, addDays(START, 77))).toBe(12);
  });

  it('bleibt bei zwoelf stehen und meldet das Programmende', () => {
    expect(getProgramWeek(plan, addDays(START, 84))).toBe(12);
    expect(isProgramFinished(plan, addDays(START, 83))).toBe(false);
    expect(isProgramFinished(plan, addDays(START, 84))).toBe(true);
  });
});

describe('Wochenziel und verpasste Einheiten', () => {
  it('zaehlt nur Einheiten der jeweiligen Programmwoche', () => {
    const sessions = [
      session(addDays(START, 0)),
      session(addDays(START, 2)),
      session(addDays(START, 7)),
    ];
    expect(sessionsInWeek(plan, sessions, 1)).toHaveLength(2);
    expect(sessionsInWeek(plan, sessions, 2)).toHaveLength(1);
  });

  it('uebertraegt nicht erreichte Einheiten nicht in die Folgewoche', () => {
    const sessions = [session(addDays(START, 0))];
    const summary = computeProgress(plan, sessions, addDays(START, 7));
    expect(summary.programWeek).toBe(2);
    expect(summary.sessionsThisWeek).toBe(0);
  });

  it('zaehlt teilweise durchgefuehrte Einheiten als durchgefuehrt', () => {
    const sessions = [
      session(addDays(START, 0), {
        feedback: {
          completion: 'partial',
          exertion: 'hard',
          complaints: false,
          wellbeing: 'neutral',
        },
      }),
    ];
    expect(sessionsInWeek(plan, sessions, 1)).toHaveLength(1);
  });

  it('zaehlt nicht durchgefuehrte Einheiten nicht mit', () => {
    const sessions = [
      session(addDays(START, 0), {
        feedback: { completion: 'none', exertion: 'easy', complaints: false, wellbeing: 'bad' },
      }),
    ];
    expect(sessionsInWeek(plan, sessions, 1)).toHaveLength(0);
  });
});

describe('Serie (§20, §21 E)', () => {
  it('zaehlt aufeinanderfolgende genutzte Trainingstage', () => {
    const sessions = [session(addDays(START, 0)), session(addDays(START, 2))];
    const streak = computeStreak(plan, sessions, addDays(START, 3));
    expect(streak.current).toBe(2);
    expect(streak.longest).toBe(2);
  });

  it('unterbricht die Serie bei einem verpassten Trainingstag', () => {
    const sessions = [session(addDays(START, 0)), session(addDays(START, 4))];
    const streak = computeStreak(plan, sessions, addDays(START, 5));
    expect(streak.current).toBe(1);
    expect(streak.longest).toBe(1);
  });

  it('bricht die Serie nicht, solange der heutige Trainingstag noch offen ist', () => {
    const sessions = [session(addDays(START, 0)), session(addDays(START, 2))];
    const streak = computeStreak(plan, sessions, addDays(START, 4));
    expect(streak.current).toBe(2);
  });

  it('merkt sich die laengste Serie auch nach einem Unterbruch', () => {
    const sessions = [
      session(addDays(START, 0)),
      session(addDays(START, 2)),
      session(addDays(START, 4)),
      session(addDays(START, 11)),
    ];
    const streak = computeStreak(plan, sessions, addDays(START, 12));
    expect(streak.longest).toBe(3);
    expect(streak.current).toBe(1);
  });
});

describe('Wiedereinstieg', () => {
  it('erkennt eine laengere Pause', () => {
    const sessions = [session(addDays(START, 0))];
    expect(needsReentry(sessions, addDays(START, 12), 10)).toBe(true);
    expect(needsReentry(sessions, addDays(START, 5), 10)).toBe(false);
  });

  it('meldet keinen Wiedereinstieg ohne jede Einheit', () => {
    expect(needsReentry([], addDays(START, 30), 10)).toBe(false);
  });
});

describe('Fortschritt und Meilensteine', () => {
  it('summiert Zwischenziele und freiwillige Zusatzziele getrennt', () => {
    const sessions = [
      session(addDays(START, 0), { sets: sets(4, 2) }),
      session(addDays(START, 2), { sets: sets(3, 0) }),
    ];
    const summary = computeProgress(plan, sessions, addDays(START, 3));
    expect(summary.targetsReached).toBe(7);
    expect(summary.optionalTargetsReached).toBe(2);
  });

  it('berechnet die durchschnittliche Belastung', () => {
    const sessions = [
      session(addDays(START, 0), {
        feedback: { completion: 'full', exertion: 'easy', complaints: false, wellbeing: 'good' },
      }),
      session(addDays(START, 2), {
        feedback: { completion: 'full', exertion: 'hard', complaints: false, wellbeing: 'good' },
      }),
    ];
    expect(computeProgress(plan, sessions, addDays(START, 3)).averageExertion).toBe(2);
  });

  it('erkennt die erste vollstaendige Trainingswoche', () => {
    const sessions = [
      session(addDays(START, 0)),
      session(addDays(START, 2)),
      session(addDays(START, 4)),
    ];
    const summary = computeProgress(plan, sessions, addDays(START, 8));
    expect(summary.weeksWithGoalReached).toBe(1);
    expect(evaluateMilestones(summary)).toContain('first-full-week');
  });

  it('vergibt Meilensteine nach Einheiten und Wochen', () => {
    const dates = [0, 2, 4, 7, 9].map((offset) => addDays(START, offset));
    const summary = computeProgress(
      plan,
      dates.map((date) => session(date)),
      addDays(START, 30),
    );
    const reached = evaluateMilestones(summary);
    expect(reached).toContain('first-session');
    expect(reached).toContain('five-sessions');
    expect(reached).toContain('four-weeks');
    expect(reached).not.toContain('ten-sessions');
    expect(reached).not.toContain('program-completed');
  });

  it('meldet das Programmende erst nach zwoelf Wochen mit mindestens einer Einheit', () => {
    const summary = computeProgress(plan, [session(addDays(START, 0))], addDays(START, 84));
    expect(evaluateMilestones(summary)).toContain('program-completed');
    const withoutSessions = computeProgress(plan, [], addDays(START, 84));
    expect(evaluateMilestones(withoutSessions)).not.toContain('program-completed');
  });

  it('liefert nur neu erreichte Meilensteine', () => {
    expect(newMilestones(['first-session', 'five-sessions'], ['first-session'])).toEqual([
      'five-sessions',
    ]);
  });
});

describe('Naechster geplanter Trainingstag', () => {
  it('findet den heutigen Trainingstag', () => {
    expect(nextPlannedDate(plan, START)).toBe(START);
  });

  it('findet den naechsten Trainingstag nach einem freien Tag', () => {
    expect(nextPlannedDate(plan, addDays(START, 1))).toBe(addDays(START, 2));
  });
});


// ---------------------------------------------------------------- Kalenderwoche

/** 2026-03-05 ist ein Donnerstag; die Kalenderwoche beginnt am 2026-03-02. */
const THURSDAY_START = '2026-03-05';

function planFrom(startDate: string, trainingDays: TrainingPlan['trainingDays']): TrainingPlan {
  return {
    startDate,
    trainingDays,
    preferredDaytime: 'evening',
    preciseTimes: null,
    routineCue: null,
    createdAt: `${startDate}T08:00:00.000Z`,
  };
}

describe('Programmwoche als Kalenderwoche (revidierter Vorentscheid B.13.1)', () => {
  const midweekPlan = planFrom(THURSDAY_START, ['mon', 'wed', 'fri']);

  it('beginnt am Montag der Kalenderwoche, in der der Plan erstellt wurde', () => {
    expect(programStart(midweekPlan)).toBe('2026-03-02');
    expect(programStart(planFrom('2026-03-08', ['mon']))).toBe('2026-03-02'); // Sonntag
    expect(programStart(planFrom('2026-03-09', ['mon']))).toBe('2026-03-09'); // Montag
  });

  it('wechselt die Programmwoche am Montag, nicht am Erstellungstag', () => {
    expect(getProgramWeek(midweekPlan, '2026-03-05')).toBe(1);
    expect(getProgramWeek(midweekPlan, '2026-03-08')).toBe(1); // Sonntag
    expect(getProgramWeek(midweekPlan, '2026-03-09')).toBe(2); // Montag
    expect(getProgramWeek(midweekPlan, '2026-03-15')).toBe(2); // Sonntag
    expect(getProgramWeek(midweekPlan, '2026-03-16')).toBe(3);
  });

  it('endet zwoelf Kalenderwochen nach dem Startmontag', () => {
    expect(isProgramFinished(midweekPlan, '2026-05-24')).toBe(false); // Sonntag Woche 12
    expect(isProgramFinished(midweekPlan, '2026-05-25')).toBe(true); // Montag danach
  });

  it('ordnet Einheiten der Kalenderwoche zu', () => {
    const sunday = session('2026-03-08');
    const monday = session('2026-03-09');
    expect(sessionsInWeek(midweekPlan, [sunday, monday], 1)).toHaveLength(1);
    expect(sessionsInWeek(midweekPlan, [sunday, monday], 2)).toHaveLength(1);
  });
});

describe('Wochenziel der Startwoche', () => {
  it('zaehlt nur die ab dem Startdatum verbleibenden geplanten Tage', () => {
    // Start am Donnerstag, geplant Mo/Mi/Fr: nur der Freitag liegt noch in der Woche.
    expect(weeklyGoal(planFrom(THURSDAY_START, ['mon', 'wed', 'fri']), 1)).toBe(1);
    // Start am Donnerstag, geplant Di/Do/Sa: Donnerstag und Samstag liegen noch drin.
    expect(weeklyGoal(planFrom(THURSDAY_START, ['tue', 'thu', 'sat']), 1)).toBe(2);
  });

  it('bleibt bei drei, wenn die Woche am Montag beginnt', () => {
    expect(weeklyGoal(planFrom('2026-03-02', ['mon', 'wed', 'fri']), 1)).toBe(3);
  });

  it('faellt nie unter eine Einheit', () => {
    // Start am Sonntag, geplant Mo/Mi/Fr: kein geplanter Tag mehr in dieser Woche.
    expect(weeklyGoal(planFrom('2026-03-08', ['mon', 'wed', 'fri']), 1)).toBe(1);
  });

  it('gilt ab Woche 2 unveraendert', () => {
    const midweekPlan = planFrom(THURSDAY_START, ['mon', 'wed', 'fri']);
    expect(weeklyGoal(midweekPlan, 2)).toBe(3);
    expect(weeklyGoal(midweekPlan, 12)).toBe(3);
  });

  it('meldet das Ueberschreiten der Empfehlung, ohne es zu verhindern', () => {
    const fullWeekPlan = planFrom('2026-03-02', ['mon', 'wed', 'fri']);
    const sessions = ['2026-03-02', '2026-03-04', '2026-03-06', '2026-03-07'].map((date) =>
      session(date),
    );
    const summary = computeProgress(fullWeekPlan, sessions, '2026-03-08');
    expect(summary.weeklyGoal).toBe(3);
    expect(summary.sessionsThisWeek).toBe(4);
    expect(summary.weeklyGoalExceeded).toBe(true);
  });
});

describe('Wahl der Startwoche (§14, B.13.1)', () => {
  // 2026-08-01 ist ein Samstag, 2026-08-03 der folgende Montag.
  const SATURDAY = '2026-08-01';
  const NEXT_MONDAY = '2026-08-03';

  it('zaehlt die ab heute verbleibenden geplanten Tage der laufenden Woche', () => {
    expect(plannedDatesLeftInCalendarWeek(['mon', 'wed', 'sat'], SATURDAY)).toEqual([SATURDAY]);
    expect(plannedDatesLeftInCalendarWeek(['mon', 'wed', 'fri'], SATURDAY)).toEqual([]);
    expect(plannedDatesLeftInCalendarWeek(['mon', 'wed', 'fri'], '2026-08-03')).toEqual([
      '2026-08-03',
      '2026-08-05',
      '2026-08-07',
    ]);
  });

  it('schlaegt die kommende Woche vor, wenn weniger als zwei Tage uebrig sind', () => {
    // Samstag, geplant Mo/Mi/Sa: nur noch der heutige Samstag — das waere eine Restwoche.
    expect(suggestStartChoice(['mon', 'wed', 'sat'], SATURDAY)).toBe('next-week');
    // Samstag, geplant Mo/Mi/Fr: gar kein Tag mehr uebrig.
    expect(suggestStartChoice(['mon', 'wed', 'fri'], SATURDAY)).toBe('next-week');
    // Montag, geplant Mo/Mi/Fr: die volle Woche liegt vor der Person.
    expect(suggestStartChoice(['mon', 'wed', 'fri'], NEXT_MONDAY)).toBe('this-week');
  });

  it('leitet aus der Wahl das Startdatum ab', () => {
    expect(startDateFor('this-week', SATURDAY)).toBe(SATURDAY);
    expect(startDateFor('next-week', SATURDAY)).toBe(NEXT_MONDAY);
    // Auch am Sonntag ist der naechste Start der Montag danach.
    expect(startDateFor('next-week', '2026-08-02')).toBe(NEXT_MONDAY);
  });

  it('erkennt die gewaehlte Startwoche aus dem Startdatum wieder', () => {
    expect(startChoiceOf(SATURDAY, SATURDAY)).toBe('this-week');
    expect(startChoiceOf(NEXT_MONDAY, SATURDAY)).toBe('next-week');
  });

  it('gibt der kommenden Startwoche das volle Wochenziel', () => {
    const later = planFrom(NEXT_MONDAY, ['mon', 'wed', 'sat']);
    expect(weeklyGoal(later, 1)).toBe(3);
    expect(programStart(later)).toBe(NEXT_MONDAY);
  });
});

describe('Zeit vor dem Programmstart', () => {
  const NEXT_MONDAY = '2026-08-03';
  const SATURDAY = '2026-08-01';
  const later = planFrom(NEXT_MONDAY, ['mon', 'wed', 'sat']);

  it('meldet den Vorstart-Zustand bis zum Startdatum', () => {
    expect(isBeforeProgramStart(later, SATURDAY)).toBe(true);
    expect(isBeforeProgramStart(later, '2026-08-02')).toBe(true);
    expect(isBeforeProgramStart(later, NEXT_MONDAY)).toBe(false);
    expect(isBeforeProgramStart(later, '2026-08-04')).toBe(false);
  });

  it('nennt als naechste Einheit nie einen Tag vor dem Start', () => {
    // Der Samstag waere ein Trainingstag, liegt aber vor dem Programmstart.
    expect(nextPlannedDate(later, SATURDAY)).toBe(NEXT_MONDAY);
  });

  it('zaehlt vor dem Start weder Einheiten noch Serien', () => {
    const summary = computeProgress(later, [], SATURDAY);
    expect(summary.sessionsTotal).toBe(0);
    expect(summary.currentStreak).toBe(0);
    expect(summary.completedWeeks).toBe(0);
    expect(summary.programFinished).toBe(false);
  });
});
