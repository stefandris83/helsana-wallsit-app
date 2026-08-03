# Auftrag: Helsana Wallsit-Pilot — Produktspezifikation und Arbeitsauftrag

Referenziert per @spec.md aus der laufenden Claude-Code-Session. Es gilt zusätzlich CLAUDE.md im Projekt-Root.

# Teil C — Produktspezifikation

## §1 Produktziel

Die App unterstützt ausgewählte Teilnehmende dabei:

- während zwölf Wochen dreimal pro Woche ein Wallsit-Training durchzuführen
- schrittweise auf vier Wallsits von jeweils bis zu zwei Minuten hinzuarbeiten
- eine feste und realistische Bewegungsroutine aufzubauen
- jede Trainingseinheit sicher und korrekt durchzuführen
- ihren Umsetzungsfortschritt sichtbar zu machen
- durch einfache, evidenzbasierte Lerninhalte zusätzliche gesundheitsfördernde Verhaltensweisen kennenzulernen
- Blutdruckwerte freiwillig in einem einfachen Tagebuch zu dokumentieren
- Helsana anonymisierte Informationen darüber bereitzustellen, wie gut die App und das Programm im Pilot funktionieren

## §2 Zweckbestimmung

Die App ist ein digitales Gesundheitsförderungs- und Bewegungsangebot.

Sie unterstützt Teilnehmende bei:

- Durchführung einer standardisierten Bewegungsroutine
- Planung und Erinnerung
- Dokumentation absolvierter Einheiten
- Selbstreflexion
- allgemeiner Gesundheitsinformation
- freiwilliger Dokumentation selbst gemessener Blutdruckwerte

Die App ersetzt keine medizinische Untersuchung, Diagnose, Behandlung oder Beratung.

## §3 Verbindliche regulatorische Grenzen

Diese Grenzen sind zusätzlich maschinenprüfbar abzusichern (siehe B.6).

Die App darf nicht:

- eine Diagnose stellen
- feststellen, ob eine Person Bluthochdruck hat
- Blutdruckwerte medizinisch interpretieren
- individuelle Zielwerte festlegen
- Blutdruckwerte in Kategorien einteilen
- Ampelfarben für Blutdruckwerte verwenden
- aufgrund eines Blutdruckwertes eine Warnstufe berechnen
- aufgrund von Blutdruckwerten das Training anpassen
- die Trainingsintensität aufgrund medizinischer Profildaten verändern
- den Wallsit-Erfolg aus Blutdruckwerten ableiten
- Ursache und Wirkung zwischen Training und Blutdruck behaupten
- Medikamente erwähnen, bewerten oder anpassen
- medizinische Therapieempfehlungen geben
- eine individuelle Prognose erstellen
- einen medizinischen Score oder ein Risikoprofil berechnen
- ein generatives KI-Modell für individuelle Gesundheitsberatung einsetzen

Unzulässige Aussagen sind beispielsweise:

- «Das Training hat Ihren Blutdruck gesenkt.»
- «Ihr Blutdruck ist jetzt im gesunden Bereich.»
- «Aufgrund Ihrer Werte sollten Sie intensiver trainieren.»
- «Ihr Wallsit-Programm wirkt.»
- «Reduzieren Sie Ihre Medikamente.»
- «Ihr Risiko ist gesunken.»

Zulässige Aussagen sind beispielsweise:

- «Sie haben diese Woche zwei von drei Einheiten abgeschlossen.»
- «Sie haben heute Ihr persönliches Zwischenziel erreicht.»
- «Regelmässigkeit hilft beim Aufbau einer neuen Bewegungsroutine.»
- «Ihre Blutdruckwerte wurden gespeichert.»
- «Die medizinische Bedeutung Ihrer Werte besprechen Sie bitte mit einer medizinischen Fachperson.»

## §4 Zielgruppe

Die App richtet sich an erwachsene, vorab durch Helsana ausgewählte Testpersonen.

Die Rekrutierung und Eignungsprüfung erfolgen ausserhalb der App mit Microsoft Forms und einer manuellen Auswahl durch das Projektteam.

Die App selbst entscheidet nicht, ob eine Person medizinisch für die Teilnahme geeignet ist.

## §5 Umfang des MVP

Der MVP umfasst:

1. Datenschutzhinweis und Einwilligung
2. Willkommens-Carousel
3. Profil und persönliches Onboarding
4. Sicherheitsbestätigung
5. persönlicher Wochenplan
6. Check-in vor jeder Trainingseinheit
7. Auswahl der leichten oder normalen Tagesvariante
8. Wallsit-Anleitung
9. geführter Trainingstimer
10. Rückmeldung nach jeder Einheit
11. Fortschrittsanzeige
12. einfache Motivationsmechaniken
13. Learning-Bereich
14. freiwilliges Blutdrucktagebuch
15. konfigurierbare Erinnerungen
16. Einstellungen
17. schlankes anonymisiertes Pilot-Dashboard für Helsana
18. Export anonymisierter Pilotdaten

Nicht Bestandteil des MVP:

- Coaching-Kommunikation
- Chat
- KI-Coach
- Terminvereinbarung
- Integration in Helsana+
- Integration mit Microsoft Forms
- automatische Übernahme von Blutdruckwerten
- Bluetooth-Anbindung
- Wearable-Integration
- ärztlicher Bericht
- Medikamentenverwaltung
- medizinische Auswertung
- Bonuspunkte
- soziale Ranglisten
- Vergleich zwischen Teilnehmenden
- kostenpflichtige Funktionen

## §6 Designprinzipien

Die visuelle Umsetzung folgt verbindlich dem Helsana Design System «Unify» (`design-system.md`, Bindung und Konfliktregeln siehe B.8). Die folgenden Prinzipien beschreiben, wie das Design System in diesem Produkt angewendet wird; sie ersetzen es nicht.

Die App soll:

- mobile-first gestaltet sein
- auf Smartphone, Tablet und Desktop funktionieren
- ruhig, vertrauenswürdig und hochwertig wirken
- einfaches, verständliches Deutsch mit Schweizer Rechtschreibung verwenden
- grosse und gut erkennbare Bedienelemente besitzen
- eine klare visuelle Hierarchie verwenden
- maximal eine primäre Aktion pro Screen zeigen
- barrierearm gestaltet sein
- nicht ausschliesslich Farben zur Informationsvermittlung verwenden
- ausreichende Farbkontraste besitzen
- die Vergrösserung von Text unterstützen
- mit Tastatur bedienbar sein
- Screenreader-freundliche Beschriftungen besitzen
- reduzierte Animationen respektieren, wenn dies im Betriebssystem aktiviert ist

Vermeide:

- medizinisch-klinische Optik im Sinne von Befund- und Messwertdarstellungen; die Markenfarben des Design Systems bleiben davon unberührt
- überladene Dashboards
- aggressive Gamification
- rote oder grüne medizinische Bewertungen
- beschämende oder moralisierende Texte
- unrealistische Gesundheitsversprechen
- künstliche Erfolgszahlen
- unnötige Menüs

## §7 Navigation

Verwende eine einfache mobile Hauptnavigation mit maximal vier Bereichen:

1. Heute
2. Fortschritt
3. Lernen
4. Blutdruck

Profil, Datenschutz, Erinnerungen und Programmeinstellungen befinden sich in einem separaten Einstellungsbereich.

Nach dem Login oder Öffnen der App landet die Person auf «Heute».

## §8 Zugang und Identität

Technische Umsetzung siehe B.9.

Die Rekrutierung erfolgt ausserhalb der App.

Für den Pilot erhält jede ausgewählte Person:

- einen anonymen Einladungscode oder persönlichen Zugangslink
- eine eindeutige Pilot-ID
- keinen für die Helsana-Auswertungsplattform sichtbaren Namen

In der Pilotdatenbank dürfen für die Auswertung keine Namen gespeichert oder angezeigt werden.

Falls für Login oder technische Zustellung eine E-Mail-Adresse benötigt wird:

- Identitätsdaten und Nutzungsdaten logisch trennen
- im Pilot-Dashboard nur die Pilot-ID anzeigen
- keine E-Mail-Adresse im Dashboard oder Export anzeigen
- die technische Lösung für Datenschutz und Security dokumentieren

## §9 Einwilligung

Vor dem Onboarding erscheint ein kurzer Einwilligungs-Screen.

Die Person muss aktiv bestätigen:

- freiwillige Teilnahme am Pilot
- Kenntnisnahme der Datenschutzinformationen
- Kenntnisnahme, dass die App kein Ersatz für medizinische Beratung ist
- Einverständnis zur anonymisierten Auswertung der App-Nutzung
- Einverständnis zur Speicherung der freiwillig eingegebenen Profildaten

Für das optionale Blutdrucktagebuch ist eine zusätzliche, getrennte Einwilligung vorzusehen.

Die App darf keine vorausgewählten Checkboxen verwenden.

## §10 Willkommens-Carousel

Das Willkommen wird als kurzes Carousel mit vier Karten umgesetzt.

### Karte 1: Willkommen

Titel: «Willkommen zu Ihrem 12-Wochen-Programm»

Text: «Mit kurzen Wallsit-Einheiten bauen Sie Schritt für Schritt eine regelmässige Bewegungsroutine auf.»

Visual: Freundliche Illustration oder Bild einer korrekt ausgeführten Wallsit-Übung.

### Karte 2: Einfacher Ablauf

Titel: «Dreimal pro Woche»

Text: «Die App führt Sie durch vier Wallsits mit Erholungspausen. Sie wählen vor jeder Einheit die Variante, die heute zu Ihnen passt.»

Visual: Drei markierte Trainingstage in einer Wochenansicht.

### Karte 3: Schritt für Schritt

Titel: «Ihr persönliches Zwischenziel zählt»

Text: «Schon das Erreichen der leichten Variante ist ein vollständiger Erfolg. Wenn heute mehr möglich ist, können Sie freiwillig bis zum nächsten Ziel weitermachen.»

Visual: Eine Fortschrittsdarstellung mit Zwischenziel und optionalem Zusatzziel.

### Karte 4: Wichtiger Hinweis

Titel: «Ihre Gesundheit geht vor»

Text: «Das Programm ersetzt keine medizinische Beratung. Trainieren Sie nicht bei Beschwerden oder Unsicherheit und lassen Sie die Teilnahme bei Bedarf medizinisch abklären.»

Hauptbutton: «Programm einrichten»

Das Carousel:

- zeigt den Fortschritt, beispielsweise vier Punkte
- kann vorwärts und rückwärts navigiert werden
- kann nicht versehentlich durch unkontrolliertes Wischen geschlossen werden
- wird beim ersten Einstieg vollständig angezeigt
- kann später im Informationsbereich erneut geöffnet werden

## §11 Profil im Onboarding

Erfasse folgende Angaben.

Pflichtfelder:

- Geburtsjahr
- Körpergrösse in Zentimetern
- Gewicht in Kilogramm

Optionale Felder:

- Geschlecht mit folgenden Optionen: weiblich, männlich, divers, keine Angabe
- Taillenumfang in Zentimetern
- Tätigkeit im Alltag: hauptsächlich sitzend, gemischt, hauptsächlich körperlich aktiv, keine Angabe

Bei optionalen Angaben muss klar stehen: «Diese Angabe ist freiwillig.»

Die Profildaten dürfen im MVP nicht für medizinische Berechnungen oder individuelle Gesundheitseinstufungen verwendet werden.

Keinen BMI anzeigen und keine Bewertung von Gewicht oder Taillenumfang vornehmen.

Die Angaben dienen ausschliesslich der Pilotauswertung und der nicht medizinischen Priorisierung allgemeiner Lerninhalte.

## §12 Persönlicher Startfragebogen

### Frage 1: Aktivität

«Wie aktiv sind Sie aktuell?»

- fast nie aktiv
- ein- bis zweimal pro Woche aktiv
- drei- bis viermal pro Woche aktiv
- fünfmal oder häufiger pro Woche aktiv

### Frage 2: Wallsit-Erfahrung

«Haben Sie bereits Erfahrung mit Wallsits?»

- noch nie
- schon einmal ausprobiert
- bereits regelmässig durchgeführt

### Frage 3: Kniebeschwerden

«Haben Sie aktuell Beschwerden an Knien, Hüften oder Rücken, die einen Wallsit erschweren könnten?»

- nein
- leichte Beschwerden
- deutliche Beschwerden
- unsicher

Bei «deutliche Beschwerden» oder «unsicher»:

- keine automatische Diagnose erstellen
- deutlich anzeigen: «Bitte klären Sie vor dem Start mit einer medizinischen Fachperson ab, ob die Übung für Sie geeignet ist.»
- die Person kann das Onboarding speichern
- die aktive Trainingsfunktion wird erst nach einer manuellen Bestätigung «Ich habe die Teilnahme abgeklärt» freigegeben
- diese Logik muss vor Kundeneinsatz durch Medical und Regulatory bestätigt werden

### Frage 4: Gewünschte Trainingstage

«An welchen drei Tagen möchten Sie normalerweise trainieren?»

- frei wählbare drei Wochentage
- zwischen geplanten Trainingstagen möglichst mindestens ein trainingsfreier Tag
- als einfache Empfehlung Montag, Mittwoch und Freitag vorauswählen
- die Person kann andere Tage wählen

Die App darf eine vierte Einheit nicht als Wochenziel empfehlen.

### Frage 5: Trainingszeit

«Wann möchten Sie normalerweise trainieren?»

- morgens
- mittags
- abends
- unterschiedlich

Optional kann eine genaue Uhrzeit pro Trainingstag gewählt werden.

### Frage 6: Grösste Hürden

«Was fällt Ihnen bei regelmässiger Bewegung am schwersten?»

Maximal zwei Antworten:

- ich habe zu wenig Zeit
- ich vergesse es häufig
- mir fehlt oft die Motivation
- ich bin häufig müde oder gestresst
- ich habe körperliche Beschwerden
- ich weiss nicht genau, wie ich beginnen soll

### Frage 7: Bevorzugte Unterstützung

«Was hilft Ihnen am meisten, das Programm durchzuziehen?»

Eine Antwort:

- motivierende Rückmeldungen
- ein klarer Plan
- Erinnerungen und Struktur
- kurze Gesundheitsinformationen
- sichtbarer Fortschritt

### Frage 8: Zuversicht

«Wie sicher sind Sie, dass Sie das zwölfwöchige Programm durchführen können?»

Skala von 1 bis 10, wobei 1 «sehr unsicher» und 10 «sehr sicher» bedeutet.

Die Antwort darf nicht als medizinisches Risiko interpretiert werden. Sie kann nicht medizinische App-Elemente priorisieren:

- niedrige Zuversicht: kleinere nächste Schritte und Wiedereinstieg betonen
- hohe Zuversicht: Fortschritt und Konsistenz betonen

### Frage 9: Erinnerungen

«Möchten Sie an Ihre geplanten Einheiten erinnert werden?»

- ja
- nein

Bei Ja:

- gewünschte Uhrzeit bestätigen
- Notifications nur nach ausdrücklicher Zustimmung aktivieren

## §13 Personalisierung

Die Personalisierung erfolgt regelbasiert und nicht durch generative KI.

Sie darf sich nur auf folgende Bereiche beziehen:

- Reihenfolge der Lernkarten
- Formulierung der Motivationshinweise
- Sichtbarkeit des nächsten geplanten Trainings
- vorgeschlagene Erinnerungszeit
- Wiedereinstiegshinweise
- leichte oder normale Variante der aktuellen Trainingseinheit

Die Personalisierung darf keine Diagnose, Risikobewertung oder medizinische Empfehlung erzeugen.

Beispiele:

- Hürde «zu wenig Zeit»: zeige häufiger «Die heutige Einheit ist kurz und bereits eingeplant.»
- Hürde «ich vergesse es»: zeige prominent nächste geplante Einheit, Reminder-Einstellung und Wenn-dann-Plan
- Hürde «fehlende Motivation»: zeige häufiger «Sie müssen nicht perfekt sein. Entscheidend ist der nächste kleine Schritt.»
- Wunsch «klarer Plan»: zeige prominent heutige Einheit, Wochenübersicht und nächsten geplanten Termin
- Wunsch «Gesundheitsinformationen»: zeige auf der Startseite die nächste Lernkarte

## §14 Persönlicher Wochenplan

Das Programm dauert zwölf Wochen. Definition der Programmwoche siehe B.13.1.

Das Wochenziel beträgt verbindlich:

- drei Trainingseinheiten pro Woche
- vier Wallsit-Sätze pro Einheit
- zwei Minuten Pause zwischen den Sätzen
- normales Weiteratmen
- keine maximale Anstrengung
- kein Training bis zum vollständigen Muskelversagen

Die Startseite zeigt:

- aktuelle Programmwoche
- heutiger Trainingsstatus
- Wochenziel, beispielsweise «2 von 3»
- nächster geplanter Trainingstag
- primären Button «Training starten»
- optional nächste Lernkarte
- einfachen Wiedereinstieg, wenn eine Einheit verpasst wurde

Verpasste Einheiten werden nicht automatisch auf denselben Tag gestapelt.

Die App verwendet keine beschämenden Meldungen.

## §15 Trainingsvarianten nach Programmwoche

Diese Matrix liegt in genau einer Konstante und ist durch Tests abgedeckt (B.5, B.11).

| Wochen | Leicht | Optionales Zusatzziel | Normal |
|---|---|---|---|
| 1–2 | 4 × 30 s | 60 s | 4 × 60 s |
| 3–4 | 4 × 45 s | 90 s | 4 × 90 s |
| 5–6 | 4 × 60 s | 120 s | 4 × 120 s |
| 7–8 | 4 × 90 s | 120 s | 4 × 120 s |
| 9–12 | 4 × 90 s | 120 s | 4 × 120 s |

Alle Varianten verwenden zwei Minuten Pause zwischen den Sätzen.

Das leichte Zwischenziel gilt als vollständiger Erfolg. Das optionale Zusatzziel ist kein Muss.

## §16 Check-in vor jeder Einheit

Vor jeder Einheit stellt die App einen sehr kurzen Tages-Check-in.

### Frage 1

«Wie fühlen Sie sich heute?»

- gut und bereit
- etwas müde oder gestresst
- heute nicht ganz fit
- ich habe Beschwerden

### Frage 2

«Wie anspruchsvoll soll die heutige Einheit sein?»

- lieber leicht starten
- normale Variante
- App soll eine Variante vorschlagen

### Vorschlagslogik

Die App empfiehlt die leichte Variante, wenn:

- «etwas müde oder gestresst» ausgewählt wurde
- «heute nicht ganz fit» ausgewählt wurde
- die vorherige Einheit als sehr anstrengend bewertet wurde
- die vorherige Einheit nur teilweise beendet wurde
- die Person nach einer längeren Pause wieder einsteigt
- die Person bewusst leicht starten möchte

Die App empfiehlt die normale Variante, wenn:

- «gut und bereit» gewählt wurde
- die vorherige Einheit passend oder leicht war
- keine Beschwerden gemeldet wurden
- die Person die normale Variante wünscht

Die Vorschlagslogik basiert ausschliesslich auf subjektiver Tagesform und Trainingserfahrung. Sie darf keine Blutdruckwerte oder medizinischen Profildaten verwenden (Testpflicht siehe B.6).

Die App formuliert: «Basierend auf Ihrer heutigen Rückmeldung schlagen wir die leichte Variante vor.»

Nicht: «Aus gesundheitlichen Gründen müssen Sie heute leicht trainieren.»

### Beschwerden

Bei «ich habe Beschwerden»:

- Training nicht direkt starten
- Art der Beschwerden nicht diagnostizieren
- Hinweis anzeigen: «Pausieren Sie das Training. Bei neuen, starken oder anhaltenden Beschwerden wenden Sie sich bitte an eine medizinische Fachperson.»
- Option «Heute aussetzen»
- Option «Ich habe keine trainingsrelevanten Beschwerden und möchte zurück»

Keine automatische Notfallbewertung implementieren, bevor die Inhalte nicht medizinisch freigegeben wurden.

## §17 Wallsit-Anleitung

Vor der ersten Einheit ist die Anleitung verpflichtend. Später ist sie jederzeit erneut aufrufbar.

Die Anleitung besteht aus:

- einem kurzen Video
- zwei bis vier ergänzenden Bildern
- wenigen klaren Textschritten
- Sicherheitshinweisen
- typischen Ausführungsfehlern

Das Video kann später durch ein KI-generiertes und fachlich freigegebenes Video ersetzt werden.

Für die erste technische Version (siehe B.13.4):

- einen klar gekennzeichneten Video-Platzhalter integrieren
- lokale oder konfigurierbare Videodatei unterstützen
- Untertitel ermöglichen
- Video auch ohne Ton verständlich machen
- kein nicht freigegebenes medizinisches Video automatisch generieren

Kernhinweise:

- Rücken stabil an der Wand
- Füsse sicher auf dem Boden
- Belastung über einen höheren oder tieferen Stand anpassen
- Knie kontrolliert ausrichten
- gleichmässig weiteratmen
- nicht pressen
- kontrolliert aufstehen
- bei Beschwerden abbrechen

Alle Übungsinhalte benötigen vor dem Pilot eine fachliche Freigabe.

## §18 Geführter Trainingstimer

Der Trainingstimer ist die Kernfunktion. Technische Anforderungen siehe B.7.

### Aufbau

1. kurze Vorbereitung
2. Satz 1
3. Pause
4. Satz 2
5. Pause
6. Satz 3
7. Pause
8. Satz 4
9. Abschluss

### Timeranzeige

Der Screen zeigt:

- aktueller Satz, beispielsweise «Satz 2 von 4»
- grosse verbleibende Zeit
- visueller Fortschrittsring
- aktuelles persönliches Zwischenziel
- optionales nächstes Ziel
- Button «Pause»
- Button «Satz beenden»
- Button «Training abbrechen»
- Hinweis «Ruhig weiteratmen»

Die Anzeige muss auch auf kleinen Smartphones klar erkennbar sein.

### Zwischenziel-Logik

Beispiel Woche 3, leichte Variante: persönliches Ziel 45 Sekunden, freiwilliges Zusatzziel 90 Sekunden.

Bis Sekunde 45:

- Timer zeigt normales Fortschrittsdesign
- motivierende, ruhige Hinweise
- bei 45 Sekunden klare Erfolgsanimation
- Text: «Zwischenziel erreicht. Sehr gut.»

Nach Erreichen des Zwischenziels:

- die Person kann den Satz sofort erfolgreich beenden
- alternativ kann die Person freiwillig weitermachen
- kurze Frage oder gut sichtbare Auswahl: «Möchten Sie noch etwas weitermachen?»
- Buttons: «Satz erfolgreich beenden» und «Freiwillig weitermachen»

Wenn weitergemacht wird:

- Timer läuft bis maximal zum normalen Wochenziel weiter
- die Zusatzphase ist visuell klar vom bereits erreichten Ziel getrennt
- das bereits erreichte Zwischenziel bleibt sichtbar
- keine manipulative Sprache
- kein Countdown, der zum Ignorieren von Beschwerden drängt
- jederzeit mit Erfolg beendbar

Geeignete Hinweise:

- «Ihr Ziel ist bereits erreicht.»
- «Wenn es sich kontrolliert anfühlt, können Sie freiwillig weitermachen.»
- «Ruhig weiteratmen.»
- «Saubere Ausführung ist wichtiger als zusätzliche Sekunden.»
- «Heute zählt, was gut machbar ist.»

Nicht verwenden:

- «Beissen Sie auf die Zähne.»
- «Geben Sie nicht auf.»
- «Schmerz ist nur Schwäche.»
- «Sie müssen 90 Sekunden schaffen.»
- «Nur noch durchhalten, egal wie es sich anfühlt.»

### Erfolgsstatus

Ein Satz gilt als erfolgreich, sobald das leichte Zwischenziel erreicht wurde. Zusätzliche Sekunden werden separat gespeichert, aber nicht als Voraussetzung für Erfolg dargestellt.

### Pause

Zwischen den Sätzen:

- zwei Minuten Pausentimer
- Option «Pause überspringen» nur nach fachlicher Freigabe (siehe B.13.5)
- Hinweis: «Atmen Sie ruhig und lockern Sie die Beine.»
- nächste Satznummer anzeigen
- kein negativer Effekt auf den Erfolgsstatus, wenn jemand länger pausiert

### Unterbruch

Bei Pause, App-Wechsel oder Display-Sperre:

- Timerzustand korrekt erhalten
- keine verlorene Trainingseinheit
- nachvollziehbare Fortsetzung oder Beendigung ermöglichen

## §19 Rückmeldung nach der Einheit

Nach jedem Training erscheint eine Rückmeldung mit maximal vier kurzen Fragen.

### Frage 1: Durchführung

«Wie viel der Einheit haben Sie durchgeführt?» — vollständig, teilweise, nicht durchgeführt

### Frage 2: Belastung

«Wie anspruchsvoll war die Einheit?» — leicht, passend, sehr anstrengend

### Frage 3: Beschwerden

«Sind während oder nach dem Training Beschwerden aufgetreten?» — nein, ja

Bei Ja:

- neutraler Hinweis
- kein Diagnoseversuch
- nächstes Training nicht automatisch intensivieren
- bei der nächsten Einheit standardmässig die leichte Variante vorschlagen

### Frage 4: Wohlbefinden

«Wie fühlen Sie sich nach der Einheit?» — gut, neutral, eher schlecht

Danach:

- Einheit speichern
- positiver, sachlicher Abschluss
- Wochenfortschritt aktualisieren
- nächste geplante Einheit anzeigen

Beispiel: «Einheit gespeichert. Sie haben diese Woche zwei von drei geplanten Einheiten durchgeführt.»

## §20 Fortschrittsbereich

Der Fortschrittsbereich zeigt ausschliesslich Verhaltens- und Trainingsfortschritt.

Anzeigen:

- aktuelle Programmwoche
- absolvierte Programmwochen
- Einheiten dieser Woche
- absolvierte Einheiten insgesamt
- Verhältnis vollständig, teilweise und nicht durchgeführt
- erreichte Zwischenziele
- Anzahl freiwilliger Zusatzziele
- Kalender mit Trainingstagen
- aktuelle Routine oder Serie
- längste Serie
- durchschnittliche subjektive Belastung
- Meilensteine

Nicht anzeigen:

- medizinischen Erfolg
- Blutdruckwirkung
- geschätzte Blutdrucksenkung
- Vergleich mit anderen Personen
- Ranglisten
- «gesund» oder «ungesund»
- Schuldzuweisungen bei verpassten Einheiten

## §21 Motivation und Behavioral Design

Die App verwendet wenige, etablierte Verhaltensmechanismen.

### A. Konkreter Plan

Die Person wählt drei Trainingstage, eine bevorzugte Uhrzeit und optional eine bestehende Alltagsroutine.

Beispiel: «Nach dem Feierabend starte ich mein Wallsit-Training.»

### B. Kleine nächste Handlung

Die Startseite zeigt immer nur die nächste relevante Handlung:

- «Training starten»
- «Nächste Einheit planen»
- «Einheit abschliessen»
- «Weiter mit Woche 4»

### C. Sichtbarer Fortschritt

- Wochenziel 0 bis 3
- Programmfortschritt 1 bis 12
- Meilensteine
- bereits erreichte Zwischenziele

### D. Positives Feedback

Geeignete Texte:

- «Erste Einheit abgeschlossen.»
- «Wochenziel erreicht.»
- «Regelmässigkeit ist wichtiger als Perfektion.»
- «Nach einer Pause zählt der Wiedereinstieg.»
- «Ihr persönliches Ziel wurde erreicht.»

### E. Wiedereinstieg

Wenn Einheiten verpasst wurden:

- keine verlorene Serie prominent hervorheben
- keine roten Misserfolgsanzeigen
- keine nachzuholenden Doppeleinheiten
- Button «Heute wieder einsteigen»
- leichte Variante vorschlagen
- Text: «Eine Pause beendet das Programm nicht. Starten Sie heute mit der nächsten passenden Einheit.»

### F. Meilensteine

- erste Einheit
- erste vollständige Trainingswoche
- fünf Einheiten
- zehn Einheiten
- vier Wochen
- Halbzeit
- acht Wochen
- zwölf Wochen
- Programm abgeschlossen

Meilensteine verwenden kurze, dezente Animationen.

Keine Punkte, virtuellen Währungen, Ranglisten oder Wettbewerbselemente im MVP.

## §22 Learning-Bereich

Der Learning-Bereich besteht aus kurzen Karten.

Jede Karte enthält:

- Titel
- kurze Einleitung
- höchstens drei Kernbotschaften
- einen einfach umsetzbaren Tipp
- optional ein Bild oder eine Illustration
- Quellenhinweis im redaktionellen System
- Freigabestatus für Medical, Legal und Marketing

Die App zeigt keine individuelle medizinische Empfehlung.

### Lernkarte 1: Wallsits und Bewegung

Kernbotschaften:

- Wallsits sind eine kurze Form isometrischer Bewegung
- die App unterstützt eine regelmässige Durchführung
- Wallsits ersetzen nicht alle anderen Bewegungsformen
- zusätzliche Alltagsbewegung bleibt sinnvoll

Praktische Beispiele: kurze Spaziergänge, Treppen statt Lift, regelmässige Bewegungspausen, normales Krafttraining, moderate Ausdauerbewegung.

Nicht behaupten, dass die einzelne Person durch das Programm einen bestimmten Blutdruckeffekt erreicht.

### Lernkarte 2: Salz im Alltag

Kernbotschaften:

- viele verarbeitete Lebensmittel enthalten viel Salz
- Etiketten können beim Vergleichen helfen
- Kräuter und Gewürze können Geschmack ergänzen

Praktischer Tipp: «Probieren Sie das Essen zuerst, bevor Sie nachsalzen.»

### Lernkarte 3: Regelmässige Bewegung

Kernbotschaften:

- kurze Einheiten können den Einstieg erleichtern
- Alltagsbewegung und geplantes Training ergänzen sich
- Regelmässigkeit ist wichtiger als einzelne perfekte Tage

### Lernkarte 4: Körpergewicht

Neutral und nicht stigmatisierend formulieren. Keine individuelle Gewichtsdiagnose und kein automatisch berechnetes Abnehmziel.

### Lernkarte 5: Alkohol

Allgemeine Information, keine individuelle Konsumdiagnose.

### Lernkarte 6: Schlaf

Praktische Tipps: möglichst regelmässige Schlafzeiten, ruhige Abendroutine, passende Schlafumgebung.

### Lernkarte 7: Stress und Erholung

Praktische Tipps: kurze Pausen, bewusste Atmung, Spaziergänge, feste Erholungszeiten.

### Reihenfolge der Lernkarten

Die Reihenfolge kann anhand nicht medizinischer Onboarding-Antworten priorisiert werden:

- wenig Zeit: Bewegung und kurze Routinen zuerst
- Stress oder Müdigkeit: Schlaf und Stress früher
- Wunsch nach Wissen: Lernkarte auf Startseite hervorheben
- körperliche Beschwerden: allgemeine Hinweise zur sicheren Bewegung, keine Diagnose

Alle endgültigen Lerntexte müssen in einer zentralen Inhaltsdatei liegen, damit Medical, Legal und Marketing sie ohne Codeänderung prüfen und freigeben können.

## §23 Blutdrucktagebuch

Das Blutdrucktagebuch ist freiwillig und klar vom Trainingsprogramm getrennt.

### Grundprinzip

Die Funktion dient ausschliesslich zur manuellen Dokumentation selbst gemessener Werte.

Sie:

- misst keinen Blutdruck
- bewertet keine Werte
- interpretiert keine Werte
- empfiehlt keine Behandlung
- passt das Training nicht an
- verknüpft Blutdruckwerte nicht mit einzelnen Trainingseinheiten
- behauptet keine Wirkung

### Eingabefelder

Pro Messung:

- Datum
- Uhrzeit
- systolischer Wert
- diastolischer Wert
- optional Puls
- optional persönliche Notiz
- optional Kennzeichnung «morgens» oder «abends»

### Darstellung

Erlaubt:

- chronologische Liste der selbst eingegebenen Werte
- Bearbeiten eines eigenen Eintrags
- Löschen eines eigenen Eintrags
- Export der eigenen Rohdaten
- neutrale Bestätigung «Wert gespeichert»

Vor regulatorischer Freigabe nicht implementieren:

- Durchschnittsberechnung
- Trendlinie
- Zielbereich
- Farbcodierung
- automatische Bewertung
- Interpretation einzelner Werte
- Vergleich vor und nach dem Programm
- Korrelation mit Trainingseinheiten
- Arztbericht
- Warnmeldungen auf Basis der Werte

### Messinformationen

Zeige eine statische Informationskarte mit allgemein freizugebenden Hinweisen:

- möglichst ein validiertes Oberarmmessgerät verwenden
- fünf Minuten ruhig im Sitzen warten
- immer möglichst zur gleichen Tageszeit messen
- am gleichen Arm messen
- Arm und Manschette auf Herzhöhe halten
- während der Messung nicht sprechen
- mindestens zwei Messungen mit mindestens einer Minute Abstand durchführen
- Werte unverändert notieren
- möglichst nicht direkt nach körperlicher Anstrengung messen
- ärztlich vereinbarte Messanweisungen haben Vorrang

Die Schweizerische Hypertonie-Gesellschaft empfiehlt unter anderem fünf Minuten Ruhe im Sitzen, Messung möglichst zur gleichen Tageszeit und am gleichen Arm, idealerweise morgens vor blutdrucksenkenden Medikamenten, keine körperliche oder geistige Anstrengung vorher sowie mindestens zwei Messungen im Abstand von mindestens einer Minute. Diese Inhalte müssen vor Verwendung redaktionell und medizinisch freigegeben werden.

### Messwochen

Die App kann optional eine allgemeine Messwoche anbieten:

- sieben aufeinanderfolgende Tage
- morgens und abends
- pro Zeitpunkt zwei Messungen
- Messungen mindestens eine Minute auseinander

Dies wird nur als allgemeine Dokumentationsroutine dargestellt. Die App berechnet und bewertet im MVP keinen Durchschnitt.

### Erinnerung zur Messung

Blutdruck-Erinnerungen sind:

- freiwillig
- separat aktivierbar
- nicht anhand von Blutdruckwerten personalisiert
- nicht mit medizinischen Aussagen verbunden

Voreinstellung: morgens und abends zu je einer selbst gewählten Uhrzeit.

Die App darf anhand der gewählten Trainingszeit lediglich eine zeitliche Überschneidung vermeiden. Beispiel: Wenn das Training für 18:00 Uhr geplant ist, darf die App vorschlagen, eine Blutdruckerinnerung nicht unmittelbar danach zu setzen.

Die App formuliert neutral: «Wählen Sie für Ihre Messung eine ruhige Zeit ausserhalb des Trainings.»

Die App darf nicht formulieren: «Messen Sie jetzt, damit wir prüfen können, ob das Training wirkt.»

## §24 Notifications

Technische Umsetzung siehe B.13.2.

### Training

- am gewählten Trainingstag
- zur selbst gewählten Uhrzeit
- optional eine einmalige freundliche Wiederholung

Beispiele:

- «Heute ist eine Ihrer drei geplanten Einheiten.»
- «Ihre nächste Wallsit-Einheit ist bereit.»
- «Heute leicht einsteigen? Auch das Zwischenziel zählt.»

### Blutdrucktagebuch

Nur mit separater Zustimmung:

- «Zeit für Ihre freiwillige Blutdruckdokumentation.»
- «Nehmen Sie sich vor der Messung einige ruhige Minuten.»

### Regeln

- keine medizinischen Behauptungen
- keine Anzeige eines Blutdruckwertes auf dem Sperrbildschirm
- keine beschämenden Nachrichten
- keine häufigen Erinnerungen
- einfache Deaktivierung
- Ruhezeiten respektieren

## §25 Einstellungen

Die Person kann:

- Trainingstage ändern
- Trainingszeit ändern
- Notifications aktivieren oder deaktivieren
- Blutdruckerinnerungen separat steuern
- Profilangaben bearbeiten
- Einwilligungen ansehen
- eigene Daten exportieren
- Blutdruckeinträge löschen
- Benutzerkonto und Daten löschen
- Willkommen und Sicherheitsinformationen erneut öffnen
- Datenschutzerklärung und Impressum aufrufen

## §26 Anonymisiertes Pilot-Dashboard für Helsana

Erstelle einen separaten, geschützten Admin-Bereich (Zugang siehe B.9). Das Dashboard soll bewusst schlank bleiben. Es zeigt keine Namen, E-Mail-Adressen oder individuellen medizinischen Bewertungen.

### Übersicht

- Anzahl aktivierter Pilot-IDs
- Anzahl begonnener Onboardings
- Anzahl abgeschlossener Onboardings
- Anzahl gestarteter Programme
- Anzahl aktiver Teilnehmender
- Anzahl abgeschlossener Programme
- gesamte absolvierte Einheiten
- durchschnittliche Einheiten pro Woche
- Anteil vollständig, teilweise und nicht abgeschlossen
- Nutzung der leichten Variante
- Nutzung der normalen Variante
- Nutzung des freiwilligen Zusatzziels
- durchschnittlich erreichte Haltezeit
- häufigste Abbruchpunkte
- Nutzung des Learning-Bereichs
- geöffnete Lernkarten
- Aktivierung von Notifications
- Nutzung des Blutdrucktagebuchs
- Anzahl dokumentierter Blutdruckeinträge

### Fragebogenauswertung

Aggregiert anzeigen:

- Aktivitätsniveau
- Wallsit-Erfahrung
- häufigste Barrieren
- bevorzugte Unterstützung
- bevorzugte Trainingstage
- bevorzugte Tageszeit
- Zuversicht beim Start
- subjektive Belastung nach Einheiten
- Wohlbefinden nach Einheiten
- gemeldete Beschwerden als Anzahl oder Anteil

### Datenschutzgrenze

Im Dashboard nicht anzeigen:

- Namen
- E-Mail-Adressen
- genaue Geburtsdaten
- einzelne Blutdruckwerte
- medizinische Profile
- Freitextnotizen aus dem Blutdrucktagebuch
- Kombinationen kleiner Gruppen, die Personen identifizierbar machen könnten (Mindestgruppengrösse siehe B.13.7)

### Filter

Nur wenige Filter: Programmwoche, Kalenderzeitraum, aktive oder inaktive Teilnahme, leichte oder normale Variante.

Keine Rangliste einzelner Personen.

### Export

CSV-Export anonymisierter Nutzungsdaten. Der Export enthält:

- Pilot-ID
- Programmwoche
- pseudonymisierte Ereignisse
- Trainingsvariante
- Zielzeit
- tatsächliche Haltezeit
- Durchführung vollständig, teilweise oder nicht
- Belastungsrückmeldung
- Wohlbefindensrückmeldung
- Beschwerden ja oder nein
- Lernkarten-Nutzung
- Notification-Nutzung
- Anzahl Blutdruckeinträge, aber keine Werte im Standardexport

Ein separater Export von medizinisch sensiblen Rohdaten darf nur nach expliziter fachlicher, rechtlicher und datenschutzrechtlicher Freigabe implementiert werden; im MVP nicht implementieren.

## §27 Ereignismodell für die Pilotauswertung

Erfasse mindestens folgende anonymisierte Ereignisse. Modelliere sie als typisierte Union; ein Test erzwingt Vollständigkeit.

- consent_completed
- onboarding_started
- onboarding_completed
- welcome_carousel_completed
- training_plan_created
- session_checkin_completed
- session_started
- light_variant_selected
- standard_variant_selected
- personal_target_reached
- optional_target_started
- optional_target_reached
- set_stopped_early
- session_paused
- session_completed
- session_partially_completed
- session_abandoned
- post_session_feedback_completed
- learning_card_opened
- notification_enabled
- notification_disabled
- bp_diary_opt_in
- bp_entry_created
- bp_entry_edited
- bp_entry_deleted
- program_week_completed
- program_completed

Speichere bei Ereignissen nur Daten, die für die Pilotauswertung benötigt werden.

## §28 Inhaltsverwaltung

Alle kundensichtbaren Texte werden zentral verwaltet (Struktur siehe B.5). Dazu gehören:

- Willkommens-Texte
- Sicherheitshinweise
- Timer-Hinweise
- Motivationsnachrichten
- Learning-Karten
- Blutdruck-Messhinweise
- Einwilligungstexte
- Fehlermeldungen
- Notification-Texte

Für jeden Inhalt sollen folgende Metadaten möglich sein: Content-ID, Version, Verantwortungsbereich, Status Entwurf oder freigegeben, Freigabe Medical, Freigabe Legal, Freigabe Datenschutz, Freigabe Marketing, Freigabedatum.

Baue keine medizinischen Texte direkt verteilt in mehrere Komponenten ein.

## §29 Fehler- und Sonderfälle

Die App muss sinnvoll reagieren, wenn:

- eine Person das Onboarding unterbricht
- keine Notifications erlaubt werden
- ein Training unterbrochen wird
- der Browser geschlossen wird
- die Internetverbindung ausfällt
- eine Einheit teilweise durchgeführt wird
- mehrere Trainingstage verpasst werden
- Beschwerden gemeldet werden
- eine Person die freiwillige Zusatzzeit nicht beginnt
- die zwölf Wochen abgeschlossen sind
- Daten gelöscht werden
- ein Blutdruckeintrag versehentlich doppelt eingegeben wird
- die Bildschirmgrösse sehr klein ist

Keine Trainings- oder Blutdruckdaten dürfen durch einen einfachen Seitenwechsel verloren gehen. Dokumentiere das Verhalten je Fall kurz in der README; die datenkritischen Fälle sind durch Tests abgedeckt (B.11).

## §30 Datenschutz und Sicherheit

Behandle sämtliche Profil-, Trainings- und Blutdruckdaten als sensible Gesundheitsdaten.

Umsetzen:

- Datenminimierung
- Zweckbindung
- Einwilligungsmanagement
- verschlüsselte Datenübertragung
- sichere Speicherung
- Rollen- und Rechtekonzept
- Trennung zwischen Teilnehmer-App und Admin-Dashboard
- Protokollierung administrativer Zugriffe
- Schutz vor unberechtigtem Export
- Löschkonzept
- Aufbewahrungskonzept
- keine Drittanbieter-Tracker ohne Freigabe
- keine Weitergabe an generative KI-Dienste
- keine echten Kundendaten in Test- oder Demo-Umgebungen
- sichere Behandlung von Zugangscodes
- Schutz gegen gängige Web-Sicherheitsrisiken

Treffe keine Annahmen zur produktiven Helsana-Infrastruktur. Da der MVP local-first arbeitet (B.4), unterscheide in `docs/` klar zwischen im Code umgesetzten Massnahmen und Massnahmen, die erst beim Betrieb greifen; dokumentiere für letztere die vorgesehenen Schnittstellen und Konfigurationspunkte.

## §31 Mindestanforderungen an die Benutzerfreundlichkeit

Eine Testperson muss ohne Erklärung:

- das Onboarding abschliessen können
- drei Trainingstage auswählen können
- ein Training starten können
- die leichte oder normale Variante verstehen
- das persönliche Zwischenziel erkennen
- einen Satz erfolgreich beenden können
- die freiwillige Zusatzzeit verstehen
- eine Einheit abschliessen können
- den Wochenfortschritt sehen können
- eine Lernkarte öffnen können
- einen Blutdruckwert eintragen und wieder löschen können
- Notifications deaktivieren können
- eigene Daten löschen können

## §32 Pilot-Erfolgskriterien

Die App soll folgende Fragen beantwortbar machen:

- Verstehen die Teilnehmenden das Programm?
- Schliessen sie das Onboarding ab?
- Starten sie die erste Einheit?
- Führen sie drei Einheiten pro Woche durch?
- Welche Variante nutzen sie?
- Erreichen sie ihre persönlichen Zwischenziele?
- Nutzen sie freiwillige Zusatzzeit?
- An welcher Stelle brechen sie Einheiten ab?
- Wie bewerten sie die Belastung?
- Welche Barrieren treten auf?
- Helfen Erinnerungen beim Wiedereinstieg?
- Welche Lerninhalte werden genutzt?
- Wird das freiwillige Blutdrucktagebuch genutzt?
- Bleiben die Teilnehmenden über zwölf Wochen aktiv?

Die App selbst beantwortet nicht, ob der Blutdruck medizinisch verbessert wurde. Eine allfällige Programmevaluation erfolgt ausserhalb der kundensichtbaren App und unter separater fachlicher und rechtlicher Verantwortung.

---

# Teil D — Abnahme, Arbeitsauftrag, Abschlussausgabe

## §33 Abnahmekriterien

Die Umsetzung gilt als vollständig, wenn:

- alle MVP-Screens funktional vorhanden sind
- der gesamte zwölfwöchige Programmablauf funktioniert
- drei Einheiten pro Woche geplant werden können
- leichte und normale Varianten je Woche korrekt hinterlegt sind
- das persönliche Zwischenziel und das freiwillige Zusatzziel korrekt funktionieren
- alle vier Sätze und Pausen geführt werden
- Unterbrechungen korrekt behandelt werden
- Rückmeldungen gespeichert werden
- Fortschritt korrekt aktualisiert wird
- das Blutdrucktagebuch nur Rohdaten dokumentiert
- das Pilot-Dashboard anonymisierte Nutzung zeigt
- keine medizinische Interpretation implementiert ist
- responsive Darstellung funktioniert
- grundlegende Barrierefreiheit umgesetzt ist
- Datenschutz- und Löschfunktionen vorhanden sind
- alle kundensichtbaren Texte zentral verwaltet werden
- automatisierte Tests für Kernlogik vorhanden sind (Umfang gemäss B.11)
- eine verständliche README vorhanden ist
- Demo-Daten klar als synthetisch gekennzeichnet sind
- keine echten Personendaten verwendet werden
- die Definition of Done aus B.12 erfüllt ist
- `docs/regulatorik-matrix.md` vollständig ausgefüllt ist
- die Umsetzung dem Design System «Unify» entspricht: nur Semantic Tokens im UI, keine Hex-Werte in Komponenten, Abstände aus der Tier-Skala, Light- und Dark-Modus geprüft, Fokus-States sichtbar, Icons als Material Symbols Rounded
- keine Statusfarbe bewertet einen Gesundheits-, Blutdruck- oder Trainingszustand

## §34 Arbeitsauftrag

Arbeite in dieser Reihenfolge:

1. Prüfe den Repository-Zustand gemäss B.1 und richte dich danach.
2. Erstelle `docs/umsetzungsuebersicht.md` mit Informationsarchitektur, Datenmodell und zentralen Zuständen. Arbeite danach ohne Zwischenfreigabe weiter.
3. Implementiere den vollständigen MVP in den Etappen aus A.7.
4. Verwende realistische, aber eindeutig synthetische Demo-Daten.
5. Implementiere die Kernlogik nicht nur als visuelle Attrappe.
6. Führe Linter, Typecheck, Tests und Build gemäss B.12 aus.
7. Behebe Fehler, die durch deine Änderungen entstehen.
8. Dokumentiere Start, Konfiguration, Datenmodell, Contentverwaltung, Pilot-Dashboard und die Vorentscheide aus B.13.
9. Verändere keine bestehenden Tests, nur um Fehler zu verdecken.
10. Hinterlasse keine Secrets, realen Kundendaten oder nicht dokumentierten externen Abhängigkeiten.

## §35 Abschlussausgabe

Berichte am Ende kompakt. Der erste Satz nennt das Ergebnis, danach folgen in dieser Reihenfolge:

- was implementiert wurde
- welche Entscheidungen du getroffen hast, die über B.13 hinausgehen
- welche Dateien besonders wichtig sind
- wie die App gestartet wird
- wie Demo-Daten geladen werden
- wie das Admin-Dashboard geöffnet wird
- welche Tests ausgeführt wurden und mit welchem Ergebnis
- welche Punkte vor einem echten Kundenpilot noch durch Medical, Legal, Datenschutz, Security und Regulatory freigegeben werden müssen

Keine Wiederholung der Spezifikation, keine Fliesstext-Zusammenfassung des Codes.
