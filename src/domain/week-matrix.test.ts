import { describe, expect, it } from 'vitest';
import {
  PROGRAM_WEEKS,
  REST_SECONDS,
  SETS_PER_SESSION,
  clampProgramWeek,
  getSetTargets,
  getWeekProgram,
  weekMatrix,
} from './week-matrix';

/** B.11.1: Wochenmatrix ueber alle zwoelf Wochen, beide Varianten, Zusatzziele, Pause. */

const expected: Record<number, { light: number; optional: number; standard: number }> = {
  1: { light: 30, optional: 60, standard: 60 },
  2: { light: 30, optional: 60, standard: 60 },
  3: { light: 45, optional: 90, standard: 90 },
  4: { light: 45, optional: 90, standard: 90 },
  5: { light: 60, optional: 120, standard: 120 },
  6: { light: 60, optional: 120, standard: 120 },
  7: { light: 90, optional: 120, standard: 120 },
  8: { light: 90, optional: 120, standard: 120 },
  9: { light: 90, optional: 120, standard: 120 },
  10: { light: 90, optional: 120, standard: 120 },
  11: { light: 90, optional: 120, standard: 120 },
  12: { light: 90, optional: 120, standard: 120 },
};

describe('Wochenmatrix (§15)', () => {
  it('deckt genau die Wochen 1 bis 12 ohne Luecke und ohne Ueberschneidung ab', () => {
    const covered = weekMatrix.flatMap((row) => [...row.weeks]).sort((a, b) => a - b);
    expect(covered).toEqual(Array.from({ length: PROGRAM_WEEKS }, (_, index) => index + 1));
  });

  it.each(Object.keys(expected).map(Number))('liefert fuer Woche %i die Sollwerte', (week) => {
    const program = getWeekProgram(week);
    expect(program.lightSeconds).toBe(expected[week].light);
    expect(program.optionalSeconds).toBe(expected[week].optional);
    expect(program.standardSeconds).toBe(expected[week].standard);
  });

  it.each(Object.keys(expected).map(Number))(
    'leichte Variante in Woche %i hat Zwischenziel und Zusatzziel',
    (week) => {
      const targets = getSetTargets(week, 'light');
      expect(targets.targetSeconds).toBe(expected[week].light);
      expect(targets.optionalTargetSeconds).toBe(expected[week].optional);
      expect(targets.setCount).toBe(SETS_PER_SESSION);
      expect(targets.restSeconds).toBe(REST_SECONDS);
    },
  );

  it.each(Object.keys(expected).map(Number))(
    'normale Variante in Woche %i hat kein zusaetzliches Ziel',
    (week) => {
      const targets = getSetTargets(week, 'standard');
      expect(targets.targetSeconds).toBe(expected[week].standard);
      expect(targets.optionalTargetSeconds).toBeNull();
    },
  );

  it('verwendet in jeder Woche zwei Minuten Pause und vier Saetze', () => {
    for (let week = 1; week <= PROGRAM_WEEKS; week += 1) {
      for (const variant of ['light', 'standard'] as const) {
        const targets = getSetTargets(week, variant);
        expect(targets.restSeconds).toBe(120);
        expect(targets.setCount).toBe(4);
      }
    }
  });

  it('begrenzt Wochenzahlen ausserhalb des Programms', () => {
    expect(clampProgramWeek(0)).toBe(1);
    expect(clampProgramWeek(-5)).toBe(1);
    expect(clampProgramWeek(13)).toBe(12);
    expect(clampProgramWeek(99)).toBe(12);
  });
});
