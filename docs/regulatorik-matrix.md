# Regulatorik-Matrix

Je Verbot aus `spec.md` §3: Umsetzung im Code, abdeckender Test, offener Freigabebedarf.

**Stand der Content-Freigabe:** Der Auftraggeber (Mitarbeiter/in Helsana) hat am 03.08.2026 die
gesamte Content-Registry fuer Medical, Legal, Datenschutz und Marketing freigegeben. Alle
Eintraege stehen auf `status: 'approved'`. Die Freigabe ist an den Wortlaut gebunden: sie ist in
`src/content/release-approval.ts` je Content-ID als Fingerabdruck hinterlegt, und ein neuer oder
geaenderter Text faellt automatisch auf `draft` zurueck (Test: `content-compliance.test.ts`,
Abschnitt «Freigabepflicht fuer neue und geaenderte Inhalte»). Die unten aufgefuehrten
prozessualen und technischen Freigaben ausserhalb der Texte bleiben davon unberuehrt.

| # | Verbot aus §3 | Umsetzung im Code | Abdeckender Test | Offener Freigabebedarf |
|---|---|---|---|---|
| 1 | eine Diagnose stellen | Der Begriff kommt in keinem kundensichtbaren Text vor; Muster `diagnose-begriff` sperrt ihn. Der Disclaimer ist als «ersetzt keine medizinische Untersuchung, Behandlung oder Beratung» formuliert (`consent.item.noMedicalAdvice`). | `src/content/content-compliance.test.ts` | – (Wortlaut freigegeben 03.08.2026) |
| 2 | feststellen, ob eine Person Bluthochdruck hat | Keine Auswertung im Blutdruckmodul; Muster `bluthochdruck-feststellung`. | `src/content/content-compliance.test.ts`, `src/data/bp-repository.test.ts` | Medical |
| 3 | Blutdruckwerte medizinisch interpretieren | `src/data/bp-repository.ts` exportiert ausschliesslich CRUD, Doppelpruefung, Anzahl und Rohdatenexport. Die Exportliste wird gegen eine Allowlist geprueft. Die seit 06.08.2026 zulaessige Verlaufsgrafik (`src/components/BpChart.tsx`) stellt nur die eingegebenen Zahlen dar: keine Zielbereiche, keine Kategoriezonen, kein Mittelwert, keine Trendlinie; die Punkteberechnung liegt in der Komponente, nicht in der Datenschicht. | `src/data/bp-repository.test.ts`, `src/design/design-compliance.test.ts` | Medical, Regulatory |
| 4 | individuelle Zielwerte festlegen | Zielzeiten stammen ausschliesslich aus der Wochenmatrix (`src/domain/week-matrix.ts`), nie aus Messwerten. Muster `zielwert`. | `src/domain/week-matrix.test.ts`, `src/content/content-compliance.test.ts` | – |
| 5 | Blutdruckwerte in Kategorien einteilen | Keine Kategorisierungsfunktion vorhanden; Muster `kategorisierung`. Die Verlaufsgrafik zeichnet keine Kategoriezonen und keine Normbaender; die Skala folgt allein den eingegebenen Zahlen. | `src/data/bp-repository.test.ts`, `src/content/content-compliance.test.ts` | Medical |
| 6 | Ampelfarben fuer Blutdruckwerte verwenden | Blutdruck- und Fortschrittsdateien duerfen keine `status-*`-Tokens und keine bewertenden Inline-Notifications enthalten. | `src/design/design-compliance.test.ts` | – |
| 7 | aufgrund eines Blutdruckwertes eine Warnstufe berechnen | Keine Warnlogik implementiert; Muster `ampel-warnstufe`. | `src/content/content-compliance.test.ts` | Medical, Regulatory |
| 8 | aufgrund von Blutdruckwerten das Training anpassen | `suggestVariant` nimmt ausschliesslich `CheckinContext` entgegen; Blutdruckdaten sind nicht Teil des Typs. | `src/data/store.test.ts` («unabhaengig von Blutdruckwerten»), `src/domain/checkin-rules.test.ts` | Medical |
| 9 | die Trainingsintensitaet aufgrund medizinischer Profildaten veraendern | Profildaten fliessen nicht in `CheckinContext` ein. | `src/data/store.test.ts` («unabhaengig von Profildaten») | Medical |
| 10 | den Wandsitz-Erfolg aus Blutdruckwerten ableiten | Erfolg haengt allein am Zwischenziel (`SetResult.targetReached`). | `src/domain/timer-engine.test.ts` | – |
| 11 | Ursache und Wirkung zwischen Training und Blutdruck behaupten | Muster `wirkung-blutdruck`, `wirkung-blutdruck-umgekehrt`, `programm-wirkt`. In den Lernkarten gelten `edu-eigene-werte-wirkung`, `edu-programm-wirkt`, `edu-anpassung-aus-daten` und `edu-erfolg-aus-werten`: allgemeine Aussagen ueber Menschen sind zulaessig, jede Aussage ueber den Blutdruck oder das Training der lesenden Person nicht. | `src/content/content-compliance.test.ts` | – (Kartentexte freigegeben 03.08.2026) |
| 12 | Medikamente erwaehnen, bewerten oder anpassen | Muster `medikamente`. Ausserhalb der Lernkarten unveraendert; in `bp-measurement-info.ts` ist der Medikamentenbezug der SHG-Empfehlung bewusst nicht uebernommen. Die Lernkarten `kaliumsalz` und `medikamente-und-alltagsprodukte` nennen Wirkstoffgruppen ausschliesslich als Sicherheitshinweis mit Verweis auf die aerztliche Abklaerung; `edu-medikamentenanweisung` und `edu-medikamente-selbst-anpassen` sperren jede Anweisung zur Einnahme, Dosis oder Anpassung. | `src/content/content-compliance.test.ts` | – (Kartentexte freigegeben 03.08.2026) |
| 13 | medizinische Therapieempfehlungen geben | Muster `therapieempfehlung`, in den Lernkarten `edu-therapieempfehlung`. Kein Text empfiehlt eine Behandlung; Karten mit Abklaerungscharakter verweisen auf eine medizinische Fachperson. | `src/content/content-compliance.test.ts` | – (Kartentexte freigegeben 03.08.2026) |
| 14 | eine individuelle Prognose erstellen | Keine Prognosefunktion; Muster `risiko` deckt `prognose` mit ab. In den Lernkarten sperrt `edu-persoenliches-risiko` jede Aussage ueber «Ihr Risiko»; allgemeine Aussagen zur Studienlage (Lernkarte `alkohol`) bleiben zulaessig. | `src/content/content-compliance.test.ts` | – (Wortlaut freigegeben 03.08.2026) |
| 15 | einen medizinischen Score oder ein Risikoprofil berechnen | Kein Score im Code; Muster `score` und `risiko`. Die Zuversichtsangabe aus §12 Frage 8 steuert nur Textauswahl (`src/domain/personalization.ts`). | `src/content/content-compliance.test.ts` | Medical |
| 16 | ein generatives KI-Modell fuer individuelle Gesundheitsberatung einsetzen | Keine KI-Abhaengigkeit im Projekt; Personalisierung ist regelbasiert und vollstaendig lokal. | `package.json` ohne KI-Abhaengigkeit; `src/domain/personalization.ts` | – |

## Freigabe fuer die Uebermittlung und Darstellung von Blutdruckwerten (06.08.2026)

Der Auftraggeber (Mitarbeiter/in Helsana) hat am 06.08.2026 freigegeben, dass fuer den Pilot

1. die Blutdruckwerte an die Pilotablage uebermittelt werden duerfen (Abweichung von B.13.6),
2. sie im Auswertungs-Dashboard je Pilotnummer sichtbar sein duerfen (Abweichung von B.11.9),
3. eine Verlaufsgrafik sowohl im Dashboard als auch in der Teilnehmeransicht gezeigt werden darf.

Begruendung des Auftraggebers: kleiner, bezahlter Pilot mit ausgewaehlter Nutzergruppe.

**Die Freigabe betrifft ausschliesslich die Darstellung, nicht die Bewertung.** Unveraendert
gesperrt bleiben und weiterhin durch Tests abgedeckt sind:

| Weiterhin unzulaessig | Absicherung |
|---|---|
| Zielbereiche, Normbaender, Kategoriezonen in der Grafik | `src/components/BpChart.tsx` zeichnet keine; Skala folgt den Daten |
| Ampel- und Statusfarben an Blutdruckwerten | `src/design/design-compliance.test.ts` (Dateiname `BpChart.tsx` faellt unter das Muster `Bp[A-Z]`) |
| Mittelwert, Trendlinie, Bewertung in der Datenschicht | Allowlist in `src/data/bp-repository.test.ts` unveraendert |
| Blutdruck und Training in derselben Darstellung | Getrennte Karten; keine gemeinsame Achse |
| Freitextnotizen in Bericht und Dashboard | `localRecord()`, `buildSharedReport()`, `parseSharedReport()`; `src/data/anonymisation.test.ts` |

Die eigentliche Auswertung der Werte findet ausserhalb der App statt. Vor einem Pilot mit echten
Teilnehmenden bleiben offen: Auftragsverarbeitungsvertrag mit dem Betreiber der Ablage,
Loeschfristen und die Zustimmung des Datenschutzes bei Helsana.

## Ausnahme fuer medizinisch freigegebene Lerninhalte (§22)

Die Lernkarten enthalten seit der Medical-Fassung vom 01.08.2026 allgemeine
Gesundheitsinformation mit Mengenangaben, Wirkzusammenhaengen und Sicherheitshinweisen.
Solche Aussagen beziehen sich auf Menschen im Allgemeinen, nicht auf die lesende Person
und nicht auf ihre Daten. Der Vollkatalog in `forbidden-claims.ts` sperrt die betroffenen
Begriffe unabhaengig vom Bezug und ist fuer diesen Inhaltstyp deshalb nicht anwendbar.

| Aspekt | Regelung |
|---|---|
| Geltungsbereich | Ausschliesslich Eintraege mit ID-Praefix `learning.card.` **und** `approvals.medical === true`. Jeder andere Eintrag wird gegen den Vollkatalog geprueft, auch ein medizinisch freigegebener ausserhalb des Lernbereichs. Die Medical-Freigabe stammt aus der Freigabe-Baseline und ist an den Wortlaut gebunden: eine geaenderte Karte verliert sie und wird wieder gegen den Vollkatalog geprueft. |
| Auswahl im Code | `patternsForEntry()` in `src/content/forbidden-claims.ts`; der Registry-Test ruft ausschliesslich diese Funktion auf. |
| Weiterhin gesperrt | Personenbezogene Diagnose, Bewertung der eigenen Messwerte, persoenlicher Zielwert, Wirkungsbehauptung ueber das eigene Training, Trainingsanpassung aus Werten oder Profildaten, Wandsitz-Erfolg aus Werten, persoenliches Risiko und persoenliche Prognose, Score, Medikamentenanweisung, Therapieempfehlung, Ampel- und Warnstufe, Kategorisierung von Werten. |
| Nachweis der Schutzhoehe | Alle in §3 aufgefuehrten unzulaessigen Beispielsaetze werden auch vom reduzierten Katalog erkannt, alle zulaessigen bleiben zulaessig; der reduzierte Katalog deckt alle acht Verbotskategorien ab. |
| Abdeckende Tests | `src/content/content-compliance.test.ts` (Beispielsaetze gegen beide Kataloge, Bindung der Ausnahme an Praefix und Medical-Freigabe, Metadatenpflicht je Karte, Kartenstruktur nach §22) |
| Redaktionelle Nachbearbeitung | Alle 14 Karten wurden nach der Abnahme redaktionell nachbearbeitet: «Tipp fuer den Alltag» verhaltenswissenschaftlich umformuliert (Auslöser statt Vorsatz), Kernbotschaften auf Bullet-Stil gekuerzt. Die Karten tragen `version: 2.1.0` und weisen die Nachbearbeitung in `source` aus; die fachlichen Aussagen und Inhaltselemente sind unveraendert. |
| Ausnahme: `atmung-und-stress` | Titel, Einleitung, Tipp und Sicherheitshinweis wurden am 01.08.2026 durch den Auftraggeber durch fachlich neuen Inhalt ersetzt (4-7-8-Atemtechnik als Fliesstext im Tipp), ausserhalb der urspruenglich abgenommenen PDF-Fassung. Die Karte traegt deshalb `version: 3.0.0` mit eigenem `source`-Vermerk. Mit der Gesamtfreigabe vom 03.08.2026 ist auch diese Fassung freigegeben. |
| Freigabestand | Kartentexte inklusive der Nachbearbeitung und der Karte `atmung-und-stress` sind mit der Gesamtfreigabe vom 03.08.2026 durch Medical, Legal, Datenschutz und Marketing freigegeben. Offen bleibt Regulatory: Bestaetigung, dass allgemeine Gesundheitsinformation in einem gekennzeichneten Lernbereich die Zweckbestimmung nicht veraendert. |

## Weitere abgesicherte Grenzen

| Anforderung | Umsetzung | Test |
|---|---|---|
| Statusfarbe bewertet nie Gesundheits-, Blutdruck- oder Trainingszustand (CLAUDE.md B.8) | `InlineNotification` dokumentiert die Einschraenkung; Gesundheitsbezuege nutzen `type="neutral"`. | `src/design/design-compliance.test.ts` |
| Dashboard und Standardexport ohne Namen, Kontaktangaben, Notizen und Blutdruckwerte | `PilotParticipantRecord` enthaelt diese Felder strukturell nicht. | `src/data/anonymisation.test.ts` |
| Mindestgruppengroesse fuenf (B.13.7) | `aggregate(..., minGroupSize)`, konfigurierbar ueber `VITE_MIN_GROUP_SIZE`. | `src/data/anonymisation.test.ts` |
| Ereignisse ohne medizinische oder personenbezogene Felder (§27) | `eventPayloadFields` gegen `forbiddenEventFields` geprueft. | `src/data/event-model.test.ts` |
| Trainingssperre nach §12 Frage 3 (B.13.9) | `src/domain/access.ts`, gekapselt an einer Stelle. | `src/data/store.test.ts` |
| Rhythmushinweise sind beschreibend, nicht vorschreibend (§14) | `src/domain/session-gate.ts`: jede Rueckfrage ist uebersteuerbar, die App verhindert keine Einheit. Grundlage sind nur Wochenplan und Trainingshistorie. | `src/domain/session-gate.test.ts` |

## Offene fachliche Freigaben vor dem Kundenpilot

Die **Texte** der Content-Registry sind seit dem 03.08.2026 vollstaendig freigegeben (Medical, Legal, Datenschutz, Marketing) und erscheinen unten nicht mehr. Offen bleiben die fachlichen, prozessualen und technischen Freigaben:

1. **Medical**: fachliche Bestaetigung der Sperrlogik nach §12 Frage 3. Zusaetzlich zu entscheiden: ob aus dem sanften Tor vor dem Start (Ruhetag, viertes Training pro Woche) eine harte Grenze werden soll — der MVP weist nur hin und laesst jede Abweichung zu. Ausserdem steht ein eigenes, medizinisch abgenommenes Anleitungsvideo aus; eingebunden ist bisher eine freigegebene Demo-Quelle.
2. **Legal**: Pruefung, ob Datenschutzerklaerung und Impressum (§25) mit den endgueltigen Angaben zur verantwortlichen Stelle uebereinstimmen.
3. **Datenschutz**: Loesch- und Aufbewahrungskonzept im Betrieb, Export-Freigabeprozess, Umgang mit einer allfaelligen Kontaktangabe.
4. **Regulatory**: Zweckbestimmung und Abgrenzung zum Medizinprodukt, Bestaetigung der Sperrlogik, Freigabe beider Musterlisten in `forbidden-claims.ts` sowie der Ausnahme fuer allgemeine Lerninhalte (siehe oben).
5. **Security**: produktiver Authentisierungsmechanismus statt des Code-Platzhalters (B.9), Transport- und Speicherverschluesselung im Betrieb, Rollen- und Rechtekonzept.
