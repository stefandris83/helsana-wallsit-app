/**
 * Automatische Uebermittlung des Ergebnisberichts (freigegeben 06.08.2026).
 *
 * Die App bleibt local-first: gespeichert wird zuerst auf dem Geraet, die
 * Uebermittlung ist der zweite Schritt und aendert am lokalen Zustand nichts.
 * Schlaegt sie fehl — Funkloch, Flugmodus —, merkt sich das Modul das und holt
 * die Uebermittlung beim naechsten Start oder bei der naechsten Aenderung nach.
 *
 * Bewusst genau ein Einhaengepunkt: eine Subscription auf den Store, durch den
 * ohnehin jede Zustandsaenderung laeuft. So kann keine Aufrufstelle vergessen
 * gehen, wenn spaeter eine neue Aktion dazukommt.
 */

import { isReportSharingConfigured } from '../app/config';
import { localRecord } from './pilot-dataset';
import { buildSharedReport, uploadSharedReport } from './report-sharing';
import { STORAGE_KEYS, getStorageAdapter } from './storage-adapter';
import { useAppStore } from './store';
import type { AppState } from './store';

/** Wartezeit, damit mehrere schnelle Aenderungen eine Uebermittlung ergeben. */
export const SYNC_DEBOUNCE_MS = 5000;

export interface SyncState {
  /** Zeitpunkt der letzten erfolgreichen Uebermittlung. */
  lastSyncedAt: string | null;
  /** Gesetzt, solange eine Aenderung noch nicht uebermittelt werden konnte. */
  pendingSince: string | null;
}

const emptySyncState: SyncState = { lastSyncedAt: null, pendingSince: null };

export function readSyncState(): SyncState {
  return getStorageAdapter().read<SyncState>(STORAGE_KEYS.sync) ?? emptySyncState;
}

function writeSyncState(state: SyncState): void {
  getStorageAdapter().write(STORAGE_KEYS.sync, state);
}

/**
 * Uebermittelt wird erst, wenn das Onboarding abgeschlossen ist. Vorher gibt es
 * keine auswertbaren Daten, und die Person hat die Einwilligung noch nicht
 * vollstaendig erteilt.
 */
function isSyncEligible(state: Pick<AppState, 'identity' | 'participant'>): boolean {
  return state.identity !== null && state.participant.onboardingCompletedAt !== null;
}

let timer: ReturnType<typeof setTimeout> | null = null;
let running = false;
let unsubscribe: (() => void) | null = null;

/**
 * Uebermittelt den aktuellen Stand. Ohne konfigurierte Ablage oder vor
 * Abschluss des Onboardings passiert nichts.
 */
export async function syncNow(): Promise<'skipped' | 'success' | 'failed'> {
  if (!isReportSharingConfigured()) return 'skipped';
  if (running) return 'skipped';

  const state = useAppStore.getState();
  const record = localRecord();
  if (!record || !isSyncEligible(state)) return 'skipped';

  /**
   * Blutdruckwerte nur bei erteilter Einwilligung. Wird sie widerrufen,
   * bleiben bereits erfasste Eintraege auf dem Geraet, wandern aber nicht
   * weiter — die Anzahl bleibt als aggregierte Kennzahl erhalten.
   */
  const payload = state.participant.bpConsent ? record : { ...record, bpEntries: [] };

  running = true;
  try {
    const result = await uploadSharedReport(buildSharedReport(payload));
    const now = new Date().toISOString();
    if (result.status === 'success') {
      writeSyncState({ lastSyncedAt: now, pendingSince: null });
      return 'success';
    }
    const previous = readSyncState();
    writeSyncState({ ...previous, pendingSince: previous.pendingSince ?? now });
    return 'failed';
  } finally {
    running = false;
  }
}

/** Merkt die Aenderung vor und uebermittelt sie nach der Wartezeit. */
export function scheduleSync(): void {
  if (!isReportSharingConfigured()) return;
  if (timer !== null) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void syncNow();
  }, SYNC_DEBOUNCE_MS);
}

/**
 * Haengt die Uebermittlung an den Store. Wird einmal beim Start der App
 * aufgerufen und holt dabei eine offene Uebermittlung nach.
 */
export function startAutoSync(): () => void {
  if (!isReportSharingConfigured()) return () => {};
  if (unsubscribe) return unsubscribe;

  // Offene Uebermittlung aus einer frueheren Sitzung nachholen.
  if (readSyncState().pendingSince !== null) void syncNow();

  unsubscribe = useAppStore.subscribe((state, previous) => {
    const changed =
      state.participant !== previous.participant ||
      state.bpEntries !== previous.bpEntries ||
      state.identity !== previous.identity;
    if (!changed || !isSyncEligible(state)) return;
    scheduleSync();
  });

  return () => {
    unsubscribe?.();
    unsubscribe = null;
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };
}

/** Nur fuer Tests: setzt den Modulzustand zurueck. */
export function resetAutoSyncForTests(): void {
  if (timer !== null) clearTimeout(timer);
  timer = null;
  running = false;
  unsubscribe?.();
  unsubscribe = null;
}
