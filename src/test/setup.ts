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

afterEach(() => {
  cleanup();
});
