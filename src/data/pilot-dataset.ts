import { toIsoDate } from '../domain/dates';
import { daysBetween } from '../domain/dates';
import type { IsoDate } from '../domain/types';
import { countBpEntries, listBpEntries } from './bp-repository';
import type { BpEntry } from '../domain/types';
import { loadEvents } from './event-log';
import type { AppEvent } from './events';
import type { ParticipantData } from './participant';
import { STORAGE_KEYS, getStorageAdapter } from './storage-adapter';

/**
 * Datengrundlage des Pilot-Dashboards (spec.md §26).
 *
 * Ein Datensatz enthaelt ausschliesslich Nutzungsdaten und die Pilot-ID.
 * Identitaetsdaten (Zugangscode, Kontaktangabe) sind bewusst nicht Teil des
 * Typs — sie koennen dadurch weder im Dashboard noch im Export auftauchen
 * (CLAUDE.md B.4, §8).
 */
export interface PilotParticipantRecord {
  pilotId: string;
  participant: ParticipantData;
  /** Anzahl der Blutdruckeintraege. Grundlage der aggregierten Kennzahl. */
  bpEntryCount: number;
  /**
   * Blutdruckeintraege ohne Freitextnotiz.
   *
   * Freigegeben durch den Auftraggeber am 06.08.2026 fuer den Pilot: die Werte
   * duerfen uebermittelt und dargestellt werden (Abweichung von B.13.6 und
   * B.11.9, dokumentiert in der README). Die Grenze aus §3 bleibt bestehen —
   * keine Bewertung, keine Kategorien, keine Zielbereiche, keine Verknuepfung
   * mit dem Training.
   */
  bpEntries: BpEntry[];
  events: AppEvent[];
  demo: boolean;
}

/** Ab dieser Anzahl Tage ohne Einheit gilt eine Teilnahme als inaktiv. */
export const INACTIVE_AFTER_DAYS = 14;

export function isActiveRecord(record: PilotParticipantRecord, today: IsoDate): boolean {
  const dates = record.participant.sessions.map((session) => session.date).sort();
  const latest = dates.at(-1);
  if (!latest) return false;
  return daysBetween(latest, today) <= INACTIVE_AFTER_DAYS;
}

/** Datensatz der lokal gespeicherten Teilnahme, sofern das Onboarding begonnen wurde. */
export function localRecord(): PilotParticipantRecord | null {
  const storage = getStorageAdapter();
  const identity = storage.read<{ pilotId: string }>(STORAGE_KEYS.identity);
  const participant = storage.read<ParticipantData>(STORAGE_KEYS.participant);
  if (!identity || !participant) return null;
  return {
    pilotId: identity.pilotId,
    participant,
    bpEntryCount: countBpEntries(),
    // Ohne Freitextnotiz: der Auswertungsdatensatz fuehrt grundsaetzlich keine
    // Freitexte, damit sie weder im Dashboard noch im Bericht auftauchen koennen.
    bpEntries: listBpEntries().map((entry) => ({ ...entry, note: null })),
    events: loadEvents(),
    demo: participant.demoLoaded,
  };
}

/**
 * Stellt den Auswertungsdatensatz zusammen. Im MVP sind das der lokale
 * Datensatz und — sofern geladen — die synthetischen Demo-Datensaetze (B.10).
 * Im Betrieb tritt an diese Stelle die serverseitige Pilotdatenbank.
 */
export function buildPilotDataset(
  demoRecords: readonly PilotParticipantRecord[] = [],
): PilotParticipantRecord[] {
  const local = localRecord();
  const records = [...demoRecords];
  if (local && !records.some((record) => record.pilotId === local.pilotId)) {
    records.push(local);
  }
  return records;
}

export function todayIso(): IsoDate {
  return toIsoDate(new Date());
}
