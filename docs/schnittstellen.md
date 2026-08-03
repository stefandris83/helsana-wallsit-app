# Schnittstellen und Betriebsmassnahmen

Der MVP arbeitet local-first (CLAUDE.md B.4). Diese Datei trennt, was **im Code umgesetzt** ist,
von dem, was **erst beim Betrieb** greift (spec.md §30).

## 1. Im Code umgesetzt

| Massnahme | Umsetzung |
|---|---|
| Datenminimierung | Ereignisse speichern nur auswertungsrelevante Felder (`eventPayloadFields`). Profildaten werden nicht fuer Berechnungen genutzt. |
| Zweckbindung | `PilotParticipantRecord` trennt Auswertungs- von Identitaetsdaten. |
| Einwilligungsmanagement | `ConsentState` mit fuenf Einzelbestaetigungen, separate Einwilligung fuer das Blutdrucktagebuch, jederzeit einsehbar und widerrufbar. |
| Trennung Teilnehmer-App / Admin | Eigene Route `/admin`, eigener Datenpfad ueber `buildPilotDataset()`, kein Zugriff auf Identitaetsdaten. |
| Protokollierung administrativer Zugriffe | `src/data/admin-log.ts`: Zeitpunkt und Aktion, kein Personenbezug, begrenzt auf 200 Eintraege. |
| Loeschkonzept | `deleteAllData()` entfernt Identitaet, Nutzungsdaten, Ereignis-Log, Blutdruckdaten, Timerzustand und Admin-Log. Zusaetzlich selektives Loeschen der Blutdruckeintraege. |
| Schutz vor unberechtigtem Export | Der Rohdatenexport ist auf die eigene Person begrenzt; der Pilotexport enthaelt keine Werte. Ein Export medizinisch sensibler Rohdaten ist bewusst nicht implementiert. |
| Freiwillige Uebermittlung | `src/data/report-sharing.ts`: nur auf Knopfdruck, keine Hintergrundsynchronisation. Der Bericht entsteht aus `PilotParticipantRecord` und wird zusaetzlich um die Profilangaben reduziert. Gegenprobe beim Einlesen in `src/data/report-import.ts`. |
| Keine Drittanbieter-Tracker | Keine Analytics-Bibliothek, keine externen CDN, keine Schriftdateien von Dritten. |
| Keine Weitergabe an generative KI-Dienste | Keine KI-Abhaengigkeit im Projekt. |
| Keine echten Kundendaten | Demodaten sind synthetisch und als solche gekennzeichnet (`src/demo/demo-data.ts`). |
| Sichere Behandlung von Zugangscodes | Codes werden nur lokal gegen eine synthetische Liste geprueft; der Code erscheint nie im Export. |
| Web-Sicherheitsrisiken | Keine `dangerouslySetInnerHTML`-Verwendung, keine Auswertung von URL-Parametern zu Zustandsaenderungen, keine `eval`-artigen Aufrufe. |

## 2. Erst im Betrieb wirksam

| Massnahme | Vorgesehene Schnittstelle / Konfigurationspunkt |
|---|---|
| Verschluesselte Datenuebertragung | Erst relevant mit serverseitiger Ablage. Vorgesehen: TLS gegen einen Helsana-Endpunkt, konfiguriert ueber `RemoteStorageAdapterStub` (`src/data/storage-adapter.ts`). |
| Sichere Speicherung | Serverseitige Verschluesselung im Ruhezustand. Im MVP liegen die Daten unverschluesselt im Browser-Speicher des Geraets — das ist im Datenschutzhinweis zu benennen. |
| Rollen- und Rechtekonzept | Teilweise umgesetzt: bei konfigurierter Berichtsablage meldet sich das Dashboard mit einem echten Konto an, und das Leserecht haengt an `public.report_readers` (Abschnitt 5). Ohne Ablage bleibt der Codeschutz ueber `VITE_ADMIN_CODE` als Platzhalter. Produktiv vorgesehen: Anbindung an das Helsana-Identitaetsmanagement mit Rollen «Auswertung lesen» und «Export erstellen». |
| Aufbewahrungskonzept | Serverseitige Loeschfristen je Datenkategorie. Im MVP nicht abbildbar, da keine zentrale Ablage existiert. |
| Codeverwaltung | `src/data/access-codes.ts` wird durch einen serverseitig verwalteten Bestand ersetzt; die Zuordnung Code zu Pilot-ID erfolgt dann ausserhalb des Clients. |
| Erinnerungen | Kein Push-Backend und kein Service Worker (B.13.2). Produktiv waere ein Push-Dienst mit eigener Einwilligung noetig. |
| Anleitungsvideo | `VITE_INSTRUCTION_VIDEO_URL` und `VITE_INSTRUCTION_VIDEO_TRACK_URL`. Standard ist ein Platzhalter; die Datei wird lokal ausgeliefert, nicht von einem externen CDN. |

## 3. Umgebungsvariablen

| Variable | Bedeutung | Standard |
|---|---|---|
| `VITE_ADMIN_CODE` | Zugangscode fuer `/admin`. Kein produktiver Authentisierungsmechanismus. | leer (Dashboard meldet fehlende Konfiguration) |
| `VITE_INSTRUCTION_VIDEO_URL` | Quelle des Anleitungsvideos (§17). | leer, Platzhalter wird angezeigt |
| `VITE_INSTRUCTION_VIDEO_TRACK_URL` | Untertitelspur zum Video. | leer |
| `VITE_FEATURE_SKIP_REST` | Feature-Flag «Pause ueberspringen» (B.13.5), freigabepflichtig. | `false` |
| `VITE_MIN_GROUP_SIZE` | Mindestgruppengroesse fuer Dashboard-Aggregate (B.13.7). | `5` |
| `VITE_REPORT_UPLOAD_URL` | Ablageordner fuer geteilte Ergebnisberichte (Abschnitt 5). | leer, Funktion ausgeblendet |
| `VITE_REPORT_UPLOAD_KEY` | Oeffentlicher Schluessel dazu, ausschliesslich Schreibrecht. | leer, Funktion ausgeblendet |
| `VITE_REPORT_UPLOAD_BUCKET` | Name des Ablageordners. | `berichte` |

Beispielwerte stehen in `.env.example`. Im Repository liegen keine Secrets: der Upload-Schluessel
ist keines, weil er ausschliesslich schreiben darf und ohnehin im Browser ausgeliefert wird
(Abschnitt 5).

## 4. Stub fuer serverseitige Ablage

`RemoteStorageAdapterStub` implementiert `StorageAdapter`, ist deaktiviert (`enabled = false`)
und wirft bei jedem Aufruf. Bei Aktivierung bleiben die Storage-Keys identisch; zusaetzlich
noetig waeren:

1. Authentisierung ueber ein kurzlebiges Token der Pilotplattform,
2. serverseitige Zuordnung der Pilot-ID,
3. getrennter Dienst fuer Identitaetsdaten (§8),
4. Konfliktbehandlung bei Mehrgeraetenutzung.

## 5. Ablageordner fuer geteilte Ergebnisberichte

Ergaenzt den local-first Betrieb um einen ausdruecklich ausgeloesten Upload (README, Abschnitt
«Ergebnisberichte teilen und einlesen»). Betreiber: Supabase, Projekt `wallsit-pilot`, Region
Zuerich (`eu-central-2`).

| Punkt | Umsetzung |
|---|---|
| Transport | HTTPS gegen die Storage-Schnittstelle, kein SDK, kein zusaetzliches Paket |
| Berechtigung Schreiben | `berichte_anon_insert`: `insert` fuer `anon` im Ordner `berichte` |
| Berechtigung Lesen | `berichte_reader_select`: `select` fuer angemeldete Konten, deren Adresse in `public.report_readers` steht |
| Lesen und Loeschen mit dem ausgelieferten Schluessel | gesperrt, geprueft am 03.08.2026 |
| Anmeldung des Dashboards | E-Mail und Passwort gegen `/auth/v1/token`; Token nur im Arbeitsspeicher, kein Refresh, keine Persistenz |
| Dateiname | `<Pilotnummer>-<Zeitstempel>.json`, kein Ueberschreiben moeglich |
| Groesse und Typ | auf 2 MB und `application/json` begrenzt |
| Konfiguration | `VITE_REPORT_UPLOAD_URL`, `VITE_REPORT_UPLOAD_KEY`, `VITE_REPORT_UPLOAD_BUCKET` |
| Abschaltung | fehlt einer der ersten beiden Werte, blendet die App die Funktion aus |

Noch offen fuer den Betrieb: Auftragsverarbeitungsvertrag mit dem Betreiber, Loeschfristen fuer
abgelegte Berichte, Zustimmung des Datenschutzes bei Helsana.
