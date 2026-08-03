import { defineContent } from '../types';

/** Fehler- und Sonderfaelle (§29). */
export const errorContent = defineContent({
  'error.generic.title': { owner: 'product', text: 'Da ist etwas schiefgelaufen' },
  'error.generic.text': {
    owner: 'product',
    text: 'Bitte laden Sie die Seite neu. Ihre gespeicherten Daten bleiben erhalten.',
  },
  'error.generic.reload': { owner: 'product', text: 'Seite neu laden' },

  'error.offline.title': { owner: 'product', text: 'Keine Verbindung' },
  'error.offline.text': {
    owner: 'product',
    text: 'Die App funktioniert vollständig ohne Internetverbindung. Nur optionale Medien wie das Anleitungsvideo sind gerade nicht verfügbar.',
  },

  'error.storage.title': { owner: 'engineering', text: 'Speichern nicht möglich' },
  'error.storage.text': {
    owner: 'engineering',
    text: 'Ihr Browser lässt das Speichern gerade nicht zu, zum Beispiel im privaten Modus. Ihre Eingaben gehen beim Schliessen des Fensters verloren.',
  },

  'error.notFound.title': { owner: 'product', text: 'Seite nicht gefunden' },
  'error.notFound.text': { owner: 'product', text: 'Diese Seite gibt es nicht.' },
  'error.notFound.action': { owner: 'product', text: 'Zurück zu Heute' },

  'error.trainingLocked.title': { owner: 'medical', text: 'Training noch nicht freigeschaltet' },
  'error.trainingLocked.text': {
    owner: 'medical',
    text: 'Bestätigen Sie zuerst, dass Sie die Teilnahme abgeklärt haben.',
  },

  'error.onboardingIncomplete.title': { owner: 'product', text: 'Onboarding noch offen' },
  'error.onboardingIncomplete.text': {
    owner: 'product',
    text: 'Ihr bisheriger Stand ist gespeichert. Setzen Sie das Onboarding dort fort, wo Sie aufgehört haben.',
  },
  'error.onboardingIncomplete.action': { owner: 'product', text: 'Onboarding fortsetzen' },

  'error.bpConsentMissing.title': { owner: 'privacy', text: 'Tagebuch noch nicht aktiviert' },
  'error.bpConsentMissing.text': {
    owner: 'privacy',
    text: 'Für das freiwillige Blutdrucktagebuch braucht es eine eigene Einwilligung.',
  },

  'error.noSession.title': { owner: 'product', text: 'Keine laufende Einheit' },
  'error.noSession.text': {
    owner: 'product',
    text: 'Starten Sie eine Einheit über den Check-in.',
  },
});
