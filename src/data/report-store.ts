/**
 * Lesender Zugriff auf die geteilten Ergebnisberichte (Pilot-Dashboard).
 *
 * Der im Browser ausgelieferte Schluessel darf ausschliesslich schreiben. Zum
 * Lesen meldet sich die auswertende Person mit einem eigenen Konto an; die
 * Leseberechtigung haengt an dieser Anmeldung, nicht am ausgelieferten
 * Schluessel. Die Datenbankregel erlaubt `select` nur fuer Adressen, die in
 * `public.report_readers` eingetragen sind.
 *
 * Das Zugangstoken wird ausschliesslich im Arbeitsspeicher gehalten: nach einem
 * Reload ist eine neue Anmeldung noetig, und auf dem Geraet der auswertenden
 * Person bleibt nichts zurueck.
 */

import { config, isReportSharingConfigured } from '../app/config';
import type { PilotParticipantRecord } from './pilot-dataset';
import { parseSharedReport } from './report-import';

export interface ReportSession {
  accessToken: string;
  email: string;
}

export type SignInResult =
  | { status: 'success'; session: ReportSession }
  | { status: 'invalid' }
  | { status: 'not-configured' }
  | { status: 'failed' };

export interface LoadResult {
  records: PilotParticipantRecord[];
  /** Dateien, die nicht gelesen oder nicht ausgewertet werden konnten. */
  rejected: string[];
}

export type LoadOutcome =
  | ({ status: 'success' } & LoadResult)
  | { status: 'unauthorised' }
  | { status: 'failed' };

function baseUrl(): string {
  return config.reportUploadUrl.replace(/\/+$/, '');
}

function apiHeaders(session?: ReportSession): Record<string, string> {
  return {
    apikey: config.reportUploadKey,
    authorization: `Bearer ${session ? session.accessToken : config.reportUploadKey}`,
    'content-type': 'application/json',
  };
}

/** Meldet die auswertende Person an. Wirft nicht. */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  if (!isReportSharingConfigured()) return { status: 'not-configured' };

  try {
    const response = await fetch(`${baseUrl()}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (response.status === 400 || response.status === 401) return { status: 'invalid' };
    if (!response.ok) return { status: 'failed' };

    const body = (await response.json()) as { access_token?: string };
    if (!body.access_token) return { status: 'failed' };
    return { status: 'success', session: { accessToken: body.access_token, email } };
  } catch {
    return { status: 'failed' };
  }
}

interface StorageObject {
  name: string;
}

/**
 * Laedt alle abgelegten Berichte und wandelt sie in Auswertungsdatensaetze um.
 * Mehrere Berichte derselben Pilotnummer werden zusammengefuehrt; der zuletzt
 * abgelegte gewinnt, damit niemand doppelt gezaehlt wird.
 */
export async function loadReports(session: ReportSession): Promise<LoadOutcome> {
  if (!isReportSharingConfigured()) return { status: 'failed' };

  try {
    const listing = await fetch(`${baseUrl()}/storage/v1/object/list/${config.reportUploadBucket}`, {
      method: 'POST',
      headers: apiHeaders(session),
      body: JSON.stringify({
        prefix: '',
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' },
      }),
    });
    if (listing.status === 401 || listing.status === 403) return { status: 'unauthorised' };
    if (!listing.ok) return { status: 'failed' };

    const objects = (await listing.json()) as StorageObject[];
    const files = objects
      .filter((object) => object.name.endsWith('.json'))
      .map((object) => object.name)
      .sort();

    const byPilotId = new Map<string, PilotParticipantRecord>();
    const rejected: string[] = [];

    for (const name of files) {
      try {
        const file = await fetch(
          `${baseUrl()}/storage/v1/object/${config.reportUploadBucket}/${encodeURIComponent(name)}`,
          { headers: apiHeaders(session) },
        );
        if (!file.ok) {
          rejected.push(name);
          continue;
        }
        const record = parseSharedReport(await file.json());
        if (!record) {
          rejected.push(name);
          continue;
        }
        byPilotId.set(record.pilotId, record);
      } catch {
        rejected.push(name);
      }
    }

    return { status: 'success', records: [...byPilotId.values()], rejected };
  } catch {
    return { status: 'failed' };
  }
}
