import { defineContent } from '../types';

/**
 * Erinnerungstexte (§24). Enthalten nie Messwerte und nie medizinische Aussagen.
 * Zustellung erfolgt lokal als In-App-Hinweis; die Systembenachrichtigung des
 * Browsers wird ausschliesslich nach ausdruecklicher Zustimmung verwendet (B.13.2).
 */
export const notificationContent = defineContent({
  'notification.training.title': { owner: 'marketing', text: 'Wandsitz-Programm' },
  'notification.training.planned': {
    owner: 'marketing',
    text: 'Heute ist eine Ihrer drei geplanten Einheiten.',
  },
  'notification.training.ready': {
    owner: 'marketing',
    text: 'Ihre nächste Wandsitz-Einheit ist bereit.',
  },
  'notification.training.light': {
    owner: 'marketing',
    text: 'Heute leicht einsteigen? Auch das Zwischenziel zählt.',
  },
  'notification.training.repeat': {
    owner: 'marketing',
    text: 'Ihre Einheit von heute ist noch offen.',
  },
  'notification.bp.due': {
    owner: 'medical',
    text: 'Zeit für Ihre freiwillige Blutdruckdokumentation.',
  },
  'notification.bp.calm': {
    owner: 'medical',
    text: 'Nehmen Sie sich vor der Messung einige ruhige Minuten.',
  },
  'notification.inAppTitle': { owner: 'product', text: 'Erinnerung' },
  'notification.dismiss': { owner: 'product', text: 'Verstanden' },
  'notification.quietHoursNote': {
    owner: 'product',
    text: 'Zwischen 22:00 und 07:00 Uhr erscheinen keine Erinnerungen.',
  },
  'notification.permissionRequest': {
    owner: 'privacy',
    text: 'Systembenachrichtigungen erlauben',
  },
  'notification.permissionExplainer': {
    owner: 'privacy',
    text: 'Zusätzlich zu den Hinweisen in der App kann Ihr Browser Sie erinnern. Das aktivieren wir nur, wenn Sie hier zustimmen.',
  },
  'notification.permissionDenied': {
    owner: 'privacy',
    text: 'Ihr Browser erlaubt keine Benachrichtigungen. Die Erinnerungen erscheinen weiterhin in der App.',
  },
  'notification.permissionUnsupported': {
    owner: 'privacy',
    text: 'Dieser Browser unterstützt keine Systembenachrichtigungen. Die Erinnerungen erscheinen in der App.',
  },
});
