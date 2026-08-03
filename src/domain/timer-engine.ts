import type { SetResult, TrainingVariant } from './types';
import { PREPARATION_SECONDS, getSetTargets } from './week-matrix';

/**
 * Timer-Engine als explizite Zustandsmaschine (CLAUDE.md B.7, spec.md §18).
 *
 *   preparation → Satz 1 → Pause → Satz 2 → Pause → Satz 3 → Pause → Satz 4 → completed
 *
 * Alle Zeiten werden aus Zeitstempeln berechnet, nie aus aufaddierten Ticks.
 * Der Zustand ist serialisierbar und wird bei jedem Wechsel persistiert.
 *
 * Zwischenziel und freiwillige Zusatzzeit: Der Satz laeuft ohne Unterbruch
 * durch. Beim Erreichen des persoenlichen Zwischenziels wechselt die Anzeige
 * auf die Skala des Zusatzziels; der bereits erreichte Teil bleibt sichtbar.
 * Der Satz endet automatisch beim Zusatzziel — beziehungsweise beim
 * Zwischenziel, wenn es kein Zusatzziel gibt — und kann jederzeit manuell
 * beendet werden. Der Erfolg haengt allein am Zwischenziel.
 */

export type TimerPhase = 'preparation' | 'set' | 'rest' | 'completed';

export type TimerStatus =
  | 'running'
  | 'optional-running'
  | 'paused'
  | 'interrupted'
  | 'completed';

/**
 * Ab dieser Luecke seit dem letzten beobachteten Tick gilt die Einheit als
 * unterbrochen. Der Wert liegt bewusst ueber der Pausendauer von 120 Sekunden,
 * damit gedrosselte Hintergrund-Tabs waehrend einer regulaeren Pause keine
 * Unterbrechung ausloesen.
 */
export const INTERRUPTION_THRESHOLD_MS = 5 * 60 * 1000;

export interface TimerConfig {
  preparationSeconds: number;
  setCount: number;
  targetSeconds: number;
  optionalTargetSeconds: number | null;
  restSeconds: number;
}

export interface TimerState {
  config: TimerConfig;
  phase: TimerPhase;
  /** 0-basierter Index des aktuellen bzw. zuletzt gelaufenen Satzes. */
  setIndex: number;
  /** Beginn der aktuellen Phase in Millisekunden seit Epoch. */
  phaseStartedAt: number;
  /** Zeitpunkt der manuellen Pause, sonst `null`. */
  pausedAt: number | null;
  /** Aufsummierte Pausendauer innerhalb der aktuellen Phase. */
  pausedAccumMs: number;
  /** Zeitpunkt, auf den der Timer wegen einer Unterbrechung eingefroren ist. */
  interruptedAt: number | null;
  /** Letzter beobachteter Tick — Grundlage der Unterbrechungserkennung. */
  lastObservedAt: number;
  completedSets: SetResult[];
  finishedAt: number | null;
}

export interface TimerView {
  phase: TimerPhase;
  status: TimerStatus;
  /** 1-basierte Satznummer. */
  setNumber: number;
  setCount: number;
  targetSeconds: number;
  optionalTargetSeconds: number | null;
  /** Im laufenden Satz bereits gehaltene Sekunden. */
  holdSeconds: number;
  /** Verbleibende Sekunden bis zum Ziel der aktuellen Phase. */
  remainingSeconds: number;
  phaseTotalSeconds: number;
  /** Gefuellter Anteil des Rings zwischen 0 und 1. */
  progress: number;
  /**
   * Anteil des Rings, der auf das bereits erreichte Zwischenziel entfaellt.
   * In der Hauptphase 1, in der Zusatzphase `Zwischenziel / Zusatzziel`.
   */
  targetShare: number;
  /**
   * Annaeherung an das Zwischenziel zwischen 0 und 1. Steuert die Einfaerbung
   * des Rings von neutral nach gruen.
   */
  targetApproach: number;
  targetReached: boolean;
  inOptionalPhase: boolean;
  isPaused: boolean;
  isInterrupted: boolean;
  completedSets: SetResult[];
  reachedTargets: number;
  reachedOptionalTargets: number;
}

export function createTimerConfig(week: number, variant: TrainingVariant): TimerConfig {
  const targets = getSetTargets(week, variant);
  return {
    preparationSeconds: PREPARATION_SECONDS,
    setCount: targets.setCount,
    targetSeconds: targets.targetSeconds,
    optionalTargetSeconds: targets.optionalTargetSeconds,
    restSeconds: targets.restSeconds,
  };
}

export function createTimer(config: TimerConfig, now: number): TimerState {
  return {
    config,
    phase: 'preparation',
    setIndex: 0,
    phaseStartedAt: now,
    pausedAt: null,
    pausedAccumMs: 0,
    interruptedAt: null,
    lastObservedAt: now,
    completedSets: [],
    finishedAt: null,
  };
}

/** Obere Grenze eines Satzes: Zusatzziel, sonst Zwischenziel. */
function setCapSeconds(config: TimerConfig): number {
  return config.optionalTargetSeconds ?? config.targetSeconds;
}

/** Zeitpunkt, auf den sich die Berechnung bezieht (eingefroren bei Pause/Unterbruch). */
function effectiveNow(state: TimerState, now: number): number {
  if (state.pausedAt !== null) return state.pausedAt;
  if (state.interruptedAt !== null) return state.interruptedAt;
  return now;
}

function phaseElapsedMs(state: TimerState, now: number): number {
  return Math.max(0, effectiveNow(state, now) - state.phaseStartedAt - state.pausedAccumMs);
}

/** Fortschritt des laufenden Satzes, unabhaengig davon, wie er endet. */
export function currentSetProgress(
  state: TimerState,
  now: number,
): Omit<SetResult, 'index' | 'stoppedEarly'> {
  const { targetSeconds, optionalTargetSeconds } = state.config;
  const cap = setCapSeconds(state.config);
  const elapsedSeconds = phaseElapsedMs(state, now) / 1000;
  const held = Math.min(elapsedSeconds, cap);
  const targetReached = elapsedSeconds >= targetSeconds;
  return {
    heldSeconds: Math.floor(held),
    targetReached,
    optionalStarted: optionalTargetSeconds !== null && targetReached,
    optionalTargetReached: optionalTargetSeconds !== null && elapsedSeconds >= optionalTargetSeconds,
  };
}

function completeSetAt(state: TimerState, at: number, result: SetResult): TimerState {
  const completedSets = [...state.completedSets, result];
  const isLast = state.setIndex + 1 >= state.config.setCount;
  if (isLast) {
    return {
      ...state,
      completedSets,
      phase: 'completed',
      finishedAt: at,
      pausedAt: null,
      pausedAccumMs: 0,
      interruptedAt: null,
    };
  }
  return {
    ...state,
    completedSets,
    phase: 'rest',
    phaseStartedAt: at,
    pausedAt: null,
    pausedAccumMs: 0,
    interruptedAt: null,
  };
}

/** Fuehrt genau einen faelligen Phasenwechsel aus oder gibt `null` zurueck. */
function tryAdvance(state: TimerState, now: number): TimerState | null {
  const eff = effectiveNow(state, now);

  if (state.phase === 'preparation') {
    const dueAt =
      state.phaseStartedAt + state.pausedAccumMs + state.config.preparationSeconds * 1000;
    if (eff < dueAt) return null;
    return {
      ...state,
      phase: 'set',
      setIndex: 0,
      phaseStartedAt: dueAt,
      pausedAccumMs: 0,
    };
  }

  if (state.phase === 'rest') {
    const dueAt = state.phaseStartedAt + state.pausedAccumMs + state.config.restSeconds * 1000;
    if (eff < dueAt) return null;
    return {
      ...state,
      phase: 'set',
      setIndex: state.setIndex + 1,
      phaseStartedAt: dueAt,
      pausedAccumMs: 0,
    };
  }

  if (state.phase === 'set') {
    const cap = setCapSeconds(state.config);
    const dueAt = state.phaseStartedAt + state.pausedAccumMs + cap * 1000;
    if (eff < dueAt) return null;
    return completeSetAt(state, dueAt, {
      index: state.setIndex,
      heldSeconds: cap,
      targetReached: true,
      optionalStarted: state.config.optionalTargetSeconds !== null,
      optionalTargetReached: state.config.optionalTargetSeconds !== null,
      stoppedEarly: false,
    });
  }

  return null;
}

/**
 * Bringt den Zustand auf den aktuellen Zeitpunkt. Muss bei jedem Tick und nach
 * jedem Neuladen aufgerufen werden.
 */
export function syncTimer(state: TimerState, now: number): TimerState {
  if (state.phase === 'completed') return state;
  if (state.pausedAt !== null) return { ...state, lastObservedAt: now };
  if (state.interruptedAt !== null) return { ...state, lastObservedAt: now };

  if (now - state.lastObservedAt > INTERRUPTION_THRESHOLD_MS) {
    return { ...state, interruptedAt: state.lastObservedAt, lastObservedAt: now };
  }

  let next = state;
  for (let guard = 0; guard < 32; guard += 1) {
    const advanced = tryAdvance(next, now);
    if (!advanced) break;
    next = advanced;
    if (next.phase === 'completed') break;
  }
  return { ...next, lastObservedAt: now };
}

function resolveStatus(state: TimerState, fallback: TimerStatus): TimerStatus {
  if (state.interruptedAt !== null) return 'interrupted';
  if (state.pausedAt !== null) return 'paused';
  return fallback;
}

export function deriveTimerView(state: TimerState, now: number): TimerView {
  const { config } = state;
  const reachedTargets = state.completedSets.filter((set) => set.targetReached).length;
  const reachedOptionalTargets = state.completedSets.filter(
    (set) => set.optionalTargetReached,
  ).length;

  const base = {
    setCount: config.setCount,
    targetSeconds: config.targetSeconds,
    optionalTargetSeconds: config.optionalTargetSeconds,
    completedSets: state.completedSets,
    reachedTargets,
    reachedOptionalTargets,
    isPaused: state.pausedAt !== null,
    isInterrupted: state.interruptedAt !== null,
  };

  if (state.phase === 'completed') {
    return {
      ...base,
      phase: 'completed',
      status: 'completed',
      setNumber: config.setCount,
      holdSeconds: 0,
      remainingSeconds: 0,
      phaseTotalSeconds: 0,
      progress: 1,
      targetShare: 1,
      targetApproach: 1,
      targetReached: true,
      inOptionalPhase: false,
      isPaused: false,
      isInterrupted: false,
    };
  }

  if (state.phase === 'preparation' || state.phase === 'rest') {
    const elapsed = phaseElapsedMs(state, now) / 1000;
    const total =
      state.phase === 'preparation' ? config.preparationSeconds : config.restSeconds;
    return {
      ...base,
      phase: state.phase,
      status: resolveStatus(state, 'running'),
      setNumber: state.phase === 'preparation' ? 1 : state.setIndex + 1,
      holdSeconds: 0,
      remainingSeconds: Math.max(0, Math.ceil(total - elapsed)),
      phaseTotalSeconds: total,
      progress: total === 0 ? 1 : Math.min(1, elapsed / total),
      targetShare: 1,
      targetApproach: 0,
      targetReached: false,
      inOptionalPhase: false,
    };
  }

  const elapsedSeconds = phaseElapsedMs(state, now) / 1000;
  const cap = setCapSeconds(config);
  const held = Math.min(elapsedSeconds, cap);
  const targetReached = elapsedSeconds >= config.targetSeconds;
  const inOptional = targetReached && config.optionalTargetSeconds !== null;

  // Bis zum Zwischenziel zeigt der Ring die Skala des Zwischenziels, danach die
  // des Zusatzziels; der bereits erreichte Teil bleibt als Anteil sichtbar.
  const phaseTotal = inOptional ? cap : config.targetSeconds;
  const targetShare = inOptional ? config.targetSeconds / cap : 1;
  const targetApproach = targetReached
    ? 1
    : Math.min(1, Math.max(0, held / config.targetSeconds));

  return {
    ...base,
    phase: 'set',
    status: resolveStatus(state, inOptional ? 'optional-running' : 'running'),
    setNumber: state.setIndex + 1,
    holdSeconds: Math.floor(held),
    remainingSeconds: Math.max(0, Math.ceil(phaseTotal - held)),
    phaseTotalSeconds: phaseTotal,
    progress: phaseTotal === 0 ? 1 : Math.min(1, held / phaseTotal),
    targetShare,
    targetApproach,
    targetReached,
    inOptionalPhase: inOptional,
  };
}

export function pauseTimer(state: TimerState, now: number): TimerState {
  if (state.pausedAt !== null || state.phase === 'completed') return state;
  return { ...state, pausedAt: now, lastObservedAt: now };
}

export function resumeTimer(state: TimerState, now: number): TimerState {
  if (state.pausedAt === null) return state;
  return {
    ...state,
    pausedAccumMs: state.pausedAccumMs + Math.max(0, now - state.pausedAt),
    pausedAt: null,
    lastObservedAt: now,
  };
}

/** Setzt nach einer erkannten Unterbrechung ohne Zeitverlust fort. */
export function resumeAfterInterruption(state: TimerState, now: number): TimerState {
  if (state.interruptedAt === null) return state;
  return {
    ...state,
    pausedAccumMs: state.pausedAccumMs + Math.max(0, now - state.interruptedAt),
    interruptedAt: null,
    lastObservedAt: now,
  };
}

/** Beendet den laufenden Satz mit dem aktuell erreichten Stand. */
export function finishCurrentSet(state: TimerState, now: number): TimerState {
  if (state.phase !== 'set') return state;
  const progress = currentSetProgress(state, now);
  return completeSetAt(state, now, {
    index: state.setIndex,
    ...progress,
    stoppedEarly: !progress.targetReached,
  });
}

export function skipRest(state: TimerState, now: number): TimerState {
  if (state.phase !== 'rest') return state;
  return {
    ...state,
    phase: 'set',
    setIndex: state.setIndex + 1,
    phaseStartedAt: now,
    pausedAt: null,
    pausedAccumMs: 0,
    interruptedAt: null,
    lastObservedAt: now,
  };
}

/**
 * Beendet die Einheit vorzeitig. Ein angefangener Satz wird mit dem bis dahin
 * erreichten Stand gespeichert; nichts geht verloren (§18 «Unterbruch»).
 */
export function endSession(state: TimerState, now: number): TimerState {
  if (state.phase === 'completed') return state;
  if (state.phase === 'set') {
    const progress = currentSetProgress(state, now);
    const withSet = completeSetAt(state, now, {
      index: state.setIndex,
      ...progress,
      stoppedEarly: !progress.targetReached,
    });
    return { ...withSet, phase: 'completed', finishedAt: now, lastObservedAt: now };
  }
  return {
    ...state,
    phase: 'completed',
    finishedAt: now,
    pausedAt: null,
    interruptedAt: null,
    lastObservedAt: now,
  };
}

/** Anzahl erfolgreicher Saetze — massgeblich ist allein das Zwischenziel (§18). */
export function countSuccessfulSets(sets: SetResult[]): number {
  return sets.filter((set) => set.targetReached).length;
}

/** Vorschlag fuer die Durchfuehrungsangabe in der Rueckmeldung (§19 Frage 1). */
export function suggestCompletion(
  sets: SetResult[],
  setCount: number,
): 'full' | 'partial' | 'none' {
  const successful = countSuccessfulSets(sets);
  if (successful >= setCount) return 'full';
  if (successful > 0 || sets.some((set) => set.heldSeconds > 0)) return 'partial';
  return 'none';
}
