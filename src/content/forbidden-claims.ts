/**
 * Musterliste unzulaessiger Aussagetypen, abgeleitet aus spec.md §3 (CLAUDE.md B.6).
 *
 * Die Liste wird durch `content-compliance.test.ts` gegen die gesamte
 * Content-Registry geprueft. Ein Treffer laesst den Test fehlschlagen.
 *
 * Grundsatz: Die App verwendet die betroffenen Begriffe gar nicht erst. Damit
 * braucht es keine Ausnahmeregeln fuer Verneinungen («keine Diagnose»), die in
 * einer maschinellen Pruefung erfahrungsgemaess unterlaufen werden koennen.
 * Der Disclaimer aus §2 ist deshalb als «ersetzt keine medizinische Untersuchung,
 * Behandlung oder Beratung» formuliert.
 */

import type { ContentEntry } from './types';

export type ForbiddenClaimCategory =
  | 'diagnose'
  | 'bewertung-von-werten'
  | 'wirkungsbehauptung'
  | 'zielwert'
  | 'risiko-prognose'
  | 'medikamente'
  | 'therapieempfehlung'
  | 'score';

export interface ForbiddenClaimPattern {
  id: string;
  category: ForbiddenClaimCategory;
  /** Verbot aus §3, das dieses Muster absichert. */
  rule: string;
  pattern: RegExp;
}

export const forbiddenClaimPatterns: ForbiddenClaimPattern[] = [
  {
    id: 'diagnose-begriff',
    category: 'diagnose',
    rule: 'Die App darf keine Diagnose stellen.',
    pattern: /\bdiagnos(e|en|tik|tizier\w*|tisch\w*)\b/i,
  },
  {
    id: 'bluthochdruck-feststellung',
    category: 'diagnose',
    rule: 'Die App darf nicht feststellen, ob eine Person Bluthochdruck hat.',
    pattern: /\b(bluthochdruck|hypertonie|hyperton\w*|hypotonie)\b/i,
  },
  {
    id: 'wertebereich',
    category: 'bewertung-von-werten',
    rule: 'Die App darf Blutdruckwerte nicht medizinisch interpretieren.',
    pattern: /\bim\s+(gesunden|normalen|gruenen|grünen|roten|optimalen)\s+bereich\b/i,
  },
  {
    id: 'werte-zu-hoch-niedrig',
    category: 'bewertung-von-werten',
    rule: 'Die App darf Blutdruckwerte nicht medizinisch interpretieren.',
    pattern: /\b(werte?|blutdruck)\b[^.!?]{0,40}\b(zu hoch|zu tief|zu niedrig|erhoeht|erhöht|auffaellig|auffällig|unbedenklich|normal)\b/i,
  },
  {
    id: 'kategorisierung',
    category: 'bewertung-von-werten',
    rule: 'Die App darf Blutdruckwerte nicht in Kategorien einteilen.',
    pattern: /\b(blutdruck\w*|messwert\w*|werte)\b[^.!?]{0,40}\b(kategorie\w*|klasse\w*|klassifi\w*|einstufung|eingestuft|einteil\w*)\b/i,
  },
  {
    id: 'ampel-warnstufe',
    category: 'bewertung-von-werten',
    rule: 'Keine Ampelfarben und keine Warnstufe aufgrund eines Blutdruckwertes.',
    pattern: /\b(ampel\w*|warnstufe\w*|alarmstufe\w*|gefahrenstufe\w*)\b/i,
  },
  {
    id: 'zielwert',
    category: 'zielwert',
    rule: 'Die App darf keine individuellen Zielwerte festlegen.',
    pattern: /\b(zielwert\w*|zielbereich\w*|grenzwert\w*|normwert\w*|richtwert\w*)\b/i,
  },
  {
    id: 'wirkung-blutdruck',
    category: 'wirkungsbehauptung',
    rule: 'Keine Ursache-Wirkung-Behauptung zwischen Training und Blutdruck.',
    pattern: /\bblutdruck\w*\b[^.!?]{0,60}\b(gesenkt|senkt|senken|sinkt|gesunken|reduziert|verbessert|verbessern)\b/i,
  },
  {
    id: 'wirkung-blutdruck-umgekehrt',
    category: 'wirkungsbehauptung',
    rule: 'Keine Ursache-Wirkung-Behauptung zwischen Training und Blutdruck.',
    pattern: /\b(gesenkt|senkt|senken|gesunken|reduziert)\b[^.!?]{0,60}\bblutdruck\w*\b/i,
  },
  {
    id: 'programm-wirkt',
    category: 'wirkungsbehauptung',
    rule: 'Keine behauptete Wirkung des Trainings.',
    pattern: /\b(programm|training|wallsit\w*|wandsitz\w*|uebung|übung)\b[^.!?]{0,20}\bwirkt\b/i,
  },
  {
    id: 'trainingsanpassung-aus-werten',
    category: 'wirkungsbehauptung',
    rule: 'Keine Trainingsanpassung aufgrund von Blutdruckwerten oder Profildaten.',
    pattern: /\baufgrund\s+(ihrer|deiner|der)\s+(werte|messwerte|blutdruckwerte|profildaten|angaben zur gesundheit)\b/i,
  },
  {
    id: 'risiko',
    category: 'risiko-prognose',
    rule: 'Kein Risikoprofil und keine individuelle Prognose.',
    pattern: /\b(risiko\w*|risiken|prognose\w*|lebenserwartung)\b/i,
  },
  {
    id: 'score',
    category: 'score',
    rule: 'Kein medizinischer Score.',
    pattern: /\b(score\w*|punktwert\w*|gesundheitsindex|risikoindex)\b/i,
  },
  {
    id: 'medikamente',
    category: 'medikamente',
    rule: 'Medikamente duerfen nicht erwaehnt, bewertet oder angepasst werden.',
    pattern: /\b(medikament\w*|arzneimittel\w*|tablette\w*|praeparat\w*|präparat\w*|dosis|dosierung|blutdrucksenker\w*)\b/i,
  },
  {
    id: 'therapieempfehlung',
    category: 'therapieempfehlung',
    rule: 'Keine medizinischen Therapieempfehlungen.',
    pattern: /\b(therapie\w*|heilung|heilt|kur\b|behandeln Sie|behandlungsempfehlung\w*)\b/i,
  },
];

/**
 * Reduzierter Musterkatalog fuer allgemeine, medizinisch freigegebene
 * Lerninhalte (§22, CLAUDE.md B.6).
 *
 * HINTERGRUND: Der Lernbereich enthaelt seit der Medical-Fassung vom 01.08.2026
 * allgemeine Gesundheitsinformation mit Mengenangaben, Wirkzusammenhaengen und
 * Sicherheitshinweisen. Solche Aussagen beziehen sich auf Menschen im
 * Allgemeinen, nicht auf die Teilnehmerin oder den Teilnehmer und nicht auf
 * deren Daten. Der Vollkatalog oben untersagt die betroffenen Begriffe
 * unabhaengig vom Bezug und ist fuer diesen Inhaltstyp deshalb nicht anwendbar.
 *
 * GRENZE: Personenbezogene Aussagen bleiben in jedem Inhaltstyp verboten. Alle
 * in §3 aufgefuehrten Beispielsaetze werden auch von diesem Katalog erkannt;
 * `content-compliance.test.ts` prueft das. Der Katalog gilt ausschliesslich fuer
 * Eintraege mit `approvals.medical === true` unterhalb von `learning.card.`.
 */
export const generalEducationClaimPatterns: ForbiddenClaimPattern[] = [
  {
    id: 'edu-personen-diagnose',
    category: 'diagnose',
    rule: 'Die App darf bei einer Person keine Diagnose stellen oder feststellen.',
    pattern:
      /\b(sie haben|bei ihnen (liegt|besteht)|wir stellen|ihre diagnose)\b[^.!?]{0,40}\b(diagnose\w*|bluthochdruck|hypertonie)\b/i,
  },
  {
    id: 'edu-eigene-werte-bewertung',
    category: 'bewertung-von-werten',
    rule: 'Die App darf die Blutdruckwerte der Person nicht interpretieren.',
    pattern:
      /\b(ihr|ihre|ihren|ihrem)\s+(blutdruck\w*|messwerte?|werte?)\b[^.!?]{0,40}\b(zu hoch|zu tief|zu niedrig|erhoeht|erhöht|auffaellig|auffällig|unbedenklich|normal|im\s+(gesunden|normalen|gruenen|grünen|roten|optimalen)\s+bereich)\b/i,
  },
  {
    id: 'edu-kategorisierung',
    category: 'bewertung-von-werten',
    rule: 'Die App darf Blutdruckwerte nicht in Kategorien einteilen.',
    pattern:
      /\b(blutdruck\w*|messwert\w*|werte)\b[^.!?]{0,40}\b(kategorie\w*|klasse\w*|klassifi\w*|einstufung|eingestuft|einteil\w*)\b/i,
  },
  {
    id: 'edu-ampel-warnstufe',
    category: 'bewertung-von-werten',
    rule: 'Keine Ampelfarben und keine Warnstufe aufgrund eines Blutdruckwertes.',
    pattern: /\b(ampel\w*|warnstufe\w*|alarmstufe\w*|gefahrenstufe\w*)\b/i,
  },
  {
    id: 'edu-persoenlicher-zielwert',
    category: 'zielwert',
    rule: 'Die App darf keine individuellen Zielwerte festlegen.',
    pattern: /\b(ihr|ihre|ihren|ihrem)\w*\s+(\w+\s+)?(zielwert\w*|zielbereich\w*)\b/i,
  },
  {
    id: 'edu-eigene-werte-wirkung',
    category: 'wirkungsbehauptung',
    rule: 'Keine Ursache-Wirkung-Behauptung zwischen Training und dem Blutdruck der Person.',
    pattern:
      /\b(ihr|ihre|ihren|ihrem)\s+(blutdruck\w*|messwerte?|werte?)\b[^.!?]{0,40}\b(gesenkt|gesunken|reduziert|verbessert)\b/i,
  },
  {
    id: 'edu-programm-wirkt',
    category: 'wirkungsbehauptung',
    rule: 'Keine behauptete Wirkung des Trainings auf die einzelne Person.',
    pattern: /\bihr\w*\s+(\w+-?)*(programm|training|wallsit\w*|wandsitz\w*)\b[^.!?]{0,20}\bwirkt\b/i,
  },
  {
    id: 'edu-anpassung-aus-daten',
    category: 'wirkungsbehauptung',
    rule: 'Keine Trainingsanpassung aufgrund von Blutdruckwerten oder Profildaten.',
    pattern:
      /\baufgrund\s+(ihrer|deiner)\s+(werte|messwerte|blutdruckwerte|profildaten|angaben zur gesundheit)\b/i,
  },
  {
    id: 'edu-erfolg-aus-werten',
    category: 'wirkungsbehauptung',
    rule: 'Der Wandsitz-Erfolg darf nicht aus Blutdruckwerten abgeleitet werden.',
    pattern: /\b(erfolg\w*|fortschritt\w*)\b[^.!?]{0,30}\b(aus|anhand|aufgrund)\b[^.!?]{0,20}\bblutdruck/i,
  },
  {
    id: 'edu-persoenliches-risiko',
    category: 'risiko-prognose',
    rule: 'Kein persoenliches Risikoprofil und keine individuelle Prognose.',
    pattern: /\b(ihr|ihre|ihren|ihrem)\s+(\w+\s+)?(risiko\w*|prognose\w*|lebenserwartung)\b/i,
  },
  {
    id: 'edu-score',
    category: 'score',
    rule: 'Kein medizinischer Score.',
    pattern: /\b(score\w*|punktwert\w*|gesundheitsindex|risikoindex)\b/i,
  },
  {
    id: 'edu-medikamentenanweisung',
    category: 'medikamente',
    rule: 'Medikamente duerfen nicht bewertet oder angepasst werden.',
    pattern:
      /\b(reduzieren|erhoehen|erhöhen|veraendern|verändern|absetzen|anpassen|nehmen)\s+sie\b[^.!?]{0,40}\b(medikament\w*|arzneimittel\w*|tablette\w*|dosis|dosierung|blutdrucksenker\w*)\b/i,
  },
  {
    id: 'edu-medikamente-selbst-anpassen',
    category: 'medikamente',
    rule: 'Medikamente duerfen nicht bewertet oder angepasst werden.',
    pattern:
      /\b(medikament\w*|dosis|dosierung|blutdrucksenker\w*)\b[^.!?]{0,30}\b(selbst|eigenstaendig|eigenständig)\b[^.!?]{0,25}\b(anpassen|aendern|ändern|absetzen|reduzieren|erhoehen|erhöhen)\b/i,
  },
  {
    id: 'edu-therapieempfehlung',
    category: 'therapieempfehlung',
    rule: 'Keine medizinischen Therapieempfehlungen.',
    pattern:
      /\bwir\s+(empfehlen|verordnen|verschreiben)\b[^.!?]{0,30}\b(therapie\w*|behandlung\w*|medikament\w*)\b/i,
  },
];

export interface ForbiddenClaimHit {
  patternId: string;
  category: ForbiddenClaimCategory;
  rule: string;
  match: string;
}

/** Prueft einen einzelnen Text gegen einen Musterkatalog. */
export function findForbiddenClaims(
  text: string,
  patterns: ForbiddenClaimPattern[] = forbiddenClaimPatterns,
): ForbiddenClaimHit[] {
  const hits: ForbiddenClaimHit[] = [];
  for (const entry of patterns) {
    const match = entry.pattern.exec(text);
    if (match) {
      hits.push({
        patternId: entry.id,
        category: entry.category,
        rule: entry.rule,
        match: match[0],
      });
    }
  }
  return hits;
}

/**
 * Waehlt den anwendbaren Musterkatalog fuer einen Registry-Eintrag.
 *
 * Der reduzierte Katalog gilt ausschliesslich fuer Lernkarten mit vorliegender
 * Medical-Freigabe. Jeder andere Eintrag — auch ein medizinisch freigegebener
 * ausserhalb des Lernbereichs — wird gegen den Vollkatalog geprueft.
 */
export function patternsForEntry(
  entry: Pick<ContentEntry, 'id' | 'approvals'>,
): ForbiddenClaimPattern[] {
  const isLearningCard = entry.id.startsWith('learning.card.');
  return isLearningCard && entry.approvals.medical
    ? generalEducationClaimPatterns
    : forbiddenClaimPatterns;
}
