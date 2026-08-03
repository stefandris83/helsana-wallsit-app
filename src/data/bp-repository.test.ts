import { describe, expect, it } from 'vitest';
import * as bpRepository from './bp-repository';
import type { BpEntryInput } from './bp-repository';

/**
 * B.11.8: Erstellen, Bearbeiten, Loeschen, Doppeleintrag, Rohdatenexport.
 * B.6: Die Datenschicht darf keine Aggregat-, Trend-, Bewertungs- oder
 * Korrelationsfunktion exportieren.
 */

const allowedExports = [
  'listBpEntries',
  'countBpEntries',
  'createBpEntry',
  'updateBpEntry',
  'deleteBpEntry',
  'deleteAllBpEntries',
  'findDuplicateBpEntry',
  'exportBpEntriesCsv',
  'replaceBpEntries',
].sort();

const forbiddenNamePatterns = [
  /average/i,
  /mean/i,
  /durchschnitt/i,
  /trend/i,
  /evaluate/i,
  /assess/i,
  /bewert/i,
  /classif/i,
  /kategor/i,
  /correlat/i,
  /korrelat/i,
  /interpret/i,
  /target/i,
  /zielbereich/i,
  /warn/i,
  /risk/i,
];

function input(overrides: Partial<BpEntryInput> = {}): BpEntryInput {
  return {
    date: '2026-03-02',
    time: '07:15',
    systolic: 128,
    diastolic: 82,
    pulse: 68,
    note: null,
    daypart: 'morning',
    ...overrides,
  };
}

describe('Blutdruck-Datenschicht: erlaubte Schnittstelle (B.6)', () => {
  it('exportiert ausschliesslich die freigegebenen Funktionen', () => {
    expect(Object.keys(bpRepository).sort()).toEqual(allowedExports);
  });

  it('exportiert keine Funktion, deren Name auf eine Auswertung hindeutet', () => {
    for (const name of Object.keys(bpRepository)) {
      for (const pattern of forbiddenNamePatterns) {
        expect(pattern.test(name), `Unzulaessiger Export: ${name}`).toBe(false);
      }
    }
  });
});

describe('Blutdrucktagebuch (§23)', () => {
  it('erstellt und liest Eintraege', () => {
    const created = bpRepository.createBpEntry(input());
    expect(created.id).toBeTruthy();
    expect(bpRepository.listBpEntries()).toHaveLength(1);
    expect(bpRepository.countBpEntries()).toBe(1);
  });

  it('sortiert chronologisch, neueste zuerst', () => {
    bpRepository.createBpEntry(input({ date: '2026-03-01' }));
    bpRepository.createBpEntry(input({ date: '2026-03-05' }));
    bpRepository.createBpEntry(input({ date: '2026-03-03' }));
    expect(bpRepository.listBpEntries().map((entry) => entry.date)).toEqual([
      '2026-03-05',
      '2026-03-03',
      '2026-03-01',
    ]);
  });

  it('bearbeitet einen Eintrag', () => {
    const created = bpRepository.createBpEntry(input());
    const updated = bpRepository.updateBpEntry(created.id, input({ systolic: 131, note: 'ruhig' }));
    expect(updated?.systolic).toBe(131);
    expect(updated?.note).toBe('ruhig');
    expect(bpRepository.listBpEntries()).toHaveLength(1);
  });

  it('meldet null beim Bearbeiten eines unbekannten Eintrags', () => {
    expect(bpRepository.updateBpEntry('unbekannt', input())).toBeNull();
  });

  it('loescht einen einzelnen Eintrag', () => {
    const created = bpRepository.createBpEntry(input());
    bpRepository.createBpEntry(input({ date: '2026-03-04' }));
    expect(bpRepository.deleteBpEntry(created.id)).toBe(true);
    expect(bpRepository.listBpEntries()).toHaveLength(1);
    expect(bpRepository.deleteBpEntry(created.id)).toBe(false);
  });

  it('loescht alle Eintraege', () => {
    bpRepository.createBpEntry(input());
    bpRepository.createBpEntry(input({ date: '2026-03-04' }));
    bpRepository.deleteAllBpEntries();
    expect(bpRepository.listBpEntries()).toHaveLength(0);
  });

  it('erkennt einen versehentlichen Doppeleintrag (§29)', () => {
    bpRepository.createBpEntry(input());
    expect(bpRepository.findDuplicateBpEntry(input())).not.toBeNull();
    expect(bpRepository.findDuplicateBpEntry(input({ time: '07:16' }))).toBeNull();
    expect(bpRepository.findDuplicateBpEntry(input({ systolic: 129 }))).toBeNull();
  });

  it('schliesst den eigenen Eintrag beim Bearbeiten aus der Doppelpruefung aus', () => {
    const created = bpRepository.createBpEntry(input());
    expect(bpRepository.findDuplicateBpEntry(input(), created.id)).toBeNull();
  });

  it('exportiert die eigenen Rohdaten unveraendert (B.13.6)', () => {
    bpRepository.createBpEntry(input({ note: 'Notiz mit "Anfuehrung"' }));
    const csv = bpRepository.exportBpEntriesCsv();
    expect(csv.split('\n')[0]).toContain('systolisch');
    expect(csv).toContain('128');
    expect(csv).toContain('82');
    expect(csv).toContain('Notiz mit ""Anfuehrung""');
  });
});
