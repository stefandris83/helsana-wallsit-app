import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { MemoryStorageAdapter, setStorageAdapter } from '../data/storage-adapter';

/**
 * Jeder Test startet mit einem leeren Speicher im Arbeitsspeicher.
 * Damit greift keine Testausfuehrung auf echte Browserdaten zu (§30).
 */
beforeEach(() => {
  setStorageAdapter(new MemoryStorageAdapter());
});

/**
 * jsdom kennt kein Scrollen und meldet bei `window.scrollTo` «Not implemented».
 * Die App springt bei jedem Seiten- und Schrittwechsel an den Anfang
 * (`src/app/scroll.ts`); der Stub haelt die Testausgabe davon frei.
 */
window.scrollTo = () => {};

afterEach(() => {
  cleanup();
});
