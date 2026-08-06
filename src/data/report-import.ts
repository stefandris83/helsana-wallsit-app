/**
 * Pruefung geteilter Ergebnisberichte, bevor sie ins Pilot-Dashboard gelangen.
 *
 * Der Bericht wird auf die im Dashboard zulaessigen Felder reduziert: ein
 * manipulierter oder aelterer Bericht kann keine Profilangaben und keine
 * Freitexte in die Auswertung tragen. Blutdruckwerte sind seit dem 06.08.2026
 * zugelassen und werden Feld fuer Feld uebernommen — die Notiz bleibt aussen vor.
 */

import type { BpDaypart, BpEntry } from '../domain/types';
import type { AppEvent } from './events';
import { createEmptyParticipant } from './participant';
import type { ParticipantData } from './participant';
import type { PilotParticipantRecord } from './pilot-dataset';
import { REPORT_SCHEMA } from './report-sharing';

/**
 * Auch die erste Fassung bleibt lesbar: waehrend der Umstellung koennen noch
 * Berichte aus einer aelteren App-Version eintreffen. Sie enthalten keine
 * Blutdruckwerte, alles andere passt unveraendert.
 */
const ACCEPTED_SCHEMAS = new Set([REPORT_SCHEMA, 'wandsitz-pilot-bericht/v1']);

const DAYPARTS: BpDaypart[] = ['morning', 'evening', 'unspecified'];

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function optionalString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * Baut einen Blutdruckeintrag aus bekannten Feldern neu auf. Alles Unbekannte
 * faellt weg, die Notiz wird konstant auf `null` gesetzt: eine manipulierte
 * Datei kann so keinen Freitext ins Dashboard tragen.
 */
function parseBpEntry(raw: unknown): BpEntry | null {
  if (!isRecordObject(raw)) return null;
  if (!isPositiveNumber(raw.systolic) || !isPositiveNumber(raw.diastolic)) return null;
  const date = optionalString(raw.date);
  if (date === '') return null;

  const daypart = DAYPARTS.find((value) => value === raw.daypart) ?? 'unspecified';
  return {
    id: optionalString(raw.id) || `bp_${date}_${raw.systolic}_${raw.diastolic}`,
    date,
    time: optionalString(raw.time),
    systolic: Math.round(raw.systolic),
    diastolic: Math.round(raw.diastolic),
    pulse: isPositiveNumber(raw.pulse) ? Math.round(raw.pulse) : null,
    note: null,
    daypart,
    createdAt: optionalString(raw.createdAt),
    updatedAt: optionalString(raw.updatedAt),
    ...(raw.demo === true ? { demo: true } : {}),
  };
}

/**
 * Prueft und normalisiert einen Bericht. Unbekannte Felder werden verworfen:
 * die Nutzungsdaten entstehen aus einem leeren Datensatz, in den nur bekannte
 * Felder uebernommen werden.
 */
export function parseSharedReport(raw: unknown): PilotParticipantRecord | null {
  if (!isRecordObject(raw)) return null;
  if (typeof raw.schema !== 'string' || !ACCEPTED_SCHEMAS.has(raw.schema)) return null;
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
  const bpEntries = Array.isArray(raw.bpEntries)
    ? raw.bpEntries.map(parseBpEntry).filter((entry): entry is BpEntry => entry !== null)
    : [];
  const declaredCount =
    typeof raw.bpEntryCount === 'number' && raw.bpEntryCount >= 0
      ? Math.floor(raw.bpEntryCount)
      : 0;

  return {
    pilotId: raw.pilotId.trim(),
    participant,
    bpEntryCount: Math.max(declaredCount, bpEntries.length),
    bpEntries,
    events,
    demo: raw.demo === true,
  };
}
