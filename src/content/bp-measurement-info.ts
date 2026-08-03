import { defineContent } from './types';

/**
 * Messhinweise zum freiwilligen Blutdrucktagebuch (spec.md §23, «Messinformationen»).
 * Diese Datei ist die einzige Quelle dieser Hinweise (CLAUDE.md B.5).
 *
 * Inhaltlicher Rahmen: allgemeine Hinweise zur Durchfuehrung einer Messung.
 * Keine Bewertung, keine Interpretation, keine Zielwerte, kein Bezug auf das Training.
 * Freigegeben mit der Gesamtfreigabe vom 03.08.2026 (`release-approval.ts`).
 */
export const bpMeasurementInfoContent = defineContent({
  'bpInfo.title': { owner: 'medical', text: 'Hinweise zur Messung' },
  'bpInfo.lead': {
    owner: 'medical',
    text: 'Allgemeine Hinweise, wie eine Messung üblicherweise durchgeführt wird.',
  },
  'bpInfo.items': {
    owner: 'medical',
    source:
      'Angelehnt an allgemeine Empfehlungen der Schweizerischen Hypertonie-Gesellschaft zur Selbstmessung.',
    items: [
      'Möglichst ein validiertes Oberarmmessgerät verwenden.',
      'Vor der Messung fünf Minuten ruhig im Sitzen warten.',
      'Immer möglichst zur gleichen Tageszeit messen.',
      'Immer am gleichen Arm messen.',
      'Arm und Manschette auf Herzhöhe halten.',
      'Während der Messung nicht sprechen.',
      'Mindestens zwei Messungen mit mindestens einer Minute Abstand durchführen.',
      'Die abgelesenen Zahlen unverändert notieren.',
      'Möglichst nicht direkt nach körperlicher Anstrengung messen.',
      'Ärztlich vereinbarte Messanweisungen haben Vorrang.',
    ],
  },
  'bpInfo.measurementWeekTitle': { owner: 'medical', text: 'Messwoche (freiwillig)' },
  'bpInfo.measurementWeekText': {
    owner: 'medical',
    text: 'Eine Messwoche ist eine einfache Dokumentationsroutine: sieben aufeinanderfolgende Tage, jeweils morgens und abends, pro Zeitpunkt zwei Messungen im Abstand von mindestens einer Minute.',
  },
  'bpInfo.measurementWeekNote': {
    owner: 'medical',
    text: 'Die App fasst diese Einträge nicht zusammen und nimmt keine Auswertung vor.',
  },
});
