# Datenmodell

Alle Typen liegen in `src/domain/types.ts` (Domaene) und `src/data/participant.ts`
(Speicherstruktur). Identitaets- und Nutzungsdaten sind getrennt (CLAUDE.md B.4, spec.md §8).

## 1. Speicherbereiche

| Storage-Key | Typ | Inhalt | Im Dashboard/Export |
|---|---|---|---|
| `hw.identity.v1` | `Identity` | Zugangscode, Pilot-ID, optionale Kontaktangabe | nur Pilot-ID |
| `hw.participant.v1` | `ParticipantData` | Einwilligung, Profil, Fragebogen, Plan, Einheiten, Einstellungen | anonymisiert |
| `hw.events.v1` | `AppEvent[]` | append-only Ereignis-Log (§27) | pseudonymisiert |
| `hw.bp.v1` | `BpEntry[]` | Blutdrucktagebuch | nur Anzahl |
| `hw.admin.v1` | `AdminLogEntry[]` | Zeitpunkt und Aktion administrativer Zugriffe | nein |
| `hw.timer.v1` | `ActiveSession` | laufende Einheit inklusive Timerzustand | nein |

Zugriff ausschliesslich ueber `StorageAdapter` (`src/data/storage-adapter.ts`).

## 2. Entitaeten

### Identity (getrennt gehalten)

```ts
{ accessCode: string; pilotId: string; contact: string | null; activatedAt: IsoDateTime }
```

Die Kontaktangabe ist im MVP immer `null`. `PilotParticipantRecord` — die Grundlage von
Dashboard und Export — enthaelt weder `accessCode` noch `contact`.

### ParticipantData

```ts
{
  consent: { voluntary, privacy, noMedicalAdvice, analytics, profileStorage, completedAt }
  welcomeCompleted: boolean
  profile: Profile | null
  questionnaire: Questionnaire | null
  safetyConfirmed: boolean            // §12 Frage 3, B.13.9
  plan: TrainingPlan | null
  sessions: TrainingSession[]
  reminders: ReminderSettings
  instructionSeen: boolean
  bpConsent: boolean                  // separate Einwilligung, §9
  learningCardsOpened: string[]
  milestonesReached: MilestoneId[]
  onboardingStartedAt / onboardingCompletedAt: IsoDateTime | null
  colorMode: 'system' | 'light' | 'dark'
  demoLoaded: boolean
  loggedWeekCompletions: number[]
  programCompletionLogged: boolean
}
```

### Profile (§11)

Pflicht: `birthYear`, `heightCm`, `weightKg`, `sex`. Freiwillig: `waistCm`, `dailyActivity`.
Es wird kein BMI berechnet und keine Bewertung vorgenommen.

`sex` ist seit dem 01.08.2026 Pflichtangabe (Freigabe des Auftraggebers, abweichend von §11) und
kennt im Formular nur `female`, `male` und `diverse`. Der Wert `unspecified` bleibt im Typ, damit
frueher gespeicherte Profile lesbar bleiben; im Formular erscheint er als leere Auswahl und muss
nachgeholt werden. Verwendet wird die Angabe fuer die Uebungsillustration auf dem Heute-Screen
und fuer die Pilotauswertung — sie beeinflusst weder Trainingsinhalt noch Zielzeiten (§3).

### Questionnaire (§12)

`activityLevel`, `wallsitExperience`, `complaints`, `trainingDays` (genau drei),
`preferredDaytime`, `preciseTimes`, `barriers` (maximal zwei), `support`,
`confidence` (1–10), `remindersWanted`, `reminderTime`.

### TrainingPlan (§14, B.13.1)

```ts
{ startDate: IsoDate; trainingDays: Weekday[3]; preferredDaytime; preciseTimes; routineCue; createdAt }
```

`startDate` ist der gewaehlte Programmstart: heute oder der naechste Montag (Wahl der
Startwoche im Wochenplan, §14). `createdAt` bleibt der Zeitpunkt der Planerstellung — beide
fallen also nicht zwingend zusammen. Die Programmwoche ist die Kalenderwoche Mo–So; Woche 1
ist die Kalenderwoche von `startDate`. Programmwoche =
`floor(Tage seit Startmontag / 7) + 1`, begrenzt auf 1–12. Das Wochenziel betraegt drei
Einheiten, in der Startwoche nur die verbleibenden geplanten Tage (1–3). Kein Uebertrag nicht
erreichter Einheiten.

Vor `startDate` laeuft keine Programmwoche (`isBeforeProgramStart`): kein Wochenziel, keine
verpasste Einheit, keine Trainingserinnerung. Wird der Start auf heute vorgezogen, aendert
sich `startDate`; die zwoelf Kalenderwochen verschieben sich entsprechend.

### TrainingSession (§18, §19)

```ts
{
  id; date; programWeek; variant: 'light' | 'standard'
  targetSeconds; optionalTargetSeconds: number | null
  sets: SetResult[4]
  feedback: { completion: 'full'|'partial'|'none'; exertion; complaints: boolean; wellbeing }
  startedAt; endedAt; aborted: boolean
  checkin: { mood; wish }
  deviation: 'none' | 'rest-day' | 'consecutive-day' | 'weekly-goal-reached' | 'already-trained-today'
  demo?: boolean
}
```

`deviation` haelt fest, ob die Einheit ausserhalb des empfohlenen Rhythmus gestartet wurde
(§14). Die App verhindert das nie; der Wert dient der Pilotauswertung.

### SetResult

```ts
{ index; heldSeconds; targetReached; optionalStarted; optionalTargetReached; stoppedEarly }
```

**Erfolgsregel (§18):** Ein Satz ist erfolgreich, sobald `targetReached === true`. Freiwillige
Zusatzsekunden stecken in `heldSeconds` oberhalb des Zwischenziels sowie in
`optionalTargetReached`; sie sind nie Erfolgsvoraussetzung.

### BpEntry (§23)

```ts
{ id; date; time; systolic; diastolic; pulse: number|null; note: string|null;
  daypart: 'morning'|'evening'|'unspecified'; createdAt; updatedAt; demo? }
```

Nur Dokumentation: keine Aggregation, kein Trend, keine Bewertung, keine Verknuepfung mit
Trainingseinheiten.

### AppEvent (§27)

```ts
{ id; at: IsoDateTime; programWeek: number | null; type: AppEventType; payload; demo? }
```

27 Ereignistypen als typisierte Union. `eventPayloadFields` dokumentiert je Typ die
gespeicherten Felder; `forbiddenEventFields` listet die verbotenen. Blutdruckereignisse haben
eine leere Nutzlast.

### ActiveSession und TimerState (B.7)

```ts
ActiveSession { id; date; programWeek; variant; checkin; deviation; targetSeconds;
                optionalTargetSeconds; startedAt; timer: TimerState;
                loggedTargetSets: number[]; loggedOptionalSets: number[]; aborted; endedAt }

TimerState   { config; phase; setIndex; phaseStartedAt; pausedAt; pausedAccumMs;
               interruptedAt; lastObservedAt; completedSets; finishedAt }
```

Alle Zeiten werden aus Zeitstempeln berechnet. Persistiert wird bei jedem Statuswechsel und
mindestens sekuendlich.

## 3. Auswertungssicht

```ts
PilotParticipantRecord {
  pilotId: string
  participant: ParticipantData
  bpEntryCount: number     // nur die Anzahl
  events: AppEvent[]
  demo: boolean
}
```

Dieser Typ ist die einzige Eingabe von `aggregate()` und der Exportfunktionen. Namen,
Kontaktangaben, Zugangscodes, Freitextnotizen und Blutdruckwerte sind hier strukturell nicht
enthalten und koennen dadurch nicht ins Dashboard oder in den Export gelangen.
