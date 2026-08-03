import { defineContent } from '../types';

/** Anonymisiertes Pilot-Dashboard (§26). */
export const adminContent = defineContent({
  'admin.title': { owner: 'product', text: 'Pilot-Dashboard' },
  'admin.subtitle': { owner: 'product', text: 'Anonymisierte Nutzung des Wandsitz-Pilots' },
  'admin.login.title': { owner: 'product', text: 'Geschützter Bereich' },
  'admin.login.lead': { owner: 'product', text: 'Bitte geben Sie den Zugangscode ein.' },
  'admin.login.codeLabel': { owner: 'product', text: 'Zugangscode' },
  'admin.login.submit': { owner: 'product', text: 'Anmelden' },
  'admin.login.invalid': { owner: 'product', text: 'Der Code ist nicht korrekt.' },
  'admin.login.notConfigured': {
    owner: 'engineering',
    text: 'Es ist kein Zugangscode konfiguriert. Setzen Sie VITE_ADMIN_CODE in der Umgebung.',
  },
  'admin.login.securityNote': {
    owner: 'engineering',
    text: 'Dieser Codeschutz ist ein Platzhalter für den Pilot und kein produktiver Authentisierungsmechanismus.',
  },
  'admin.logout': { owner: 'product', text: 'Abmelden' },
  'admin.backToApp': { owner: 'product', text: 'Zur Teilnehmeransicht' },

  'admin.privacyNotice': {
    owner: 'privacy',
    text: 'Diese Ansicht zeigt keine Namen, keine Kontaktangaben, keine Geburtsdaten, keine Freitextnotizen und keine einzelnen Blutdruckzahlen.',
  },
  'admin.minGroupNotice': {
    owner: 'privacy',
    text: 'Zu wenige Daten für eine anonyme Auswertung. Angezeigt wird erst ab {min} Personen.',
  },
  'admin.dataSourceNote': {
    owner: 'engineering',
    text: 'Grundlage sind der lokale Datenbestand dieses Geräts und die eingelesenen Ergebnisberichte. Im Betrieb tritt an diese Stelle die serverseitige Pilotdatenbank.',
  },

  'admin.section.overview': { owner: 'product', text: 'Übersicht' },
  'admin.section.sessions': { owner: 'product', text: 'Einheiten' },
  'admin.section.questionnaire': { owner: 'product', text: 'Fragebogenauswertung' },
  'admin.section.usage': { owner: 'product', text: 'Nutzung' },
  'admin.section.export': { owner: 'product', text: 'Export' },
  'admin.section.filter': { owner: 'product', text: 'Filter' },

  'admin.metric.activatedIds': { owner: 'product', text: 'Aktivierte Pilot-IDs' },
  'admin.metric.onboardingStarted': { owner: 'product', text: 'Begonnene Onboardings' },
  'admin.metric.onboardingCompleted': { owner: 'product', text: 'Abgeschlossene Onboardings' },
  'admin.metric.programsStarted': { owner: 'product', text: 'Gestartete Programme' },
  'admin.metric.activeParticipants': { owner: 'product', text: 'Aktive Teilnehmende' },
  'admin.metric.programsCompleted': { owner: 'product', text: 'Abgeschlossene Programme' },
  'admin.metric.trainingLocked': { owner: 'medical', text: 'Zugänge mit gesperrter Trainingsfunktion' },
  'admin.metric.sessionsTotal': { owner: 'product', text: 'Absolvierte Einheiten gesamt' },
  'admin.metric.sessionsPerWeek': { owner: 'product', text: 'Einheiten pro Woche im Schnitt' },
  'admin.metric.completionSplit': { owner: 'product', text: 'Anteil vollständig, teilweise, nicht' },
  'admin.metric.lightVariant': { owner: 'product', text: 'Nutzung leichte Variante' },
  'admin.metric.standardVariant': { owner: 'product', text: 'Nutzung normale Variante' },
  'admin.metric.optionalTarget': { owner: 'product', text: 'Nutzung freiwilliges Zusatzziel' },
  'admin.metric.aboveRecommendation': {
    owner: 'product',
    text: 'Einheiten über der Wochenempfehlung',
  },
  'admin.metric.averageHold': { owner: 'product', text: 'Durchschnittlich erreichte Haltezeit' },
  'admin.metric.abortPoints': { owner: 'product', text: 'Häufigste Abbruchpunkte' },
  'admin.metric.learningUsage': { owner: 'product', text: 'Nutzung Learning-Bereich' },
  'admin.metric.learningCards': { owner: 'product', text: 'Geöffnete Lernkarten' },
  'admin.metric.notifications': { owner: 'product', text: 'Aktivierung von Erinnerungen' },
  'admin.metric.bpUsage': { owner: 'product', text: 'Nutzung Blutdrucktagebuch' },
  'admin.metric.bpEntries': { owner: 'product', text: 'Dokumentierte Blutdruckeinträge' },

  'admin.q.activityLevel': { owner: 'product', text: 'Aktivitätsniveau' },
  'admin.q.wallsitExperience': { owner: 'product', text: 'Wallsit-Erfahrung' },
  'admin.q.barriers': { owner: 'product', text: 'Häufigste Barrieren' },
  'admin.q.support': { owner: 'product', text: 'Bevorzugte Unterstützung' },
  'admin.q.trainingDays': { owner: 'product', text: 'Bevorzugte Trainingstage' },
  'admin.q.trainingTime': { owner: 'product', text: 'Bevorzugte Tageszeit' },
  'admin.q.confidence': { owner: 'product', text: 'Zuversicht beim Start' },
  'admin.q.exertion': { owner: 'product', text: 'Empfundene Belastung nach Einheiten' },
  'admin.q.wellbeing': { owner: 'product', text: 'Wohlbefinden nach Einheiten' },
  'admin.q.complaints': { owner: 'medical', text: 'Gemeldete Beschwerden' },

  'admin.filter.programWeek': { owner: 'product', text: 'Programmwoche' },
  'admin.filter.period': { owner: 'product', text: 'Kalenderzeitraum' },
  'admin.filter.participation': { owner: 'product', text: 'Teilnahme' },
  'admin.filter.participation.all': { owner: 'product', text: 'Alle' },
  'admin.filter.participation.active': { owner: 'product', text: 'Aktiv' },
  'admin.filter.participation.inactive': { owner: 'product', text: 'Inaktiv' },
  'admin.filter.variant': { owner: 'product', text: 'Trainingsvariante' },
  'admin.filter.all': { owner: 'product', text: 'Alle' },
  'admin.filter.from': { owner: 'product', text: 'Von' },
  'admin.filter.to': { owner: 'product', text: 'Bis' },
  'admin.filter.reset': { owner: 'product', text: 'Filter zurücksetzen' },

  'admin.import.title': { owner: 'privacy', text: 'Geteilte Ergebnisberichte einlesen' },
  'admin.import.text': {
    owner: 'privacy',
    text: 'Berichte, die Teilnehmende freiwillig geteilt haben, als JSON-Dateien auswählen. Mehrfachauswahl ist möglich. Teilt eine Pilotnummer mehrere Berichte, zählt der zuletzt eingelesene.',
  },
  'admin.import.action': { owner: 'privacy', text: 'Berichte auswählen' },
  'admin.import.retention': {
    owner: 'privacy',
    text: 'Eingelesene Berichte bleiben nur für diese Sitzung im Arbeitsspeicher und werden auf diesem Gerät nicht gespeichert.',
  },
  'admin.import.done': { owner: 'privacy', text: '{count} Bericht(e) eingelesen.' },
  'admin.import.replaced': { owner: 'privacy', text: 'Davon {count} als neuere Fassung ersetzt.' },
  'admin.import.rejected': {
    owner: 'privacy',
    text: '{count} Datei(en) konnten nicht gelesen werden und wurden übersprungen.',
  },
  'admin.import.clear': { owner: 'privacy', text: 'Eingelesene Berichte verwerfen' },
  'admin.import.count': { owner: 'privacy', text: 'Eingelesen: {count}' },

  'admin.export.title': { owner: 'privacy', text: 'CSV-Export anonymisierter Nutzungsdaten' },
  'admin.export.text': {
    owner: 'privacy',
    text: 'Der Standardexport enthält Pilot-ID, Programmwoche, pseudonymisierte Ereignisse, Trainingsvariante, Zielzeit, Haltezeit, Durchführung, Rückmeldungen, Lernkarten- und Erinnerungsnutzung sowie die Anzahl der Blutdruckeinträge. Er enthält keine Blutdruckzahlen.',
  },
  'admin.export.sessions': { owner: 'privacy', text: 'Einheiten als CSV' },
  'admin.export.events': { owner: 'privacy', text: 'Ereignisse als CSV' },
  'admin.export.rawNote': {
    owner: 'legal',
    text: 'Ein Export medizinisch sensibler Rohdaten ist im MVP bewusst nicht implementiert.',
  },

  'admin.empty': { owner: 'product', text: 'Für die aktuelle Auswahl liegen keine Daten vor.' },
  'admin.accessLogTitle': { owner: 'privacy', text: 'Protokoll administrativer Zugriffe' },
  'admin.accessLogNote': {
    owner: 'privacy',
    text: 'Lokal protokolliert werden Zeitpunkt und Aktion, ohne Personenbezug.',
  },
});
