# Helsana Wallsit-Pilot

Mobile-first Web-App fuer einen zwoelfwoechigen Wallsit-Piloten: drei Trainingseinheiten pro
Woche mit je vier Saetzen, gefuehrtem Timer, Fortschrittsanzeige, Lernkarten, freiwilligem
Blutdrucktagebuch und einem anonymisierten Pilot-Dashboard.

Die App ist **local-first**: alle Teilnehmerdaten bleiben im Browser des Geraets. Im MVP
verlassen keine Daten das Geraet.

> Die App ersetzt keine medizinische Untersuchung, Behandlung oder Beratung.

## Start

```bash
npm install
npm run dev
```

Die App laeuft anschliessend auf `http://localhost:5173`. Einstieg: Einladungscode eingeben.
Fuer den Test steht der synthetische Code **`WS-2026-A1B2`** zur Verfuegung (weitere Codes in
`src/data/access-codes.ts`).

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Typecheck und Produktionsbuild |
| `npm run preview` | Produktionsbuild lokal ansehen |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript im Strict Mode |
| `npm run test` | Vitest |
| `npm run format` | Prettier |
| `npm run content:approve` | Freigabe-Baseline der Content-Registry neu erzeugen — **erst nach erteilter Freigabe**, siehe «Contentverwaltung» |

## Konfiguration

Werte werden ueber Umgebungsvariablen gesetzt. `.env.example` nach `.env.local` kopieren.
Im Repository liegen keine Secrets.

| Variable | Bedeutung | Standard |
|---|---|---|
| `VITE_ADMIN_CODE` | Zugangscode fuer `/admin` | leer |
| `VITE_INSTRUCTION_VIDEO_URL` | Anleitungsvideo (§17) | leer, Platzhalter |
| `VITE_INSTRUCTION_VIDEO_TRACK_URL` | Untertitelspur | leer |
| `VITE_FEATURE_SKIP_REST` | Feature-Flag «Pause ueberspringen» — **freigabepflichtig** | `false` |
| `VITE_MIN_GROUP_SIZE` | Mindestgruppengroesse im Dashboard | `5` |

`BASE_PATH` ist keine Vite-Variable, sondern eine Build-Variable: sie setzt den Basis-Pfad der
Auslieferung (`vite.config.ts`). Lokal `/`, auf GitHub Pages `/<repository>/`.

## Auslieferung auf GitHub Pages

Repository: <https://github.com/stefandris83/helsana-wallsit-app>

| Zweck | Adresse |
|---|---|
| Teilnehmerinnen und Teilnehmer | <https://stefandris83.github.io/helsana-wallsit-app/> |
| Pilot-Dashboard | <https://stefandris83.github.io/helsana-wallsit-app/admin> |

Jeder Push auf `main` startet `.github/workflows/deploy.yml`: Lint, Typecheck, Tests, Build,
Deployment. Schlaegt einer der Schritte fehl, wird nichts veroeffentlicht. Der Workflow setzt
`BASE_PATH` aus dem Repository-Namen; ein Fork oder eine Umbenennung funktioniert ohne Anpassung.

Die App verwendet echte Pfade (`/heute`, `/admin`) statt Hash-Routing. GitHub Pages kennt diese
Pfade nicht als Dateien, deshalb erzeugt der Build zusaetzlich eine `404.html` als Kopie der
`index.html`. Ein Direktaufruf oder ein Reload einer Unterseite laedt damit dieselbe Anwendung,
die den Pfad selbst aufloest. `.nojekyll` verhindert die Jekyll-Verarbeitung.

**Grenzen dieser Auslieferung.** Sie ist fuer Demonstration und internes Testen gedacht, nicht
fuer einen Pilot mit echten Teilnehmerdaten:

- Der Zugangscode fuer `/admin` wird in das ausgelieferte JavaScript kompiliert und ist damit
  fuer jede Person lesbar, die die Seite aufruft. Der Deploy verwendet bewusst den erkennbaren
  Demo-Wert `pilot-admin-demo`. Ein Repository-Secret `VITE_ADMIN_CODE` uebersteuert ihn, aendert
  aber nichts an der Auslesbarkeit. Das bleibt der in CLAUDE.md B.9 beschriebene Platzhalter und
  ist kein produktiver Authentisierungsmechanismus.
- Die App ist local-first: Daten liegen im Browser des jeweiligen Geraets. Jede Besucherin und
  jeder Besucher startet mit leerem Zustand, und das Dashboard zeigt nur, was auf demselben
  Geraet entstanden ist. Fuer eine Vorfuehrung im Dashboard den Schalter «Demodaten» aktivieren.
- Der Einladungscode schuetzt nicht vor Zugriff, er ordnet nur eine Pilot-ID zu. Die Seite ist
  oeffentlich erreichbar; wer die Adresse kennt, kann die App verwenden.
- Das Repository ist oeffentlich und enthaelt neben dem Code auch `spec.md`, `design-system.md`
  und `CLAUDE.md` sowie das Helsana-Logo (Herkunft siehe «Design System «Unify»»).

## Projektstruktur

```
src/
  app/            Routing, Layout, Navigation, Theme, Erinnerungen, Konfiguration
  screens/        Bildschirme je Bereich (onboarding, heute, fortschritt, lernen,
                  blutdruck, einstellungen, admin)
  components/     UI-Bausteine nach design-system.md Kapitel 12
  domain/         Programmlogik ohne React und ohne Storage-Zugriff
  data/           StorageAdapter, Repositories, Ereignis-Log, Aggregation, Export, Store
  content/        alle kundensichtbaren Texte inklusive Metadaten
  design/         tokens.css, components.css, Design-Compliance-Test
  demo/           synthetische Demodaten
  test/           Test-Setup
docs/             Umsetzungsuebersicht, Datenmodell, Regulatorik-Matrix, Schnittstellen
scripts/          Wartungsbefehle (Freigabe-Baseline der Content-Registry)
```

Abweichungen von der Vorgabe in CLAUDE.md B.3:

- Die Tests liegen als `*.test.ts` neben dem geprueften Code statt gesammelt in `src/test/`.
  `src/test/` enthaelt nur das Setup. Das haelt Test und Gegenstand zusammen und erleichtert das
  Auffinden der Abdeckung je Modul.
- `scripts/` ist ergaenzt. Dort liegt `approve-content.ts`, das die Freigabe-Baseline der
  Content-Registry erzeugt (siehe «Contentverwaltung»). Ausgefuehrt wird es ueber `vite-node`,
  das bereits als Teil von Vitest vorliegt — keine zusaetzliche Abhaengigkeit.

## Datenmodell

Ausfuehrlich in [`docs/datenmodell.md`](docs/datenmodell.md). Kurzfassung:

- **Identitaetsdaten** (`hw.identity.v1`): Zugangscode, Pilot-ID, optionale Kontaktangabe.
- **Nutzungsdaten** (`hw.participant.v1`): Einwilligung, Profil, Fragebogen, Wochenplan,
  Trainingseinheiten, Einstellungen.
- **Ereignis-Log** (`hw.events.v1`): append-only, 27 Ereignistypen nach §27.
- **Blutdrucktagebuch** (`hw.bp.v1`): getrennt gehalten, im Pilotexport nur die Anzahl.
- **Timerzustand** (`hw.timer.v1`): laufende Einheit, sekuendlich persistiert.
- **Admin-Log** (`hw.admin.v1`): Zeitpunkt und Aktion, ohne Personenbezug.

Alle Zugriffe laufen ueber `StorageAdapter`. Neben der lokalen Implementierung existiert ein
dokumentierter, **nicht aktivierter** Stub fuer eine spaetere serverseitige Ablage.

## Contentverwaltung

`src/content/` ist die einzige Quelle kundensichtbarer Texte. Komponenten und Screens
enthalten keine Textliterale, sondern nur Content-IDs.

- Jeder Eintrag hat `id`, `version`, `owner`, `status`, `approvals` (medical, legal, privacy,
  marketing), `approvedAt`, Text bzw. strukturierte Felder und optional `source`.
- **Alle Inhalte sind freigegeben (Gesamtfreigabe vom 03.08.2026).** Der Auftraggeber
  (Mitarbeiter/in Helsana) hat saemtliche zu diesem Zeitpunkt bestehenden Inhalte fuer Medical,
  Legal, Datenschutz und Marketing freigegeben. `status` steht damit auf `approved`; in der
  Teilnehmeransicht aendert der Status nichts am Verhalten.
- **Die Freigabe ist an den Wortlaut gebunden.** `src/content/release-approval.ts` haelt je
  Content-ID einen Fingerabdruck ueber Text, Aufzaehlungen, Teilfelder und Quellenangabe
  (`fingerprint.ts`). Ein **neuer** Eintrag oder ein **geaenderter** Wortlaut faellt automatisch
  auf `draft` zurueck, und `content-compliance.test.ts` schlaegt fehl. Damit kann eine spaetere
  Textaenderung eine erteilte Freigabe nicht still uebernehmen.
- Je genau eine Datei: Wochenmatrix `src/domain/week-matrix.ts`, Lernkarten
  `src/content/learning-cards.ts`, Blutdruck-Messhinweise `src/content/bp-measurement-info.ts`.
- Verwendung: `t('id')`, `tList('id')`, `tField('id', 'feld')`, `tFieldOptional('id', 'feld')`;
  Zuordnung von Domaenenwerten zu Content-IDs in `src/content/mappings.ts`.

**Ablauf bei neuen oder geaenderten Texten.** Die Gesamtfreigabe gilt fuer den Stand vom
03.08.2026, nicht fuer spaetere Arbeit:

1. Text aendern oder neuen Eintrag anlegen. `npm run test` schlaegt fehl und nennt die betroffenen
   IDs — der Eintrag steht auf `draft`.
2. Freigabe beim Auftraggeber einholen. Bei kundensichtbaren Texten, neuen Features mit Inhalten
   und neuen Grafiken oder Videoquellen sind zusaetzlich §3 und B.6 (unzulaessige Aussagetypen)
   sowie B.8 (Design System) zu pruefen; Assets brauchen einen Herkunftsvermerk unter
   «Fehlende Assets».
3. Nach erteilter Freigabe die Baseline neu erzeugen:

```bash
npm run content:approve
```

Der Befehl erklaert den aktuellen Stand der Registry fuer freigegeben. Er ist deshalb **erst nach**
der tatsaechlichen Freigabe auszufuehren, nicht zum Gruenmachen eines fehlschlagenden Tests.

### Lernkarten (§22)

14 Karten in `src/content/learning-cards.ts`, redaktionelle Grundlage ist die medizinisch
abgenommene Fassung «Learning-Cards fuer die Blutdruck-App» vom 01.08.2026. Jede Karte hat
denselben Aufbau:

| Feld | Inhalt |
|---|---|
| `fields.topic` | kurzes Themenlabel ueber dem Titel (z. B. «Salz») |
| `fields.title` | die Kernaussage als Satz, zugleich Titel in der Uebersicht |
| `fields.intro` | zwei bis drei Saetze Einordnung |
| `items` | hoechstens drei Kernbotschaften (§22) |
| `fields.tip` | «Tipp fuer den Alltag» |
| `fields.safety` | optionaler Sicherheitshinweis, nur wo fachlich noetig |

Optional kommt eine Handlungsliste dazu (`…​.steps`, zugeordnet in
`learningCardStepIds`); im MVP nutzt sie die Karte «Blutdruck messen».

Die Tipps folgen bewusst dem Muster «Auslöser statt Vorsatz» — Kopplung an eine bestehende
Gewohnheit, Wenn-dann-Plan, Vorabfestlegung oder Substitution. Die Kernbotschaften sind
knappe Bullets mit je einem Gedanken. Beides wurde nach der medizinischen Abnahme
redaktionell nachbearbeitet; die Karten tragen `version: 2.1.0`, die Nachbearbeitung steht
in `source`, die fachlichen Aussagen und Inhaltselemente sind unveraendert.

### Reihenfolge der Lernkarten (§13, §22)

`orderLearningCards()` in `src/domain/personalization.ts` priorisiert regelbasiert ueber
Themenachsen (`learningCardTopics`). Eingang finden ausschliesslich nicht medizinische
Angaben:

- Huerden aus §12 Frage 6 — die erstgenannte wiegt schwerer
- Wandsitz-Erfahrung (Frage 2) und Aktivitaetsniveau (Frage 1)
- Wunsch nach Gesundheitswissen (Frage 7)
- Alltagstaetigkeit aus dem Profil (§11: «nicht medizinische Priorisierung allgemeiner
  Lerninhalte»)
- bereits gelesene Karten rutschen ans Ende, bleiben aber erreichbar

Bewusst **nicht** ausgewertet werden Blutdruckwerte, Tagebucheintraege, die Beschwerdefrage
(§12 Frage 3) sowie Gewicht, Taillenumfang, Geburtsjahr und Geschlecht — eine Priorisierung
daraus waere eine implizite Bewertung. `src/domain/personalization.test.ts` prueft das.
Weicht die Reihenfolge vom Standard ab, weist die Uebersicht transparent darauf hin.

Redaktion aendert Texte ausschliesslich in `src/content/` — ohne Codeaenderung an Screens.

## Regulatorische Schutzschicht

`src/content/forbidden-claims.ts` enthaelt die Musterliste unzulaessiger Aussagetypen aus §3.
`src/content/content-compliance.test.ts` prueft die gesamte Registry dagegen. Weitere
maschinelle Absicherungen und die vollstaendige Zuordnung Verbot → Umsetzung → Test stehen in
[`docs/regulatorik-matrix.md`](docs/regulatorik-matrix.md).

Bewusste Konsequenz: Der Begriff «Diagnose» kommt in keinem kundensichtbaren Text vor. Der
Disclaimer lautet deshalb «ersetzt keine medizinische Untersuchung, Behandlung oder Beratung».
Damit braucht die maschinelle Pruefung keine Ausnahmeregeln fuer Verneinungen.

**Zwei Musterkataloge.** Die medizinisch freigegebenen Lernkarten enthalten allgemeine
Gesundheitsinformation mit Mengenangaben, Wirkzusammenhaengen und Sicherheitshinweisen. Fuer
sie gilt `generalEducationClaimPatterns` statt des Vollkatalogs; die Auswahl trifft
`patternsForEntry()` und ist an das ID-Praefix `learning.card.` **und** `approvals.medical`
gebunden. Personenbezogene Aussagen bleiben ueberall gesperrt: alle in §3 aufgefuehrten
unzulaessigen Beispielsaetze werden auch vom reduzierten Katalog erkannt, was der Test
nachweist. Details und offener Freigabebedarf in
[`docs/regulatorik-matrix.md`](docs/regulatorik-matrix.md), Abschnitt «Ausnahme fuer
medizinisch freigegebene Lerninhalte».

## Demodaten

Synthetisch, ohne reale Personendaten, in `src/demo/demo-data.ts`.

- **Laden:** Einstellungen → Demodaten → «Demodaten laden». Danach zeigt die Kopfzeile die
  Kennzeichnung «Demodaten». Achtung: der aktuelle lokale Datenbestand wird ersetzt.
- **Entfernen:** Einstellungen → Demodaten → «Demodaten entfernen».
- **Im Dashboard:** unter `/admin` die Auswahl «Demodaten» aktivieren. Erst damit wird die
  Mindestgruppengroesse von fuenf Personen erreicht und die Aggregation sichtbar.

## Pilot-Dashboard

Erreichbar unter `/admin`, geschuetzt durch `VITE_ADMIN_CODE`.

**Der Codeschutz ist ein Platzhalter fuer den Pilot und kein produktiver
Authentisierungsmechanismus.** Produktiv vorgesehen ist eine Anbindung an das
Helsana-Identitaetsmanagement mit getrennten Rollen; siehe
[`docs/schnittstellen.md`](docs/schnittstellen.md).

Das Dashboard zeigt Uebersichtskennzahlen, Fragebogenauswertung, wenige Filter
(Programmwoche, Zeitraum, aktive/inaktive Teilnahme, Variante) und den CSV-Export. Es zeigt
keine Namen, keine Kontaktangaben, keine Geburtsdaten, keine Freitextnotizen und keine
einzelnen Blutdruckwerte. Aggregierte Werte erscheinen erst ab fuenf zugrunde liegenden
Personen, sonst ein neutraler Hinweis. Administrative Zugriffe werden lokal protokolliert.

## Vorentscheide (CLAUDE.md B.13)

1. **Programmwoche (revidiert am 31.07.2026):** Die Programmwoche ist die Kalenderwoche von
   Montag bis Sonntag. Woche 1 ist die Kalenderwoche des Startdatums; ihr Wochenziel
   entspricht den ab dem Startdatum noch verbleibenden geplanten Trainingstagen, hoechstens
   drei und mindestens einer. Ab Woche 2 gilt das Wochenziel von drei Einheiten. Kein
   Uebertrag nicht erreichter Einheiten. Der urspruengliche Vorentscheid sah einen
   rollierenden Sieben-Tage-Block ab Startdatum vor; er wurde verworfen, weil der Wochenreset
   sonst auf einen fuer die Person willkuerlichen Wochentag faellt und «diese Woche» nicht
   mehr dem Kalender entspricht.

   **Wahl der Startwoche (ergaenzt am 01.08.2026):** Im Wochenplan waehlt die Person, ob
   Woche 1 in der laufenden oder in der kommenden Kalenderwoche beginnt. Das Startdatum ist
   entsprechend heute oder der naechste Montag; Woche 1 ist die Kalenderwoche des
   Startdatums, nicht zwingend die der Planerstellung. Vorausgewaehlt ist die kommende
   Woche, sobald in der laufenden Woche weniger als zwei geplante Trainingstage uebrig sind
   — sonst waere Woche 1 nur eine Restwoche mit einer einzigen Einheit. Die Regel ist rein
   kalendarisch (`suggestStartChoice` in `src/domain/progress.ts`) und kennt weder Profil-
   noch Blutdruckdaten. Bis zum Startdatum laeuft keine Programmwoche: der Heute-Screen zeigt
   eine Vorstart-Karte mit Startdatum und Anleitung statt eines Trainingsstarts, Trainings-
   erinnerungen ruhen, und der Fortschritt weist auf den Start hin. «Doch heute beginnen»
   zieht das Startdatum auf heute vor — dadurch entstehen keine Einheiten ausserhalb des
   Programms. §27 kennt kein eigenes Ereignis dafuer; protokolliert wird eine erneute
   Planerstellung mit `startChoice`.
2. **Erinnerungen:** lokale Planung mit In-App-Hinweisen; Systembenachrichtigungen des Browsers
   nur nach ausdruecklicher Zustimmung. Kein Push-Backend, kein Service Worker, keine Werte in
   Benachrichtigungstexten. Ruhezeit 22:00–07:00.
3. **Offline:** Die App funktioniert vollstaendig ohne Netz. Faellt die Verbindung aus,
   erscheint ein ruhiger Hinweis; betroffen sind nur optionale Medien.
4. **Anleitungsvideo:** Komponente mit konfigurierbarer Quelle, Slot fuer Untertitel und
   vollstaendiger Textalternative. Standard ist ein klar gekennzeichneter Platzhalter.
5. **Pause ueberspringen:** hinter `VITE_FEATURE_SKIP_REST`, standardmaessig aus.
   **Freigabepflichtig durch Medical.**
6. **Blutdruckexport:** Die Person exportiert ihre eigenen Rohdaten als CSV. Der
   Standard-Pilotexport enthaelt nur die Anzahl der Eintraege.
7. **Mindestgruppengroesse:** fuenf, konfigurierbar ueber `VITE_MIN_GROUP_SIZE`.
8. **Sprache:** ausschliesslich Deutsch mit Schweizer Rechtschreibung, keine
   Internationalisierungsschicht, alle Texte ueber die Content-Registry.
9. **Sicherheitsbestaetigung (§12 Frage 3):** Onboarding wird gespeichert, die Trainingsfunktion
   bleibt gesperrt bis zur aktiven Bestaetigung. Gekapselt in `src/domain/access.ts`, im
   Dashboard nur als Anzahl sichtbar.
10. **Codebezeichner** englisch, kundensichtbare Texte und Dokumentation deutsch.

## Weitere Entscheide

- **Geschlecht als Pflichtangabe (ergaenzt am 01.08.2026, Freigabe des Auftraggebers):** §11
  fuehrt das Geschlecht als optionales Feld. Auf Wunsch des Auftraggebers ist es seit dem
  01.08.2026 ein Pflichtfeld mit den Auswahlwerten weiblich, maennlich und divers; «keine
  Angabe» wird nicht mehr angeboten. Zweck ist die Auswahl der Uebungsillustration auf dem
  Heute-Screen, was im Feldhinweis auch so benannt wird. Der Wert `unspecified` bleibt im Typ
  erhalten, damit Bestandsprofile weiter lesbar sind; sie muessen die Auswahl beim naechsten
  Bearbeiten nachholen (`profileDraftFrom` setzt das Feld dann leer). Die Angabe steuert
  ausschliesslich die Bildauswahl — Trainingsinhalt, Zielzeiten und Lernkarten-Reihenfolge
  bleiben davon unberuehrt (§3).
- **Zwischenziel-Verhalten:** Der Satz laeuft ohne Unterbruch durch. Beim Erreichen des
  persoenlichen Zwischenziels wechselt die Anzeige auf die Skala des freiwilligen Zusatzziels;
  der bereits erreichte Anteil bleibt als gruener Ringabschnitt sichtbar, die Zusatzzeit laeuft
  violett weiter. Der Satz endet automatisch beim Zusatzziel — beziehungsweise beim
  Zwischenziel, wenn es keines gibt — und kann ueber «Satz erfolgreich beenden» jederzeit
  vorzeitig beendet werden. Der Erfolg haengt weiterhin allein am Zwischenziel.
- **Rueckmeldung beim Zwischenziel:** «Zwischenziel erreicht. Sehr gut.» erscheint als kurze,
  nicht blockierende Einblendung fuer fuenf Sekunden, waehrend der Timer sichtbar weiterlaeuft.
- **Abschluss der Einheit:** Nach dem letzten Satz fuehrt die App unmittelbar zur Rueckmeldung.
  Deren Kopfbereich uebernimmt den Abschluss: eine Gratulation je nach Ausgang, die Einordnung
  in die Woche und das Ergebnis in Alltagssprache («Alle 4 Wandsitze gehalten»). Wer die App
  vorher schliesst, kommt ueber «Heute» mit «Feedback zur Einheit geben» direkt dorthin zurueck.
- **Rhythmus: sanftes Tor statt Sperre.** Vor dem Start prueft `evaluateStartGate` vier Lagen —
  heute bereits trainiert, Wochenziel erreicht, gestern trainiert, Ruhetag. Die ersten drei
  loesen eine Rueckfrage aus, die jederzeit uebersteuerbar ist; die App verhindert nie eine
  Einheit. Die Abweichung wird auf der Einheit und im Ereignis `session_started` als
  `deviation` festgehalten und im Dashboard als «Einheiten ueber der Wochenempfehlung»
  ausgewiesen. Begruendung: Die Spezifikation verlangt, eine vierte Einheit nicht zu
  *empfehlen* — nicht, sie zu verbieten. Eine harte Sperre waere eine vorschreibende Aussage
  und wuerde zudem verbergen, was der Pilot laut §32 gerade messen soll. **Ob daraus eine
  harte Grenze wird, entscheidet Medical.**
- **Tagesstatus auf «Heute»:** Ein Statusband zeigt «Heute ist Trainingstag», «Heute ist
  Ruhetag», «Heute erledigt» oder «Wochenziel erreicht», darunter ein Wochenstreifen Mo–So mit
  erledigten und geplanten Tagen. An Ruhetagen und nach erreichtem Wochenziel ist der Start
  eine sekundaere Aktion; damit bleibt es bei maximal einer primaeren Aktion pro Screen.
- **Ueberschreitung sichtbar statt gesperrt:** Ab der vierten Einheit zeigt die Wochenzeile
  «4 Einheiten diese Woche. Empfohlen sind 3.» statt eines Ziels — sachlich, ohne Wertung.
- **Ringfarben:** Bis zum Zwischenziel faerbt sich der gefuellte Bogen mit zunehmender Zielnaehe
  von `text-primary` in das dekorative Helsana-Gruen (`decorative-green-darker`). Die
  Einfaerbung ist quadratisch gestaffelt, bleibt also anfangs neutral und ist beim Zwischenziel
  vollstaendig gruen. In der Zusatzphase bleibt dieser Anteil gruen, die Zusatzzeit laeuft in
  `text-decorative` weiter. Verwendet werden bewusst dekorative Tokens und keine Status-Tokens,
  damit keine Farbe einen Trainingszustand bewertet (CLAUDE.md B.8).
- **Unterbruchgrenze:** Liegt der letzte beobachtete Tick mehr als fuenf Minuten zurueck, gilt
  die Einheit als unterbrochen und die Person entscheidet zwischen Fortsetzen und Beenden. Der
  Wert liegt bewusst ueber der Pausendauer von zwei Minuten, damit gedrosselte
  Hintergrund-Tabs waehrend einer regulaeren Pause keine Unterbrechung ausloesen.
- **Serie:** aufeinanderfolgende geplante Trainingstage mit durchgefuehrter Einheit. Ein
  heutiger, noch offener Trainingstag unterbricht die Serie nicht.
- **Wiedereinstieg:** ab zehn Tagen ohne Einheit.
- **Dashboard-Datengrundlage:** im MVP der lokale Datensatz plus optional die synthetischen
  Demo-Datensaetze. Im Betrieb tritt an diese Stelle die serverseitige Pilotdatenbank.

## Verhalten in Fehler- und Sonderfaellen (§29)

| Fall | Verhalten |
|---|---|
| Onboarding wird unterbrochen | Jeder Schritt wird sofort gespeichert; beim naechsten Start geht es an derselben Stelle weiter. |
| Notifications werden nicht erlaubt | Der Schalter bleibt aus, ein Hinweis erklaert es; In-App-Erinnerungen laufen weiter. |
| Training wird unterbrochen | Der Timerzustand wird sekuendlich persistiert. Nach kurzer Unterbrechung laeuft er aus Zeitstempeln weiter, nach mehr als fuenf Minuten erscheint die Auswahl «Fortsetzen» oder «Einheit beenden». |
| Browser wird geschlossen | Alle Daten liegen bereits im lokalen Speicher; nichts geht verloren. |
| Internetverbindung faellt aus | Ruhiger Hinweis; die App bleibt vollstaendig bedienbar. |
| Einheit nur teilweise durchgefuehrt | Erreichte Saetze werden gespeichert; die Rueckmeldung schlaegt «teilweise» vor. |
| Mehrere Trainingstage verpasst | Wiedereinstiegskarte ohne Schuldzuweisung, leichte Variante wird vorgeschlagen, keine Doppeleinheiten. |
| Beschwerden gemeldet | Kein direkter Start; neutraler Hinweis, «Heute aussetzen» oder Rueckkehr zum Check-in. |
| Freiwillige Zusatzzeit wird nicht begonnen | Der Satz gilt unveraendert als erfolgreich. |
| Zwoelf Wochen abgeschlossen | Abschlusskarte auf «Heute»; Fortschritt bleibt sichtbar, freiwilliges Weitertrainieren moeglich. |
| Daten werden geloescht | Alle sechs Speicherbereiche werden entfernt, die App startet beim Zugangscode. |
| Blutdruckeintrag versehentlich doppelt | Gleiches Datum, gleiche Uhrzeit und gleiche Zahlen loesen eine Rueckfrage aus. |
| Sehr kleine Bildschirmgroesse | Mobile-first ab 375 px, einspaltiges Layout, Touch-Targets mindestens 44 × 44 px, Textzoom bis 200 Prozent ohne Layoutbruch. |

## Design System «Unify»

Die visuelle Umsetzung folgt `design-system.md`.

- `src/design/tokens.css` uebernimmt Kapitel 10 (Primitives, Semantic Tokens fuer light,
  light-hc, dark, dark-hc, System-Preference-Fallback, Typo-Utilities, Layout-Container).
- `tailwind.config.js` uebernimmt Kapitel 11; ergaenzt wurde ausschliesslich das technisch
  notwendige `content`-Feld.
- Im UI-Code kommen nur Semantic Tokens vor. Primitives und Hex-Werte stehen ausschliesslich in
  `tokens.css`. `src/design/design-compliance.test.ts` prueft das automatisch, ebenso das Verbot
  von arbitrary values und von Statusfarben an Blutdruck- und Fortschrittsdarstellungen.
- Textfarben laufen ueber die Klassen `text-primary`, `text-secondary` usw. in
  `components.css`. Grund: Tailwind wuerde aus `colors.text.primary` die Klasse
  `text-text-primary` erzeugen; das Design System schreibt die Schreibweise `text-*` vor.
- Randbreiten laufen ueber `u-border-top` / `u-border-bottom` statt ueber Tailwind, weil
  `border-s` und `border-l` mit den logischen Seiten-Utilities kollidieren wuerden.
- **Abweichung von Kapitel 12.10/12.11:** Der Auswahlzustand von Radio Buttons, Checkboxen und
  Auswahlkarten ist `interactive-primary` (Helsana-Rot, im Dark-Modus Pink) statt des im Design
  System vorgesehenen `text-primary`. So bewusst entschieden, damit die Auswahl dieselbe
  Interaktionsfarbe traegt wie die Buttons.
- **Abstaende Ueberschrift zu Inhalt:** Abschnittsueberschriften (`h2`, `h3`) haben eine
  Basisregel `margin-block-end: space-bee`, die den Flex-Gap des Containers um eine Stufe
  ergaenzt (z. B. 12 px + 4 px = 16 px). Fragegruppen (`RadioGroup`, `CheckboxGroup`) setzen
  16 px zwischen Frage und erster Antwortoption, 4 px zwischen Frage und Hinweistext und 8 px
  zwischen den Optionen. Formularfelder halten 8 px zwischen Label und Feld.
- Fragegruppen verwenden `role="radiogroup"` beziehungsweise `role="group"` mit
  `aria-labelledby` statt `fieldset`/`legend`: Ein `legend` wird von Browsern ausserhalb des
  Flusses gerendert, wodurch der Abstand zur ersten Antwortoption nicht zuverlaessig steuerbar
  ist. Der zugaengliche Name bleibt erhalten.

### Fehlende Assets

- **Schrift `Akkurat Helsana`**: lizenzpflichtig und nicht im Projekt. Gesetzt ist der
  Font-Stack aus Kapitel 4.1 inklusive Fallback (`"Helvetica Neue", Arial, sans-serif`). Es
  werden keine Schriftdateien eingebunden und nichts von einem externen CDN geladen. **Vor dem
  Pilot ist die Lizenz zu klaeren und die Schrift lokal auszuliefern.**
- **Helsana-Logo**: eingebunden als `src/components/HelsanaLogo.tsx`, Asset in
  `src/assets/helsana-logo.svg`. Ursprünglich als Platzhalter vorgesehen (CLAUDE.md B.8); am
  31.07.2026 durch den Auftraggeber (Mitarbeiter/in Helsana) freigegeben und von der offiziellen
  Helsana-Webseite bezogen (`helsana.ch`, Header-Logo, unverändert übernommen). Die Datei trägt
  fest die Markenfarbe aus dem Corporate Design; eine `constant-white`-Fläche dahinter sichert
  im Dark-Modus ausreichenden Kontrast und ist im Light-Modus auf dem weissen Header unsichtbar.
- **Icons**: Die offiziellen Material-Symbols-SVGs liegen nicht vor, externe CDN sind
  ausgeschlossen. `src/components/Icon.tsx` enthaelt daher lokal vereinfacht nachgezeichnete
  Glyphen mit den Namen und Groessen aus Kapitel 9.1. **Vor dem Pilot durch die offiziellen
  Assets ersetzen**; die Komponentenschnittstelle bleibt unveraendert.
- **Illustrationen der Anleitung**: schlichte SVGs aus Semantic Tokens und als Platzhalter
  gekennzeichnet.
- **Anleitungsvideo**: Der produktive Standard bleibt der gekennzeichnete Platzhalter
  (`VITE_INSTRUCTION_VIDEO_URL` leer, siehe «Konfiguration»); `.env.example` aendert sich nicht.
  Fuer eine erste lokale Demo hat der Auftraggeber am 02.08.2026 die Verwendung eines externen
  Physitrack-Uebungsvideos freigegeben
  (`https://media.physitrack.com/exercises/78c2dfb7-ca1e-4bb4-9c83-aeb2881edb5a/en/video_1280x720.mp4`).
  Die URL ist ausschliesslich in der nicht versionierten `.env.local` hinterlegt und wird per
  `<video src>` referenziert, nicht heruntergeladen oder im Repository gespeichert. Es handelt
  sich um ein generisches Drittanbieter-Uebungsvideo (nicht Helsana-Branding, keine
  Untertitelspur) fuer die Erstansicht der Demo; **vor dem Kundenpilot ist ein eigenes,
  medizinisch abgenommenes Anleitungsvideo bereitzustellen.**
- **Illustrationen des Willkommens-Carousels**: `src/assets/onboarding-wallsit.png`,
  `onboarding-woche.png`, `onboarding-varianten.png` und `onboarding-sicherheit.jpg`, eingebunden
  ueber `src/screens/onboarding/WelcomeVisual.tsx`. Vom Auftraggeber am 02.08.2026 bereitgestellt
  und freigegeben, Vorlage «Parousel onboarding – anleitung zur Umsetzung». Inhaltlich unveraendert
  uebernommen; bearbeitet wurde nur die Groesse: alle vier einheitlich auf 640 x 426 px, damit die
  Karten beim Blaettern nicht in der Hoehe springen. Karte 4 hat keinen Alphakanal und liegt
  deshalb als JPEG (22 kB statt 189 kB); die drei uebrigen bleiben PNG mit Alphakanal. Geladen wird
  ausschliesslich lokal. Wie beim Logo liegt eine `constant-white`-Flaeche dahinter, damit die
  Graustufen-Zeichnungen auch im Dark-Modus lesbar bleiben.
  **Offen:** Karte 3 nennt im Bild «20 s» fuer die leichte Variante; die Wochenmatrix (§15) startet
  in Woche 1–2 bei 30 s. Der Kartentext nennt bewusst keine Sekunden, das Bild ist aber vor dem
  Pilot zu korrigieren oder freizugeben.
- **Wandsitz-Illustrationen**: `src/assets/wandsitz-frau.png` und `wandsitz-mann.png`, eingebunden
  ueber `src/components/WandsitzFigure.tsx`. Vom Auftraggeber am 01.08.2026 bereitgestellt und
  freigegeben. Die Originale (1536 x 1024, je rund 2,2 MB) wurden freigestellt, auf 200 px Breite
  reduziert und als Graustufe mit Alphakanal gespeichert (52 kB bzw. 40 kB); geladen wird
  ausschliesslich lokal. Wie beim Logo liegt eine `constant-white`-Flaeche dahinter, damit die
  Strichzeichnung auch im Dark-Modus lesbar bleibt. **Fuer «Divers» liegt bisher keine eigene
  Zeichnung vor**; dort wird die weibliche Darstellung gezeigt, bis eine dritte Zeichnung vorliegt.

## Abhaengigkeiten ueber CLAUDE.md B.2 hinaus

| Paket | Grund |
|---|---|
| `@types/node` | `src/design/design-compliance.test.ts` liest Quelldateien vom Dateisystem. Ohne Node-Typen ist die in B.8 geforderte automatische Pruefung auf Hex-Werte und Primitive-Tokens nicht typsicher umsetzbar. |
| `globals` | Standard-Globals-Definitionen fuer die ESLint-Flat-Config. |
| `@testing-library/dom` | Peer-Abhaengigkeit von `@testing-library/react`. |

Keine weiteren Bibliotheken, keine Backend-Abhaengigkeit, kein externer Auth-Provider, keine
Analytics-Bibliothek, keine externen Schriftarten oder Skripte.

## Barrierefreiheit

Fokus immer sichtbar ueber `:focus-visible`, Touch-Targets mindestens 44 × 44 px, Statusfarbe
nie alleiniger Bedeutungstraeger (immer Icon plus Text), Light- und Dark-Modus geprueft,
`prefers-reduced-motion` respektiert, Textzoom bis 200 Prozent ohne Layoutbruch,
Screenreader-Ansagen des Timers ueber eine hoefliche Live-Region (Satzwechsel, Zwischenziel,
Pausenbeginn, Abschluss — keine sekuendliche Ansage), Sprunglink zum Inhalt.

## Tests

`npm run test` fuehrt 408 Tests in 14 Dateien aus. Abgedeckt sind die elf in CLAUDE.md B.11
geforderten Bereiche:

| Bereich | Datei |
|---|---|
| Wochenmatrix | `src/domain/week-matrix.test.ts` |
| Erfolgslogik, Timer-Zustandsmaschine, Unterbruch | `src/domain/timer-engine.test.ts` |
| Check-in-Vorschlagslogik | `src/domain/checkin-rules.test.ts` |
| Fortschritt, Serien, Meilensteine | `src/domain/progress.test.ts` |
| Ereignismodell | `src/data/event-model.test.ts` |
| Blutdrucktagebuch und erlaubte Schnittstelle | `src/data/bp-repository.test.ts` |
| Anonymisierung und Mindestgruppengroesse | `src/data/anonymisation.test.ts` |
| Content-Compliance gegen §3 | `src/content/content-compliance.test.ts` |
| Persistenz und Unabhaengigkeit des Check-ins | `src/data/store.test.ts` |
| Design-System-Konformitaet | `src/design/design-compliance.test.ts` |
| Rhythmus-Tor vor dem Start | `src/domain/session-gate.test.ts` |
| Personalisierung und ihre Grenzen | `src/domain/personalization.test.ts` |
| Routing und Zugang | `src/app/App.test.tsx` |

## Vor dem Kundenpilot noch freizugeben

Siehe [`docs/regulatorik-matrix.md`](docs/regulatorik-matrix.md), Abschnitt «Offene fachliche
Freigaben».

**Die Inhalte der Content-Registry sind seit dem 03.08.2026 vollstaendig freigegeben** (Medical,
Legal, Datenschutz, Marketing; siehe «Contentverwaltung»). Die Freigabe gilt fuer den damaligen
Wortlaut: neue oder geaenderte Texte fallen automatisch auf `draft` zurueck und sind erneut
freizugeben.

Offen sind weiterhin: Schriftlizenz und offizielle Icon-Assets, das produktive
Anleitungsvideo, der produktive Authentisierungsmechanismus fuer das Dashboard sowie das
Feature-Flag «Pause ueberspringen». Das Helsana-Logo ist bereits freigegeben und eingebunden
(siehe «Fehlende Assets» oben). Fuer das Anleitungsvideo liegt seit 02.08.2026 eine freigegebene
Demo-Quelle vor (siehe «Fehlende Assets»); ein eigenes, medizinisch abgenommenes Video steht
weiterhin aus.
