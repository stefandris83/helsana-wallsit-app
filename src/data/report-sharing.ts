/**
 * Freiwilliges Teilen eines Ergebnisberichts (Ergaenzung zu §25).
 *
 * Die App bleibt local-first: der Bericht wird ausschliesslich auf
 * ausdruecklichen Knopfdruck erzeugt und hochgeladen. Es gibt keine
 * Hintergrundsynchronisation und keinen automatischen Abgleich.
 *
 * Der Bericht enthaelt genau die Daten, die im Pilot-Dashboard ohnehin
 * ausgewertet werden duerfen (§26):
 *   - keine Identitaetsdaten (Zugangscode, Kontaktangabe) — im Datentyp
 *     `PilotParticipantRecord` gar nicht vorhanden (B.4),
 *   - keine einzelnen Blutdruckwerte, nur deren Anzahl (B.13.6),
 *   - keine Freitextnotizen — Notizen existieren nur am Blutdruckeintrag,
 *   - kein Profil: Groesse, Gewicht, Geburtsjahr und Geschlecht werden fuer
 *     die Auswertung nicht benoetigt und deshalb vor dem Versand entfernt.
 *
 * Der Upload laeuft ueber einen privaten Ablageordner, dessen oeffentlicher
 * Schluessel ausschliesslich schreiben darf. Wer ihn aus dem ausgelieferten
 * JavaScript ausliest, kann damit keine Datei lesen oder auflisten.
 */

import { config, isReportSharingConfigured } from '../app/config';
import type { AppEvent } from './events';
import type { ParticipantData } from './participant';
import type { PilotParticipantRecord } from './pilot-dataset';

export const REPORT_SCHEMA = 'wandsitz-pilot-bericht/v1';

/** Nutzungsdaten des Berichts: `ParticipantData` ohne Profilangaben. */
export type SharedParticipantData = Omit<ParticipantData, 'profile'> & { profile: null };

export interface SharedReport {
  schema: typeof REPORT_SCHEMA;
  createdAt: string;
  pilotId: string;
  /** Nur die Anzahl der Blutdruckeintraege, niemals die Zahlen. */
  bpEntryCount: number;
  demo: boolean;
  participant: SharedParticipantData;
  events: AppEvent[];
}

/** Baut den Bericht aus dem lokalen Auswertungsdatensatz. */
export function buildSharedReport(
  record: PilotParticipantRecord,
  now: Date = new Date(),
): SharedReport {
  const { profile: _profile, ...rest } = record.participant;
  return {
    schema: REPORT_SCHEMA,
    createdAt: now.toISOString(),
    pilotId: record.pilotId,
    bpEntryCount: record.bpEntryCount,
    demo: record.demo,
    participant: { ...rest, profile: null },
    events: [...record.events],
  };
}

/**
 * Dateiname im Ablageordner. Enthaelt die Pilot-ID und den Zeitpunkt, damit
 * mehrfaches Teilen nebeneinander bestehen bleibt und nichts ueberschrieben
 * wird — der Ablageordner erlaubt bewusst kein Aendern bestehender Dateien.
 */
export function reportFileName(report: SharedReport): string {
  const stamp = report.createdAt.replaceAll(/[:.]/g, '-');
  return `${report.pilotId}-${stamp}.json`;
}

export type ShareResult =
  | { status: 'success' }
  | { status: 'not-configured' }
  | { status: 'offline' }
  | { status: 'failed' };

/** Laedt den Bericht hoch. Wirft nicht, sondern meldet den Ausgang zurueck. */
export async function uploadSharedReport(report: SharedReport): Promise<ShareResult> {
  if (!isReportSharingConfigured()) return { status: 'not-configured' };
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { status: 'offline' };
  }

  const base = config.reportUploadUrl.replace(/\/+$/, '');
  const target = `${base}/storage/v1/object/${config.reportUploadBucket}/${reportFileName(report)}`;

  try {
    const response = await fetch(target, {
      method: 'POST',
      headers: {
        apikey: config.reportUploadKey,
        authorization: `Bearer ${config.reportUploadKey}`,
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
      body: JSON.stringify(report),
    });
    return response.ok ? { status: 'success' } : { status: 'failed' };
  } catch {
    return { status: 'failed' };
  }
}
