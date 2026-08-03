/**
 * Erzeugt die Freigabe-Baseline `src/content/release-fingerprints.generated.ts`
 * aus dem aktuellen Stand der Content-Registry (CLAUDE.md B.5).
 *
 * Aufruf: `npm run content:approve`
 *
 * ACHTUNG: Der Befehl erklaert den aktuellen Wortlaut aller Eintraege fuer
 * freigegeben. Er ist erst auszufuehren, nachdem der Auftraggeber die neuen
 * oder geaenderten Texte tatsaechlich freigegeben hat.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { allContentEntries } from '../src/content/registry';

const target = fileURLToPath(
  new URL('../src/content/release-fingerprints.generated.ts', import.meta.url),
);

const entries = allContentEntries()
  .slice()
  .sort((a, b) => a.id.localeCompare(b.id, 'de'));

const unsafe = entries.filter((entry) => /['\\]/.test(entry.id));
if (unsafe.length > 0) {
  throw new Error(`Content-IDs mit Sonderzeichen: ${unsafe.map((entry) => entry.id).join(', ')}`);
}

const lines = entries.map((entry) => `  '${entry.id}': '${entry.fingerprint}',`);

const file = `/**
 * ERZEUGTE DATEI — nicht von Hand bearbeiten.
 * Neu erzeugen mit \`npm run content:approve\`, siehe \`release-approval.ts\`.
 */

export const approvedFingerprints: Readonly<Record<string, string>> = {
${lines.join('\n')}
};
`;

writeFileSync(target, file, 'utf8');

const pending = entries.filter((entry) => entry.status !== 'approved').length;
process.stdout.write(
  `Freigabe-Baseline erzeugt: ${entries.length} Eintraege (vorher offen: ${pending}).\n`,
);
