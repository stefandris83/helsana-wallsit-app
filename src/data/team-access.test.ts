import { describe, expect, it } from 'vitest';
import { accessCodes, findAccessCode, isTeamAccessCode } from './access-codes';

/**
 * Demodaten sind dem Projektteam vorbehalten (B.10).
 *
 * Testpersonen sollen ihren eigenen Datenstand nicht versehentlich durch
 * synthetische Daten ersetzen koennen; ausserdem tragen Datensaetze eines
 * Team-Geraets die Markierung `demo` und bleiben damit aus der Auswertung
 * heraus, solange der Demodaten-Schalter aus ist.
 */

describe('Team-Zugang', () => {
  it('erkennt den Team-Code', () => {
    expect(isTeamAccessCode('WS-2026-TEAM')).toBe(true);
  });

  it('behandelt Schreibweise und Leerzeichen wie beim Einloesen', () => {
    expect(isTeamAccessCode(' ws-2026-team ')).toBe(true);
  });

  it('gibt keiner Testperson den Team-Zugang', () => {
    for (const entry of accessCodes.filter((code) => code.team !== true)) {
      expect(isTeamAccessCode(entry.code), `Code ${entry.code}`).toBe(false);
    }
  });

  it('behandelt fehlenden oder unbekannten Code als kein Team', () => {
    expect(isTeamAccessCode(null)).toBe(false);
    expect(isTeamAccessCode(undefined)).toBe(false);
    expect(isTeamAccessCode('')).toBe(false);
    expect(isTeamAccessCode('WS-2026-XXXX')).toBe(false);
  });

  it('fuehrt genau einen Team-Code, ausserhalb des Nummernbereichs der Testpersonen', () => {
    const team = accessCodes.filter((entry) => entry.team === true);
    expect(team).toHaveLength(1);
    expect(team[0].pilotId).toBe('P-900');

    const participantIds = accessCodes
      .filter((entry) => entry.team !== true)
      .map((entry) => entry.pilotId);
    expect(participantIds).not.toContain(team[0].pilotId);
  });

  it('bleibt ein regulaer einloesbarer Code', () => {
    expect(findAccessCode('WS-2026-TEAM')?.pilotId).toBe('P-900');
  });
});
