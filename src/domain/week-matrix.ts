import type { TrainingVariant } from './types';

/**
 * Trainingsvarianten nach Programmwoche (spec.md §15).
 *
 * Diese Datei ist die einzige Quelle der Wochenmatrix (CLAUDE.md B.5) und
 * vollstaendig durch `week-matrix.test.ts` abgedeckt (B.11.1).
 *
 * | Wochen | Leicht  | Optionales Zusatzziel | Normal   |
 * |--------|---------|-----------------------|----------|
 * | 1–2    | 4 × 30 s | 60 s                 | 4 × 60 s  |
 * | 3–4    | 4 × 45 s | 90 s                 | 4 × 90 s  |
 * | 5–6    | 4 × 60 s | 120 s                | 4 × 120 s |
 * | 7–8    | 4 × 90 s | 120 s                | 4 × 120 s |
 * | 9–12   | 4 × 90 s | 120 s                | 4 × 120 s |
 */

export const PROGRAM_WEEKS = 12;
export const SETS_PER_SESSION = 4;
export const SESSIONS_PER_WEEK = 3;
/** Zwei Minuten Pause zwischen den Saetzen (§14, §15). */
export const REST_SECONDS = 120;
/** Kurze Vorbereitungsphase vor dem ersten Satz (§18). */
export const PREPARATION_SECONDS = 15;

export interface WeekProgram {
  /** Wochen, fuer die diese Zeile gilt. */
  weeks: readonly number[];
  /** Haltezeit pro Satz in der leichten Variante. */
  lightSeconds: number;
  /** Freiwilliges Zusatzziel oberhalb der leichten Variante. */
  optionalSeconds: number;
  /** Haltezeit pro Satz in der normalen Variante. */
  standardSeconds: number;
}

export const weekMatrix: readonly WeekProgram[] = [
  { weeks: [1, 2], lightSeconds: 30, optionalSeconds: 60, standardSeconds: 60 },
  { weeks: [3, 4], lightSeconds: 45, optionalSeconds: 90, standardSeconds: 90 },
  { weeks: [5, 6], lightSeconds: 60, optionalSeconds: 120, standardSeconds: 120 },
  { weeks: [7, 8], lightSeconds: 90, optionalSeconds: 120, standardSeconds: 120 },
  { weeks: [9, 10, 11, 12], lightSeconds: 90, optionalSeconds: 120, standardSeconds: 120 },
] as const;

/** Begrenzt eine Wochenzahl auf den gueltigen Programmbereich 1..12. */
export function clampProgramWeek(week: number): number {
  if (!Number.isFinite(week)) return 1;
  return Math.min(Math.max(Math.trunc(week), 1), PROGRAM_WEEKS);
}

export function getWeekProgram(week: number): WeekProgram {
  const clamped = clampProgramWeek(week);
  const row = weekMatrix.find((entry) => entry.weeks.includes(clamped));
  if (!row) {
    throw new Error(`Keine Wochenmatrix-Zeile fuer Woche ${clamped}.`);
  }
  return row;
}

export interface SetTargets {
  /** Persoenliches Zwischenziel; Erreichen bedeutet vollen Erfolg (§18). */
  targetSeconds: number;
  /** Freiwilliges Zusatzziel; `null`, wenn es keines gibt. */
  optionalTargetSeconds: number | null;
  restSeconds: number;
  setCount: number;
}

/**
 * Zielzeiten einer Einheit. In der normalen Variante ist das Wochenziel bereits
 * das obere Ende der Matrix; deshalb gibt es dort kein zusaetzliches Zusatzziel.
 */
export function getSetTargets(week: number, variant: TrainingVariant): SetTargets {
  const program = getWeekProgram(week);
  if (variant === 'light') {
    return {
      targetSeconds: program.lightSeconds,
      optionalTargetSeconds:
        program.optionalSeconds > program.lightSeconds ? program.optionalSeconds : null,
      restSeconds: REST_SECONDS,
      setCount: SETS_PER_SESSION,
    };
  }
  return {
    targetSeconds: program.standardSeconds,
    optionalTargetSeconds: null,
    restSeconds: REST_SECONDS,
    setCount: SETS_PER_SESSION,
  };
}
