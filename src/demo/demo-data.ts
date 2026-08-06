import { addDays, toIsoDate, weekdayOf } from '../domain/dates';
import type {
  BpEntry,
  IsoDate,
  Questionnaire,
  SessionCompletion,
  SetResult,
  TrainingPlan,
  TrainingSession,
  TrainingVariant,
  Weekday,
} from '../domain/types';
import { getProgramWeek, startChoiceOf } from '../domain/progress';
import { getSetTargets } from '../domain/week-matrix';
import { replaceBpEntries } from '../data/bp-repository';
import { replaceEvents } from '../data/event-log';
import type { AppEvent } from '../data/events';
import type { Identity, ParticipantData } from '../data/participant';
import { createEmptyParticipant } from '../data/participant';
import type { PilotParticipantRecord } from '../data/pilot-dataset';

/**
 * Synthetische Demodaten (CLAUDE.md B.10, spec.md §30).
 *
 * Alle Werte sind erfunden. Es gibt keine Namen, keine Kontaktangaben und
 * keine realen Blutdruckverlaeufe. Die Daten werden nur ueber eine
 * ausdrueckliche Aktion geladen und sind in der Oberflaeche als Demodaten
 * gekennzeichnet.
 */

const DEMO_PROGRAM_START_OFFSET_DAYS = -35;

function today(): IsoDate {
  return toIsoDate(new Date());
}

function makeSets(
  targetSeconds: number,
  optionalTargetSeconds: number | null,
  reached: number,
  optionalReached: number,
): SetResult[] {
  return Array.from({ length: 4 }, (_, index) => {
    const targetReached = index < reached;
    const optionalStarted = index < optionalReached;
    return {
      index,
      heldSeconds: targetReached
        ? optionalStarted && optionalTargetSeconds !== null
          ? optionalTargetSeconds
          : targetSeconds
        : Math.max(5, Math.round(targetSeconds * 0.6)),
      targetReached,
      optionalStarted,
      optionalTargetReached: optionalStarted,
      stoppedEarly: !targetReached,
    };
  });
}

interface SessionSpec {
  dayOffset: number;
  variant: TrainingVariant;
  completion: SessionCompletion;
  reachedSets: number;
  optionalSets: number;
  exertion: TrainingSession['feedback']['exertion'];
  wellbeing: TrainingSession['feedback']['wellbeing'];
  complaints: boolean;
}

function makeSession(
  plan: TrainingPlan,
  spec: SessionSpec,
  index: number,
  pilotId: string,
): TrainingSession {
  const date = addDays(plan.startDate, spec.dayOffset);
  const programWeek = getProgramWeek(plan, date);
  const targets = getSetTargets(programWeek, spec.variant);
  return {
    id: `demo_${pilotId}_ses_${index}`,
    date,
    programWeek,
    variant: spec.variant,
    targetSeconds: targets.targetSeconds,
    optionalTargetSeconds: targets.optionalTargetSeconds,
    sets: makeSets(
      targets.targetSeconds,
      targets.optionalTargetSeconds,
      spec.reachedSets,
      spec.optionalSets,
    ),
    feedback: {
      completion: spec.completion,
      exertion: spec.exertion,
      complaints: spec.complaints,
      wellbeing: spec.wellbeing,
    },
    startedAt: `${date}T18:00:00.000Z`,
    endedAt: `${date}T18:14:00.000Z`,
    aborted: spec.completion === 'partial',
    checkin: { mood: 'good', wish: 'suggest' },
    deviation: 'none',
    demo: true,
  };
}

function planFor(startOffsetDays: number, trainingDays: Weekday[]): TrainingPlan {
  const startDate = addDays(today(), startOffsetDays);
  return {
    startDate,
    trainingDays,
    preferredDaytime: 'evening',
    preciseTimes: null,
    routineCue: 'Nach dem Feierabend starte ich mein Wandsitz-Training.',
    createdAt: `${startDate}T08:00:00.000Z`,
  };
}

/** Geplante Trainingstage innerhalb der ersten Wochen als Tagesoffsets. */
function plannedOffsets(plan: TrainingPlan, weeks: number): number[] {
  const offsets: number[] = [];
  for (let offset = 0; offset < weeks * 7; offset += 1) {
    const date = addDays(plan.startDate, offset);
    if (date >= today()) break;
    if (plan.trainingDays.includes(weekdayOf(date))) offsets.push(offset);
  }
  return offsets;
}

const demoQuestionnaire: Questionnaire = {
  activityLevel: 'one-to-two',
  wallsitExperience: 'tried',
  complaints: 'none',
  trainingDays: ['mon', 'wed', 'fri'],
  preferredDaytime: 'evening',
  preciseTimes: null,
  barriers: ['time', 'forget'],
  support: 'plan',
  confidence: 7,
  remindersWanted: true,
  reminderTime: '18:00',
};

export const demoIdentity: Identity = {
  accessCode: 'WS-2026-A1B2',
  pilotId: 'P-001',
  contact: null,
  activatedAt: `${toIsoDate(new Date())}T08:00:00.000Z`,
};

function buildDemoParticipant(): ParticipantData {
  const plan = planFor(DEMO_PROGRAM_START_OFFSET_DAYS, ['mon', 'wed', 'fri']);
  const offsets = plannedOffsets(plan, 6);

  const sessions = offsets.map((dayOffset, index) =>
    makeSession(
      plan,
      {
        dayOffset,
        variant: index % 3 === 0 ? 'light' : 'standard',
        completion: index % 5 === 4 ? 'partial' : 'full',
        reachedSets: index % 5 === 4 ? 2 : 4,
        optionalSets: index % 4 === 0 ? 2 : 0,
        exertion: index % 4 === 3 ? 'hard' : 'fitting',
        wellbeing: index % 6 === 5 ? 'neutral' : 'good',
        complaints: false,
      },
      index,
      'P-001',
    ),
  );

  return {
    ...createEmptyParticipant(),
    consent: {
      voluntary: true,
      privacy: true,
      noMedicalAdvice: true,
      analytics: true,
      profileStorage: true,
      completedAt: `${plan.startDate}T07:50:00.000Z`,
    },
    welcomeCompleted: true,
    profile: {
      birthYear: 1975,
      heightCm: 174,
      weightKg: 78,
      // Geschlecht ist seit 01.08.2026 Pflichtangabe (§11); synthetischer Wert.
      sex: 'female',
      waistCm: null,
      dailyActivity: 'sitting',
    },
    questionnaire: demoQuestionnaire,
    safetyConfirmed: true,
    plan,
    sessions,
    instructionSeen: true,
    bpConsent: true,
    learningCardsOpened: ['wandsitz-krafttraining', 'bewegung-sofort'],
    onboardingStartedAt: `${plan.startDate}T07:45:00.000Z`,
    onboardingCompletedAt: `${plan.startDate}T08:00:00.000Z`,
    demoLoaded: true,
    reminders: {
      trainingEnabled: true,
      trainingTime: '18:00',
      bpEnabled: true,
      bpMorningTime: '07:00',
      bpEveningTime: '20:00',
      systemNotifications: false,
    },
  };
}

/** Klar synthetische Beispielzahlen ohne realen Verlauf. */
function buildDemoBpEntries(): BpEntry[] {
  const values: [number, number, number][] = [
    [128, 82, 68],
    [131, 84, 72],
    [126, 79, 65],
    [133, 85, 70],
    [129, 81, 67],
  ];
  return values.map((entry, index) => {
    const date = addDays(today(), -(index * 3 + 1));
    return {
      id: `demo_bp_${index}`,
      date,
      time: index % 2 === 0 ? '07:15' : '20:30',
      systolic: entry[0],
      diastolic: entry[1],
      pulse: entry[2],
      note: null,
      daypart: index % 2 === 0 ? 'morning' : 'evening',
      createdAt: `${date}T07:20:00.000Z`,
      updatedAt: `${date}T07:20:00.000Z`,
      demo: true,
    };
  });
}

/**
 * Synthetische Messreihe fuer einen Dashboard-Datensatz.
 *
 * Die Zahlen schwanken um einen erfundenen Ausgangswert und folgen bewusst
 * keinem Verlauf, der eine Wirkung des Trainings nahelegen wuerde (§3, Verbot
 * 11). Sie dienen ausschliesslich dazu, die Grafik bei einer Vorfuehrung mit
 * Inhalt zu fuellen.
 */
function buildRecordBpEntries(pilotId: string, count: number, startDate: IsoDate): BpEntry[] {
  const seed = Number.parseInt(pilotId.replace(/\D/g, ''), 10) || 0;
  const baseSystolic = 124 + (seed % 5) * 3;
  const baseDiastolic = 78 + (seed % 4) * 2;

  return Array.from({ length: count }, (_, index) => {
    const wobble = [0, 4, -3, 6, -2, 3, -5, 1][index % 8];
    const date = addDays(startDate, index * 4 + 2);
    const morning = index % 2 === 0;
    return {
      id: `demo_bp_${pilotId}_${index}`,
      date,
      time: morning ? '07:15' : '20:30',
      systolic: baseSystolic + wobble,
      diastolic: baseDiastolic + Math.round(wobble / 2),
      pulse: 64 + ((index * 3) % 11),
      note: null,
      daypart: morning ? 'morning' : 'evening',
      createdAt: `${date}T07:20:00.000Z`,
      updatedAt: `${date}T07:20:00.000Z`,
      demo: true,
    } satisfies BpEntry;
  });
}

function buildDemoEvents(participant: ParticipantData): AppEvent[] {
  const events: AppEvent[] = [];
  let counter = 0;
  const push = (event: Omit<AppEvent, 'id' | 'demo'>) => {
    counter += 1;
    events.push({ ...event, id: `demo_evt_${counter}`, demo: true } as AppEvent);
  };

  const startedAt = participant.onboardingStartedAt ?? new Date().toISOString();
  push({ type: 'onboarding_started', at: startedAt, programWeek: null, payload: {} });
  push({ type: 'consent_completed', at: startedAt, programWeek: null, payload: {} });
  push({ type: 'welcome_carousel_completed', at: startedAt, programWeek: null, payload: {} });
  push({ type: 'onboarding_completed', at: startedAt, programWeek: 1, payload: {} });
  if (participant.plan) {
    push({
      type: 'training_plan_created',
      at: participant.plan.createdAt,
      programWeek: 1,
      payload: {
        trainingDays: participant.plan.trainingDays,
        preferredDaytime: participant.plan.preferredDaytime,
        startChoice: startChoiceOf(
          participant.plan.startDate,
          toIsoDate(new Date(participant.plan.createdAt)),
        ),
      },
    });
  }

  for (const session of participant.sessions) {
    push({
      type: 'session_started',
      at: session.startedAt,
      programWeek: session.programWeek,
      payload: {
        sessionId: session.id,
        variant: session.variant,
        targetSeconds: session.targetSeconds,
      },
    });
    push({
      type: session.variant === 'light' ? 'light_variant_selected' : 'standard_variant_selected',
      at: session.startedAt,
      programWeek: session.programWeek,
      payload: { sessionId: session.id },
    });
    for (const set of session.sets.filter((entry) => entry.targetReached)) {
      push({
        type: 'personal_target_reached',
        at: session.endedAt,
        programWeek: session.programWeek,
        payload: {
          sessionId: session.id,
          setIndex: set.index,
          targetSeconds: session.targetSeconds,
        },
      });
    }
    push({
      type: session.feedback.completion === 'full' ? 'session_completed' : 'session_partially_completed',
      at: session.endedAt,
      programWeek: session.programWeek,
      payload: {
        sessionId: session.id,
        setsReached: session.sets.filter((entry) => entry.targetReached).length,
      },
    });
    push({
      type: 'post_session_feedback_completed',
      at: session.endedAt,
      programWeek: session.programWeek,
      payload: {
        sessionId: session.id,
        completion: session.feedback.completion,
        exertion: session.feedback.exertion,
        complaints: session.feedback.complaints,
        wellbeing: session.feedback.wellbeing,
      },
    });
  }

  push({ type: 'bp_diary_opt_in', at: startedAt, programWeek: 1, payload: {} });
  return events;
}

export interface DemoState {
  identity: Identity | null;
  participant: ParticipantData;
  bpEntries: BpEntry[];
}

/** Laedt Demodaten in den lokalen Speicher und liefert den neuen Zustand. */
export function loadDemoState(): DemoState {
  const participant = buildDemoParticipant();
  const bpEntries = buildDemoBpEntries();
  replaceBpEntries(bpEntries);
  replaceEvents(buildDemoEvents(participant));
  return { identity: demoIdentity, participant, bpEntries };
}

/** Entfernt Demodaten wieder vollstaendig. */
export function removeDemoState(): DemoState {
  replaceBpEntries([]);
  replaceEvents([]);
  return { identity: null, participant: createEmptyParticipant(), bpEntries: [] };
}

interface DemoRecordSpec {
  pilotId: string;
  startOffsetDays: number;
  trainingDays: Weekday[];
  sessionCount: number;
  variantBias: TrainingVariant;
  questionnaire: Questionnaire;
  bpEntryCount: number;
  learningCards: string[];
  remindersEnabled: boolean;
  safetyConfirmed: boolean;
}

const recordSpecs: DemoRecordSpec[] = [
  {
    pilotId: 'P-101',
    startOffsetDays: -70,
    trainingDays: ['mon', 'wed', 'fri'],
    sessionCount: 24,
    variantBias: 'standard',
    questionnaire: {
      ...demoQuestionnaire,
      activityLevel: 'three-to-four',
      wallsitExperience: 'regular',
      barriers: ['time'],
      support: 'progress',
      confidence: 9,
    },
    bpEntryCount: 12,
    learningCards: ['wandsitz-krafttraining', 'salz-tagesbudget', 'schlafapnoe'],
    remindersEnabled: true,
    safetyConfirmed: true,
  },
  {
    pilotId: 'P-102',
    startOffsetDays: -49,
    trainingDays: ['tue', 'thu', 'sat'],
    sessionCount: 15,
    variantBias: 'light',
    questionnaire: {
      ...demoQuestionnaire,
      activityLevel: 'rarely',
      wallsitExperience: 'never',
      barriers: ['motivation', 'tired'],
      support: 'feedback',
      confidence: 4,
    },
    bpEntryCount: 4,
    learningCards: ['atmung-und-stress'],
    remindersEnabled: true,
    safetyConfirmed: true,
  },
  {
    pilotId: 'P-103',
    startOffsetDays: -28,
    trainingDays: ['mon', 'wed', 'fri'],
    sessionCount: 10,
    variantBias: 'standard',
    questionnaire: {
      ...demoQuestionnaire,
      activityLevel: 'one-to-two',
      barriers: ['forget'],
      support: 'reminders',
      confidence: 6,
    },
    bpEntryCount: 0,
    learningCards: ['bewegung-sofort'],
    remindersEnabled: true,
    safetyConfirmed: true,
  },
  {
    pilotId: 'P-104',
    startOffsetDays: -21,
    trainingDays: ['mon', 'thu', 'sat'],
    sessionCount: 4,
    variantBias: 'light',
    questionnaire: {
      ...demoQuestionnaire,
      activityLevel: 'rarely',
      complaints: 'unsure',
      barriers: ['physical'],
      support: 'knowledge',
      confidence: 3,
    },
    bpEntryCount: 7,
    learningCards: [],
    remindersEnabled: false,
    safetyConfirmed: false,
  },
  {
    pilotId: 'P-105',
    startOffsetDays: -84,
    trainingDays: ['tue', 'thu', 'sun'],
    sessionCount: 33,
    variantBias: 'standard',
    questionnaire: {
      ...demoQuestionnaire,
      activityLevel: 'five-plus',
      wallsitExperience: 'regular',
      barriers: [],
      support: 'plan',
      confidence: 10,
    },
    bpEntryCount: 20,
    learningCards: ['wandsitz-krafttraining', 'koerpergewicht', 'alkohol', 'schlafapnoe'],
    remindersEnabled: true,
    safetyConfirmed: true,
  },
  {
    pilotId: 'P-106',
    startOffsetDays: -42,
    trainingDays: ['mon', 'wed', 'sat'],
    sessionCount: 8,
    variantBias: 'light',
    questionnaire: {
      ...demoQuestionnaire,
      activityLevel: 'one-to-two',
      barriers: ['how-to-start'],
      support: 'knowledge',
      confidence: 5,
    },
    bpEntryCount: 2,
    learningCards: ['bewegung-sofort', 'atmung-und-stress'],
    remindersEnabled: false,
    safetyConfirmed: true,
  },
  {
    pilotId: 'P-107',
    startOffsetDays: -14,
    trainingDays: ['mon', 'wed', 'fri'],
    sessionCount: 5,
    variantBias: 'standard',
    questionnaire: {
      ...demoQuestionnaire,
      activityLevel: 'three-to-four',
      barriers: ['time', 'tired'],
      support: 'progress',
      confidence: 8,
    },
    bpEntryCount: 3,
    learningCards: ['salz-tagesbudget'],
    remindersEnabled: true,
    safetyConfirmed: true,
  },
  {
    // Frueher Abbruch: nach der ersten Einheit nichts mehr. Zeigt im Dashboard
    // den Unterschied zwischen «Programm gestartet» und «aktiv».
    pilotId: 'P-108',
    startOffsetDays: -56,
    trainingDays: ['tue', 'thu', 'sun'],
    sessionCount: 1,
    variantBias: 'light',
    questionnaire: {
      ...demoQuestionnaire,
      activityLevel: 'rarely',
      wallsitExperience: 'never',
      barriers: ['motivation', 'how-to-start'],
      support: 'reminders',
      confidence: 3,
    },
    bpEntryCount: 0,
    learningCards: [],
    remindersEnabled: false,
    safetyConfirmed: true,
  },
];

function buildRecord(spec: DemoRecordSpec): PilotParticipantRecord {
  const plan = planFor(spec.startOffsetDays, spec.trainingDays);
  const offsets = plannedOffsets(plan, 12).slice(0, spec.sessionCount);
  const sessions = offsets.map((dayOffset, index) =>
    makeSession(
      plan,
      {
        dayOffset,
        variant:
          spec.variantBias === 'light' ? (index % 4 === 3 ? 'standard' : 'light') : index % 3 === 0 ? 'light' : 'standard',
        completion: index % 7 === 6 ? 'partial' : 'full',
        reachedSets: index % 7 === 6 ? 2 : 4,
        optionalSets: index % 5 === 0 ? 1 : 0,
        exertion: index % 5 === 4 ? 'hard' : index % 3 === 0 ? 'easy' : 'fitting',
        wellbeing: index % 8 === 7 ? 'neutral' : 'good',
        complaints: index % 11 === 10,
      },
      index,
      spec.pilotId,
    ),
  );

  const participant: ParticipantData = {
    ...createEmptyParticipant(),
    consent: {
      voluntary: true,
      privacy: true,
      noMedicalAdvice: true,
      analytics: true,
      profileStorage: true,
      completedAt: `${plan.startDate}T07:50:00.000Z`,
    },
    welcomeCompleted: true,
    profile: {
      birthYear: 1980,
      heightCm: 172,
      weightKg: 75,
      sex: spec.pilotId.endsWith('2') || spec.pilotId.endsWith('4') ? 'female' : 'male',
      waistCm: null,
      dailyActivity: 'mixed',
    },
    questionnaire: { ...spec.questionnaire, trainingDays: spec.trainingDays },
    safetyConfirmed: spec.safetyConfirmed,
    plan,
    sessions,
    instructionSeen: true,
    bpConsent: spec.bpEntryCount > 0,
    learningCardsOpened: spec.learningCards,
    onboardingStartedAt: `${plan.startDate}T07:45:00.000Z`,
    onboardingCompletedAt: `${plan.startDate}T08:00:00.000Z`,
    demoLoaded: true,
    reminders: {
      trainingEnabled: spec.remindersEnabled,
      trainingTime: '18:00',
      bpEnabled: spec.bpEntryCount > 0,
      bpMorningTime: '07:00',
      bpEveningTime: '20:00',
      systemNotifications: false,
    },
  };

  return {
    pilotId: spec.pilotId,
    participant,
    bpEntryCount: spec.bpEntryCount,
    bpEntries: buildRecordBpEntries(spec.pilotId, spec.bpEntryCount, plan.startDate),
    events: buildDemoEvents(participant),
    demo: true,
  };
}

/** Synthetische Datensaetze fuer das Pilot-Dashboard (B.10). */
export function demoPilotRecords(): PilotParticipantRecord[] {
  return recordSpecs.map(buildRecord);
}
