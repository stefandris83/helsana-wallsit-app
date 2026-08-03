import { defineContent } from './types';

/**
 * Lernkarten nach spec.md §22. Diese Datei ist die einzige Quelle der Lerninhalte
 * (CLAUDE.md B.5) und kann von Medical, Legal und Marketing ohne Codeaenderung
 * geprueft werden.
 *
 * REDAKTIONELLE GRUNDLAGE: «Learning-Cards für die Blutdruck-App», Fassung des
 * Auftraggebers vom 01.08.2026, medizinisch abgenommen. Die Karten enthalten
 * allgemeine Gesundheitsinformation (Wirkzusammenhaenge, Mengenangaben,
 * Sicherheitshinweise). Ihre Freigabe fuehrt die Baseline in
 * `release-approval.ts`, gebunden an den konkreten Wortlaut.
 *
 * REGULATORISCHER RAHMEN (§3, CLAUDE.md B.6): Fuer diese Eintraege gilt der
 * reduzierte Musterkatalog `generalEducationClaimPatterns` aus
 * `forbidden-claims.ts`. Verboten bleibt jede personenbezogene Aussage —
 * Diagnose der Person, Bewertung ihrer Messwerte, persoenlicher Zielwert,
 * Wirkungsbehauptung ueber ihr Training, Medikamentenanweisung, Score.
 * Zulaessig ist allgemeine, nicht auf die Person bezogene Information.
 */

/**
 * Standardreihenfolge ohne Personalisierung. Sortiert nach Naehe zum Programm
 * (Wandsitz, Bewegung), danach die Alltagshebel mit der breitesten Wirkung,
 * zuletzt die Spezialthemen mit Abklaerungscharakter.
 */
export const learningCardIds = [
  'wandsitz-krafttraining',
  'bewegung-sofort',
  'salz-tagesbudget',
  'verstecktes-salz',
  'blutdruck-messen',
  'kaliumreiche-ernaehrung',
  'ernaehrungsmuster',
  'ausdauertraining',
  'atmung-und-stress',
  'alkohol',
  'koerpergewicht',
  'kaliumsalz',
  'schlafapnoe',
  'medikamente-und-alltagsprodukte',
] as const;

export type LearningCardId = (typeof learningCardIds)[number];

export type LearningTopic =
  | 'bewegung'
  | 'kraft'
  | 'ausdauer'
  | 'kurze-routinen'
  | 'sofort-wirkung'
  | 'einstieg'
  | 'ernaehrung'
  | 'einkauf'
  | 'gewicht'
  | 'erholung'
  | 'schlaf'
  | 'messen'
  | 'sicherheit';

/** Themenachsen fuer die regelbasierte Reihenfolge (§22 «Reihenfolge der Lernkarten»). */
export const learningCardTopics: Record<LearningCardId, ReadonlyArray<LearningTopic>> = {
  'wandsitz-krafttraining': ['bewegung', 'kraft', 'einstieg', 'kurze-routinen'],
  'bewegung-sofort': ['bewegung', 'kurze-routinen', 'sofort-wirkung'],
  'salz-tagesbudget': ['ernaehrung'],
  'verstecktes-salz': ['ernaehrung', 'einkauf'],
  'blutdruck-messen': ['messen'],
  'kaliumreiche-ernaehrung': ['ernaehrung'],
  ernaehrungsmuster: ['ernaehrung'],
  ausdauertraining: ['bewegung', 'ausdauer'],
  'atmung-und-stress': ['erholung', 'kurze-routinen'],
  alkohol: ['ernaehrung', 'erholung', 'schlaf'],
  koerpergewicht: ['gewicht', 'ernaehrung'],
  kaliumsalz: ['ernaehrung', 'sicherheit'],
  schlafapnoe: ['schlaf', 'erholung', 'sicherheit'],
  'medikamente-und-alltagsprodukte': ['sicherheit', 'messen'],
};

/**
 * Herkunft der Karten. Die Freigabe selbst steht nicht hier, sondern in der
 * Freigabe-Baseline (`release-approval.ts`): sie ist an den konkreten Wortlaut
 * gebunden und faellt bei einer Textaenderung automatisch weg.
 */
const MEDICAL_SOURCE = {
  version: '2.0.0',
  owner: 'medical',
  source: 'Learning-Cards für die Blutdruck-App, Fassung vom 01.08.2026, medizinisch abgenommen.',
} as const;

/**
 * Redaktionelle Nachbearbeitung nach der medizinischen Abnahme, ohne Aenderung der
 * fachlichen Aussagen: «Tipp für den Alltag» als Auslöser statt Vorsatz (Habit
 * Stacking, Wenn-dann-Plan, Vorabfestlegung, Substitution) und Kernbotschaften als
 * knappe Einzeiler mit je einem Gedanken.
 */
const MEDICAL_SOURCE_REVISED = {
  ...MEDICAL_SOURCE,
  version: '2.1.0',
  source:
    'Learning-Cards für die Blutdruck-App, Fassung vom 01.08.2026, medizinisch abgenommen. Tipps und Kernbotschaften am 01.08.2026 redaktionell überarbeitet.',
} as const;

export const learningCardContent = defineContent({
  'learning.title': { owner: 'marketing', text: 'Lernen' },
  'learning.lead': {
    owner: 'marketing',
    text: 'Kurze Karten mit allgemeinem Gesundheitswissen rund um Blutdruck und Alltag. Sie ersetzen keine persönliche Beratung.',
  },
  'learning.openCard': { owner: 'marketing', text: 'Karte öffnen' },
  'learning.keyMessages': { owner: 'marketing', text: 'Kernbotschaften' },
  'learning.tip': { owner: 'marketing', text: 'Tipp für den Alltag' },
  'learning.safety': { owner: 'medical', text: 'Wichtiger Sicherheitshinweis' },
  'learning.sourceLabel': { owner: 'marketing', text: 'Quelle' },
  'learning.readBadge': { owner: 'marketing', text: 'Gelesen' },
  'learning.back': { owner: 'marketing', text: 'Zurück zur Übersicht' },
  'learning.orderNote': {
    owner: 'product',
    text: 'Die Reihenfolge richtet sich nach Ihren Angaben aus dem Startfragebogen. Alle Karten bleiben jederzeit verfügbar.',
  },
  'learning.disclaimer': {
    owner: 'medical',
    text: 'Diese Inhalte sind allgemeine Informationen und keine persönliche Empfehlung. Fragen zu Ihrer Gesundheit besprechen Sie bitte mit einer medizinischen Fachperson.',
  },

  // ------------------------------------------------------------------ Bewegung

  'learning.card.wandsitz-krafttraining': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Krafttraining',
      title: 'Mit dem Wandsitz haben Sie bereits angefangen',
      intro:
        'Der Wandsitz ist eine Form des isometrischen Krafttrainings: Sie halten die Spannung, statt sich zu bewegen. Damit kräftigen Sie Ihre Beinmuskulatur und setzen zugleich einen Reiz, der als wirksam für die Senkung des Blutdrucks gilt. Sie sind also bereits auf dem richtigen Weg.',
      tip: 'Hängen Sie die beiden Übungen direkt an Ihre Wandsitz-Einheit an — im Anschluss, solange Sie ohnehin an der Wand stehen. Zum Beispiel Stuhl-Kniebeugen und Liegestütze an einer Wand oder einer erhöhten Fläche.',
      safety:
        'Atmen Sie während der Übungen gleichmässig weiter und vermeiden Sie Pressatmung. Beginnen Sie mit einem Widerstand, den Sie kontrolliert bewegen können.',
    },
    items: [
      'Ergänzende Übungen bewegen die Muskeln über den vollen Bewegungsumfang: Kniebeugen, Aufstehen vom Stuhl, Rudern, Liegestütze an der Wand.',
      'Regelmässiges Krafttraining kann den Blutdruck weiter verbessern, erhält Muskelkraft und Selbstständigkeit und wirkt günstig auf Zuckerstoffwechsel, Körperzusammensetzung und Herz-Kreislauf-Gesundheit.',
      'Schon zweimal pro Woche über alle grossen Muskelgruppen, Widerstand allmählich steigern.',
    ],
  },

  'learning.card.bewegung-sofort': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Bewegung',
      title: 'Eine Bewegungseinheit kann noch am selben Tag wirken',
      intro:
        'Bewegung wirkt nicht erst nach mehreren Monaten. Nach einer aktiven Einheit bleibt der Blutdruck für mehrere Stunden niedriger — bei erhöhtem Blutdruck ist dieser unmittelbare Effekt besonders wertvoll. Jede einzelne Einheit zählt, nicht erst die zwanzigste.',
      tip: 'Legen Sie fest, nach welcher festen Alltagshandlung Sie gehen — zum Beispiel direkt nach dem Mittagessen. 20 Minuten genügen; bei schlechtem Wetter ersatzweise Gehen auf der Stelle, Stuhl-Kniebeugen oder kontrolliertes Treppensteigen.',
      safety:
        'Atmen Sie während der Übungen gleichmässig weiter und vermeiden Sie Pressatmung.',
    },
    items: [
      'Der Effekt einer einzelnen Einheit hält mehrere Stunden an.',
      'Weder Fitnessstudio noch spezielle Geräte nötig.',
      'Zügiges Gehen, Treppensteigen oder einfache Übungen mit grossen Muskelgruppen: bereits ein wirksamer Reiz.',
    ],
  },

  'learning.card.ausdauertraining': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Ausdauer',
      title: 'Der beste Blutdruck-Sport ist nicht der härteste',
      intro:
        'Für den Blutdruck zählt vor allem die Regelmässigkeit. Moderate Bewegung wie zügiges Gehen, Schwimmen, Wandern oder Tanzen kann bereits sehr wirksam sein. Sie müssen sich dafür nicht verausgaben.',
      tip: 'Tragen Sie zwei feste Zeitfenster für diese Woche in den Kalender ein und hängen Sie sie an bestehende Termine, zum Beispiel den Heimweg am Dienstag. Ein Termin wird eher eingehalten als ein Vorsatz.',
    },
    items: [
      'Regelmässiges Ausdauertraining kann den Blutdruck im Durchschnitt um mehrere mmHg senken.',
      'Moderate Intensität genügt, härteres Training ist nicht automatisch wirksamer.',
      'Orientierung: rund 150 Minuten pro Woche, zum Beispiel fünfmal 30 Minuten.',
    ],
  },

  // ----------------------------------------------------------------- Ernährung

  'learning.card.salz-tagesbudget': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Salz',
      title: 'Ein Teelöffel Salz ist fast das ganze Tagesbudget',
      intro:
        'Die empfohlene Obergrenze liegt bei ungefähr 5 Gramm Salz pro Tag — etwa einem gestrichenen Teelöffel. Erreicht ist sie meist schneller als gedacht, denn es zählt nicht nur das Salz aus dem Salzstreuer.',
      tip: 'Probieren Sie das Essen zuerst, bevor Sie nachsalzen — und stellen Sie den Salzstreuer nicht auf den Tisch, sondern zurück ins Regal.',
    },
    items: [
      'Auch Brot, Käse, Fleischwaren, Fertiggerichte und Snacks zählen mit.',
      'Wenige stark gesalzene Lebensmittel schöpfen die Tagesmenge bereits aus.',
      'Weniger Salz kann dazu beitragen, den Blutdruck zu senken.',
    ],
  },

  'learning.card.verstecktes-salz': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Verstecktes Salz',
      title: 'Der Salzstreuer ist selten das Hauptproblem',
      intro:
        'Auch wer beim Kochen kaum salzt, kann viel Salz aufnehmen. Der grösste Anteil stammt häufig aus bereits verarbeiteten Lebensmitteln und kann so unbemerkt zu einem erhöhten Blutdruck beitragen — ein Lebensmittel muss dafür nicht salzig schmecken.',
      tip: 'Achten Sie beim nächsten Einkauf auf die Angabe «Salz pro 100 Gramm» und vergleichen Sie zwei ähnliche Produkte.',
    },
    items: [
      'Oft salzreich: Brot, Käse, Wurstwaren, Pizza, Suppen, Fertiggerichte, Restaurantessen.',
      'Der Geschmack ist kein verlässlicher Hinweis auf den Salzgehalt.',
      'Die Angabe «Salz pro 100 Gramm» macht ähnliche Produkte vergleichbar.',
    ],
  },

  'learning.card.kaliumreiche-ernaehrung': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Kalium',
      title: 'Weniger Natrium und mehr Kalium wirken als Team',
      intro:
        'Kalium unterstützt den Körper dabei, Natrium auszuscheiden und den Gefässwiderstand zu regulieren. Für den Blutdruck ist deshalb nicht nur entscheidend, wie viel Salz man isst, sondern auch, wie viel Kalium die Ernährung liefert.',
      tip: 'Wählen Sie ein Gericht, das Sie fast jede Woche kochen, und geben Sie ab jetzt fest eine Portion Gemüse, Hülsenfrüchte oder Kartoffeln dazu — eine Entscheidung, die dann jede Woche gilt.',
      safety:
        'Kaliumpräparate sollten nicht ohne medizinische Abklärung eingenommen werden. Bei eingeschränkter Nierenfunktion gelten besondere Vorsichtsmassnahmen.',
    },
    items: [
      'Gute Quellen: Gemüse, Hülsenfrüchte, Kartoffeln, Früchte, Nüsse, Samen.',
      'Weniger Natrium und mehr Kalium wirken zusammen stärker als einzeln und können zur besseren Kontrolle des Blutdrucks beitragen.',
      'Für die meisten Menschen über normale Lebensmittel machbar.',
    ],
  },

  'learning.card.ernaehrungsmuster': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Ernährung',
      title: 'Nicht ein Superfood, sondern das Muster zählt',
      intro:
        'Einzelne Lebensmittel wie Randen, Nüsse oder Hülsenfrüchte können wertvoll sein. Entscheidend für den Blutdruck ist jedoch vor allem das gesamte Ernährungsmuster.',
      tip: 'Gestalten Sie Ihr Abendessen so, dass ungefähr die Hälfte des Tellers aus Gemüse besteht.',
    },
    items: [
      'Blutdruckfreundlich: Viel Gemüse, Früchte, Hülsenfrüchte, Vollkornprodukte, Nüsse und hochwertige Proteinquellen (z. B. Soja/Tofu, fettarme Milchprodukte, Fisch & mageres Fleisch).',
      'Dazu wenig stark Verarbeitetes, wenig Salz, wenig verarbeitetes Fleisch.',
      'Kein einzelnes Lebensmittel gleicht eine insgesamt ungünstige Ernährung aus.',
    ],
  },

  'learning.card.kaliumsalz': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Kaliumsalz',
      title: 'Salz lässt sich teilweise durch Kalium ersetzen',
      intro:
        'Natriumreduziertes Salz enthält einen Teil Kaliumchlorid statt Natriumchlorid. Der Geschmack bleibt salzig. Man muss Salz also nicht unbedingt weglassen, sondern kann seine Zusammensetzung verändern.',
      tip: 'Kaufen Sie beim nächsten Einkauf eine Packung natriumreduziertes Salz und stellen Sie sie an den Platz des alten — verwenden Sie davon höchstens gleich viel wie bisher.',
      safety:
        'Kaliumsalz ist nicht für alle geeignet. Bei eingeschränkter Nierenfunktion, erhöhtem Kalium oder bestimmten Wirkstoffen — insbesondere ACE-Hemmern, Sartanen und kaliumsparenden Entwässerungsmitteln — muss die Verwendung ärztlich abgeklärt werden.',
    },
    items: [
      'Natriumreduziertes Salz senkt die Natriumaufnahme und erhöht die Kaliumaufnahme.',
      'Beides kann sich günstig auf einen erhöhten Blutdruck auswirken.',
      'Es schmeckt weiterhin salzig, die verwendete Menge sollte nicht steigen.',
    ],
  },

  'learning.card.alkohol': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Alkohol',
      title: 'Für den Blutdruck gilt: weniger ist besser',
      intro:
        'Alkohol kann den Blutdruck erhöhen und seine Kontrolle erschweren. Und das verbreitete Bild vom Gläschen, das dem Herz guttut, hält der heutigen Datenlage nicht stand.',
      tip: 'Legen Sie zwei feste alkoholfreie Wochentage fest, zum Beispiel Montag und Dienstag, und sorgen Sie dafür, dass ein Ersatzgetränk im Haus ist. Wer mehr will, testet eine vierwöchige alkoholfreie Phase.',
    },
    items: [
      'Ein Herzschutz durch kleine Mengen Alkohol ist wissenschaftlich nicht belegt.',
      'Auch kleinste Mengen wirken ungünstig: auf das Herz und auf das Krebsrisiko, in einem Ausmass, das mit Rauchen vergleichbar ist.',
      'Mengenangaben in Empfehlungen sind absolute Obergrenzen, keine Gesundheitsziele.',
    ],
  },

  'learning.card.koerpergewicht': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Körpergewicht',
      title: 'Schon eine moderate Gewichtsabnahme entlastet',
      intro:
        'Bei Übergewicht muss nicht zuerst das persönliche Wunschgewicht erreicht werden. Der gesundheitliche Nutzen beginnt lange davor.',
      tip: 'Nehmen Sie sich für zwei Wochen eine einzige Verhaltensänderung vor, die Sie sicher durchhalten — zum Beispiel Wasser statt Süssgetränk zum Mittagessen. Verhalten lässt sich planen, eine Zahl auf der Waage nicht.',
    },
    items: [
      'Bereits 5 bis 10 Prozent des Ausgangsgewichts können einen erhöhten Blutdruck und weitere Gesundheitsmarker deutlich verbessern.',
      'Verhalten lässt sich leichter verändern als eine Zahl auf der Waage.',
      'Diese App berechnet keinen BMI, bewertet kein Gewicht und setzt kein Gewichtsziel.',
    ],
  },

  // -------------------------------------------------------- Messen und Erholung

  'learning.card.blutdruck-messen': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Messen',
      title: 'Ein Messfehler kann grösser sein als die Veränderung, die Sie sehen wollen',
      intro:
        'Reden, gekreuzte Beine, ein nicht abgestützter Rücken oder ein herunterhängender Arm verändern den Messwert. Auch eine Messung direkt nach Bewegung, Kaffee, Nikotin oder Stress ist häufig nicht repräsentativ.',
      tip: 'Koppeln Sie die fünf Minuten Sitzen an etwas, das Sie ohnehin tun — messen Sie zum Beispiel immer direkt nach dem Zähneputzen am Morgen. Hinsetzen, Handy weg, nicht sprechen.',
    },
    items: [
      'Eine ungenaue Messung kann stärker abweichen als die Veränderung, die Sie beobachten möchten.',
      'Vergleichbar wird sie durch gleiche Bedingungen: gleicher Arm, gleiche Haltung, gleiche Tageszeit.',
      'Einzelne Messungen schwanken, deshalb an mehreren Tagen messen.',
    ],
  },
  'learning.card.blutdruck-messen.steps': {
    ...MEDICAL_SOURCE,
    fields: { title: 'So messen Sie vergleichbar' },
    items: [
      'Fünf Minuten ruhig sitzen.',
      'Rücken und Arm abstützen.',
      'Beide Füsse flach auf den Boden stellen.',
      'Während der Messung nicht sprechen.',
      'Zwei Messungen im Abstand von ein bis zwei Minuten durchführen.',
      'An mehreren Tagen messen und die Werte gemeinsam betrachten.',
    ],
  },

  'learning.card.atmung-und-stress': {
    ...MEDICAL_SOURCE_REVISED,
    version: '3.0.0',
    source:
      'Learning-Cards für die Blutdruck-App, Fassung vom 01.08.2026, medizinisch abgenommen. Titel, Einleitung, Tipp und Sicherheitshinweis am 01.08.2026 durch den Auftraggeber ersetzt (4-7-8-Atemtechnik).',
    fields: {
      topic: 'Atmung und Stress',
      title: 'Mit der Atmung das Nervensystem beruhigen',
      intro:
        'Bei Stress schaltet der Körper in Alarmbereitschaft: Das Herz schlägt schneller, die Gefässe verengen sich, und der Blutdruck kann ansteigen. Langsames, kontrolliertes Atmen setzt genau hier an. Vor allem eine verlängerte Ausatmung unterstützt den Körper dabei, vom Stressmodus wieder in einen ruhigeren Zustand zu wechseln. Dadurch können Herzfrequenz und Blutdruck bereits innerhalb weniger Minuten sinken. Regelmässige Atemübungen können deshalb eine sinnvolle Ergänzung bei erhöhtem Blutdruck sein.',
      tip: 'Die 4-7-8-Atemtechnik: 4 Sekunden ruhig durch die Nase einatmen, den Atem 7 Sekunden anhalten und 8 Sekunden langsam durch den Mund ausatmen. Wiederholen Sie die Abfolge zunächst viermal, ruhig und angenehm.',
      safety:
        'Fühlt sich das lange Luftanhalten unangenehm an oder macht es schwindlig, verkürzen Sie die Zeiten oder atmen Sie einfach langsam ein und etwas länger aus.',
    },
    items: [
      'Die Atmung ist einer der wenigen Körperprozesse, über die wir das Nervensystem unmittelbar beeinflussen.',
      'Regelmässige Atemübungen helfen, Stressreaktionen früher zu unterbrechen.',
      'Der Effekt ist kurzfristig und ersetzt Bewegung und Ernährung nicht.',
    ],
  },

  'learning.card.schlafapnoe': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Schlaf',
      title: 'Vielleicht ist nicht die Disziplin das Problem, sondern der Schlaf',
      intro:
        'Lautes Schnarchen, beobachtete Atemaussetzer, morgendliche Kopfschmerzen oder starke Tagesmüdigkeit können auf eine Schlafapnoe hinweisen — und Betroffene bemerken davon selbst oft nichts.',
      tip: 'Fragen Sie eine nahestehende Person, ob ihr bei Ihnen lautes Schnarchen oder Atempausen aufgefallen sind.',
      safety:
        'Diese App kann das nicht beurteilen. Wenn Sie solche Hinweise bei sich bemerken, besprechen Sie sie mit einer medizinischen Fachperson.',
    },
    items: [
      'Atemaussetzer im Schlaf können den Blutdruck besonders nachts erhöhen.',
      'Bleibt der Blutdruck trotz Lebensstiländerungen schwer beeinflussbar, lohnt der Blick auf den Schlaf.',
      'Ein Hinweis aus dem Umfeld ist oft der erste Anhaltspunkt.',
    ],
  },

  'learning.card.medikamente-und-alltagsprodukte': {
    ...MEDICAL_SOURCE_REVISED,
    fields: {
      topic: 'Alltagsprodukte',
      title: 'Auch Schmerz- und Erkältungsmittel können den Blutdruck erhöhen',
      intro:
        'Nicht nur Ernährung, Bewegung und Stress beeinflussen den Blutdruck. Auch frei verkäufliche Mittel aus dem Alltag können ihn erhöhen — ein vermeintlich harmloses Produkt macht dabei mehr aus als gedacht.',
      tip: 'Fotografieren Sie die Packungen, die bei Ihnen zu Hause stehen, und zeigen Sie das Foto beim nächsten Arzt- oder Apothekenbesuch — so brauchen Sie dafür keinen zusätzlichen Termin.',
      safety:
        'Verschriebene Mittel niemals eigenständig absetzen oder verändern. Diese App gibt dazu keine Empfehlung.',
    },
    items: [
      'Entzündungshemmende Schmerzmittel wie Ibuprofen oder Diclofenac.',
      'Abschwellende Erkältungsmittel, Kortisonpräparate, grössere Mengen Lakritze oder Süssholz.',
      'Bestimmte Hormone und stimulierende Substanzen.',
    ],
  },
});
