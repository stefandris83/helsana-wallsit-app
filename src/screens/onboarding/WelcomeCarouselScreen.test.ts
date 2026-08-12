import { describe, expect, it } from 'vitest';
import {
  clampWelcomeIndex,
  nextWelcomeIndex,
  previousWelcomeIndex,
  welcomeCards,
} from './WelcomeCarouselScreen';

/**
 * Kartenindex des Willkommens-Carousels (§10).
 *
 * Hintergrund: Zwei «Weiter»-Klicks innerhalb desselben React-Batches — ein
 * schneller Doppeltipp auf einem langsamen Geraet — haben den Index frueher
 * ueber die letzte Karte hinaus erhoeht. Die Karte war dann `undefined` und die
 * Ansicht stuerzte mit einem weissen Bildschirm ab.
 */

const lastIndex = welcomeCards.length - 1;

describe('Weiterschalten', () => {
  it('geht Karte fuer Karte bis zur letzten', () => {
    let index = 0;
    for (let step = 1; step <= lastIndex; step += 1) {
      index = nextWelcomeIndex(index);
      expect(index).toBe(step);
    }
  });

  it('bleibt auf der letzten Karte stehen', () => {
    expect(nextWelcomeIndex(lastIndex)).toBe(lastIndex);
  });

  it('haelt auch mehrfaches Weiterschalten im selben Batch aus', () => {
    // Bildet den Doppeltipp nach: mehrere Aktualisierungen ohne Neuzeichnen.
    let index = lastIndex - 1;
    for (let click = 0; click < 5; click += 1) {
      index = nextWelcomeIndex(index);
    }
    expect(index).toBe(lastIndex);
    expect(welcomeCards[index]).toBeDefined();
  });
});

describe('Zurueckschalten', () => {
  it('geht Karte fuer Karte bis zur ersten', () => {
    let index = lastIndex;
    for (let step = lastIndex - 1; step >= 0; step -= 1) {
      index = previousWelcomeIndex(index);
      expect(index).toBe(step);
    }
  });

  it('bleibt auf der ersten Karte stehen', () => {
    let index = 0;
    for (let click = 0; click < 5; click += 1) {
      index = previousWelcomeIndex(index);
    }
    expect(index).toBe(0);
    expect(welcomeCards[index]).toBeDefined();
  });
});

describe('Begrenzung des Index', () => {
  it('faengt Werte ausserhalb der Kartenliste ab', () => {
    expect(clampWelcomeIndex(-10)).toBe(0);
    expect(clampWelcomeIndex(welcomeCards.length)).toBe(lastIndex);
    expect(clampWelcomeIndex(999)).toBe(lastIndex);
  });

  it('faengt ungueltige Zahlenwerte ab', () => {
    expect(clampWelcomeIndex(Number.NaN)).toBe(0);
    expect(clampWelcomeIndex(Number.POSITIVE_INFINITY)).toBe(0);
    expect(clampWelcomeIndex(1.7)).toBe(1);
  });

  it('liefert fuer jeden denkbaren Eingabewert eine vorhandene Karte', () => {
    const inputs = [-999, -1, 0, 1, lastIndex, welcomeCards.length, 999, Number.NaN];
    for (const input of inputs) {
      const card = welcomeCards[clampWelcomeIndex(input)];
      expect(card, `Eingabe ${input}`).toBeDefined();
      expect(card.visual, `Eingabe ${input}`).toBeTruthy();
    }
  });
});
