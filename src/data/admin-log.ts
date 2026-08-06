import { createId } from './id';
import { STORAGE_KEYS, getStorageAdapter } from './storage-adapter';

/**
 * Protokollierung administrativer Zugriffe (spec.md §30, CLAUDE.md B.9).
 * Erfasst werden Zeitpunkt und Aktion, ohne jeden Personenbezug.
 */

export type AdminAction =
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'dashboard_viewed'
  | 'filter_changed'
  | 'export_sessions'
  | 'export_events'
  | 'reports_loaded';

export interface AdminLogEntry {
  id: string;
  at: string;
  action: AdminAction;
}

const MAX_ENTRIES = 200;

export function loadAdminLog(): AdminLogEntry[] {
  return getStorageAdapter().read<AdminLogEntry[]>(STORAGE_KEYS.adminLog) ?? [];
}

export function logAdminAction(action: AdminAction): void {
  const entries = loadAdminLog();
  entries.push({ id: createId('adm'), at: new Date().toISOString(), action });
  getStorageAdapter().write(STORAGE_KEYS.adminLog, entries.slice(-MAX_ENTRIES));
}

export function clearAdminLog(): void {
  getStorageAdapter().remove(STORAGE_KEYS.adminLog);
}
