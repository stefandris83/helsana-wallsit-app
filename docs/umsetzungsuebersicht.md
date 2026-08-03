# Umsetzungsuebersicht — Helsana Wallsit-Pilot

Stand: Neuentwicklung (leeres Repository, daher Stack und Struktur nach CLAUDE.md B.2/B.3).

## 1. Informationsarchitektur

### 1.1 Routen

| Route | Screen | Zugangsbedingung |
|---|---|---|
| `/zugang` | Einladungscode | immer |
| `/onboarding/einwilligung` | Einwilligung (§9) | Code eingeloest |
| `/onboarding/willkommen` | Willkommens-Carousel (§10) | Einwilligung erteilt |
| `/onboarding/profil` | Profil (§11) | Carousel gesehen |
| `/onboarding/fragebogen` | Startfragebogen (§12) | Profil erfasst |
| `/onboarding/plan` | Wochenplan bestaetigen (§14) | Fragebogen erfasst |
| `/heute` | Heute (§14) | Onboarding abgeschlossen |
| `/heute/checkin` | Tages-Check-in (§16) | Training freigegeben |
| `/heute/anleitung` | Wandsitz-Anleitung (§17) | Onboarding abgeschlossen |
| `/heute/training` | Trainingstimer (§18) | Check-in abgeschlossen |
| `/heute/rueckmeldung` | Rueckmeldung (§19) | Training beendet/abgebrochen |
| `/fortschritt` | Fortschritt (§20, §21) | Onboarding abgeschlossen |
| `/lernen`, `/lernen/:cardId` | Learning-Bereich (§22) | Onboarding abgeschlossen |
| `/blutdruck`, `/blutdruck/neu`, `/blutdruck/:id/bearbeiten`, `/blutdruck/hinweise` | Blutdrucktagebuch (§23) | Onboarding abgeschlossen; Eintragspflege erst nach separater Einwilligung |
| `/einstellungen/*` | Einstellungen (§25) | Onboarding abgeschlossen |
| `/admin` | Pilot-Dashboard (§26) | Admin-Code aus `VITE_ADMIN_CODE` |

Hauptnavigation (§7, maximal vier Bereiche): Heute · Fortschritt · Lernen · Blutdruck.
Einstellungen liegen ausserhalb der Hauptnavigation und sind ueber ein Icon in der Kopfzeile erreichbar.

### 1.2 Gate-Logik

`src/domain/access.ts` kapselt an genau einer Stelle:

- `hasAccess` — Einladungscode eingeloest
- `onboardingStage` — naechster offener Onboarding-Schritt
- `isTrainingUnlocked` — Sicherheitsbestaetigung nach §12 Frage 3 (B.13.9)

## 2. Datenmodell

Identitaetsdaten und Nutzungsdaten sind technisch getrennt (B.4, §8). Vier Speicherbereiche:

| Bereich | Storage-Key | Inhalt | Im Export/Dashboard |
|---|---|---|---|
| Identitaet | `hw.identity.v1` | Zugangscode, Pilot-ID, optionale Kontaktangabe | nur Pilot-ID |
| Nutzungsdaten | `hw.participant.v1` | Profil, Fragebogen, Plan, Einheiten, Rueckmeldungen, Einstellungen | anonymisiert |
| Ereignis-Log | `hw.events.v1` | append-only Ereignisse (§27) | pseudonymisiert |
| Blutdruck | `hw.bp.v1` | Rohdaten des freiwilligen Tagebuchs | nur Anzahl Eintraege |
| Admin-Log | `hw.admin.v1` | Zeitpunkt und Aktion administrativer Zugriffe, ohne Personenbezug | nein |
| Timer | `hw.timer.v1` | laufender Timerzustand (B.7) | nein |

### 2.1 Kernentitaeten

```
Identity          { accessCode, pilotId, contact?, activatedAt }
Profile           { birthYear, heightCm, weightKg, sex?, waistCm?, dailyActivity? }
Questionnaire     { activityLevel, wallsitExperience, complaints, trainingDays[3],
                    trainingTime, preciseTimes?, barriers[0..2], support, confidence 1..10,
                    remindersWanted }
TrainingPlan      { startDate, weekdays[3], preferredTime, preciseTimes? }
CheckIn           { mood, wish, suggestedVariant, chosenVariant, createdAt }
TrainingSession   { id, date, programWeek, variant, sets[4], completion,
                    feedback{exertion, complaints, wellbeing}, startedAt, endedAt }
SetResult         { index, heldSeconds, targetReached, optionalStarted,
                    optionalTargetReached, stoppedEarly }
BpEntry           { id, date, time, systolic, diastolic, pulse?, note?, daypart?, createdAt }
AppEvent          { id, type, at, programWeek?, payload }
```

`TrainingSession.completion` ∈ `full | partial | none` (§19 Frage 1).
Ein Satz gilt als erfolgreich, sobald `targetReached === true` (§18). Freiwillige Zusatzsekunden
liegen in `heldSeconds` oberhalb des Zwischenziels und in `optionalTargetReached`; sie sind
keine Erfolgsvoraussetzung.

### 2.2 Programmwoche

Die Programmwoche ist die Kalenderwoche Montag bis Sonntag (revidierter Vorentscheid B.13.1).
Woche 1 ist die Kalenderwoche, in der `TrainingPlan.startDate` liegt:
`programWeek = floor(tageSeitStartmontag / 7) + 1`, begrenzt auf 1..12.

Das Wochenziel betraegt drei Einheiten. In der Startwoche zaehlen nur die ab dem Startdatum
noch verbleibenden geplanten Trainingstage, hoechstens drei und mindestens einer — sonst waere
eine am Wochenende erstellte Woche 1 nicht erreichbar. Kein Uebertrag nicht erreichter
Einheiten in die Folgewoche.

## 2.3 Sanftes Tor vor dem Start (§14)

`src/domain/session-gate.ts` bewertet vor jeder Einheit die Tageslage:

| Zustand | Ausloeser | Verhalten |
|---|---|---|
| `already-trained-today` | Einheit mit heutigem Datum | Rueckfrage, uebersteuerbar |
| `weekly-goal-reached` | Einheiten der Woche >= Wochenziel | Rueckfrage, uebersteuerbar |
| `consecutive-day` | Einheit am Vortag | Rueckfrage, uebersteuerbar |
| `rest-day` | heute kein geplanter Tag | kein Dialog, Start als sekundaere Aktion |
| `open` | planmaessiger Trainingstag | Start als primaere Aktion |

Kein Zustand verhindert den Start. Die gewaehlte Abweichung landet als
`TrainingSession.deviation` und in der Nutzlast von `session_started`. Grundlage sind
ausschliesslich Wochenplan und Trainingshistorie — keine Blutdruck- und keine Profildaten.

## 3. Zentrale Zustaende

### 3.1 Anwendungszustand

Ein Zustand-Store (`src/data/store.ts`) haelt Identitaet, Nutzungsdaten, Blutdruckdaten und
Timerzustand. Jede zustandsveraendernde Aktion schreibt unmittelbar ueber den
`StorageAdapter` (B.4). Es gibt keinen «Speichern»-Button und keinen ungespeicherten
Zwischenzustand ausserhalb kurzlebiger Formulareingaben.

### 3.2 Timer-Zustandsmaschine (B.7, §18)

```
preparation → set 1 → rest → set 2 → rest → set 3 → rest → set 4 → completed
```

Status innerhalb einer Satzphase:

| Status | Bedeutung |
|---|---|
| `running` | Zwischenziel noch nicht erreicht |
| `optional-running` | Zwischenziel erreicht, freiwillige Zusatzzeit laeuft bis zum Zusatzziel |
| `paused` | manuell pausiert |
| `interrupted` | Luecke > 5 Minuten seit dem letzten beobachteten Tick |

Der Satz laeuft ohne Unterbruch durch: Beim Zwischenziel wechselt die Anzeige auf die Skala
des Zusatzziels, der bereits erreichte Anteil bleibt sichtbar. Der Satz endet automatisch
beim Zusatzziel — beziehungsweise beim Zwischenziel, wenn es keines gibt — und kann jederzeit
manuell beendet werden.

Alle Restzeiten werden aus Zeitstempeln berechnet, nie aus aufaddierten Ticks. Der Zustand
wird bei jedem Statuswechsel und mindestens sekuendlich persistiert.

Ringfarben (`ProgressRing`): bis zum Zwischenziel faerbt sich der gefuellte Bogen mit
zunehmender Zielnaehe von `text-primary` in `decorative-green-darker`, in der Zusatzphase
bleibt der erreichte Anteil gruen und die Zusatzzeit laeuft in `text-decorative` weiter.
Bewusst dekorative Tokens, keine Status-Tokens.

### 3.3 Trainingssperre

Bei «deutliche Beschwerden» oder «unsicher» in §12 Frage 3 bleibt die Trainingsfunktion
gesperrt, bis die Person aktiv bestaetigt (B.13.9). Die Sperre ist in `src/domain/access.ts`
gekapselt und im Dashboard nur als Anzahl sichtbar.

## 4. Schichten

```
content/   Texte + Metadaten (einzige Quelle kundensichtbarer Sprache)
domain/    reine Logik ohne React und ohne Storage-Zugriff
data/      StorageAdapter, Repositories, Ereignis-Log, Export, Store
components/ UI-Bausteine nach design-system.md Kapitel 12
screens/   Bildschirme je Bereich
app/       Routing, Layout, Navigation, Theme
```

Regel: `domain/` importiert weder `data/` noch `components/`. `components/` und `screens/`
enthalten keine kundensichtbaren Textliterale, sondern nur Content-IDs.

## 5. Regulatorische Schutzschicht (B.6)

| Massnahme | Ort |
|---|---|
| Musterliste unzulaessiger Aussagen | `src/content/forbidden-claims.ts` |
| Pruefung der gesamten Content-Registry | `src/content/content-compliance.test.ts` |
| Check-in unabhaengig von Blutdruck/Profil | `src/domain/checkin-rules.ts` (Signatur ohne diese Daten) |
| Blutdruck-Datenschicht ohne Auswertung | `src/data/bp-repository.ts` |
| Keine Statusfarbe an Gesundheitszustaenden | `src/design/design-compliance.test.ts` |
| Matrix Verbot → Umsetzung → Test | `docs/regulatorik-matrix.md` |
