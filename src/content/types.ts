/**
 * Datenmodell der Content-Registry (CLAUDE.md B.5, spec.md §28).
 *
 * Jeder kundensichtbare Text liegt als Eintrag mit Metadaten vor, damit Medical,
 * Legal, Datenschutz und Marketing ihn ohne Codeaenderung pruefen und freigeben
 * koennen.
 */

import { contentFingerprint } from './fingerprint';
import {
  RELEASE_APPROVALS,
  RELEASE_APPROVAL_DATE,
  approvedFingerprints,
} from './release-approval';

export type ContentOwner =
  | 'medical'
  | 'legal'
  | 'privacy'
  | 'marketing'
  | 'product'
  | 'engineering';

export type ContentStatus = 'draft' | 'approved';

export interface ContentApprovals {
  medical: boolean;
  legal: boolean;
  privacy: boolean;
  marketing: boolean;
}

export interface ContentEntry {
  /** Eindeutige Content-ID, identisch mit dem Schluessel in der Registry. */
  id: string;
  version: string;
  owner: ContentOwner;
  status: ContentStatus;
  approvals: ContentApprovals;
  approvedAt: string | null;
  /** Fingerabdruck des Wortlauts; bindet die Freigabe an genau diesen Text. */
  fingerprint: string;
  /** Einzeltext. Bei strukturierten Eintraegen leer. */
  text?: string;
  /** Aufzaehlungen, z. B. Kernbotschaften oder Messhinweise. */
  items?: string[];
  /** Benannte Teilfelder, z. B. Titel/Einleitung/Tipp einer Lernkarte. */
  fields?: Record<string, string>;
  /** Quellenhinweis im redaktionellen System (§22). */
  source?: string;
}

export interface ContentEntryInput {
  owner: ContentOwner;
  version?: string;
  status?: ContentStatus;
  approvals?: Partial<ContentApprovals>;
  approvedAt?: string | null;
  text?: string;
  items?: string[];
  fields?: Record<string, string>;
  source?: string;
}

const NO_APPROVALS: ContentApprovals = {
  medical: false,
  legal: false,
  privacy: false,
  marketing: false,
};

/**
 * Erzeugt getypte Content-Eintraege.
 *
 * Ein Eintrag gilt genau dann als freigegeben, wenn seine ID in der
 * Freigabe-Baseline steht **und** sein Fingerabdruck unveraendert ist
 * (`release-approval.ts`). Andernfalls bleibt er im Status `draft` (B.5) —
 * das gilt fuer neu hinzugefuegte Eintraege ebenso wie fuer geaenderte Texte.
 * Der Status fuehrt in der Teilnehmeransicht zu keiner Verhaltensaenderung.
 */
export function defineContent<T extends Record<string, ContentEntryInput>>(
  entries: T,
): { [K in keyof T]: ContentEntry } {
  const result = {} as { [K in keyof T]: ContentEntry };
  for (const key of Object.keys(entries) as (keyof T)[]) {
    const input = entries[key];
    const id = String(key);
    const fingerprint = contentFingerprint(input);
    const released = approvedFingerprints[id] === fingerprint;

    result[key] = {
      id,
      version: input.version ?? '1.0.0',
      owner: input.owner,
      status: released ? 'approved' : (input.status ?? 'draft'),
      approvals: released ? { ...RELEASE_APPROVALS } : { ...NO_APPROVALS, ...input.approvals },
      approvedAt: released ? RELEASE_APPROVAL_DATE : (input.approvedAt ?? null),
      fingerprint,
      ...(input.text === undefined ? {} : { text: input.text }),
      ...(input.items === undefined ? {} : { items: input.items }),
      ...(input.fields === undefined ? {} : { fields: input.fields }),
      ...(input.source === undefined ? {} : { source: input.source }),
    };
  }
  return result;
}
