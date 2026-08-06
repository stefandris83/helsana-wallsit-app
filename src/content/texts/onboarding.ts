import { defineContent } from '../types';

/** Zugang (§8), Einwilligung (§9), Willkommens-Carousel (§10). */
export const onboardingAccessContent = defineContent({
  'access.title': { owner: 'product', text: 'Willkommen beim Wandsitz-Pilot' },
  'access.lead': {
    owner: 'product',
    text: 'Geben Sie den Einladungscode ein, den Sie von Helsana erhalten haben.',
  },
  'access.codeLabel': { owner: 'product', text: 'Einladungscode' },
  'access.codePlaceholder': { owner: 'product', text: 'z. B. WS-2026-A1B2' },
  'access.submit': { owner: 'product', text: 'Code einlösen' },
  'access.invalid': {
    owner: 'product',
    text: 'Dieser Code ist nicht gültig. Bitte prüfen Sie Ihre Eingabe.',
  },
  'access.privacyNote': {
    owner: 'privacy',
    text: 'Der Code ist anonym. Ihr Name wird in dieser App nicht erfasst.',
  },
  'access.demoHint': {
    owner: 'product',
    text: 'Für den Test steht der synthetische Code WS-2026-A1B2 zur Verfügung.',
  },

  'consent.title': { owner: 'legal', text: 'Bevor es losgeht' },
  'consent.lead': {
    owner: 'legal',
    text: 'Bitte bestätigen Sie die folgenden Punkte. Ohne Bestätigung können Sie das Programm nicht starten.',
  },
  'consent.item.voluntary': {
    owner: 'legal',
    text: 'Ich nehme freiwillig am Pilot teil und kann jederzeit aufhören.',
  },
  'consent.item.privacy': {
    owner: 'privacy',
    text: 'Ich habe die Datenschutzinformationen zur Kenntnis genommen.',
  },
  'consent.item.noMedicalAdvice': {
    owner: 'medical',
    text: 'Ich habe zur Kenntnis genommen, dass die App keine medizinische Untersuchung, Behandlung oder Beratung ersetzt.',
  },
  'consent.item.analytics': {
    owner: 'privacy',
    text: 'Ich bin mit der anonymisierten Auswertung meiner App-Nutzung einverstanden.',
  },
  'consent.item.profile': {
    owner: 'privacy',
    text: 'Ich bin mit der Speicherung der von mir freiwillig eingegebenen Profildaten einverstanden.',
  },
  'consent.privacyText': {
    owner: 'privacy',
    text: 'Ihre Angaben werden auf diesem Gerät gespeichert und für die Pilotauswertung laufend an Helsana übermittelt: nach jeder Trainingseinheit und nach jedem Eintrag. Übermittelt werden Ihre Nutzungsdaten mit Ihrer Pilotnummer, ohne Namen und ohne Kontaktangaben.',
  },
  'consent.submit': { owner: 'legal', text: 'Bestätigen und weiter' },
  'consent.incomplete': {
    owner: 'legal',
    text: 'Bitte bestätigen Sie alle fünf Punkte, um fortzufahren.',
  },

  'welcome.progressLabel': { owner: 'product', text: '{current} von {total}' },
  'welcome.card1.title': {
    owner: 'marketing',
    text: 'Willkommen zu Ihrem 12-Wochen-Wandsitz-Programm',
  },
  'welcome.card1.text': {
    owner: 'marketing',
    text: 'Mit kurzen Wandsitz-Einheiten bauen Sie Schritt für Schritt eine regelmässige Bewegungsroutine auf. Das Programm unterstützt Sie dabei, mehr Bewegung in Ihren Alltag zu integrieren.',
  },
  'welcome.card1.visualAlt': {
    owner: 'marketing',
    text: 'Illustration: eine Frau und ein Mann in der Wandsitz-Position, Rücken flach an der Wand, Knie etwa rechtwinklig gebeugt.',
  },
  'welcome.card2.title': { owner: 'marketing', text: 'Dreimal pro Woche' },
  'welcome.card2.text': {
    owner: 'marketing',
    text: 'Sie führen den Wandsitz dreimal pro Woche durch. Sie wählen Ihre Trainingstage, und die App erledigt den Rest.',
  },
  'welcome.card2.visualAlt': {
    owner: 'marketing',
    text: 'Illustration: Wochenübersicht von Montag bis Sonntag mit drei markierten Trainingstagen.',
  },
  'welcome.card3.title': { owner: 'marketing', text: 'Sie haben die Wahl' },
  'welcome.card3.text': {
    owner: 'marketing',
    text: 'Sie können jederzeit zwischen einer leichten und der normalen Variante wählen – leichte Variante bedeutet kürzere Haltezeit, normale Variante bedeutet die volle Trainingszeit.',
  },
  'welcome.card3.visualAlt': {
    owner: 'marketing',
    text: 'Illustration: zwei Karten nebeneinander für die leichte und die normale Variante, dazwischen ein Pfeil zum Wechseln.',
  },
  'welcome.card4.title': { owner: 'medical', text: 'Ihre Gesundheit geht vor' },
  'welcome.card4.text': {
    owner: 'medical',
    text: 'Das Programm ersetzt keine medizinische Beratung. Trainieren Sie nicht bei Beschwerden oder Unsicherheit und lassen Sie die Teilnahme bei Bedarf medizinisch abklären.',
  },
  'welcome.card4.visualAlt': {
    owner: 'medical',
    text: 'Illustration: ein Schutzschild mit Ausrufezeichen als Hinweis auf einen sicheren Start.',
  },
  'welcome.finish': { owner: 'marketing', text: 'Programm einrichten' },
  'welcome.next': { owner: 'product', text: 'Weiter' },
  'welcome.previous': { owner: 'product', text: 'Zurück' },
  'welcome.goToCard': { owner: 'product', text: 'Zu Karte {index}' },
});

/** Profil (§11). */
export const onboardingProfileContent = defineContent({
  'profile.title': { owner: 'product', text: 'Ihr Profil' },
  'profile.lead': {
    owner: 'privacy',
    text: 'Diese Angaben dienen ausschliesslich der Pilotauswertung und der Auswahl allgemeiner Lerninhalte.',
  },
  'profile.noEvaluationNote': {
    owner: 'medical',
    text: 'Die App nimmt keine gesundheitliche Einschätzung Ihrer Angaben vor.',
  },
  'profile.birthYear': { owner: 'product', text: 'Geburtsjahr' },
  'profile.heightCm': { owner: 'product', text: 'Körpergrösse in Zentimetern' },
  'profile.weightKg': { owner: 'product', text: 'Gewicht in Kilogramm' },
  'profile.sex': { owner: 'product', text: 'Geschlecht' },
  'profile.sex.placeholder': { owner: 'product', text: 'Bitte wählen' },
  'profile.sexHint': {
    owner: 'product',
    text: 'Wird ausschliesslich für die Auswahl der Übungsillustration und für die Pilotauswertung verwendet.',
  },
  'profile.sex.female': { owner: 'product', text: 'Weiblich' },
  'profile.sex.male': { owner: 'product', text: 'Männlich' },
  'profile.sex.diverse': { owner: 'product', text: 'Divers' },
  'profile.waistCm': { owner: 'product', text: 'Taillenumfang in Zentimetern' },
  'profile.dailyActivity': { owner: 'product', text: 'Tätigkeit im Alltag' },
  'profile.dailyActivity.sitting': { owner: 'product', text: 'Hauptsächlich sitzend' },
  'profile.dailyActivity.mixed': { owner: 'product', text: 'Gemischt' },
  'profile.dailyActivity.active': { owner: 'product', text: 'Hauptsächlich körperlich aktiv' },
  'profile.error.birthYear': {
    owner: 'product',
    text: 'Bitte geben Sie ein Geburtsjahr zwischen 1900 und heute an.',
  },
  'profile.error.heightCm': {
    owner: 'product',
    text: 'Bitte geben Sie eine Körpergrösse zwischen 100 und 250 Zentimetern an.',
  },
  'profile.error.weightKg': {
    owner: 'product',
    text: 'Bitte geben Sie ein Gewicht zwischen 30 und 300 Kilogramm an.',
  },
  'profile.error.sex': {
    owner: 'product',
    text: 'Bitte wählen Sie eine der Angaben aus.',
  },
  'profile.error.waistCm': {
    owner: 'product',
    text: 'Bitte geben Sie einen Taillenumfang zwischen 40 und 200 Zentimetern an oder lassen Sie das Feld leer.',
  },
  'profile.saved': { owner: 'product', text: 'Profil gespeichert.' },
});

/** Startfragebogen (§12) und Sicherheitsbestätigung. */
export const onboardingQuestionnaireContent = defineContent({
  'questionnaire.title': { owner: 'product', text: 'Ihr Start' },
  'questionnaire.lead': {
    owner: 'product',
    text: 'Neun kurze Fragen in vier Schritten. Damit richten wir Ihren Wochenplan ein.',
  },
  'questionnaire.stepLabel': { owner: 'product', text: 'Schritt {current} von {total}' },

  'questionnaire.section.basics': { owner: 'product', text: 'Ihre Ausgangslage' },
  'questionnaire.section.schedule': { owner: 'product', text: 'Ihr Wochenplan' },
  'questionnaire.section.support': { owner: 'product', text: 'Motivation und Unterstützung' },
  'questionnaire.section.reminders': { owner: 'product', text: 'Erinnerungen' },

  'questionnaire.q1.title': { owner: 'product', text: 'Wie aktiv sind Sie aktuell?' },
  'questionnaire.q1.rarely': { owner: 'product', text: 'Fast nie aktiv' },
  'questionnaire.q1.oneToTwo': { owner: 'product', text: 'Ein- bis zweimal pro Woche aktiv' },
  'questionnaire.q1.threeToFour': { owner: 'product', text: 'Drei- bis viermal pro Woche aktiv' },
  'questionnaire.q1.fivePlus': {
    owner: 'product',
    text: 'Fünfmal oder häufiger pro Woche aktiv',
  },

  'questionnaire.q2.title': {
    owner: 'product',
    text: 'Haben Sie bereits Erfahrung mit Wandsitzen?',
  },
  'questionnaire.q2.never': { owner: 'product', text: 'Noch nie' },
  'questionnaire.q2.tried': { owner: 'product', text: 'Schon einmal ausprobiert' },
  'questionnaire.q2.regular': { owner: 'product', text: 'Bereits regelmässig durchgeführt' },

  'questionnaire.q3.title': {
    owner: 'medical',
    text: 'Haben Sie aktuell Beschwerden an Knien, Hüften oder Rücken, die einen Wandsitz erschweren könnten?',
  },
  'questionnaire.q3.none': { owner: 'medical', text: 'Nein' },
  'questionnaire.q3.mild': { owner: 'medical', text: 'Leichte Beschwerden' },
  'questionnaire.q3.strong': { owner: 'medical', text: 'Deutliche Beschwerden' },
  'questionnaire.q3.unsure': { owner: 'medical', text: 'Unsicher' },
  'questionnaire.q3.clarifyNotice': {
    owner: 'medical',
    text: 'Bitte klären Sie vor dem Start mit einer medizinischen Fachperson ab, ob die Übung für Sie geeignet ist.',
  },

  'questionnaire.q4.title': {
    owner: 'product',
    text: 'An welchen drei Tagen möchten Sie normalerweise trainieren?',
  },
  'questionnaire.q4.hint': {
    owner: 'product',
    text: 'Empfohlen sind Montag, Mittwoch und Freitag. Zwischen zwei Trainingstagen liegt idealerweise ein freier Tag.',
  },
  'questionnaire.q4.error': { owner: 'product', text: 'Bitte wählen Sie genau drei Tage.' },
  'questionnaire.q4.spacingHint': {
    owner: 'product',
    text: 'Ihre Auswahl enthält zwei Trainingstage direkt hintereinander. Das ist möglich, ein freier Tag dazwischen ist aber angenehmer.',
  },

  'questionnaire.q5.title': {
    owner: 'product',
    text: 'Wann möchten Sie normalerweise trainieren?',
  },
  'questionnaire.q5.preciseToggle': {
    owner: 'product',
    text: 'Genaue Uhrzeit pro Trainingstag wählen',
  },

  'questionnaire.q6.title': {
    owner: 'product',
    text: 'Was fällt Ihnen bei regelmässiger Bewegung am schwersten?',
  },
  'questionnaire.q6.hint': { owner: 'product', text: 'Maximal zwei Antworten.' },
  'questionnaire.q6.time': { owner: 'product', text: 'Ich habe zu wenig Zeit' },
  'questionnaire.q6.forget': { owner: 'product', text: 'Ich vergesse es häufig' },
  'questionnaire.q6.motivation': { owner: 'product', text: 'Mir fehlt oft die Motivation' },
  'questionnaire.q6.tired': { owner: 'product', text: 'Ich bin häufig müde oder gestresst' },
  'questionnaire.q6.physical': { owner: 'product', text: 'Ich habe körperliche Beschwerden' },
  'questionnaire.q6.howToStart': {
    owner: 'product',
    text: 'Ich weiss nicht genau, wie ich beginnen soll',
  },

  'questionnaire.q7.title': {
    owner: 'product',
    text: 'Was hilft Ihnen am meisten, das Programm durchzuziehen?',
  },
  'questionnaire.q7.feedback': { owner: 'product', text: 'Motivierende Rückmeldungen' },
  'questionnaire.q7.plan': { owner: 'product', text: 'Ein klarer Plan' },
  'questionnaire.q7.reminders': { owner: 'product', text: 'Erinnerungen und Struktur' },
  'questionnaire.q7.knowledge': { owner: 'product', text: 'Kurze Gesundheitsinformationen' },
  'questionnaire.q7.progress': { owner: 'product', text: 'Sichtbarer Fortschritt' },

  'questionnaire.q8.title': {
    owner: 'product',
    text: 'Wie sicher sind Sie, dass Sie das zwölfwöchige Programm durchführen können?',
  },
  'questionnaire.q8.low': { owner: 'product', text: '1 – sehr unsicher' },
  'questionnaire.q8.high': { owner: 'product', text: '10 – sehr sicher' },
  'questionnaire.q8.hint': {
    owner: 'medical',
    text: 'Ihre Antwort beeinflusst nur, welche Hinweise die App Ihnen zeigt.',
  },

  'questionnaire.q9.title': {
    owner: 'product',
    text: 'Möchten Sie an Ihre geplanten Einheiten erinnert werden?',
  },
  'questionnaire.q9.timeLabel': { owner: 'product', text: 'Gewünschte Uhrzeit' },
  'questionnaire.q9.permissionHint': {
    owner: 'privacy',
    text: 'Systembenachrichtigungen aktivieren wir erst, wenn Sie in den Einstellungen ausdrücklich zustimmen.',
  },

  'safety.title': { owner: 'medical', text: 'Teilnahme abklären' },
  'safety.text': {
    owner: 'medical',
    text: 'Sie haben angegeben, dass Beschwerden bestehen oder dass Sie unsicher sind. Ihr Onboarding ist gespeichert. Die Trainingsfunktion bleibt gesperrt, bis Sie die Teilnahme abgeklärt und dies hier bestätigt haben.',
  },
  'safety.confirmLabel': { owner: 'medical', text: 'Ich habe die Teilnahme abgeklärt' },
  'safety.confirmButton': { owner: 'medical', text: 'Bestätigen und Training freischalten' },
  'safety.lockedBadge': { owner: 'medical', text: 'Training noch gesperrt' },
  'safety.lockedHint': {
    owner: 'medical',
    text: 'Sie können die App weiterhin nutzen. Das Training starten Sie, sobald Sie die Abklärung bestätigt haben.',
  },
  'safety.unlocked': { owner: 'medical', text: 'Training freigeschaltet.' },
  'safety.reviewPending': {
    owner: 'legal',
    text: 'Diese Logik ist vor dem Kundeneinsatz durch Medical und Regulatory zu bestätigen.',
  },
});

/** Wochenplan (§14). */
export const onboardingPlanContent = defineContent({
  'plan.title': { owner: 'product', text: 'Ihr Wochenplan' },
  'plan.lead': {
    owner: 'product',
    text: 'Drei Einheiten pro Woche, zwölf Wochen lang. Sie können die Tage jederzeit in den Einstellungen ändern.',
  },
  'plan.daysLabel': { owner: 'product', text: 'Ihre Trainingstage' },
  'plan.timeLabel': { owner: 'product', text: 'Ihre bevorzugte Tageszeit' },
  'plan.routineLabel': { owner: 'product', text: 'Wenn-dann-Plan (freiwillig)' },
  'plan.routinePlaceholder': {
    owner: 'product',
    text: 'z. B. Nach dem Feierabend starte ich mein Wandsitz-Training.',
  },
  'plan.routineHint': {
    owner: 'product',
    text: 'Ein fester Anknüpfungspunkt im Alltag hilft beim Aufbau einer Routine.',
  },
  'plan.weeklyGoal': { owner: 'product', text: 'Wochenziel: drei Einheiten' },
  'plan.sessionStructure': {
    owner: 'medical',
    text: 'Jede Einheit besteht aus vier Wandsitzen mit je zwei Minuten Pause dazwischen. Atmen Sie normal weiter, trainieren Sie nicht bis zur maximalen Anstrengung.',
  },
  'plan.create': { owner: 'product', text: 'Wochenplan erstellen' },
  'plan.created': { owner: 'product', text: 'Ihr Wochenplan ist erstellt.' },
  'plan.startsToday': { owner: 'product', text: 'Woche 1 beginnt heute.' },

  // Wahl der Startwoche (§14, B.13.1)
  'plan.startLabel': { owner: 'product', text: 'Wann möchten Sie starten?' },
  'plan.start.thisWeek': { owner: 'product', text: 'Diese Woche' },
  'plan.start.thisWeekHint': {
    owner: 'product',
    text: 'Woche 1 beginnt heute. Bis Sonntag sind noch {count} Einheiten geplant.',
  },
  'plan.start.thisWeekHintOne': {
    owner: 'product',
    text: 'Woche 1 beginnt heute. Bis Sonntag ist noch eine Einheit geplant.',
  },
  'plan.start.thisWeekUnavailable': {
    owner: 'product',
    text: 'Diese Woche ist kein Trainingstag mehr übrig.',
  },
  'plan.start.nextWeek': { owner: 'product', text: 'Nächste Woche' },
  'plan.start.nextWeekHint': {
    owner: 'product',
    text: 'Woche 1 beginnt am Montag, {date}, mit drei Einheiten.',
  },
  'plan.start.note': {
    owner: 'product',
    text: 'Das Programm läuft ab Woche 1 über zwölf Kalenderwochen. Sie können den Start später auf heute vorziehen.',
  },
});
