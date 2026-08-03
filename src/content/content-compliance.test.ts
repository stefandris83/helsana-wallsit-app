import { describe, expect, it } from 'vitest';
import { allContentEntries, contentRegistry, entryTexts } from './registry';
import {
  findForbiddenClaims,
  forbiddenClaimPatterns,
  generalEducationClaimPatterns,
  patternsForEntry,
} from './forbidden-claims';
import { learningCardContent } from './learning-cards';
import { RELEASE_APPROVAL_DATE, approvedFingerprints } from './release-approval';
import { defineContent } from './types';

/** B.6 und B.11.10: Die gesamte Content-Registry gegen §3 pruefen. */

describe('Musterliste unzulaessiger Aussagen (§3)', () => {
  const unzulaessig = [
    'Das Training hat Ihren Blutdruck gesenkt.',
    'Ihr Blutdruck ist jetzt im gesunden Bereich.',
    'Aufgrund Ihrer Werte sollten Sie intensiver trainieren.',
    'Ihr Wandsitz-Programm wirkt.',
    'Reduzieren Sie Ihre Medikamente.',
    'Ihr Risiko ist gesunken.',
    'Wir stellen die Diagnose Bluthochdruck.',
    'Ihr persoenlicher Zielwert liegt bei 120 zu 80.',
    'Ihre Werte werden in Kategorien eingeteilt.',
    'Die Ampel steht auf Rot.',
    'Wir berechnen Ihren Score.',
    'Wir empfehlen eine Therapie.',
  ];

  const zulaessig = [
    'Sie haben diese Woche zwei von drei Einheiten abgeschlossen.',
    'Sie haben heute Ihr persoenliches Zwischenziel erreicht.',
    'Regelmaessigkeit hilft beim Aufbau einer neuen Bewegungsroutine.',
    'Ihre Blutdruckwerte wurden gespeichert.',
    'Die medizinische Bedeutung Ihrer Werte besprechen Sie bitte mit einer medizinischen Fachperson.',
    'Basierend auf Ihrer heutigen Rueckmeldung schlagen wir die leichte Variante vor.',
    'Normale Variante: vier Saetze mit je 60 Sekunden.',
    'Sie trainieren normalerweise am Montag, Mittwoch und Freitag.',
  ];

  it.each(unzulaessig)('erkennt «%s» als unzulaessig', (text) => {
    expect(findForbiddenClaims(text).length).toBeGreaterThan(0);
  });

  it.each(zulaessig)('laesst «%s» zu', (text) => {
    expect(findForbiddenClaims(text)).toEqual([]);
  });

  it.each(unzulaessig)(
    'erkennt «%s» auch im reduzierten Katalog fuer Lerninhalte als unzulaessig',
    (text) => {
      expect(findForbiddenClaims(text, generalEducationClaimPatterns).length).toBeGreaterThan(0);
    },
  );

  it.each(zulaessig)('laesst «%s» auch im reduzierten Katalog zu', (text) => {
    expect(findForbiddenClaims(text, generalEducationClaimPatterns)).toEqual([]);
  });

  it('deckt alle Verbotskategorien aus §3 ab', () => {
    const categories = new Set(forbiddenClaimPatterns.map((entry) => entry.category));
    expect([...categories].sort()).toEqual(
      [
        'bewertung-von-werten',
        'diagnose',
        'medikamente',
        'risiko-prognose',
        'score',
        'therapieempfehlung',
        'wirkungsbehauptung',
        'zielwert',
      ].sort(),
    );
  });
});

describe('Content-Registry (B.5)', () => {
  it('enthaelt keine unzulaessige Aussage', () => {
    const violations: string[] = [];
    for (const entry of allContentEntries()) {
      for (const text of entryTexts(entry)) {
        for (const hit of findForbiddenClaims(text, patternsForEntry(entry))) {
          violations.push(`${entry.id}: «${hit.match}» verstoesst gegen ${hit.rule}`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('haelt fuer jeden Eintrag die Metadaten aus §28 bereit', () => {
    for (const entry of allContentEntries()) {
      expect(entry.id).toBeTruthy();
      expect(entry.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(entry.owner).toBeTruthy();
      expect(['draft', 'approved']).toContain(entry.status);
      expect(entry.approvals).toEqual(
        expect.objectContaining({
          medical: expect.any(Boolean),
          legal: expect.any(Boolean),
          privacy: expect.any(Boolean),
          marketing: expect.any(Boolean),
        }),
      );
    }
  });

  it('traegt den Status «approved» genau dann, wenn alle vier Freigaben vorliegen (B.5)', () => {
    for (const entry of allContentEntries()) {
      const complete =
        entry.approvals.medical &&
        entry.approvals.legal &&
        entry.approvals.privacy &&
        entry.approvals.marketing;
      expect(entry.status, `Eintrag ${entry.id}`).toBe(complete ? 'approved' : 'draft');
    }
  });

  it('fuehrt saemtliche Inhalte als freigegeben (Gesamtfreigabe vom 03.08.2026)', () => {
    const offen = allContentEntries()
      .filter((entry) => entry.status !== 'approved')
      .map((entry) => entry.id);

    expect(offen, 'nicht freigegebene Eintraege — nach Freigabe `npm run content:approve`').toEqual(
      [],
    );
  });

  it('bindet die Freigabe an den Wortlaut und traegt das Freigabedatum', () => {
    for (const entry of allContentEntries()) {
      expect(approvedFingerprints[entry.id], `Eintrag ${entry.id}`).toBe(entry.fingerprint);
      expect(entry.approvedAt, `Eintrag ${entry.id}`).toBe(RELEASE_APPROVAL_DATE);
    }
  });

  it('vermerkt ein Freigabedatum genau dann, wenn eine Freigabe vorliegt', () => {
    for (const entry of allContentEntries()) {
      const anyApproval = Object.values(entry.approvals).some(Boolean);
      expect(entry.approvedAt !== null, `Eintrag ${entry.id}`).toBe(anyApproval);
    }
  });

  it('haelt Schluessel und Eintrags-ID konsistent', () => {
    for (const [key, entry] of Object.entries(contentRegistry)) {
      expect(entry.id).toBe(key);
    }
  });

  it('enthaelt zu jedem Eintrag mindestens einen Text', () => {
    for (const entry of allContentEntries()) {
      expect(entryTexts(entry).length, `Eintrag ${entry.id} ist leer`).toBeGreaterThan(0);
    }
  });
});

/**
 * B.5: Die Gesamtfreigabe vom 03.08.2026 gilt fuer den damaligen Wortlaut. Neue
 * und geaenderte Inhalte muessen erneut freigegeben werden — das darf nicht von
 * der Sorgfalt der schreibenden Person abhaengen, sondern wird hier erzwungen.
 */
describe('Freigabepflicht fuer neue und geaenderte Inhalte (B.5)', () => {
  it('fuehrt einen neuen Eintrag als «draft» ohne Freigaben', () => {
    const { neu } = defineContent({
      neu: { owner: 'marketing', text: 'Ein neuer, noch nicht freigegebener Text.' },
    });

    expect(neu.status).toBe('draft');
    expect(neu.approvals).toEqual({
      medical: false,
      legal: false,
      privacy: false,
      marketing: false,
    });
    expect(neu.approvedAt).toBeNull();
  });

  it('entzieht einem freigegebenen Eintrag die Freigabe, sobald sich der Wortlaut aendert', () => {
    const id = 'today.title';
    const original = contentRegistry[id];
    expect(original.status).toBe('approved');

    const { [id]: geaendert } = defineContent({
      [id]: { owner: original.owner, text: `${original.text} Zusatz.` },
    });

    expect(geaendert.status).toBe('draft');
    expect(geaendert.approvedAt).toBeNull();
  });

  it('erkennt auch eine geaenderte Quellenangabe als aenderungspflichtig', () => {
    const id = 'bpInfo.items';
    const original = contentRegistry[id];
    expect(original.status).toBe('approved');

    const { [id]: geaendert } = defineContent({
      [id]: { owner: original.owner, items: original.items, source: 'Andere Quelle.' },
    });

    expect(geaendert.status).toBe('draft');
  });
});

describe('Ausnahme fuer medizinisch freigegebene Lerninhalte (B.6, §22)', () => {
  it('deckt mit dem reduzierten Katalog alle Verbotskategorien aus §3 ab', () => {
    const categories = new Set(generalEducationClaimPatterns.map((entry) => entry.category));
    const full = new Set(forbiddenClaimPatterns.map((entry) => entry.category));
    expect([...categories].sort()).toEqual([...full].sort());
  });

  it('wendet den reduzierten Katalog nur auf freigegebene Lernkarten an', () => {
    const approvals = { medical: true, legal: false, privacy: false, marketing: false };

    expect(patternsForEntry({ id: 'learning.card.alkohol', approvals })).toBe(
      generalEducationClaimPatterns,
    );
    expect(
      patternsForEntry({ id: 'learning.card.alkohol', approvals: { ...approvals, medical: false } }),
    ).toBe(forbiddenClaimPatterns);
    expect(patternsForEntry({ id: 'bpInfo.items', approvals })).toBe(forbiddenClaimPatterns);
    expect(patternsForEntry({ id: 'today.title', approvals })).toBe(forbiddenClaimPatterns);
  });

  it('fuehrt jede Lernkarte mit Medical-Freigabe, Datum und Quelle', () => {
    for (const [id, entry] of Object.entries(learningCardContent)) {
      if (!id.startsWith('learning.card.')) continue;
      expect(entry.approvals.medical, `${id} ohne Medical-Freigabe`).toBe(true);
      expect(entry.approvedAt, `${id} ohne Freigabedatum`).not.toBeNull();
      expect(entry.source, `${id} ohne Quellenangabe`).toBeTruthy();
      expect(entry.owner).toBe('medical');
    }
  });

  it('haelt die Kartenstruktur aus §22 ein', () => {
    for (const [id, entry] of Object.entries(learningCardContent)) {
      if (!id.startsWith('learning.card.') || id.endsWith('.steps')) continue;
      expect(entry.fields?.topic, `${id} ohne Themenlabel`).toBeTruthy();
      expect(entry.fields?.title, `${id} ohne Titel`).toBeTruthy();
      expect(entry.fields?.intro, `${id} ohne Einleitung`).toBeTruthy();
      expect(entry.fields?.tip, `${id} ohne Tipp`).toBeTruthy();
      expect(entry.items?.length ?? 0, `${id} hat mehr als drei Kernbotschaften`).toBeLessThanOrEqual(3);
      expect(entry.items?.length ?? 0, `${id} ohne Kernbotschaft`).toBeGreaterThan(0);
    }
  });
});
