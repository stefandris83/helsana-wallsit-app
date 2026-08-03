/**
 * Freigabe-Baseline der Content-Registry (CLAUDE.md B.5).
 *
 * Der Auftraggeber (Mitarbeiter/in Helsana) hat am 03.08.2026 saemtliche zu
 * diesem Zeitpunkt bestehenden Inhalte fuer Medical, Legal, Datenschutz und
 * Marketing freigegeben. Die Baseline haelt fest, **welcher Wortlaut** damit
 * freigegeben wurde: je Content-ID ein Fingerabdruck ueber Text, Aufzaehlungen
 * und Teilfelder (siehe `fingerprint.ts`).
 *
 * Wirkung in `defineContent`:
 * - ID in der Baseline **und** Fingerabdruck identisch → `status: 'approved'`
 *   mit allen vier Freigaben und dem Freigabedatum.
 * - Neue ID oder geaenderter Wortlaut → `status: 'draft'`. Die Freigabe ist
 *   erneut einzuholen und die Baseline anschliessend neu zu erzeugen.
 *
 * Die Fingerabdruecke liegen in `release-fingerprints.generated.ts` und werden
 * nicht von Hand gepflegt:
 *
 * ```
 * npm run content:approve
 * ```
 *
 * Der Befehl uebernimmt den aktuellen Stand der Registry als freigegeben. Er
 * ist deshalb erst auszufuehren, **nachdem** der Auftraggeber die geaenderten
 * oder neuen Texte tatsaechlich freigegeben hat.
 */

import type { ContentApprovals } from './types';

export { approvedFingerprints } from './release-fingerprints.generated';

export const RELEASE_APPROVAL_DATE = '2026-08-03';

export const RELEASE_APPROVAL_SOURCE =
  'Gesamtfreigabe des Auftraggebers (Mitarbeiter/in Helsana) vom 03.08.2026 fuer Medical, Legal, Datenschutz und Marketing.';

export const RELEASE_APPROVALS: ContentApprovals = {
  medical: true,
  legal: true,
  privacy: true,
  marketing: true,
};
