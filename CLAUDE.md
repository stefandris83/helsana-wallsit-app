# CLAUDE.md — Helsana Wallsit-Pilot

Diese Datei gilt für jede Session in diesem Projekt (wird automatisch geladen).
Sprache der Session-Kommunikation und aller Dokumentation: Deutsch, Schweizer Rechtschreibung, kein ß.

# Teil A — Arbeitsvereinbarung

## A.1 Rolle und Auftrag

Du bist verantwortlich für die vollständige Umsetzung einer schlanken, mobile-first Web-App für einen Helsana-Piloten mit einem zwölfwöchigen Wallsit-Programm. Die App wird direkt von ausgewählten Testkundinnen und Testkunden verwendet. Sie soll ohne technische Vorkenntnisse verständlich sein und die regelmässige Durchführung eines einfachen Bewegungsprogramms unterstützen.

Lies das gesamte Dokument, bevor du mit der Umsetzung beginnst.

Setze die App als funktionierenden, konsistenten MVP um. Hinterlasse keine leeren Screens, funktionslosen Buttons, Platzhalterlogik oder nicht implementierten Kernfunktionen.

## A.2 Scope-Disziplin

Liefere genau den beschriebenen Umfang. Triff Routineentscheidungen selbst und frage nur nach, wenn unterschiedliche Lesarten zu materiell unterschiedlicher Arbeit führen würden. Wenn eine Anforderung fehlerhaft, widersprüchlich oder fachlich fragwürdig erscheint oder ein besserer Ansatz existiert, sage das in einem Satz und führe den Auftrag anschliessend wie beschrieben weiter, statt ihn still zu verengen, auszuweiten oder umzuformen. Führe die Aufgabe vollständig zu Ende und unterlasse Handlungen, die klar über den Auftrag hinausgehen.

Erweitere den Funktionsumfang nicht über die Spezifikation hinaus. Füge keine Bibliotheken hinzu, die über die in B.2 genannten hinausgehen, ausser eine Anforderung ist ohne sie nicht umsetzbar; dokumentiere jede solche Ergänzung in der README.

## A.3 Kommunikation während der Session

Sage vor dem ersten Tool-Aufruf in einem Satz, was du vorhast. Während der Arbeit gibst du nur dann ein kurzes Update, wenn du etwas Wichtiges findest oder die Richtung wechselst. Am Ende führt der erste Satz das Ergebnis, danach folgen Details für Lesende, die mehr wollen.

Korrigiere eine frühere Aussage nur, wenn der Fehler Code, Schlussfolgerungen oder Entscheidungen des Auftraggebers verändert. Kleine Ausrutscher ohne Folge behebst du still.

## A.4 Subagenten

Delegiere nur für grosse, wirklich unabhängige und parallelisierbare Arbeitsblöcke. Delegiere keine Arbeit, die du selbst in wenigen Tool-Aufrufen abschliessen kannst, und nutze keine Subagenten, um deine eigene Arbeit zu prüfen. Wenn ein Subagent genügt, nimm einen statt mehrere. Halte die Anzahl gestarteter Agenten insgesamt niedrig (Obergrenze: drei in dieser Session).

Diese Obergrenze gilt nicht, wenn der Auftraggeber im Prompt ausdrücklich einen Workflow oder eine breite Parallelisierung verlangt. Dann gilt der Umfang, den er nennt.

## A.5 Keine zusätzlichen Prüfschleifen

Es gilt die Definition of Done in B.12: führe die dort genannten Befehle aus und behebe, was fehlschlägt. Baue darüber hinaus keine separaten Verifikations- oder Review-Durchgänge ein und beauftrage keine Prüf-Subagenten.

## A.6 Länge schriftlicher Deliverables

Passe die Länge geschriebener Dokumente dem Zweck an: Substanz vollständig abdecken, aber nicht mit Füllabschnitten, redundanten Zusammenfassungen oder Boilerplate aufblähen. Als Kalibrierung: Umsetzungsübersicht kompakt, README so lang wie nötig für Start, Konfiguration, Datenmodell, Contentverwaltung und Dashboard, weitere Dokumente jeweils kurz.

## A.7 Umsetzungsreihenfolge

Arbeite in folgenden Etappen. Jede Etappe endet in einem lauffähigen Zustand mit grünem Build. Warte zwischen den Etappen nicht auf Bestätigung, sondern arbeite durch.

1. **Fundament:** Projektsetup, Design-Tokens und Tailwind-Konfiguration aus `design-system.md` (siehe B.8), Routing und Navigation, Persistenzschicht, Content-Registry, Ereignis-Logger.
2. **Zugang und Onboarding:** Einwilligung, Willkommens-Carousel, Profil, Startfragebogen, Sicherheitsbestätigung, Erstellung des Wochenplans.
3. **Trainingskern:** Heute-Screen, Check-in, Wallsit-Anleitung, Timer-Engine mit Zwischenziel und freiwilligem Zusatzziel, Rückmeldung nach der Einheit, Speicherung.
4. **Fortschritt und Motivation:** Fortschrittsbereich, Meilensteine, Wiedereinstieg, regelbasierte Personalisierung, Learning-Bereich.
5. **Blutdruck und Einstellungen:** freiwilliges Blutdrucktagebuch, Erinnerungen, Einstellungen, Datenexport und Löschung.
6. **Pilot-Dashboard:** geschützter Admin-Bereich, Aggregation, Filter, CSV-Export, Anonymisierungsregeln.
7. **Abschluss:** Tests vervollständigen, Lint, Typecheck, Build, README und weitere Dokumentation, Regulatorik-Matrix.

---

# Teil B — Technischer Rahmen und Vorentscheide

## B.1 Repository-Zustand

Falls im Arbeitsverzeichnis ein bestehendes Repository liegt: analysiere es zuerst und verwende dessen sinnvolle Konventionen, Stack und Struktur; die Vorgaben in B.2 und B.3 gelten dann nur, wo das Repository keine Vorgabe macht. Falls das Verzeichnis leer ist oder nur Dokumentation enthält: behandle das Projekt als Neuentwicklung und verwende B.2 und B.3. Erfinde keine Konventionen aus einer Codebasis, die nicht existiert.

## B.2 Stack

- Vite, React, TypeScript im Strict Mode
- Tailwind CSS für Styling; die Konfiguration wird nicht selbst entworfen, sondern aus Kapitel 11 des Design Systems übernommen (siehe B.8)
- React Router für Navigation
- Zustand (oder ein gleichwertiger, schlanker Store) für Anwendungszustand
- Vitest, @testing-library/react und jsdom für Tests
- ESLint und Prettier
- keine Backend-Abhängigkeit, kein externer Auth-Provider, keine Analytics-Bibliothek, keine Schriftarten oder Skripte von externen CDN

## B.3 Verzeichnisstruktur

Orientiere dich an folgender Struktur und begründe Abweichungen kurz in der README:

```
src/
  app/            Routing, Layout, Navigation
  screens/        Screens je Bereich (heute, fortschritt, lernen, blutdruck, einstellungen, admin, onboarding)
  components/     wiederverwendbare UI-Bausteine
  domain/         Programmlogik: Wochenmatrix, Timer-Engine, Check-in-Regeln, Fortschritt, Personalisierung
  data/           Persistenz, Storage-Adapter, Ereignis-Log, Export
  content/        alle kundensichtbaren Texte inklusive Metadaten
  design/         tokens.css und Typo-Utilities, übernommen aus design-system.md
  demo/           synthetische Demodaten
  test/           Test-Setup und Hilfsfunktionen
docs/             Umsetzungsübersicht, Datenmodell, Regulatorik-Matrix, Schnittstellen
```

## B.4 Persistenz und Datenfluss

- Die App ist local-first. Alle Teilnehmerdaten liegen im Browser des Geräts; im MVP verlassen keine Daten das Gerät.
- Definiere ein Interface `StorageAdapter` mit einer Implementierung gegen den lokalen Browser-Speicher und einem dokumentierten, nicht aktivierten Stub für eine späteres serverseitige Ablage. Alle Lese- und Schreibzugriffe der Domänenlogik laufen über dieses Interface.
- Schreibe zustandsverändernde Aktionen unmittelbar und atomar. Ein Seitenwechsel, ein Reload oder ein Tab-Wechsel darf keine Trainings-, Onboarding- oder Blutdruckdaten verlieren.
- Führe ein append-only Ereignis-Log gemäss §27. Ereignisse werden nie überschrieben oder gelöscht, ausser über die Löschfunktion in §25.
- Trenne Identitätsdaten (Zugangscode, optionale Kontaktangabe) technisch und im Datenmodell von Nutzungsdaten (Ereignisse, Trainings, Fragebogen). Das Dashboard und der Export greifen ausschliesslich auf Nutzungsdaten zu.

## B.5 Content-Registry

`src/content/` ist die einzige Quelle kundensichtbarer Texte. Verbindlich:

- Jeder Eintrag hat: `id`, `version`, `owner` (Verantwortungsbereich), `status` (`draft` oder `approved`), `approvals` (medical, legal, privacy, marketing), `approvedAt`, `text` beziehungsweise strukturierte Felder, optional `source`.
- Komponenten und Screens enthalten keine kundensichtbaren Textliterale, sondern referenzieren ausschliesslich Content-IDs. Das gilt auch für Fehlermeldungen, Button-Labels, Timer-Hinweise und Notification-Texte.
- Die Wochenmatrix aus §15, die Lernkarten aus §22 und die Messhinweise aus §23 liegen jeweils in genau einer Datei.
- Neue Inhalte starten im Status `draft`. Der Status führt in der Teilnehmeransicht zu keiner Verhaltensänderung.

**Gesamtfreigabe vom 03.08.2026 (erteilt durch den Auftraggeber, Mitarbeiter/in Helsana):** Sämtliche zu diesem Zeitpunkt bestehenden Inhalte sind für Medical, Legal, Datenschutz und Marketing freigegeben. Die Freigabe ist an den konkreten Wortlaut gebunden und in `src/content/release-approval.ts` samt Fingerabdruck je Content-ID hinterlegt. Hinweise auf ausstehende Freigaben wurden aus der Oberfläche entfernt.

**Die Freigabepflicht bleibt bestehen.** Die Gesamtfreigabe gilt ausschliesslich für den Stand vom 03.08.2026, nicht für spätere Arbeit. Daraus folgt:

- Ein neuer Content-Eintrag oder ein geänderter Wortlaut fällt automatisch auf `status: 'draft'` zurück; der Test in `src/content/content-compliance.test.ts` schlägt dann fehl. Erst nach ausdrücklicher Freigabe durch den Auftraggeber wird die Baseline mit `npm run content:approve` neu erzeugt.
- Bei jeder Änderung an kundensichtbarem Text, jedem neuen Feature mit kundensichtbaren Inhalten und jeder neu eingeführten Grafik, Illustration oder Videoquelle ist der Auftraggeber **vor dem Abschluss der Arbeit** auf die einschlägigen Vorgaben hinzuweisen — insbesondere §3 und B.6 (unzulässige Aussagetypen), B.5 (Content-Registry), B.8 (Design System, Semantic Tokens, Statusfarben) — und die Freigabe ist einzuholen. Das gilt auch dann, wenn die Änderung klein wirkt.
- Assets (Bilder, Videos, Logos, Schriften) benötigen zusätzlich eine dokumentierte Herkunfts- und Rechteangabe in der README, wie bei den bereits freigegebenen Assets.

## B.6 Regulatorische Schutzschicht im Code

Die Verbote aus §3 sind nicht nur redaktionell einzuhalten, sondern maschinenprüfbar abzusichern:

- `src/content/forbidden-claims.ts`: Musterliste unzulässiger Aussagetypen, abgeleitet aus §3 (Diagnose, Bewertung oder Kategorisierung von Werten, behauptete Wirkung des Trainings auf den Blutdruck, Zielwerte, Risiko- oder Prognoseaussagen, Medikamentenbezug, Therapieempfehlung).
- Ein Test prüft die gesamte Content-Registry gegen diese Liste und schlägt bei einem Treffer fehl.
- Ein Test belegt, dass die Vorschlagslogik des Check-ins bei identischer Tagesform unabhängig von vorhandenen Blutdruck- und Profildaten dasselbe Ergebnis liefert.
- Ein Test belegt, dass die Blutdruck-Datenschicht ausschliesslich Erstellen, Lesen, Bearbeiten, Löschen und Rohdatenexport anbietet und keine Aggregat-, Trend-, Bewertungs- oder Korrelationsfunktion exportiert.
- `docs/regulatorik-matrix.md`: Tabelle mit je einer Zeile pro Verbot aus §3, der Umsetzung im Code, der abdeckenden Testdatei und dem offenen Freigabebedarf.

## B.7 Timer-Engine

- Der Ablauf ist eine explizite Zustandsmaschine: Vorbereitung, Satz 1, Pause, Satz 2, Pause, Satz 3, Pause, Satz 4, Abschluss.
- Rechne die verbleibende Zeit aus Zeitstempeln, nicht aus aufaddierten Intervall-Ticks. Der Timer bleibt korrekt, wenn der Tab in den Hintergrund geht, das Display sperrt oder die Seite neu geladen wird.
- Persistiere den Timerzustand bei jedem Zustandswechsel und mindestens jede Sekunde, sodass nach einem Unterbruch eine nachvollziehbare Fortsetzung oder Beendigung möglich ist.
- Ansagen für Screenreader über eine höfliche Live-Region: Satzwechsel, Erreichen des Zwischenziels, Pausenbeginn und Abschluss. Keine sekündliche Ansage.
- Kein Ton und keine Vibration im MVP.

## B.8 Design System «Unify» (verbindlich)

Die visuelle Umsetzung folgt vollständig dem Helsana Design System «Unify». Die Spezifikation liegt im Projekt-Root als `design-system.md`. Lies sie zu Beginn von Etappe 1, bevor du die erste Komponente schreibst. Erfinde keine eigenen Farben, Abstände, Schriftgrössen, Radien oder Komponentenvarianten.

**Übernahme statt Neuentwurf:**

- `src/design/tokens.css` entsteht durch Übernahme der CSS-Implementierung aus Kapitel 10 (Primitives, Semantic Tokens Light, Light-HC, Dark, Dark-HC, System-Preference-Fallback, Typo-Utilities, Layout-Container).
- `tailwind.config.js` entsteht durch Übernahme von Kapitel 11. Keine Tailwind-Standardpalette, keine arbitrary values wie `text-[#9A0941]` oder `p-[13px]`.
- Komponenten folgen den Konventionen aus Kapitel 12 und der CSS-Referenzimplementierung in 12.23. Baue nur die Komponenten, die der MVP tatsächlich braucht.

**Nicht verhandelbare Regeln (Kapitel 1 und 14):**

- Im UI-Code ausschliesslich Semantic Tokens. Primitives (`brand-500`, `neutral-300`, …) kommen nur in `tokens.css` vor. Keine Hex-Werte in Komponenten.
- Abstände nur aus der Tier-Skala (`space-bee`, `space-rat`, `space-dog`, …). Keine krummen Werte.
- Radius 2 px als Default, 4 px für Cards, `border-radius-full` nur für Pills und Avatare.
- Schrift `Akkurat Helsana` in 300/400/700, keine anderen Schnitte. Typo-Tokens (`h1`–`h5`, `body-*`, `helper-*`, `lead`) statt eigener Grössen.
- Icons: Material Symbols Rounded in 16/24/32 px, Farbe über `text-*`-Token.
- Light- und Dark-Modus sind beide Pflicht. Die HC-Modi werden über `data-color-mode` mit angelegt, aber im MVP nicht als Benutzereinstellung angeboten.
- Fokus immer sichtbar über `:focus-visible`, Touch-Targets mindestens 44 × 44 px, Statusfarbe nie alleiniger Bedeutungsträger (immer Icon plus Text), Kontrast in allen angelegten Modi geprüft, `prefers-reduced-motion` respektiert, Textzoom bis 200 Prozent ohne Layoutbruch.

**Vorrang der regulatorischen Grenzen (§3) vor dem Design System:**

Das Design System enthält `status-red-*` und `status-green-*` Tokens. Diese sind ausschliesslich für technische UI-Zustände zulässig: Formularvalidierung, Inline-Notifications, Offline-Hinweise, Speicherbestätigungen. Sie dürfen nie einen Gesundheits-, Blutdruck- oder Trainingszustand bewerten. Konkret: keine Statusfarbe an Blutdruckwerten, an Zwischen- oder Zusatzzielen, an verpassten Einheiten oder an Fortschrittsanzeigen. Bei Konflikt gilt §3.

**Freigegebene Einzelausnahme (erteilt durch den Auftraggeber, 31.07.2026):** Die Abschlussmarkierung des heutigen Trainingstages («Heute erledigt» auf dem Heute-Screen) darf das dekorative Helsana-Grün (`decorative-green-*`, nicht `status-green-*`) als Akzentfarbe für das Check-Icon verwenden. Begründung des Auftraggebers: Diese Markierung bewertet keinen Gesundheits- oder Trainingszustand, sondern zeigt ausschliesslich an, dass die heutige Einheit erledigt ist — kein Ampel-Vergleich zu anderen Zuständen. Die Ausnahme gilt ausschliesslich für dieses eine Icon. Sie öffnet keine allgemeine Erlaubnis für Statusfarben an anderen Fortschritts-, Blutdruck- oder Trainingsanzeigen; weitere Ausnahmen dieser Art sind im Einzelfall neu zu genehmigen und hier zu dokumentieren.

**Fehlende Assets:**

- Die Schriftdateien `Akkurat Helsana` sind lizenzpflichtig und liegen nicht vor. Setze die Font-Stack-Deklaration aus Kapitel 4.1 inklusive Fallback (`"Helvetica Neue", Arial, sans-serif`), binde keine Schriftdateien ein, lade nichts von einem externen CDN und vermerke die Lizenzabhängigkeit in der README.
- Das offizielle Helsana-Logo-SVG lag ursprünglich nicht vor; Vorgabe war ein dokumentierter Platzhalter-Slot. *Freigegeben durch den Auftraggeber am 31.07.2026 (Mitarbeiter/in Helsana):* das offizielle Logo darf von der Helsana-Webseite bezogen und eingebunden werden. Quelle und Bezugsdatum sind in der README zu vermerken.
- Die Figma-Referenzen in Kapitel 15 sind nur Herkunftsnachweis. Baue keine Abhängigkeit zu einem Figma-Zugriff auf; `design-system.md` ist die Quelle der Wahrheit.

**Automatisiert geprüft (ergänzt B.11):**

- Ein Test schlägt fehl, wenn in `src/components` oder `src/screens` ein Hex-Farbwert oder ein Primitive-Token vorkommt.
- Ein Test schlägt fehl, wenn ein Status-Token in einer Blutdruck- oder Fortschrittskomponente verwendet wird.

## B.9 Zugang, Pilot-ID und Admin-Bereich

- Zugang über einen anonymen Einladungscode aus einer lokalen, synthetischen Codeliste. Jeder Code ist genau einer Pilot-ID zugeordnet. Kein Konto, kein Passwort, keine E-Mail-Pflicht im MVP.
- Der Admin-Bereich liegt auf einer eigenen Route und ist durch einen Code aus einer Umgebungsvariable geschützt (`.env.example` mit Beispielwert, keine Secrets im Repository). Dokumentiere ausdrücklich, dass dies kein produktiver Authentisierungsmechanismus ist und welche Schnittstelle produktiv vorgesehen wäre.
- Administrative Zugriffe werden lokal protokolliert (Zeitpunkt, Aktion, kein Personenbezug).

## B.10 Demodaten

Synthetische Demodaten liegen in `src/demo/`, werden nur über eine ausdrückliche Aktion oder ein Flag geladen und sind in der Oberfläche sichtbar als Demodaten gekennzeichnet. Keine realen Personendaten, keine realistischen Namen, keine echten Blutdruckverläufe realer Personen.

## B.11 Tests der Kernlogik

Automatisierte Tests deckungspflichtig für:

1. Wochenmatrix: alle zwölf Wochen, leichte und normale Variante, optionale Zusatzziele, Pausendauer.
2. Erfolgslogik: ein Satz gilt ab Erreichen des Zwischenziels als erfolgreich; freiwillige Zusatzsekunden werden separat gespeichert und sind keine Erfolgsvoraussetzung.
3. Timer-Zustandsmaschine mit vier Sätzen und drei Pausen, geprüft mit kontrollierter Zeit.
4. Unterbruch und Wiederaufnahme: Reload während eines Satzes, Wechsel in den Hintergrund, Zeitsprung.
5. Check-in-Vorschlagslogik: alle Regeln aus §16 inklusive Unabhängigkeit von Blutdruck- und Profildaten (siehe B.6).
6. Fortschrittsberechnung: Wochenziel, verpasste Einheiten ohne Nachholstapelung, aktuelle und längste Serie, Meilensteine.
7. Vollständigkeit des Ereignismodells aus §27.
8. Blutdrucktagebuch: Erstellen, Bearbeiten, Löschen, Erkennung eines versehentlichen Doppeleintrags, Rohdatenexport.
9. Anonymisierung: Standardexport und Dashboard enthalten keine Namen, keine Kontaktangaben, keine Freitextnotizen und keine einzelnen Blutdruckwerte; die Mindestgruppengrösse wird eingehalten.
10. Content-Compliance gemäss B.6.
11. Persistenz: kein Datenverlust bei Reload während Onboarding, Training oder Blutdruckeingabe.

## B.12 Definition of Done

Die Umsetzung ist fertig, wenn folgende Befehle ohne Fehler durchlaufen:

```
npm run lint
npm run typecheck
npm run test
npm run build
```

Zusätzlich: keine offenen TODO-Marker in kundensichtbaren Funktionspfaden, keine ungenutzten Platzhalterkomponenten, keine Secrets im Repository, alle Abnahmekriterien aus §33 erfüllt.

## B.13 Vorentscheide zu offenen Punkten

Diese Entscheide sind getroffen. Halte sie ein und dokumentiere sie in der README.

1. **Programmwoche:** *Revidiert am 31.07.2026 durch den Auftraggeber (UX-Begründung: der Wochenreset muss auf einen Montag fallen, damit «diese Woche» dem Kalender der Person entspricht).* Die Programmwoche ist die Kalenderwoche von Montag bis Sonntag. Woche 1 ist die Kalenderwoche, in der der Wochenplan erstellt wurde; ihr Wochenziel entspricht den ab dem Startdatum noch verbleibenden geplanten Trainingstagen, höchstens drei und mindestens einer. Ab Woche 2 gilt das Wochenziel von drei Einheiten. Das Programm läuft über zwölf Kalenderwochen. Es gibt keinen Übertrag in die nächste Woche.
   *Ursprüngliche Fassung: rollierender Sieben-Tage-Block ab Startdatum, nicht die Kalenderwoche.*
2. **Erinnerungen:** lokale Planung mit In-App-Hinweisen; optional zusätzlich die Benachrichtigungsschnittstelle des Browsers, ausschliesslich nach ausdrücklicher Zustimmung. Kein Push-Backend, kein Service Worker, keine Werte in Benachrichtigungstexten.
3. **Offline:** Die App funktioniert vollständig ohne Netzverbindung. Ein Ausfall betrifft nur optionale Medien; zeige dann einen ruhigen Hinweis statt eines Fehlerzustands.
4. **Anleitungsvideo:** eine Komponente mit konfigurierbarer Videoquelle über Umgebungsvariable, Slot für Untertitelspur und vollständiger Textalternative. Standard ist ein klar gekennzeichneter Platzhalter. Kein automatisch generiertes medizinisches Video.
5. **Pause überspringen:** hinter einem standardmässig deaktivierten Feature-Flag implementieren; die Schaltfläche erscheint nur bei aktivem Flag. In der README als freigabepflichtig markieren.
6. **Blutdruckexport:** Die Person kann ihre eigenen Rohdaten exportieren. Der Standard-Pilotexport enthält nur die Anzahl der Einträge, keine Werte.
7. **Mindestgruppengrösse im Dashboard:** Aggregierte Werte werden erst ab fünf zugrunde liegenden Personen angezeigt, sonst erscheint ein neutraler Hinweis auf zu wenige Daten. Der Schwellenwert liegt an einer Stelle konfigurierbar.
8. **Sprache:** ausschliesslich Deutsch mit Schweizer Rechtschreibung. Keine Internationalisierungsschicht, aber alle Texte über die Content-Registry.
9. **Sicherheitsbestätigung nach §12 Frage 3:** Der Onboarding-Fortschritt wird gespeichert; die Trainingsfunktion bleibt gesperrt, bis die Person aktiv bestätigt hat. Die Sperre ist im Code an einer Stelle gekapselt und im Dashboard als Anzahl sichtbar, nicht personenbezogen.
10. **Codebezeichner** in englischer Sprache, kundensichtbare Texte und Dokumentation auf Deutsch.

---


---

<tone_preference>
Halte die Session-Ausgaben knapp. Ausführliche Inhalte gehören in Dateien, nicht in Chat-Nachrichten. Liefere den beschriebenen Umfang, ohne ihn zu erweitern, und baue keine zusätzlichen Prüfschleifen ein.
</tone_preference>
