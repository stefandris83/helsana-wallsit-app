import { defineContent } from '../types';

/** Einstellungen (§25) und Datenschutzfunktionen (§30). */
export const settingsContent = defineContent({
  'settings.title': { owner: 'product', text: 'Einstellungen' },
  'settings.section.program': { owner: 'product', text: 'Programm' },
  'settings.section.reminders': { owner: 'product', text: 'Erinnerungen' },
  'settings.section.profile': { owner: 'product', text: 'Profil' },
  'settings.section.privacy': { owner: 'privacy', text: 'Daten und Einwilligungen' },
  'settings.section.info': { owner: 'legal', text: 'Information' },
  'settings.section.appearance': { owner: 'product', text: 'Darstellung' },

  'settings.trainingDays': { owner: 'product', text: 'Trainingstage ändern' },
  'settings.trainingTime': { owner: 'product', text: 'Trainingszeit ändern' },
  'settings.planSaved': { owner: 'product', text: 'Änderungen gespeichert.' },
  'settings.planChangeNote': {
    owner: 'product',
    text: 'Ihre Programmwoche und Ihr bisheriger Fortschritt bleiben unverändert.',
  },

  'settings.reminders.training': { owner: 'product', text: 'Erinnerung an das Training' },
  'settings.reminders.trainingTime': { owner: 'product', text: 'Uhrzeit der Erinnerung' },
  'settings.reminders.bp': { owner: 'product', text: 'Erinnerung an die Blutdruckmessung' },
  'settings.reminders.systemToggle': { owner: 'privacy', text: 'Systembenachrichtigungen' },
  'settings.reminders.disabledAll': { owner: 'product', text: 'Erinnerungen sind ausgeschaltet.' },

  'settings.profile.edit': { owner: 'product', text: 'Profilangaben bearbeiten' },
  'settings.appearance.mode': { owner: 'product', text: 'Farbmodus' },
  'settings.appearance.system': { owner: 'product', text: 'Systemeinstellung' },
  'settings.appearance.light': { owner: 'product', text: 'Hell' },
  'settings.appearance.dark': { owner: 'product', text: 'Dunkel' },

  'settings.consents.title': { owner: 'privacy', text: 'Einwilligungen ansehen' },
  'settings.consents.givenAt': { owner: 'privacy', text: 'Erteilt am {date}' },
  'settings.consents.bpTitle': { owner: 'privacy', text: 'Blutdrucktagebuch' },
  'settings.consents.bpActive': { owner: 'privacy', text: 'Aktiv' },
  'settings.consents.bpInactive': { owner: 'privacy', text: 'Nicht aktiv' },

  'settings.export.title': { owner: 'privacy', text: 'Eigene Daten exportieren' },
  'settings.export.text': {
    owner: 'privacy',
    text: 'Sie erhalten Ihre auf diesem Gerät gespeicherten Daten als JSON-Datei.',
  },
  'settings.export.action': { owner: 'privacy', text: 'Daten herunterladen' },


  'settings.deleteBp.title': { owner: 'privacy', text: 'Blutdruckeinträge löschen' },
  'settings.deleteBp.text': {
    owner: 'privacy',
    text: 'Alle Einträge des Blutdrucktagebuchs werden von diesem Gerät entfernt. Ihr Trainingsfortschritt bleibt bestehen.',
  },
  'settings.deleteBp.action': { owner: 'privacy', text: 'Alle Blutdruckeinträge löschen' },
  'settings.deleteBp.done': { owner: 'privacy', text: 'Alle Blutdruckeinträge wurden gelöscht.' },

  'settings.deleteAll.title': { owner: 'privacy', text: 'Zugang und alle Daten löschen' },
  'settings.deleteAll.text': {
    owner: 'privacy',
    text: 'Damit werden Ihr Zugang, Ihr Profil, Ihr Trainingsfortschritt, das Ereignisprotokoll und Ihr Blutdrucktagebuch unwiderruflich von diesem Gerät entfernt.',
  },
  'settings.deleteAll.action': { owner: 'privacy', text: 'Alles löschen' },
  'settings.deleteAll.confirmLabel': {
    owner: 'privacy',
    text: 'Ja, ich möchte alle Daten unwiderruflich löschen.',
  },
  'settings.deleteAll.done': { owner: 'privacy', text: 'Alle Daten wurden von diesem Gerät entfernt.' },

  'settings.reopenWelcome': { owner: 'product', text: 'Willkommen erneut ansehen' },
  'settings.reopenInstruction': { owner: 'medical', text: 'Sicherheitsinformationen ansehen' },
  'settings.privacyPolicy': { owner: 'legal', text: 'Datenschutzerklärung' },
  'settings.imprint': { owner: 'legal', text: 'Impressum' },

  'legal.privacyPolicy.title': { owner: 'privacy', text: 'Datenschutzerklärung' },
  'legal.privacyPolicy.text': {
    owner: 'privacy',
    text: 'Diese Pilotversion speichert alle Angaben auf Ihrem Gerät. Für die Pilotauswertung wird Ihr Stand laufend an Helsana übermittelt: nach jeder Trainingseinheit und nach jedem Eintrag im Blutdrucktagebuch. Übermittelt werden Ihre Trainingseinheiten, Ihre Antworten aus dem Startfragebogen sowie — sofern Sie das Tagebuch nutzen — Ihre Blutdruckeinträge mit Datum, Uhrzeit und Zahlen, jeweils verbunden mit Ihrer Pilotnummer. Nicht übermittelt werden Ihr Name, Ihre Kontaktangaben, Ihre Grösse, Ihr Gewicht, Ihr Geburtsjahr und Ihre Notizen. Die Daten liegen auf einem Server in der Schweiz und sind nur dem Projektteam zugänglich. Das Anleitungsvideo wird beim Öffnen der Anleitung von einem externen Anbieter geladen. Dieser Anbieter erhält dabei Ihre IP-Adresse und technische Angaben zu Ihrem Gerät und Browser. Er setzt keine Cookies und erhält keine Ihrer Trainings-, Fragebogen- oder Blutdruckdaten. Sie können Ihre Daten jederzeit exportieren und löschen; für die bereits übermittelten Daten wenden Sie sich an das Projektteam. Verantwortlich für die Pilotdurchführung ist das Projektteam von Helsana.',
  },
  'legal.imprint.title': { owner: 'legal', text: 'Impressum' },
  'legal.imprint.text': {
    owner: 'legal',
    text: 'Helsana Versicherungen AG, Zürich. Diese Anwendung ist eine interne Pilotversion und nicht öffentlich verfügbar.',
  },

  'settings.demo.title': { owner: 'product', text: 'Demodaten' },
  'settings.demo.text': {
    owner: 'product',
    text: 'Synthetische Beispieldaten für Vorführungen. Sie enthalten keine echten Personendaten.',
  },
  'settings.demo.load': { owner: 'product', text: 'Demodaten laden' },
  'settings.demo.loaded': { owner: 'product', text: 'Demodaten geladen und sichtbar gekennzeichnet.' },
  'settings.demo.remove': { owner: 'product', text: 'Demodaten entfernen' },
  'settings.demo.warning': {
    owner: 'product',
    text: 'Beim Laden werden Ihre aktuellen Daten auf diesem Gerät ersetzt.',
  },
});
