import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from './store';
import { selectVariantSuggestion } from './selectors';
import { loadEvents } from './event-log';
import { listBpEntries } from './bp-repository';
import { STORAGE_KEYS, getStorageAdapter } from './storage-adapter';
import { deriveTimerView } from '../domain/timer-engine';
import { toIsoDate } from '../domain/dates';
import type { CheckinAnswers, Profile, Questionnaire } from '../domain/types';

/**
 * B.11.11: Kein Datenverlust bei Reload waehrend Onboarding, Training oder
 * Blutdruckeingabe.
 * B.6: Der Variantenvorschlag ist unabhaengig von Blutdruck- und Profildaten.
 */

const questionnaire: Questionnaire = {
  activityLevel: 'one-to-two',
  wallsitExperience: 'tried',
  complaints: 'none',
  trainingDays: ['mon', 'wed', 'fri'],
  preferredDaytime: 'evening',
  preciseTimes: null,
  barriers: ['time'],
  support: 'plan',
  confidence: 7,
  remindersWanted: false,
  reminderTime: null,
};

const profile: Profile = {
  birthYear: 1975,
  heightCm: 174,
  weightKg: 78,
  sex: 'female',
  waistCm: 88,
  dailyActivity: 'sitting',
};

/** Simuliert einen Reload: der Store wird aus dem Speicher neu aufgebaut. */
function reload(): void {
  useAppStore.getState().reload();
}

function completeOnboarding(): void {
  const store = useAppStore.getState();
  store.redeemAccessCode('WS-2026-A1B2');
  store.setConsent({
    voluntary: true,
    privacy: true,
    noMedicalAdvice: true,
    analytics: true,
    profileStorage: true,
    completedAt: new Date().toISOString(),
  });
  store.completeWelcome();
  store.saveProfile(profile);
  store.saveQuestionnaire(questionnaire);
  useAppStore.getState().createPlan({
    startDate: toIsoDate(new Date()),
    trainingDays: ['mon', 'wed', 'fri'],
    preferredDaytime: 'evening',
    preciseTimes: null,
    routineCue: null,
  });
}

beforeEach(() => {
  useAppStore.setState({
    identity: null,
    activeSession: null,
    bpEntries: [],
    pendingMilestones: [],
    storageBlocked: false,
  });
  reload();
});

describe('Zugang und Onboarding (B.9, §29)', () => {
  it('weist einen unbekannten Code zurueck', () => {
    expect(useAppStore.getState().redeemAccessCode('FALSCH')).toBe(false);
    expect(useAppStore.getState().identity).toBeNull();
  });

  it('ordnet einem gueltigen Code eine Pilot-ID zu', () => {
    expect(useAppStore.getState().redeemAccessCode('ws-2026-a1b2')).toBe(true);
    expect(useAppStore.getState().identity?.pilotId).toBe('P-001');
  });

  it('haelt den Onboarding-Fortschritt ueber einen Reload hinweg', () => {
    const store = useAppStore.getState();
    store.redeemAccessCode('WS-2026-A1B2');
    store.setConsent({
      voluntary: true,
      privacy: true,
      noMedicalAdvice: true,
      analytics: true,
      profileStorage: true,
      completedAt: new Date().toISOString(),
    });
    useAppStore.getState().saveProfile(profile);

    reload();

    const restored = useAppStore.getState();
    expect(restored.identity?.pilotId).toBe('P-001');
    expect(restored.participant.consent.voluntary).toBe(true);
    expect(restored.participant.profile).toEqual(profile);
  });

  it('speichert das Onboarding auch bei gesperrter Trainingsfunktion (B.13.9)', () => {
    completeOnboarding();
    useAppStore.getState().saveQuestionnaire({ ...questionnaire, complaints: 'strong' });
    reload();
    expect(useAppStore.getState().participant.questionnaire?.complaints).toBe('strong');
    expect(useAppStore.getState().participant.safetyConfirmed).toBe(false);

    useAppStore.getState().startSession({ mood: 'good', wish: 'standard' }, 'standard');
    expect(useAppStore.getState().activeSession).toBeNull();

    useAppStore.getState().confirmSafety();
    useAppStore.getState().startSession({ mood: 'good', wish: 'standard' }, 'standard');
    expect(useAppStore.getState().activeSession).not.toBeNull();
  });
});

describe('Training: kein Datenverlust bei Reload (B.11.11)', () => {
  it('setzt eine laufende Einheit nach dem Reload korrekt fort', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-03-02T18:00:00.000Z'));
      completeOnboarding();
      useAppStore.getState().startSession({ mood: 'good', wish: 'light' }, 'light');

      const sessionId = useAppStore.getState().activeSession?.id;
      expect(sessionId).toBeTruthy();

      // 15 s Vorbereitung plus 20 s Haltezeit.
      vi.setSystemTime(new Date('2026-03-02T18:00:35.000Z'));
      useAppStore.getState().tickTimer();

      reload();

      const restored = useAppStore.getState().activeSession;
      expect(restored?.id).toBe(sessionId);
      const view = deriveTimerView(restored!.timer, Date.now());
      expect(view.phase).toBe('set');
      expect(view.holdSeconds).toBe(20);
    } finally {
      vi.useRealTimers();
    }
  });

  it('speichert abgeschlossene Saetze und die Rueckmeldung dauerhaft', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-03-02T18:00:00.000Z'));
      completeOnboarding();
      useAppStore.getState().startSession({ mood: 'good', wish: 'light' }, 'light');

      vi.setSystemTime(new Date('2026-03-02T18:00:45.000Z'));
      useAppStore.getState().tickTimer();
      useAppStore.getState().finishSet();

      expect(useAppStore.getState().activeSession?.timer.completedSets).toHaveLength(1);

      useAppStore.getState().abortSession();
      useAppStore.getState().saveFeedback({
        completion: 'partial',
        exertion: 'fitting',
        complaints: false,
        wellbeing: 'good',
      });

      reload();

      const sessions = useAppStore.getState().participant.sessions;
      expect(sessions).toHaveLength(1);
      expect(sessions[0].sets.length).toBeGreaterThanOrEqual(1);
      expect(sessions[0].feedback.completion).toBe('partial');
      expect(useAppStore.getState().activeSession).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('schreibt die Ereignisse der Einheit ins Log (§27)', () => {
    completeOnboarding();
    useAppStore.getState().startSession({ mood: 'good', wish: 'light' }, 'light');
    const types = loadEvents().map((event) => event.type);
    expect(types).toContain('session_checkin_completed');
    expect(types).toContain('session_started');
    expect(types).toContain('light_variant_selected');
  });
});

describe('Abweichung vom empfohlenen Rhythmus (§14)', () => {
  function runSession(): void {
    useAppStore.getState().startSession({ mood: 'good', wish: 'light' }, 'light');
    useAppStore.getState().abortSession();
    useAppStore.getState().saveFeedback({
      completion: 'partial',
      exertion: 'fitting',
      complaints: false,
      wellbeing: 'good',
    });
  }

  it('vermerkt eine planmaessige Einheit als abweichungsfrei', () => {
    // Fixer Montag: der Plan sieht Mo/Mi/Fr vor, sonst haengt das Ergebnis vom Wochentag ab.
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-03-02T18:00:00.000Z'));
      completeOnboarding();
      runSession();
      expect(useAppStore.getState().participant.sessions[0].deviation).toBe('none');
    } finally {
      vi.useRealTimers();
    }
  });

  it('verhindert eine zweite Einheit am selben Tag nicht, vermerkt sie aber', () => {
    completeOnboarding();
    runSession();
    runSession();

    const sessions = useAppStore.getState().participant.sessions;
    expect(sessions).toHaveLength(2);
    expect(sessions[1].deviation).toBe('already-trained-today');

    const started = loadEvents().filter((event) => event.type === 'session_started');
    expect(started).toHaveLength(2);
    expect(started[1].payload).toMatchObject({ deviation: 'already-trained-today' });
  });
});

describe('Blutdrucktagebuch: kein Datenverlust bei Reload (B.11.11)', () => {
  it('haelt Eintraege ueber einen Reload hinweg', () => {
    completeOnboarding();
    useAppStore.getState().setBpConsent(true);
    useAppStore.getState().addBpEntry({
      date: '2026-03-02',
      time: '07:15',
      systolic: 128,
      diastolic: 82,
      pulse: 68,
      note: 'ruhig gemessen',
      daypart: 'morning',
    });

    reload();

    const entries = useAppStore.getState().bpEntries;
    expect(entries).toHaveLength(1);
    expect(entries[0].systolic).toBe(128);
    expect(entries[0].note).toBe('ruhig gemessen');
    expect(listBpEntries()).toHaveLength(1);
  });

  it('loescht auf Wunsch alle Daten dieses Geraets (§25)', () => {
    completeOnboarding();
    useAppStore.getState().setBpConsent(true);
    useAppStore.getState().addBpEntry({
      date: '2026-03-02',
      time: '07:15',
      systolic: 128,
      diastolic: 82,
      pulse: null,
      note: null,
      daypart: 'morning',
    });

    useAppStore.getState().deleteAllData();
    reload();

    const state = useAppStore.getState();
    expect(state.identity).toBeNull();
    expect(state.participant.plan).toBeNull();
    expect(state.bpEntries).toHaveLength(0);
    expect(loadEvents()).toHaveLength(0);
    expect(getStorageAdapter().read(STORAGE_KEYS.participant)).toBeNull();
  });
});

describe('Variantenvorschlag ohne Blutdruck- und Profildaten (B.6, §16)', () => {
  const answers: CheckinAnswers[] = [
    { mood: 'good', wish: 'suggest' },
    { mood: 'tired', wish: 'suggest' },
    { mood: 'not-fit', wish: 'suggest' },
    { mood: 'good', wish: 'light' },
    { mood: 'good', wish: 'standard' },
  ];

  it('liefert bei identischer Tagesform dasselbe Ergebnis, unabhaengig von Blutdruckwerten', () => {
    completeOnboarding();
    const withoutBp = answers.map((answer) =>
      selectVariantSuggestion(useAppStore.getState(), answer),
    );

    useAppStore.getState().setBpConsent(true);
    for (const systolic of [118, 152, 176]) {
      useAppStore.getState().addBpEntry({
        date: '2026-03-02',
        time: '07:15',
        systolic,
        diastolic: 95,
        pulse: 80,
        note: 'Testeintrag',
        daypart: 'morning',
      });
    }
    expect(useAppStore.getState().bpEntries.length).toBe(3);

    const withBp = answers.map((answer) => selectVariantSuggestion(useAppStore.getState(), answer));
    expect(withBp).toEqual(withoutBp);
  });

  it('liefert dasselbe Ergebnis, unabhaengig von Profildaten', () => {
    completeOnboarding();
    const before = answers.map((answer) => selectVariantSuggestion(useAppStore.getState(), answer));

    useAppStore.getState().saveProfile({
      birthYear: 1945,
      heightCm: 150,
      weightKg: 140,
      sex: 'male',
      waistCm: 160,
      dailyActivity: 'sitting',
    });

    const after = answers.map((answer) => selectVariantSuggestion(useAppStore.getState(), answer));
    expect(after).toEqual(before);
  });

  it('liefert dasselbe Ergebnis, unabhaengig von der Wandsitz-Erfahrung im Profilteil', () => {
    completeOnboarding();
    const before = answers.map((answer) => selectVariantSuggestion(useAppStore.getState(), answer));
    useAppStore.getState().saveQuestionnaire({ ...questionnaire, complaints: 'mild' });
    const after = answers.map((answer) => selectVariantSuggestion(useAppStore.getState(), answer));
    expect(after).toEqual(before);
  });
});

describe('Wahl der Startwoche (§14, B.13.1)', () => {
  // 2026-08-01 ist ein Samstag, 2026-08-03 der folgende Montag.
  const SATURDAY = '2026-08-01';
  const NEXT_MONDAY = '2026-08-03';

  function onboardWithStart(startDate: string): void {
    const store = useAppStore.getState();
    store.redeemAccessCode('WS-2026-A1B2');
    store.setConsent({
      voluntary: true,
      privacy: true,
      noMedicalAdvice: true,
      analytics: true,
      profileStorage: true,
      completedAt: new Date().toISOString(),
    });
    store.completeWelcome();
    store.saveProfile(profile);
    store.saveQuestionnaire({ ...questionnaire, trainingDays: ['mon', 'wed', 'sat'] });
    useAppStore.getState().createPlan({
      startDate,
      trainingDays: ['mon', 'wed', 'sat'],
      preferredDaytime: 'evening',
      preciseTimes: null,
      routineCue: null,
    });
  }

  it('haelt einen Start in der kommenden Woche fest und protokolliert die Wahl', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(`${SATURDAY}T09:00:00.000Z`));
      onboardWithStart(NEXT_MONDAY);

      reload();

      expect(useAppStore.getState().participant.plan?.startDate).toBe(NEXT_MONDAY);
      const created = loadEvents().filter((event) => event.type === 'training_plan_created');
      expect(created).toHaveLength(1);
      expect(created[0].payload).toMatchObject({ startChoice: 'next-week' });
    } finally {
      vi.useRealTimers();
    }
  });

  it('zieht den Start auf Wunsch auf heute vor', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(`${SATURDAY}T09:00:00.000Z`));
      onboardWithStart(NEXT_MONDAY);

      useAppStore.getState().startProgramToday();

      reload();

      expect(useAppStore.getState().participant.plan?.startDate).toBe(SATURDAY);
      const created = loadEvents().filter((event) => event.type === 'training_plan_created');
      expect(created).toHaveLength(2);
      expect(created[1].payload).toMatchObject({ startChoice: 'this-week' });
    } finally {
      vi.useRealTimers();
    }
  });

  it('laesst einen bereits laufenden Start unveraendert', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(`${SATURDAY}T09:00:00.000Z`));
      onboardWithStart(SATURDAY);

      useAppStore.getState().startProgramToday();

      expect(useAppStore.getState().participant.plan?.startDate).toBe(SATURDAY);
      expect(loadEvents().filter((event) => event.type === 'training_plan_created')).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
