import { describe, expect, it } from 'vitest';
import {
  INTERRUPTION_THRESHOLD_MS,
  countSuccessfulSets,
  createTimer,
  createTimerConfig,
  deriveTimerView,
  endSession,
  finishCurrentSet,
  pauseTimer,
  resumeAfterInterruption,
  resumeTimer,
  suggestCompletion,
  syncTimer,
} from './timer-engine';
import type { TimerState } from './timer-engine';
import { PREPARATION_SECONDS } from './week-matrix';

/**
 * B.11.2 Erfolgslogik, B.11.3 Zustandsmaschine mit kontrollierter Zeit,
 * B.11.4 Unterbruch und Wiederaufnahme.
 */

const T0 = 1_700_000_000_000;

/** Woche 3, leichte Variante: Ziel 45 s, Zusatzziel 90 s (§18 Beispiel). */
function lightWeek3(): TimerState {
  return createTimer(createTimerConfig(3, 'light'), T0);
}

function at(state: TimerState, seconds: number): TimerState {
  return syncTimer(state, T0 + seconds * 1000);
}

describe('Timer-Zustandsmaschine (§18, B.7)', () => {
  it('startet in der Vorbereitung und wechselt danach in Satz 1', () => {
    let state = lightWeek3();
    expect(deriveTimerView(state, T0).phase).toBe('preparation');

    state = at(state, PREPARATION_SECONDS - 1);
    expect(deriveTimerView(state, T0 + (PREPARATION_SECONDS - 1) * 1000).phase).toBe('preparation');

    state = at(state, PREPARATION_SECONDS);
    const view = deriveTimerView(state, T0 + PREPARATION_SECONDS * 1000);
    expect(view.phase).toBe('set');
    expect(view.setNumber).toBe(1);
  });

  it('fuehrt vier Saetze mit drei Pausen und endet danach', () => {
    let state = lightWeek3();
    let now = T0;

    const advance = (seconds: number) => {
      now += seconds * 1000;
      state = syncTimer(state, now);
    };

    advance(PREPARATION_SECONDS);

    for (let set = 1; set <= 4; set += 1) {
      expect(deriveTimerView(state, now).phase).toBe('set');
      expect(deriveTimerView(state, now).setNumber).toBe(set);

      advance(45); // Zwischenziel erreicht
      expect(deriveTimerView(state, now).targetReached).toBe(true);

      state = finishCurrentSet(state, now);

      if (set < 4) {
        expect(deriveTimerView(state, now).phase).toBe('rest');
        expect(deriveTimerView(state, now).phaseTotalSeconds).toBe(120);
        advance(120);
      }
    }

    expect(deriveTimerView(state, now).phase).toBe('completed');
    expect(state.completedSets).toHaveLength(4);
    expect(countSuccessfulSets(state.completedSets)).toBe(4);
  });

  it('geht am Zwischenziel ohne Unterbruch in die Zusatzzeit ueber', () => {
    const now = T0 + (PREPARATION_SECONDS + 45) * 1000;
    const view = deriveTimerView(syncTimer(lightWeek3(), now), now);
    expect(view.phase).toBe('set');
    expect(view.status).toBe('optional-running');
    expect(view.targetReached).toBe(true);
    expect(view.inOptionalPhase).toBe(true);
    // Die Anzeige wechselt auf die Skala des Zusatzziels.
    expect(view.phaseTotalSeconds).toBe(90);
    expect(view.holdSeconds).toBe(45);
    expect(view.remainingSeconds).toBe(45);
    expect(view.targetShare).toBeCloseTo(0.5);
  });

  it('beendet den Satz automatisch beim Zusatzziel', () => {
    const now = T0 + (PREPARATION_SECONDS + 90) * 1000;
    const state = syncTimer(lightWeek3(), now);
    expect(state.completedSets).toHaveLength(1);
    expect(state.completedSets[0]).toMatchObject({
      heldSeconds: 90,
      targetReached: true,
      optionalStarted: true,
      optionalTargetReached: true,
      stoppedEarly: false,
    });
    expect(deriveTimerView(state, now).phase).toBe('rest');
  });

  it('beendet den Satz in der normalen Variante direkt beim Zwischenziel', () => {
    const config = createTimerConfig(3, 'standard');
    const now = T0 + (PREPARATION_SECONDS + 90) * 1000;
    const state = syncTimer(createTimer(config, T0), now);
    expect(state.completedSets).toHaveLength(1);
    expect(state.completedSets[0]).toMatchObject({
      heldSeconds: 90,
      targetReached: true,
      optionalStarted: false,
      optionalTargetReached: false,
    });
    expect(deriveTimerView(state, now).phase).toBe('rest');
  });
});

describe('Einfaerbung des Fortschrittsrings', () => {
  it('naehert sich mit der Haltezeit von neutral an das Zwischenziel an', () => {
    const view = (seconds: number) => {
      const now = T0 + (PREPARATION_SECONDS + seconds) * 1000;
      return deriveTimerView(syncTimer(lightWeek3(), now), now);
    };

    expect(view(0).targetApproach).toBe(0);
    expect(view(10).targetApproach).toBeCloseTo(10 / 45, 2);
    expect(view(30).targetApproach).toBeCloseTo(30 / 45, 2);
    expect(view(45).targetApproach).toBe(1);
  });

  it('haelt den erreichten Anteil in der Zusatzphase fest', () => {
    const now = T0 + (PREPARATION_SECONDS + 60) * 1000;
    const view = deriveTimerView(syncTimer(lightWeek3(), now), now);
    expect(view.targetApproach).toBe(1);
    expect(view.targetShare).toBeCloseTo(45 / 90);
    expect(view.progress).toBeCloseTo(60 / 90);
  });

  it('faerbt Vorbereitung und Pause nicht ein', () => {
    const prep = deriveTimerView(lightWeek3(), T0 + 5000);
    expect(prep.phase).toBe('preparation');
    expect(prep.targetApproach).toBe(0);

    const afterSet = finishCurrentSet(
      syncTimer(lightWeek3(), T0 + (PREPARATION_SECONDS + 45) * 1000),
      T0 + (PREPARATION_SECONDS + 45) * 1000,
    );
    const rest = deriveTimerView(afterSet, T0 + (PREPARATION_SECONDS + 50) * 1000);
    expect(rest.phase).toBe('rest');
    expect(rest.targetApproach).toBe(0);
  });
});

describe('Erfolgslogik (§18, B.11.2)', () => {
  it('wertet einen Satz ab dem Zwischenziel als erfolgreich', () => {
    let state = at(lightWeek3(), PREPARATION_SECONDS + 45);
    state = finishCurrentSet(state, T0 + (PREPARATION_SECONDS + 45) * 1000);
    const result = state.completedSets[0];
    expect(result.targetReached).toBe(true);
    expect(result.stoppedEarly).toBe(false);
    expect(result.optionalTargetReached).toBe(false);
  });

  it('markiert einen vor dem Zwischenziel beendeten Satz als nicht erfolgreich', () => {
    let state = at(lightWeek3(), PREPARATION_SECONDS + 20);
    state = finishCurrentSet(state, T0 + (PREPARATION_SECONDS + 20) * 1000);
    const result = state.completedSets[0];
    expect(result.targetReached).toBe(false);
    expect(result.stoppedEarly).toBe(true);
    expect(result.heldSeconds).toBe(20);
  });

  it('speichert freiwillige Zusatzsekunden getrennt und ohne Erfolgsvoraussetzung', () => {
    const now = T0 + (PREPARATION_SECONDS + 90) * 1000;
    const state = syncTimer(lightWeek3(), now);

    const result = state.completedSets[0];
    expect(result.targetReached).toBe(true);
    expect(result.optionalStarted).toBe(true);
    expect(result.optionalTargetReached).toBe(true);
    expect(result.heldSeconds).toBe(90);
  });

  it('beendet die Zusatzphase jederzeit erfolgreich', () => {
    const now = T0 + (PREPARATION_SECONDS + 55) * 1000;
    const state = finishCurrentSet(syncTimer(lightWeek3(), now), now);
    const result = state.completedSets[0];
    expect(result.targetReached).toBe(true);
    expect(result.optionalStarted).toBe(true);
    expect(result.optionalTargetReached).toBe(false);
    expect(result.heldSeconds).toBe(55);
    expect(result.stoppedEarly).toBe(false);
  });

  it('kennt in der normalen Variante keine Zusatzphase', () => {
    const config = createTimerConfig(3, 'standard');
    expect(config.optionalTargetSeconds).toBeNull();
    const now = T0 + (PREPARATION_SECONDS + 60) * 1000;
    const view = deriveTimerView(syncTimer(createTimer(config, T0), now), now);
    expect(view.inOptionalPhase).toBe(false);
    expect(view.phaseTotalSeconds).toBe(90);
  });
});

describe('Pause und Unterbruch (§18, B.11.4)', () => {
  it('friert die Zeit bei manueller Pause ein und setzt verlustfrei fort', () => {
    const startOfSet = T0 + PREPARATION_SECONDS * 1000;
    let state = syncTimer(lightWeek3(), startOfSet + 10_000);
    expect(deriveTimerView(state, startOfSet + 10_000).holdSeconds).toBe(10);

    state = pauseTimer(state, startOfSet + 10_000);
    expect(deriveTimerView(state, startOfSet + 300_000).holdSeconds).toBe(10);
    expect(deriveTimerView(state, startOfSet + 300_000).isPaused).toBe(true);

    state = resumeTimer(state, startOfSet + 300_000);
    expect(deriveTimerView(state, startOfSet + 305_000).holdSeconds).toBe(15);
  });

  it('rechnet nach einem Reload aus Zeitstempeln weiter', () => {
    const state = lightWeek3();
    const serialized = JSON.parse(JSON.stringify(state)) as TimerState;
    const later = T0 + (PREPARATION_SECONDS + 30) * 1000;
    const restored = syncTimer({ ...serialized, lastObservedAt: later - 1000 }, later);
    const view = deriveTimerView(restored, later);
    expect(view.phase).toBe('set');
    expect(view.holdSeconds).toBe(30);
  });

  it('erkennt eine lange Luecke als Unterbruch und verliert nichts', () => {
    const observed = T0 + (PREPARATION_SECONDS + 20) * 1000;
    let state = syncTimer(lightWeek3(), observed);
    expect(deriveTimerView(state, observed).holdSeconds).toBe(20);

    const muchLater = observed + INTERRUPTION_THRESHOLD_MS + 60_000;
    state = syncTimer(state, muchLater);
    const view = deriveTimerView(state, muchLater);
    expect(view.status).toBe('interrupted');
    expect(view.isInterrupted).toBe(true);
    expect(view.holdSeconds).toBe(20);
  });

  it('setzt nach einem Unterbruch ohne Zeitverlust fort', () => {
    const observed = T0 + (PREPARATION_SECONDS + 20) * 1000;
    let state = syncTimer(lightWeek3(), observed);
    const muchLater = observed + INTERRUPTION_THRESHOLD_MS + 60_000;
    state = syncTimer(state, muchLater);
    state = resumeAfterInterruption(state, muchLater);

    expect(deriveTimerView(state, muchLater).holdSeconds).toBe(20);
    expect(deriveTimerView(state, muchLater + 5000).holdSeconds).toBe(25);
  });

  it('beendet die Einheit nach einem Unterbruch mit dem erreichten Stand', () => {
    const observed = T0 + (PREPARATION_SECONDS + 20) * 1000;
    let state = syncTimer(lightWeek3(), observed);
    const muchLater = observed + INTERRUPTION_THRESHOLD_MS + 60_000;
    state = syncTimer(state, muchLater);
    state = endSession(state, muchLater);

    expect(state.phase).toBe('completed');
    expect(state.completedSets).toHaveLength(1);
    expect(state.completedSets[0].heldSeconds).toBe(20);
    expect(state.completedSets[0].targetReached).toBe(false);
  });

  it('behandelt einen Zeitsprung waehrend der Pause als Unterbruch statt als Fortschritt', () => {
    let now = T0 + PREPARATION_SECONDS * 1000 + 45_000;
    let state = finishCurrentSet(syncTimer(lightWeek3(), now), now);
    expect(deriveTimerView(state, now).phase).toBe('rest');

    now += INTERRUPTION_THRESHOLD_MS + 1000;
    state = syncTimer(state, now);
    expect(deriveTimerView(state, now).status).toBe('interrupted');
    expect(state.completedSets).toHaveLength(1);
  });
});

describe('Vorschlag fuer die Durchfuehrungsangabe (§19)', () => {
  it('schlaegt vollstaendig vor, wenn alle Saetze erfolgreich waren', () => {
    const sets = Array.from({ length: 4 }, (_, index) => ({
      index,
      heldSeconds: 45,
      targetReached: true,
      optionalStarted: false,
      optionalTargetReached: false,
      stoppedEarly: false,
    }));
    expect(suggestCompletion(sets, 4)).toBe('full');
  });

  it('schlaegt teilweise vor, wenn nur ein Teil erreicht wurde', () => {
    expect(
      suggestCompletion(
        [
          {
            index: 0,
            heldSeconds: 45,
            targetReached: true,
            optionalStarted: false,
            optionalTargetReached: false,
            stoppedEarly: false,
          },
        ],
        4,
      ),
    ).toBe('partial');
  });

  it('schlaegt nicht durchgefuehrt vor, wenn nichts gehalten wurde', () => {
    expect(suggestCompletion([], 4)).toBe('none');
  });
});
