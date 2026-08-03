import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAppStore } from '../data/store';

/**
 * Setzt den Farbmodus ueber `data-color-mode` (design-system.md Kapitel 10).
 * Light und Dark sind Pflicht; die HC-Modi sind in den Tokens angelegt, werden
 * im MVP aber nicht als Benutzereinstellung angeboten (CLAUDE.md B.8).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorMode = useAppStore((state) => state.participant.colorMode);

  useEffect(() => {
    const root = document.documentElement;
    if (colorMode === 'system') {
      root.removeAttribute('data-color-mode');
    } else {
      root.setAttribute('data-color-mode', colorMode);
    }
  }, [colorMode]);

  return <>{children}</>;
}
