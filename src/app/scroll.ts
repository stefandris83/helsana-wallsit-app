import { useEffect } from 'react';

/**
 * Springt an den Seitenanfang.
 *
 * Bewusst ohne weiches Scrollen: Der Sprung erfolgt sofort und ist damit
 * unabhaengig von `prefers-reduced-motion` (design-system.md Kapitel 13). Er
 * verhaelt sich wie ein Seitenwechsel in einer nativen App.
 */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

/**
 * Springt an den Seitenanfang, sobald sich `value` aendert — und beim ersten
 * Zeichnen.
 *
 * Gedacht fuer zwei Faelle:
 * - Seitenwechsel (`pathname`): React Router setzt die Scrollposition nicht
 *   selbst zurueck. Ohne das startet die neue Seite dort, wo die vorige
 *   verlassen wurde.
 * - Schrittwechsel innerhalb einer Seite (Fragebogen, Willkommens-Carousel):
 *   Hier aendert sich nur der Zustand, nicht die Adresse. Nach «Weiter» bliebe
 *   die Ansicht sonst mitten im naechsten Schritt stehen.
 */
export function useScrollToTopOnChange(value: unknown): void {
  useEffect(() => {
    scrollToTop();
  }, [value]);
}
