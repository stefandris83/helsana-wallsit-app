import { defineContent } from '../types';

/** Startseite «Heute» (§14) und Motivationsbausteine (§13, §21). */
export const todayContent = defineContent({
  'today.title': { owner: 'product', text: 'Heute' },
  'today.programWeek': { owner: 'product', text: 'Programmwoche {week} von 12' },
  'today.weeklyGoal': { owner: 'product', text: 'Wochenziel: {done} von {total} Einheiten' },
  'today.status.plannedToday': { owner: 'product', text: 'Heute ist ein geplanter Trainingstag.' },
  'today.dayStatus.trainingDay': { owner: 'product', text: 'Heute ist Trainingstag' },
  'today.dayStatus.restDay': { owner: 'product', text: 'Heute ist Ruhetag' },
  'today.dayStatus.doneToday': { owner: 'product', text: 'Heute erledigt' },
  'today.dayStatus.weekGoalReached': { owner: 'product', text: 'Wochenziel erreicht' },
  'today.weekStripLabel': { owner: 'product', text: 'Ihre Woche' },
  'today.figureAlt': {
    owner: 'medical',
    text: 'Illustration: eine Person lehnt mit geradem Rücken an einer Wand, die Knie sind etwa rechtwinklig gebeugt.',
  },
  'today.restDayHint': {
    owner: 'product',
    text: 'Das Programm sieht zwischen zwei Einheiten einen freien Tag vor.',
  },
  'today.weeklyGoalExceeded': {
    owner: 'product',
    text: '{done} Einheiten diese Woche. Empfohlen sind {total}.',
  },
  'today.feedbackPending': { owner: 'product', text: 'Feedback zur Einheit geben' },

  // Zeit zwischen Planerstellung und gewaehltem Programmstart (§14, B.13.1)
  'today.beforeStart.status': { owner: 'product', text: 'Ihr Programm startet bald' },
  'today.beforeStart.lead': {
    owner: 'product',
    text: 'Woche 1 beginnt am {day}. Bis dahin ist nichts zu tun.',
  },
  'today.beforeStart.firstSession': { owner: 'product', text: 'Erste Einheit: {day}' },
  'today.beforeStart.weekStripLabel': { owner: 'product', text: 'Ihre erste Woche' },
  'today.beforeStart.prepare': {
    owner: 'product',
    text: 'Nutzen Sie die Zeit, um sich die Anleitung in Ruhe anzusehen.',
  },
  'today.beforeStart.startNow': { owner: 'product', text: 'Doch heute beginnen' },
  'today.beforeStart.startNowHint': {
    owner: 'product',
    text: 'Damit beginnt Woche 1 heute, und die zwölf Wochen verschieben sich entsprechend.',
  },

  'gate.sameDay.title': { owner: 'product', text: 'Heute schon trainiert' },
  'gate.sameDay.text': {
    owner: 'medical',
    text: 'Sie haben heute bereits eine Einheit abgeschlossen. Das Programm sieht zwischen zwei Einheiten einen freien Tag vor.',
  },
  'gate.sameDay.confirm': { owner: 'product', text: 'Trotzdem weitere Einheit' },
  'gate.sameDay.cancel': { owner: 'product', text: 'Für heute belassen' },
  'gate.consecutive.title': { owner: 'product', text: 'Gestern war Ihre letzte Einheit' },
  'gate.consecutive.text': {
    owner: 'medical',
    text: 'Das Programm sieht zwischen zwei Einheiten einen freien Tag vor. Wenn es heute besser passt, können Sie trotzdem trainieren.',
  },
  'gate.consecutive.confirm': { owner: 'product', text: 'Heute trainieren' },
  'gate.consecutive.cancel': { owner: 'product', text: 'Heute pausieren' },
  'gate.weeklyGoal.title': { owner: 'product', text: 'Wochenziel bereits erreicht' },
  'gate.weeklyGoal.text': {
    owner: 'product',
    text: 'Sie haben in dieser Woche schon {done} von {total} empfohlenen Einheiten abgeschlossen.',
  },
  'gate.weeklyGoal.confirm': { owner: 'product', text: 'Trotzdem eine weitere Einheit' },
  'gate.weeklyGoal.cancel': { owner: 'product', text: 'Für diese Woche belassen' },
  'today.status.doneToday': { owner: 'product', text: 'Heute haben Sie bereits trainiert.' },
  'today.status.restDay': { owner: 'product', text: 'Heute ist kein Trainingstag geplant.' },
  'today.status.weekGoalReached': {
    owner: 'product',
    text: 'Sie haben Ihr Wochenziel von drei Einheiten erreicht.',
  },
  'today.nextSession': { owner: 'product', text: 'Nächste geplante Einheit: {day}' },
  'today.nextSessionWithTime': {
    owner: 'product',
    text: 'Nächste geplante Einheit: {day}, {time}',
  },
  'today.start': { owner: 'product', text: 'Training starten' },
  'today.startAnyway': { owner: 'product', text: 'Trotzdem heute trainieren' },
  'today.planNext': { owner: 'product', text: 'Nächste Einheit planen' },
  'today.finishSession': { owner: 'product', text: 'Einheit abschliessen' },
  'today.continueWeek': { owner: 'product', text: 'Weiter mit Woche {week}' },
  'today.resumeSession': { owner: 'product', text: 'Laufende Einheit fortsetzen' },
  'today.programFinishedTitle': { owner: 'product', text: 'Zwölf Wochen abgeschlossen' },
  'today.programFinishedText': {
    owner: 'product',
    text: 'Sie haben das zwölfwöchige Programm beendet. Ihre Übersicht bleibt weiterhin verfügbar. Sie können jederzeit freiwillig weiter trainieren.',
  },
  'today.learningTeaser': { owner: 'marketing', text: 'Ihre nächste Lernkarte' },
  'today.instructionLink': { owner: 'medical', text: 'Wandsitz-Anleitung ansehen' },

  'today.restart.title': { owner: 'product', text: 'Wiedereinstieg' },
  'today.restart.text': {
    owner: 'product',
    text: 'Eine Pause beendet das Programm nicht. Starten Sie heute mit der nächsten passenden Einheit.',
  },
  'today.restart.action': { owner: 'product', text: 'Heute wieder einsteigen' },

  'motivation.default': {
    owner: 'marketing',
    text: 'Regelmässigkeit hilft beim Aufbau einer neuen Bewegungsroutine.',
  },
  'motivation.barrier.time': {
    owner: 'marketing',
    text: 'Die heutige Einheit ist kurz und bereits eingeplant.',
  },
  'motivation.barrier.routine': {
    owner: 'marketing',
    text: 'Ein fester Zeitpunkt im Alltag hilft, die Einheit nicht ausfallen zu lassen.',
  },
  'motivation.barrier.motivation': {
    owner: 'marketing',
    text: 'Sie müssen nicht perfekt sein. Entscheidend ist der nächste kleine Schritt.',
  },
  'motivation.barrier.enjoyment': {
    owner: 'marketing',
    text: 'Die Einheit dauert nur wenige Minuten und ist schnell wieder vorbei.',
  },
  'motivation.barrier.tired': {
    owner: 'marketing',
    text: 'An müden Tagen ist die leichte Variante die richtige Wahl.',
  },
  'motivation.barrier.physical': {
    owner: 'medical',
    text: 'Achten Sie auf eine ruhige, kontrollierte Ausführung. Brechen Sie bei Beschwerden ab.',
  },
  'motivation.barrier.howToStart': {
    owner: 'marketing',
    text: 'Die App führt Sie Schritt für Schritt durch die Einheit.',
  },
  'motivation.support.plan': {
    owner: 'marketing',
    text: 'Ihr Plan steht: drei Einheiten in dieser Woche.',
  },
  'motivation.support.progress': {
    owner: 'marketing',
    text: 'Ihr Fortschritt wächst mit jeder abgeschlossenen Einheit.',
  },
  'motivation.support.knowledge': {
    owner: 'marketing',
    text: 'Passend zu Ihrem Programm: eine kurze Lerneinheit.',
  },
  'motivation.lowConfidence': {
    owner: 'marketing',
    text: 'Beginnen Sie klein. Der nächste Schritt zählt mehr als das ganze Programm.',
  },
  'motivation.highConfidence': {
    owner: 'marketing',
    text: 'Bleiben Sie bei Ihrem Rhythmus. Konstanz ist Ihr grösster Hebel.',
  },
});

/** Check-in vor der Einheit (§16). */
export const checkinContent = defineContent({
  'checkin.title': { owner: 'product', text: 'Kurzer Check-in' },
  'checkin.lead': { owner: 'product', text: 'Zwei Fragen, dann geht es los.' },

  'checkin.q1.title': { owner: 'product', text: 'Wie fühlen Sie sich heute?' },
  'checkin.q1.good': { owner: 'product', text: 'Gut und bereit' },
  'checkin.q1.tired': { owner: 'product', text: 'Etwas müde oder gestresst' },
  'checkin.q1.notFit': { owner: 'product', text: 'Heute nicht ganz fit' },
  'checkin.q1.complaints': { owner: 'medical', text: 'Ich habe Beschwerden' },

  'checkin.q2.title': { owner: 'product', text: 'Wie anspruchsvoll soll die heutige Einheit sein?' },
  'checkin.q2.light': { owner: 'product', text: 'Lieber leicht starten' },
  'checkin.q2.standard': { owner: 'product', text: 'Normale Variante' },
  'checkin.q2.suggest': { owner: 'product', text: 'App soll eine Variante vorschlagen' },

  'checkin.suggestion.light': {
    owner: 'product',
    text: 'Basierend auf Ihrer heutigen Rückmeldung schlagen wir die leichte Variante vor.',
  },
  'checkin.suggestion.standard': {
    owner: 'product',
    text: 'Basierend auf Ihrer heutigen Rückmeldung schlagen wir die normale Variante vor.',
  },
  'checkin.suggestion.reason.wish': { owner: 'product', text: 'Sie haben diese Variante gewählt.' },
  'checkin.suggestion.reason.mood': {
    owner: 'product',
    text: 'Grund: Ihre heutige Tagesform.',
  },
  'checkin.suggestion.reason.previousHard': {
    owner: 'product',
    text: 'Grund: Die letzte Einheit war für Sie sehr anstrengend.',
  },
  'checkin.suggestion.reason.previousPartial': {
    owner: 'product',
    text: 'Grund: Die letzte Einheit wurde nur teilweise beendet.',
  },
  'checkin.suggestion.reason.previousComplaints': {
    owner: 'medical',
    text: 'Grund: Bei der letzten Einheit sind Beschwerden aufgetreten.',
  },
  'checkin.suggestion.reason.reentry': {
    owner: 'product',
    text: 'Grund: Sie steigen nach einer längeren Pause wieder ein.',
  },
  'checkin.suggestion.reason.ready': {
    owner: 'product',
    text: 'Grund: Sie fühlen sich gut und die letzte Einheit war gut machbar.',
  },
  'checkin.suggestion.override': { owner: 'product', text: 'Andere Variante wählen' },
  'checkin.targetPreview': {
    owner: 'product',
    text: '4 Sätze mit je {seconds} Sekunden, dazwischen zwei Minuten Pause.',
  },
  'checkin.optionalPreview': {
    owner: 'product',
    text: 'Freiwilliges Zusatzziel pro Satz: {seconds} Sekunden.',
  },
  'checkin.start': { owner: 'product', text: 'Einheit starten' },

  'checkin.complaints.title': { owner: 'medical', text: 'Heute besser pausieren' },
  'checkin.complaints.text': {
    owner: 'medical',
    text: 'Pausieren Sie das Training. Bei neuen, starken oder anhaltenden Beschwerden wenden Sie sich bitte an eine medizinische Fachperson.',
  },
  'checkin.complaints.skip': { owner: 'medical', text: 'Heute aussetzen' },
  'checkin.complaints.back': {
    owner: 'medical',
    text: 'Ich habe keine trainingsrelevanten Beschwerden und möchte zurück',
  },
  'checkin.skipped': { owner: 'product', text: 'Heute ausgesetzt. Das ist in Ordnung.' },
});

/** Wandsitz-Anleitung (§17). */
export const instructionContent = defineContent({
  'instruction.title': { owner: 'medical', text: 'So funktioniert der Wandsitz' },
  'instruction.lead': {
    owner: 'medical',
    text: 'Nehmen Sie sich zwei Minuten Zeit. Die Anleitung können Sie später jederzeit erneut öffnen.',
  },
  'instruction.videoPlaceholder': {
    owner: 'medical',
    text: 'Für dieses Gerät ist kein Anleitungsvideo hinterlegt.',
  },
  'instruction.videoPlaceholderHint': {
    owner: 'medical',
    text: 'Die Textanleitung unten enthält alle nötigen Schritte und ist ohne Ton verständlich.',
  },
  'instruction.videoCaptionsNote': {
    owner: 'medical',
    text: 'Untertitel',
  },
  'instruction.videoAlternativeTitle': { owner: 'medical', text: 'Textalternative zum Video' },
  'instruction.stepsTitle': { owner: 'medical', text: 'Schritt für Schritt' },
  'instruction.steps': {
    owner: 'medical',
    items: [
      'Stellen Sie sich mit dem Rücken an eine stabile, glatte Wand.',
      'Gehen Sie mit den Füssen etwa eine Schrittlänge nach vorne, Füsse hüftbreit.',
      'Rutschen Sie mit geradem Rücken an der Wand nach unten, bis die Knie etwa rechtwinklig gebeugt sind.',
      'Halten Sie die Position ruhig und atmen Sie gleichmässig weiter.',
      'Drücken Sie sich am Ende kontrolliert wieder nach oben.',
    ],
  },
  'instruction.keyPointsTitle': { owner: 'medical', text: 'Kernhinweise' },
  'instruction.keyPoints': {
    owner: 'medical',
    items: [
      'Rücken stabil an der Wand',
      'Füsse sicher auf dem Boden',
      'Belastung über einen höheren oder tieferen Stand anpassen',
      'Knie kontrolliert ausrichten',
      'Gleichmässig weiteratmen',
      'Nicht pressen',
      'Kontrolliert aufstehen',
      'Bei Beschwerden abbrechen',
    ],
  },
  'instruction.mistakesTitle': { owner: 'medical', text: 'Typische Ausführungsfehler' },
  'instruction.mistakes': {
    owner: 'medical',
    items: [
      'Der Rücken löst sich von der Wand oder wird rund.',
      'Die Knie fallen nach innen oder schieben weit über die Fussspitzen.',
      'Die Luft wird angehalten statt gleichmässig weitergeatmet.',
      'Die Position wird tiefer gewählt, als heute kontrolliert machbar ist.',
    ],
  },
  'instruction.imagesTitle': { owner: 'medical', text: 'Bilder zur Ausführung' },
  'instruction.imageAlt': {
    owner: 'medical',
    text: 'Illustration: eine Frau und ein Mann in der Wandsitz-Position, Rücken flach an der Wand, Knie etwa rechtwinklig gebeugt.',
  },
  'instruction.safetyTitle': { owner: 'medical', text: 'Sicherheit' },
  'instruction.safetyText': {
    owner: 'medical',
    text: 'Trainieren Sie nur, wenn Sie sich sicher fühlen. Brechen Sie ab, wenn Beschwerden auftreten, und wenden Sie sich bei anhaltenden Beschwerden an eine medizinische Fachperson.',
  },
  'instruction.confirm': { owner: 'medical', text: 'Anleitung gelesen, weiter' },
  'instruction.reopen': { owner: 'medical', text: 'Anleitung erneut öffnen' },
});

/** Trainingstimer (§18). */
export const timerContent = defineContent({
  'timer.title': { owner: 'product', text: 'Trainingseinheit' },
  'timer.phase.preparation': { owner: 'product', text: 'Vorbereitung' },
  'timer.phase.preparationHint': {
    owner: 'medical',
    text: 'Stellen Sie sich an die Wand und gehen Sie ruhig in die Position.',
  },
  'timer.phase.set': { owner: 'product', text: 'Satz {current} von {total}' },
  'timer.phase.rest': { owner: 'product', text: 'Pause' },
  'timer.phase.restHint': { owner: 'medical', text: 'Atmen Sie ruhig und lockern Sie die Beine.' },
  'timer.phase.restNext': { owner: 'product', text: 'Als Nächstes: Satz {next} von {total}' },

  'timer.targetLabel': { owner: 'product', text: 'Ihr Zwischenziel: {seconds} Sekunden' },
  'timer.optionalLabel': { owner: 'product', text: 'Freiwilliges Zusatzziel: {seconds} Sekunden' },
  'timer.breathingHint': { owner: 'medical', text: 'Ruhig weiteratmen.' },
  'timer.formHint': {
    owner: 'medical',
    text: 'Saubere Ausführung ist wichtiger als zusätzliche Sekunden.',
  },
  'timer.todayHint': { owner: 'marketing', text: 'Heute zählt, was gut machbar ist.' },

  'timer.targetReachedTitle': { owner: 'product', text: 'Zwischenziel erreicht. Sehr gut.' },
  'timer.finishSet': { owner: 'product', text: 'Satz erfolgreich beenden' },
  'timer.optionalPhaseLabel': { owner: 'product', text: 'Freiwillige Zusatzzeit' },
  'timer.optionalReached': { owner: 'product', text: 'Zusatzziel erreicht.' },

  'timer.pause': { owner: 'product', text: 'Pause' },
  'timer.resume': { owner: 'product', text: 'Weiter' },
  'timer.stopSet': { owner: 'product', text: 'Satz beenden' },
  'timer.abort': { owner: 'product', text: 'Training abbrechen' },
  'timer.skipRest': { owner: 'medical', text: 'Pause überspringen' },

  'timer.abortDialogTitle': { owner: 'product', text: 'Training abbrechen?' },
  'timer.abortDialogText': {
    owner: 'product',
    text: 'Ihre bereits absolvierten Sätze werden gespeichert. Sie kommen anschliessend zur kurzen Rückmeldung.',
  },
  'timer.abortDialogConfirm': { owner: 'product', text: 'Ja, abbrechen' },
  'timer.abortDialogCancel': { owner: 'product', text: 'Weitertrainieren' },

  'timer.interruptedTitle': { owner: 'product', text: 'Einheit unterbrochen' },
  'timer.interruptedText': {
    owner: 'product',
    text: 'Die App war längere Zeit nicht aktiv. Ihr Stand ist gespeichert. Möchten Sie fortsetzen oder die Einheit hier beenden?',
  },
  'timer.interruptedResume': { owner: 'product', text: 'Einheit fortsetzen' },
  'timer.interruptedEnd': { owner: 'product', text: 'Einheit hier beenden' },


  'timer.announce.setStart': { owner: 'product', text: 'Satz {current} von {total} beginnt.' },
  'timer.announce.targetReached': { owner: 'product', text: 'Zwischenziel erreicht.' },
  'timer.announce.optionalReached': { owner: 'product', text: 'Zusatzziel erreicht.' },
  'timer.announce.restStart': { owner: 'product', text: 'Pause von zwei Minuten beginnt.' },
  'timer.announce.completed': { owner: 'product', text: 'Einheit beendet.' },
  'timer.remainingLabel': { owner: 'product', text: 'Verbleibende Zeit' },
  'timer.progressLabel': { owner: 'product', text: 'Fortschritt der aktuellen Phase' },
});

/** Rückmeldung nach der Einheit (§19). */
export const feedbackContent = defineContent({
  'feedback.head.first': { owner: 'marketing', text: 'Ihre erste Einheit ist geschafft.' },
  'feedback.head.weekGoal': { owner: 'marketing', text: 'Wochenziel erreicht.' },
  'feedback.head.done': { owner: 'marketing', text: 'Einheit geschafft.' },
  'feedback.head.partial': { owner: 'marketing', text: 'Einheit beendet.' },
  'feedback.head.week': {
    owner: 'product',
    text: '{done}. von {total} Einheiten in dieser Woche.',
  },
  'feedback.head.weekExceeded': {
    owner: 'product',
    text: '{done} Einheiten diese Woche. Empfohlen sind {total}.',
  },
  'feedback.head.setsAll': { owner: 'product', text: 'Alle {total} Wandsitze gehalten.' },
  'feedback.head.setsSome': { owner: 'product', text: '{reached} von {total} Wandsitze gehalten.' },
  'feedback.head.optional': {
    owner: 'product',
    text: 'Davon {count} mit freiwilliger Zusatzzeit.',
  },
  'feedback.head.encourage': {
    owner: 'marketing',
    text: 'Regelmässigkeit ist wichtiger als Perfektion.',
  },

  'feedback.title': { owner: 'product', text: 'Kurze Rückmeldung' },
  'feedback.lead': { owner: 'product', text: 'Vier kurze Fragen. Danach ist die Einheit gespeichert.' },

  'feedback.q1.title': { owner: 'product', text: 'Wie viel der Einheit haben Sie durchgeführt?' },
  'feedback.q1.full': { owner: 'product', text: 'Vollständig' },
  'feedback.q1.partial': { owner: 'product', text: 'Teilweise' },
  'feedback.q1.none': { owner: 'product', text: 'Nicht durchgeführt' },

  'feedback.q2.title': { owner: 'product', text: 'Wie anspruchsvoll war die Einheit?' },
  'feedback.q2.easy': { owner: 'product', text: 'Leicht' },
  'feedback.q2.fitting': { owner: 'product', text: 'Passend' },
  'feedback.q2.hard': { owner: 'product', text: 'Sehr anstrengend' },

  'feedback.q3.title': {
    owner: 'medical',
    text: 'Sind während oder nach dem Training Beschwerden aufgetreten?',
  },
  'feedback.q3.note': {
    owner: 'medical',
    text: 'Danke für den Hinweis. Wir schlagen Ihnen bei der nächsten Einheit die leichte Variante vor. Bei anhaltenden Beschwerden wenden Sie sich bitte an eine medizinische Fachperson.',
  },

  'feedback.q4.title': { owner: 'product', text: 'Wie fühlen Sie sich nach der Einheit?' },
  'feedback.q4.good': { owner: 'product', text: 'Gut' },
  'feedback.q4.neutral': { owner: 'product', text: 'Neutral' },
  'feedback.q4.bad': { owner: 'product', text: 'Eher schlecht' },

  'feedback.save': { owner: 'product', text: 'Einheit speichern' },
  'feedback.savedTitle': { owner: 'product', text: 'Einheit gespeichert.' },
  'feedback.savedWeek': {
    owner: 'product',
    text: 'Sie haben diese Woche {done} von {total} geplanten Einheiten durchgeführt.',
  },
  'feedback.savedNext': { owner: 'product', text: 'Nächste geplante Einheit: {day}' },
  'feedback.toToday': { owner: 'product', text: 'Zurück zu Heute' },
});
