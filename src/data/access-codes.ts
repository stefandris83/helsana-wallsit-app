/**
 * Lokale, synthetische Codeliste fuer den Pilot (CLAUDE.md B.9, spec.md §8).
 *
 * Jeder Code ist genau einer Pilot-ID zugeordnet. Es gibt kein Konto, kein
 * Passwort und keine E-Mail-Pflicht. Die Codes sind erfunden und enthalten
 * keinerlei Personenbezug.
 *
 * Im Betrieb tritt an diese Stelle eine serverseitig verwaltete Codeliste;
 * siehe docs/schnittstellen.md.
 */

export interface AccessCodeEntry {
  code: string;
  pilotId: string;
}

export const accessCodes: readonly AccessCodeEntry[] = [
  { code: 'WS-2026-A1B2', pilotId: 'P-001' },
  { code: 'WS-2026-C3D4', pilotId: 'P-002' },
  { code: 'WS-2026-E5F6', pilotId: 'P-003' },
  { code: 'WS-2026-G7H8', pilotId: 'P-004' },
  { code: 'WS-2026-J9K1', pilotId: 'P-005' },
  { code: 'WS-2026-L2M3', pilotId: 'P-006' },
  { code: 'WS-2026-N4P5', pilotId: 'P-007' },
  { code: 'WS-2026-Q6R7', pilotId: 'P-008' },
] as const;

function normalize(code: string): string {
  return code.trim().toUpperCase().replaceAll(/\s+/g, '');
}

export function findAccessCode(code: string): AccessCodeEntry | null {
  const normalized = normalize(code);
  return accessCodes.find((entry) => entry.code === normalized) ?? null;
}
