import type { BpDaypart, BpEntry, ClockTime, IsoDate } from '../domain/types';
import { createId } from './id';
import { STORAGE_KEYS, getStorageAdapter } from './storage-adapter';

/**
 * Datenschicht des freiwilligen Blutdrucktagebuchs (spec.md §23).
 *
 * REGULATORISCHE GRENZE (CLAUDE.md B.6): Dieses Modul bietet ausschliesslich
 * Erstellen, Lesen, Bearbeiten, Loeschen und Rohdatenexport an. Es exportiert
 * bewusst KEINE Aggregat-, Trend-, Bewertungs- oder Korrelationsfunktion —
 * kein Durchschnitt, keine Zielbereiche, keine Farbcodierung, keine Verknuepfung
 * mit Trainingseinheiten. `bp-repository.test.ts` prueft die Exportliste.
 *
 * `countBpEntries` liefert ausschliesslich die Anzahl der Eintraege. Sie wird
 * fuer den anonymisierten Pilotexport benoetigt (§26) und wertet keine Zahlen aus.
 */

export interface BpEntryInput {
  date: IsoDate;
  time: ClockTime;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  note: string | null;
  daypart: BpDaypart;
}

function readAll(): BpEntry[] {
  return getStorageAdapter().read<BpEntry[]>(STORAGE_KEYS.bloodPressure) ?? [];
}

function writeAll(entries: BpEntry[]): void {
  getStorageAdapter().write(STORAGE_KEYS.bloodPressure, entries);
}

/** Chronologische Liste, neueste zuerst. */
export function listBpEntries(): BpEntry[] {
  return readAll().sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
}

export function countBpEntries(): number {
  return readAll().length;
}

export function createBpEntry(input: BpEntryInput, options: { demo?: boolean } = {}): BpEntry {
  const now = new Date().toISOString();
  const entry: BpEntry = {
    id: createId('bp'),
    ...input,
    createdAt: now,
    updatedAt: now,
    ...(options.demo ? { demo: true } : {}),
  };
  writeAll([...readAll(), entry]);
  return entry;
}

export function updateBpEntry(id: string, input: BpEntryInput): BpEntry | null {
  const entries = readAll();
  const index = entries.findIndex((entry) => entry.id === id);
  if (index === -1) return null;
  const updated: BpEntry = {
    ...entries[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  entries[index] = updated;
  writeAll(entries);
  return updated;
}

export function deleteBpEntry(id: string): boolean {
  const entries = readAll();
  const remaining = entries.filter((entry) => entry.id !== id);
  if (remaining.length === entries.length) return false;
  writeAll(remaining);
  return true;
}

export function deleteAllBpEntries(): void {
  getStorageAdapter().remove(STORAGE_KEYS.bloodPressure);
}

/**
 * Erkennt einen versehentlichen Doppeleintrag (§29): gleiches Datum, gleiche
 * Uhrzeit und identische Zahlen. Rein technischer Abgleich, keine Bewertung.
 */
export function findDuplicateBpEntry(input: BpEntryInput, ignoreId?: string): BpEntry | null {
  return (
    readAll().find(
      (entry) =>
        entry.id !== ignoreId &&
        entry.date === input.date &&
        entry.time === input.time &&
        entry.systolic === input.systolic &&
        entry.diastolic === input.diastolic,
    ) ?? null
  );
}

/** Rohdatenexport der eigenen Eintraege als CSV (B.13.6). */
export function exportBpEntriesCsv(): string {
  const header = ['datum', 'uhrzeit', 'systolisch', 'diastolisch', 'puls', 'zeitpunkt', 'notiz'];
  const rows = listBpEntries().map((entry) => [
    entry.date,
    entry.time,
    String(entry.systolic),
    String(entry.diastolic),
    entry.pulse === null ? '' : String(entry.pulse),
    entry.daypart,
    entry.note ?? '',
  ]);
  return [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(';'))
    .join('\n');
}

/** Ersetzt den gesamten Bestand. Nur fuer Demodaten und Loeschfunktion. */
export function replaceBpEntries(entries: BpEntry[]): void {
  writeAll(entries);
}
