import type { BpEntry } from '../domain/types';
import type { AppEvent } from './events';
import type { Identity, ParticipantData } from './participant';
import type { PilotParticipantRecord } from './pilot-dataset';

/**
 * Exporte (spec.md §25, §26).
 *
 * - Pilotexport: anonymisiert, ohne Namen, Kontaktangaben, Freitextnotizen und
 *   ohne einzelne Blutdruckwerte. Vom Blutdrucktagebuch erscheint nur die Anzahl.
 * - Eigener Export: die Person erhaelt ihre eigenen Daten vollstaendig (§25).
 */

function csvCell(value: string | number | boolean | null): string {
  const text = value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function csvRows(rows: (string | number | boolean | null)[][]): string {
  return rows.map((row) => row.map(csvCell).join(';')).join('\n');
}

export const sessionExportColumns = [
  'pilot_id',
  'programmwoche',
  'datum',
  'variante',
  'zielzeit_sekunden',
  'zusatzziel_sekunden',
  'haltezeit_gesamt_sekunden',
  'saetze_zwischenziel_erreicht',
  'saetze_zusatzziel_erreicht',
  'durchfuehrung',
  'belastung',
  'wohlbefinden',
  'beschwerden',
  'abgebrochen',
  'abweichung',
  'lernkarten_geoeffnet',
  'erinnerungen_aktiv',
  'blutdruck_eintraege_anzahl',
] as const;

export function exportSessionsCsv(records: readonly PilotParticipantRecord[]): string {
  const rows: (string | number | boolean | null)[][] = [[...sessionExportColumns]];
  for (const record of records) {
    for (const session of record.participant.sessions) {
      rows.push([
        record.pilotId,
        session.programWeek,
        session.date,
        session.variant,
        session.targetSeconds,
        session.optionalTargetSeconds ?? '',
        session.sets.reduce((sum, set) => sum + set.heldSeconds, 0),
        session.sets.filter((set) => set.targetReached).length,
        session.sets.filter((set) => set.optionalTargetReached).length,
        session.feedback.completion,
        session.feedback.exertion,
        session.feedback.wellbeing,
        session.feedback.complaints ? 'ja' : 'nein',
        session.aborted ? 'ja' : 'nein',
        session.deviation,
        record.participant.learningCardsOpened.length,
        record.participant.reminders.trainingEnabled || record.participant.reminders.bpEnabled
          ? 'ja'
          : 'nein',
        record.bpEntryCount,
      ]);
    }
  }
  return csvRows(rows);
}

export const eventExportColumns = [
  'pilot_id',
  'zeitpunkt',
  'programmwoche',
  'ereignis',
  'einheit_pseudonym',
  'detail',
] as const;

/** Ersetzt Einheiten-IDs durch fortlaufende Pseudonyme je Pilot-ID. */
function pseudonymize(events: readonly AppEvent[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const event of events) {
    const payload = event.payload as { sessionId?: string };
    if (payload.sessionId && !map.has(payload.sessionId)) {
      map.set(payload.sessionId, `S${map.size + 1}`);
    }
  }
  return map;
}

const detailFields = [
  'variant',
  'deviation',
  'targetSeconds',
  'optionalTargetSeconds',
  'heldSeconds',
  'setIndex',
  'completion',
  'exertion',
  'wellbeing',
  'complaints',
  'mood',
  'wish',
  'suggestedVariant',
  'channel',
  'cardId',
  'week',
  'sessions',
  'sessionsTotal',
  'setsReached',
  'phase',
  'preferredDaytime',
] as const;

export function exportEventsCsv(records: readonly PilotParticipantRecord[]): string {
  const rows: (string | number | boolean | null)[][] = [[...eventExportColumns]];
  for (const record of records) {
    const pseudonyms = pseudonymize(record.events);
    for (const event of record.events) {
      const payload = event.payload as Record<string, unknown>;
      const detail = detailFields
        .filter((field) => payload[field] !== undefined)
        .map((field) => `${field}=${String(payload[field])}`)
        .join(' ');
      rows.push([
        record.pilotId,
        event.at,
        event.programWeek ?? '',
        event.type,
        typeof payload.sessionId === 'string' ? (pseudonyms.get(payload.sessionId) ?? '') : '',
        detail,
      ]);
    }
  }
  return csvRows(rows);
}

export interface OwnDataExport {
  exportedAt: string;
  hinweis: string;
  pilotId: string | null;
  nutzungsdaten: ParticipantData;
  blutdruckeintraege: BpEntry[];
  ereignisse: AppEvent[];
}

/** Eigener Datenexport der teilnehmenden Person (§25). */
export function buildOwnDataExport(
  identity: Identity | null,
  participant: ParticipantData,
  bpEntries: readonly BpEntry[],
  events: readonly AppEvent[],
): OwnDataExport {
  return {
    exportedAt: new Date().toISOString(),
    hinweis:
      'Persoenlicher Export aus dem Wandsitz-Pilot. Enthaelt alle auf diesem Geraet gespeicherten Daten.',
    pilotId: identity?.pilotId ?? null,
    nutzungsdaten: participant,
    blutdruckeintraege: [...bpEntries],
    ereignisse: [...events],
  };
}
