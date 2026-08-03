/**
 * Einlesen freiwillig geteilter Ergebnisberichte im Pilot-Dashboard.
 *
 * Berichte werden ausschliesslich fuer die Dauer der Sitzung im Arbeitsspeicher
 * gehalten und nicht auf dem Geraet der auswertenden Person gespeichert. Beim
 * Einlesen wird der Bericht auf die im Dashboard zulaessigen Felder reduziert:
 * ein manipulierter oder aelterer Bericht kann keine Profilangaben, keine
 * Blutdruckwerte und keine Freitexte in die Auswertung tragen.
 */

import type { AppEvent } from './events';
import { createEmptyParticipant } from './participant';
import type { ParticipantData } from './participant';
import type { PilotParticipantRecord } from './pilot-dataset';
import { REPORT_SCHEMA } from './report-sharing';

export interface ImportOutcome {
  records: PilotParticipantRecord[];
  /** Dateinamen, die nicht gelesen werden konnten. */
  rejected: string[];
  /** Dateinamen, deren Pilot-ID bereits vorhanden war und die ersetzt wurden. */
  replaced: string[];
}

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Prueft und normalisiert einen Bericht. Unbekannte Felder werden verworfen:
 * die Nutzungsdaten entstehen aus einem leeren Datensatz, in den nur bekannte
 * Felder uebernommen werden.
 */
export function parseSharedReport(raw: unknown): PilotParticipantRecord | null {
  if (!isRecordObject(raw)) return null;
  if (raw.schema !== REPORT_SCHEMA) return null;
  if (typeof raw.pilotId !== 'string' || raw.pilotId.trim() === '') return null;
  if (!isRecordObject(raw.participant)) return null;

  const source = raw.participant;
  const target = createEmptyParticipant();
  const participant: ParticipantData = { ...target, profile: null };

  for (const key of Object.keys(target) as (keyof ParticipantData)[]) {
    if (key === 'profile') continue;
    const value = source[key];
    if (value === undefined) continue;
    if (typeof value !== typeof target[key] && target[key] !== null) continue;
    Object.assign(participant, { [key]: value });
  }

  const events = Array.isArray(raw.events) ? (raw.events as AppEvent[]) : [];
  const bpEntryCount = typeof raw.bpEntryCount === 'number' && raw.bpEntryCount >= 0
    ? Math.floor(raw.bpEntryCount)
    : 0;

  return {
    pilotId: raw.pilotId.trim(),
    participant,
    bpEntryCount,
    events,
    demo: raw.demo === true,
  };
}

/**
 * Liest mehrere Dateien ein und fuehrt sie mit den bereits eingelesenen
 * Berichten zusammen. Ein neuerer Bericht derselben Pilot-ID ersetzt den
 * aelteren, damit mehrfaches Teilen keine Person doppelt zaehlt.
 */
export async function importReportFiles(
  files: readonly File[],
  existing: readonly PilotParticipantRecord[] = [],
): Promise<ImportOutcome> {
  const byPilotId = new Map(existing.map((record) => [record.pilotId, record]));
  const rejected: string[] = [];
  const replaced: string[] = [];

  for (const file of files) {
    let parsed: PilotParticipantRecord | null = null;
    try {
      parsed = parseSharedReport(JSON.parse(await file.text()));
    } catch {
      parsed = null;
    }
    if (!parsed) {
      rejected.push(file.name);
      continue;
    }
    if (byPilotId.has(parsed.pilotId)) replaced.push(file.name);
    byPilotId.set(parsed.pilotId, parsed);
  }

  return { records: [...byPilotId.values()], rejected, replaced };
}
