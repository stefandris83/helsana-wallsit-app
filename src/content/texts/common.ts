import { defineContent } from '../types';

export const commonContent = defineContent({
  'app.subtitle': { owner: 'marketing', text: 'Helsana Pilot' },
  'app.logoAlt': { owner: 'marketing', text: 'Helsana' },

  'nav.today': { owner: 'product', text: 'Heute' },
  'nav.progress': { owner: 'product', text: 'Fortschritt' },
  'nav.learning': { owner: 'product', text: 'Lernen' },
  'nav.bloodPressure': { owner: 'product', text: 'Blutdruck' },
  'nav.settings': { owner: 'product', text: 'Einstellungen' },
  'nav.mainLabel': { owner: 'product', text: 'Hauptnavigation' },
  'nav.skipToContent': { owner: 'product', text: 'Direkt zum Inhalt' },

  'action.continue': { owner: 'product', text: 'Weiter' },
  'action.back': { owner: 'product', text: 'Zurück' },
  'action.save': { owner: 'product', text: 'Speichern' },
  'action.cancel': { owner: 'product', text: 'Abbrechen' },
  'action.close': { owner: 'product', text: 'Schliessen' },
  'action.delete': { owner: 'product', text: 'Löschen' },
  'action.edit': { owner: 'product', text: 'Bearbeiten' },
  'action.confirm': { owner: 'product', text: 'Bestätigen' },
  'action.openSettings': { owner: 'product', text: 'Einstellungen öffnen' },

  'common.optionalHint': { owner: 'legal', text: 'Diese Angabe ist freiwillig.' },
  'common.required': { owner: 'product', text: 'Pflichtfeld' },
  'common.yes': { owner: 'product', text: 'Ja' },
  'common.no': { owner: 'product', text: 'Nein' },
  'common.noAnswer': { owner: 'product', text: 'Keine Angabe' },
  'common.demoBadge': { owner: 'product', text: 'Demodaten' },

  'common.weekday.mon': { owner: 'product', text: 'Montag' },
  'common.weekday.tue': { owner: 'product', text: 'Dienstag' },
  'common.weekday.wed': { owner: 'product', text: 'Mittwoch' },
  'common.weekday.thu': { owner: 'product', text: 'Donnerstag' },
  'common.weekday.fri': { owner: 'product', text: 'Freitag' },
  'common.weekday.sat': { owner: 'product', text: 'Samstag' },
  'common.weekday.sun': { owner: 'product', text: 'Sonntag' },
  'common.weekday.mon.short': { owner: 'product', text: 'Mo' },
  'common.weekday.tue.short': { owner: 'product', text: 'Di' },
  'common.weekday.wed.short': { owner: 'product', text: 'Mi' },
  'common.weekday.thu.short': { owner: 'product', text: 'Do' },
  'common.weekday.fri.short': { owner: 'product', text: 'Fr' },
  'common.weekday.sat.short': { owner: 'product', text: 'Sa' },
  'common.weekday.sun.short': { owner: 'product', text: 'So' },

  'common.daytime.morning': { owner: 'product', text: 'Morgens' },
  'common.daytime.midday': { owner: 'product', text: 'Mittags' },
  'common.daytime.evening': { owner: 'product', text: 'Abends' },
  'common.daytime.varies': { owner: 'product', text: 'Unterschiedlich' },

  'common.variant.light': { owner: 'product', text: 'Leichte Variante' },
  'common.variant.standard': { owner: 'product', text: 'Normale Variante' },

  'common.seconds': { owner: 'product', text: 'Sekunden' },
  'common.secondsShort': { owner: 'product', text: 's' },
});
