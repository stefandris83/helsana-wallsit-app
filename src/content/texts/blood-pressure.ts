import { defineContent } from '../types';

/** Blutdrucktagebuch (§23). Reine Dokumentation, keine Auswertung. */
export const bloodPressureContent = defineContent({
  'bp.title': { owner: 'product', text: 'Blutdruck' },
  'bp.lead': {
    owner: 'medical',
    text: 'Ein freiwilliges Tagebuch für selbst gemessene Zahlen. Die App misst nichts und bewertet Ihre Zahlen nicht.',
  },
  'bp.separationNote': {
    owner: 'medical',
    text: 'Das Tagebuch ist vom Trainingsprogramm getrennt. Ihre Einträge beeinflussen Ihr Training nicht.',
  },
  'bp.medicalNote': {
    owner: 'medical',
    text: 'Die medizinische Bedeutung Ihrer Einträge besprechen Sie bitte mit einer medizinischen Fachperson.',
  },

  'bp.consent.title': { owner: 'privacy', text: 'Zusätzliche Einwilligung' },
  'bp.consent.text': {
    owner: 'privacy',
    text: 'Das Blutdrucktagebuch ist freiwillig und benötigt eine eigene Einwilligung. Für die Pilotauswertung werden Ihre Einträge an Helsana übermittelt: Datum, Uhrzeit und die Zahlen, verbunden mit Ihrer Pilotnummer. Ihre Notizen bleiben auf diesem Gerät und werden nicht übermittelt. Sie können das Tagebuch jederzeit deaktivieren; danach werden keine Werte mehr übermittelt.',
  },
  'bp.consent.checkbox': {
    owner: 'privacy',
    text: 'Ich möchte das freiwillige Blutdrucktagebuch nutzen und bin mit der Übermittlung meiner Einträge für die Pilotauswertung einverstanden.',
  },
  'bp.consent.activate': { owner: 'privacy', text: 'Tagebuch aktivieren' },
  'bp.consent.revoke': { owner: 'privacy', text: 'Tagebuch deaktivieren' },
  'bp.consent.revokeHint': {
    owner: 'privacy',
    text: 'Beim Deaktivieren bleiben bereits erfasste Einträge bestehen. Sie können sie einzeln oder gesammelt löschen.',
  },

  'bp.chart.title': { owner: 'medical', text: 'Ihre Werte im Zeitverlauf' },
  'bp.chart.lead': {
    owner: 'medical',
    text: 'Die Grafik zeigt die Zahlen, die Sie eingetragen haben, ohne weitere Einordnung.',
  },
  'bp.chart.systolic': { owner: 'medical', text: 'Systolisch' },
  'bp.chart.diastolic': { owner: 'medical', text: 'Diastolisch' },
  'bp.chart.columnDate': { owner: 'product', text: 'Datum' },
  'bp.chart.alt': {
    owner: 'medical',
    text: 'Verlauf von {count} Blutdruckeinträgen, systolisch und diastolisch in mmHg',
  },
  'bp.chart.tooFew': {
    owner: 'product',
    text: 'Ab zwei Einträgen sehen Sie hier den Verlauf Ihrer Werte.',
  },

  'bp.list.title': { owner: 'product', text: 'Ihre Einträge' },
  'bp.list.empty': { owner: 'product', text: 'Noch keine Einträge vorhanden.' },
  'bp.list.count': { owner: 'product', text: '{count} Einträge' },
  'bp.list.add': { owner: 'product', text: 'Eintrag hinzufügen' },

  'bp.form.title.create': { owner: 'product', text: 'Neuer Eintrag' },
  'bp.form.title.edit': { owner: 'product', text: 'Eintrag bearbeiten' },
  'bp.form.date': { owner: 'product', text: 'Datum' },
  'bp.form.time': { owner: 'product', text: 'Uhrzeit' },
  'bp.form.systolic': { owner: 'product', text: 'Systolisch (oberer Wert)' },
  'bp.form.diastolic': { owner: 'product', text: 'Diastolisch (unterer Wert)' },
  'bp.form.pulse': { owner: 'product', text: 'Puls' },
  'bp.form.note': { owner: 'product', text: 'Persönliche Notiz' },
  'bp.form.noteHint': {
    owner: 'privacy',
    text: 'Die Notiz bleibt auf diesem Gerät und erscheint nie in einer Auswertung.',
  },
  'bp.form.daypart': { owner: 'product', text: 'Zeitpunkt' },
  'bp.form.daypart.morning': { owner: 'product', text: 'Morgens' },
  'bp.form.daypart.evening': { owner: 'product', text: 'Abends' },
  'bp.form.unitMmhg': { owner: 'product', text: 'mmHg' },
  'bp.form.unitBpm': { owner: 'product', text: 'pro Minute' },
  'bp.form.save': { owner: 'product', text: 'Eintrag speichern' },
  'bp.form.saved': { owner: 'product', text: 'Eintrag gespeichert.' },
  'bp.form.updated': { owner: 'product', text: 'Eintrag aktualisiert.' },

  'bp.form.error.systolic': {
    owner: 'product',
    text: 'Bitte tragen Sie den oberen Messwert als Zahl zwischen 50 und 300 ein.',
  },
  'bp.form.error.diastolic': {
    owner: 'product',
    text: 'Bitte tragen Sie den unteren Messwert als Zahl zwischen 30 und 200 ein.',
  },
  'bp.form.error.order': {
    owner: 'product',
    text: 'Der obere Messwert muss grösser sein als der untere. Bitte prüfen Sie Ihre Eingabe.',
  },
  'bp.form.error.pulse': {
    owner: 'product',
    text: 'Bitte tragen Sie den Puls als Zahl zwischen 20 und 250 ein oder lassen Sie das Feld leer.',
  },
  'bp.form.error.date': { owner: 'product', text: 'Bitte wählen Sie ein gültiges Datum.' },
  'bp.form.error.time': { owner: 'product', text: 'Bitte wählen Sie eine gültige Uhrzeit.' },

  'bp.duplicate.title': { owner: 'product', text: 'Ähnlicher Eintrag vorhanden' },
  'bp.duplicate.text': {
    owner: 'product',
    text: 'Für diesen Zeitpunkt existiert bereits ein Eintrag mit denselben Zahlen. Möchten Sie ihn trotzdem zusätzlich speichern?',
  },
  'bp.duplicate.saveAnyway': { owner: 'product', text: 'Trotzdem speichern' },
  'bp.duplicate.discard': { owner: 'product', text: 'Verwerfen' },

  'bp.delete.title': { owner: 'product', text: 'Eintrag löschen?' },
  'bp.delete.text': { owner: 'product', text: 'Der Eintrag wird von diesem Gerät entfernt.' },
  'bp.delete.confirm': { owner: 'product', text: 'Eintrag löschen' },
  'bp.deleted': { owner: 'product', text: 'Eintrag gelöscht.' },

  'bp.export.title': { owner: 'privacy', text: 'Eigene Rohdaten exportieren' },
  'bp.export.text': {
    owner: 'privacy',
    text: 'Sie erhalten Ihre Einträge unverändert als CSV-Datei. Der Pilotexport von Helsana enthält davon ausschliesslich die Anzahl.',
  },
  'bp.export.action': { owner: 'privacy', text: 'CSV herunterladen' },

  'bp.reminder.title': { owner: 'product', text: 'Erinnerung an die Messung' },
  'bp.reminder.text': {
    owner: 'medical',
    text: 'Wählen Sie für Ihre Messung eine ruhige Zeit ausserhalb des Trainings.',
  },
  'bp.reminder.enable': { owner: 'product', text: 'Erinnerung an die Messung' },
  'bp.reminder.morning': { owner: 'product', text: 'Uhrzeit morgens' },
  'bp.reminder.evening': { owner: 'product', text: 'Uhrzeit abends' },
  'bp.reminder.overlapHint': {
    owner: 'product',
    text: 'Diese Zeit liegt nahe an Ihrem geplanten Training. Wählen Sie am besten eine ruhigere Zeit.',
  },
  'bp.infoLink': { owner: 'medical', text: 'Hinweise zur Messung ansehen' },
});
