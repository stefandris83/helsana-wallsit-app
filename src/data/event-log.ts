import type { AppEvent, AppEventPayloads, AppEventType } from './events';
import { createId } from './id';
import { STORAGE_KEYS, getStorageAdapter } from './storage-adapter';

/**
 * Append-only Ereignis-Log (CLAUDE.md B.4, spec.md §27).
 *
 * Ereignisse werden nie ueberschrieben oder einzeln geloescht. Die einzige
 * Ausnahme ist die vollstaendige Loeschung ueber die Loeschfunktion in §25.
 */

export function loadEvents(): AppEvent[] {
  return getStorageAdapter().read<AppEvent[]>(STORAGE_KEYS.events) ?? [];
}

export function appendEvent<K extends AppEventType>(
  type: K,
  payload: AppEventPayloads[K],
  options: { programWeek?: number | null; demo?: boolean } = {},
): AppEvent {
  const event = {
    id: createId('evt'),
    at: new Date().toISOString(),
    programWeek: options.programWeek ?? null,
    type,
    payload,
    ...(options.demo ? { demo: true } : {}),
  } as AppEvent;

  const events = loadEvents();
  events.push(event);
  getStorageAdapter().write(STORAGE_KEYS.events, events);
  return event;
}

/** Ersetzt das Log vollstaendig. Nur fuer Demodaten und Loeschfunktion. */
export function replaceEvents(events: AppEvent[]): void {
  getStorageAdapter().write(STORAGE_KEYS.events, events);
}

/** Vollstaendige Loeschung nach §25. */
export function clearEvents(): void {
  getStorageAdapter().remove(STORAGE_KEYS.events);
}
