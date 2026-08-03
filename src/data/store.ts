import { create } from 'zustand';
import { config } from '../app/config';
import type { ConsentState } from '../domain/access';
import { isTrainingUnlocked, resolveOnboardingStage } from '../domain/access';
import { toIsoDate } from '../domain/dates';
import { evaluateMilestones, newMilestones } from '../domain/milestones';
import type { MilestoneId } from '../domain/milestones';
import {
  completedProgramWeeks,
  computeProgress,
  getProgramWeek,
  sessionsInWeek,
  startChoiceOf,
} from '../domain/progress';
import {
  createTimer,
  createTimerConfig,
  deriveTimerView,
  endSession,
  finishCurrentSet,
  pauseTimer,
  resumeAfterInterruption,
  resumeTimer,
  skipRest,
  suggestCompletion,
  syncTimer,
} from '../domain/timer-engine';
import { deviationOf, evaluateStartGate } from '../domain/session-gate';
import { getSetTargets } from '../domain/week-matrix';
import type {
  BpEntry,
  CheckinAnswers,
  Profile,
  Questionnaire,
  SessionFeedback,
  TrainingPlan,
  TrainingSession,
  TrainingVariant,
} from '../domain/types';
import type { BpEntryInput } from './bp-repository';
import {
  countBpEntries,
  createBpEntry,
  deleteAllBpEntries,
  deleteBpEntry,
  listBpEntries,
  updateBpEntry,
} from './bp-repository';
import { findAccessCode } from './access-codes';
import { clearAdminLog } from './admin-log';
import { appendEvent, clearEvents } from './event-log';
import type { NotificationChannel } from './events';
import { createId } from './id';
import type { ActiveSession, ColorModePreference, Identity, ParticipantData } from './participant';
import { createEmptyParticipant } from './participant';
import { STORAGE_KEYS, getStorageAdapter } from './storage-adapter';

/**
 * Zentraler Anwendungszustand.
 *
 * Jede zustandsveraendernde Aktion schreibt unmittelbar ueber den
 * `StorageAdapter` (CLAUDE.md B.4). Ein Seitenwechsel, ein Reload oder ein
 * Tab-Wechsel verliert dadurch keine Daten.
 */

export interface AppState {
  identity: Identity | null;
  participant: ParticipantData;
  activeSession: ActiveSession | null;
  bpEntries: BpEntry[];
  /** Wird gesetzt, wenn der Browser das Schreiben verweigert (§29). */
  storageBlocked: boolean;
  /** Zuletzt neu erreichte Meilensteine fuer die dezente Anzeige (§21 F). */
  pendingMilestones: MilestoneId[];

  redeemAccessCode: (code: string) => boolean;
  setConsent: (consent: ConsentState) => void;
  completeWelcome: () => void;
  saveProfile: (profile: Profile) => void;
  saveQuestionnaire: (questionnaire: Questionnaire) => void;
  confirmSafety: () => void;
  createPlan: (plan: Omit<TrainingPlan, 'createdAt'>) => void;
  updatePlan: (patch: Partial<Omit<TrainingPlan, 'createdAt' | 'startDate'>>) => void;
  /** Zieht einen fuer die kommende Woche geplanten Programmstart auf heute vor (§14). */
  startProgramToday: () => void;
  markInstructionSeen: () => void;

  startSession: (checkin: CheckinAnswers, variant: TrainingVariant) => void;
  tickTimer: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  finishSet: () => void;
  skipRestPhase: () => void;
  abortSession: () => void;
  resumeInterrupted: () => void;
  endInterrupted: () => void;
  saveFeedback: (feedback: SessionFeedback) => void;
  discardActiveSession: () => void;

  openLearningCard: (cardId: string) => void;
  setBpConsent: (value: boolean) => void;
  addBpEntry: (input: BpEntryInput) => BpEntry;
  editBpEntry: (id: string, input: BpEntryInput) => void;
  removeBpEntry: (id: string) => void;
  removeAllBpEntries: () => void;

  setReminders: (patch: Partial<ParticipantData['reminders']>) => void;
  setColorMode: (mode: ColorModePreference) => void;
  acknowledgeMilestones: () => void;

  replaceAll: (data: {
    identity: Identity | null;
    participant: ParticipantData;
    bpEntries: BpEntry[];
  }) => void;
  deleteAllData: () => void;
  reload: () => void;
}

const adapter = () => getStorageAdapter();

function loadIdentity(): Identity | null {
  return adapter().read<Identity>(STORAGE_KEYS.identity);
}

function loadParticipant(): ParticipantData {
  const stored = adapter().read<Partial<ParticipantData>>(STORAGE_KEYS.participant);
  return { ...createEmptyParticipant(), ...(stored ?? {}) };
}

function loadActiveSession(): ActiveSession | null {
  return adapter().read<ActiveSession>(STORAGE_KEYS.timer);
}

function today(): string {
  return toIsoDate(new Date());
}

function currentProgramWeek(participant: ParticipantData): number | null {
  return participant.plan ? getProgramWeek(participant.plan, today()) : null;
}

export const useAppStore = create<AppState>()((set, get) => {
  /** Schreibt Nutzungsdaten und meldet blockierten Speicher. */
  function persistParticipant(participant: ParticipantData): void {
    const ok = adapter().write(STORAGE_KEYS.participant, participant);
    set({ participant, storageBlocked: !ok });
  }

  function persistActiveSession(session: ActiveSession | null): void {
    if (session === null) {
      adapter().remove(STORAGE_KEYS.timer);
      set({ activeSession: null });
      return;
    }
    const ok = adapter().write(STORAGE_KEYS.timer, session);
    set({ activeSession: session, storageBlocked: !ok });
  }

  function patchParticipant(patch: Partial<ParticipantData>): ParticipantData {
    const next = { ...get().participant, ...patch };
    persistParticipant(next);
    return next;
  }

  function logEvent(...args: Parameters<typeof appendEvent>): void {
    const [type, payload, options] = args;
    appendEvent(type, payload, {
      programWeek: currentProgramWeek(get().participant),
      ...options,
    });
  }

  function refreshMilestones(participant: ParticipantData): void {
    if (!participant.plan) return;
    const summary = computeProgress(participant.plan, participant.sessions, today());
    const reached = evaluateMilestones(summary);
    const fresh = newMilestones(reached, participant.milestonesReached);
    if (fresh.length === 0) return;
    const next = patchParticipant({ milestonesReached: reached });
    set({ pendingMilestones: fresh });
    if (fresh.includes('program-completed') && !next.programCompletionLogged) {
      logEvent('program_completed', { sessionsTotal: summary.sessionsTotal });
      patchParticipant({ programCompletionLogged: true });
    }
  }

  function logCompletedWeeks(participant: ParticipantData): void {
    if (!participant.plan) return;
    const completed = completedProgramWeeks(participant.plan, today());
    const logged = new Set(participant.loggedWeekCompletions);
    const fresh: number[] = [];
    for (let week = 1; week <= completed; week += 1) {
      if (!logged.has(week)) fresh.push(week);
    }
    if (fresh.length === 0) return;
    for (const week of fresh) {
      logEvent('program_week_completed', {
        week,
        sessions: sessionsInWeek(participant.plan, participant.sessions, week).length,
      });
    }
    patchParticipant({ loggedWeekCompletions: [...participant.loggedWeekCompletions, ...fresh] });
  }

  return {
    identity: loadIdentity(),
    participant: loadParticipant(),
    activeSession: loadActiveSession(),
    bpEntries: listBpEntries(),
    storageBlocked: false,
    pendingMilestones: [],

    redeemAccessCode: (code) => {
      const entry = findAccessCode(code);
      if (!entry) return false;
      const identity: Identity = {
        accessCode: entry.code,
        pilotId: entry.pilotId,
        contact: null,
        activatedAt: new Date().toISOString(),
      };
      const ok = adapter().write(STORAGE_KEYS.identity, identity);
      set({ identity, storageBlocked: !ok });
      const participant = get().participant;
      if (!participant.onboardingStartedAt) {
        patchParticipant({ onboardingStartedAt: new Date().toISOString() });
        logEvent('onboarding_started', {});
      }
      return true;
    },

    setConsent: (consent) => {
      patchParticipant({ consent });
      if (consent.completedAt) logEvent('consent_completed', {});
    },

    completeWelcome: () => {
      if (get().participant.welcomeCompleted) return;
      patchParticipant({ welcomeCompleted: true });
      logEvent('welcome_carousel_completed', {});
    },

    saveProfile: (profile) => {
      patchParticipant({ profile });
    },

    saveQuestionnaire: (questionnaire) => {
      patchParticipant({
        questionnaire,
        reminders: {
          ...get().participant.reminders,
          trainingEnabled: questionnaire.remindersWanted,
          trainingTime: questionnaire.reminderTime ?? get().participant.reminders.trainingTime,
        },
      });
      if (questionnaire.remindersWanted) {
        logEvent('notification_enabled', { channel: 'training' });
      }
    },

    confirmSafety: () => {
      patchParticipant({ safetyConfirmed: true });
    },

    createPlan: (plan) => {
      const participant = get().participant;
      const full: TrainingPlan = { ...plan, createdAt: new Date().toISOString() };
      const next = patchParticipant({
        plan: full,
        onboardingCompletedAt: participant.onboardingCompletedAt ?? new Date().toISOString(),
      });
      logEvent('training_plan_created', {
        trainingDays: full.trainingDays,
        preferredDaytime: full.preferredDaytime,
        startChoice: startChoiceOf(full.startDate, today()),
      });
      if (
        resolveOnboardingStage({
          hasAccess: get().identity !== null,
          consent: next.consent,
          welcomeCompleted: next.welcomeCompleted,
          profile: next.profile,
          questionnaire: next.questionnaire,
          plan: next.plan,
        }) === 'done'
      ) {
        logEvent('onboarding_completed', {});
      }
    },

    updatePlan: (patch) => {
      const plan = get().participant.plan;
      if (!plan) return;
      patchParticipant({ plan: { ...plan, ...patch } });
    },

    /**
     * Zieht einen fuer die kommende Woche geplanten Start auf heute vor (§14).
     * Der Wochenplan bekommt damit einen neuen Startpunkt; das Programm laeuft ab
     * heute wieder ueber zwoelf Kalenderwochen. Protokolliert wird das als
     * erneute Planerstellung — §27 kennt kein eigenes Ereignis dafuer.
     */
    startProgramToday: () => {
      const plan = get().participant.plan;
      const now = today();
      if (!plan || plan.startDate <= now) return;
      const moved: TrainingPlan = { ...plan, startDate: now };
      patchParticipant({ plan: moved });
      logEvent('training_plan_created', {
        trainingDays: moved.trainingDays,
        preferredDaytime: moved.preferredDaytime,
        startChoice: 'this-week',
      });
    },

    markInstructionSeen: () => {
      if (get().participant.instructionSeen) return;
      patchParticipant({ instructionSeen: true });
    },

    startSession: (checkin, variant) => {
      const participant = get().participant;
      if (!participant.plan) return;
      if (!isTrainingUnlocked(participant.questionnaire, participant.safetyConfirmed)) return;

      const week = getProgramWeek(participant.plan, today());
      const targets = getSetTargets(week, variant);
      const deviation = deviationOf(
        evaluateStartGate(participant.plan, participant.sessions, today()),
      );
      const now = Date.now();
      const session: ActiveSession = {
        id: createId('ses'),
        date: today(),
        programWeek: week,
        variant,
        checkin,
        deviation,
        targetSeconds: targets.targetSeconds,
        optionalTargetSeconds: targets.optionalTargetSeconds,
        startedAt: new Date(now).toISOString(),
        timer: createTimer(createTimerConfig(week, variant), now),
        loggedTargetSets: [],
        loggedOptionalSets: [],
        aborted: false,
        endedAt: null,
      };
      persistActiveSession(session);
      logEvent('session_checkin_completed', {
        mood: checkin.mood,
        wish: checkin.wish,
        suggestedVariant: variant,
      });
      logEvent('session_started', {
        sessionId: session.id,
        variant,
        targetSeconds: targets.targetSeconds,
        deviation,
      });
      logEvent(
        variant === 'light' ? 'light_variant_selected' : 'standard_variant_selected',
        { sessionId: session.id },
      );
    },

    tickTimer: () => {
      const active = get().activeSession;
      if (!active || active.endedAt) return;
      const now = Date.now();
      const timer = syncTimer(active.timer, now);
      const view = deriveTimerView(timer, now);

      // Erreichte Zwischenziele: waehrend des Satzes oder beim automatischen Abschluss.
      let loggedTargetSets = active.loggedTargetSets;
      const reachedTargetIndexes = [
        ...timer.completedSets.filter((set) => set.targetReached).map((set) => set.index),
        ...(view.phase === 'set' && view.targetReached ? [view.setNumber - 1] : []),
      ];
      for (const setIndex of reachedTargetIndexes) {
        if (loggedTargetSets.includes(setIndex)) continue;
        loggedTargetSets = [...loggedTargetSets, setIndex];
        logEvent('personal_target_reached', {
          sessionId: active.id,
          setIndex,
          targetSeconds: active.targetSeconds,
        });
      }

      // Der Uebergang in die freiwillige Zusatzzeit erfolgt ohne Unterbruch.
      let loggedOptionalSets = active.loggedOptionalSets;
      const optionalIndexes = [
        ...timer.completedSets.filter((set) => set.optionalStarted).map((set) => set.index),
        ...(view.phase === 'set' && view.inOptionalPhase ? [view.setNumber - 1] : []),
      ];
      for (const setIndex of optionalIndexes) {
        if (loggedOptionalSets.includes(setIndex)) continue;
        loggedOptionalSets = [...loggedOptionalSets, setIndex];
        logEvent('optional_target_started', { sessionId: active.id, setIndex });
      }

      const reachedOptional = timer.completedSets.filter((s) => s.optionalTargetReached).length;
      const previousOptional = active.timer.completedSets.filter(
        (s) => s.optionalTargetReached,
      ).length;
      if (reachedOptional > previousOptional) {
        logEvent('optional_target_reached', {
          sessionId: active.id,
          setIndex: timer.completedSets.length - 1,
          optionalTargetSeconds: active.optionalTargetSeconds ?? active.targetSeconds,
        });
      }

      const finished = timer.phase === 'completed' && active.timer.phase !== 'completed';
      persistActiveSession({
        ...active,
        timer,
        loggedTargetSets,
        loggedOptionalSets,
        endedAt: finished ? new Date(now).toISOString() : active.endedAt,
      });
    },

    pauseSession: () => {
      const active = get().activeSession;
      if (!active) return;
      const timer = pauseTimer(active.timer, Date.now());
      persistActiveSession({ ...active, timer });
      logEvent('session_paused', { sessionId: active.id, phase: timer.phase });
    },

    resumeSession: () => {
      const active = get().activeSession;
      if (!active) return;
      persistActiveSession({ ...active, timer: resumeTimer(active.timer, Date.now()) });
    },

    finishSet: () => {
      const active = get().activeSession;
      if (!active) return;
      const now = Date.now();
      const timer = finishCurrentSet(active.timer, now);
      if (timer === active.timer) return;
      const completed = timer.completedSets.at(-1);
      if (completed?.stoppedEarly) {
        logEvent('set_stopped_early', {
          sessionId: active.id,
          setIndex: completed.index,
          heldSeconds: completed.heldSeconds,
        });
      }
      if (completed?.optionalTargetReached) {
        logEvent('optional_target_reached', {
          sessionId: active.id,
          setIndex: completed.index,
          optionalTargetSeconds: active.optionalTargetSeconds ?? active.targetSeconds,
        });
      }
      const finished = timer.phase === 'completed';
      persistActiveSession({
        ...active,
        timer,
        endedAt: finished ? new Date(now).toISOString() : active.endedAt,
      });
    },

    skipRestPhase: () => {
      if (!config.featureSkipRest) return;
      const active = get().activeSession;
      if (!active) return;
      persistActiveSession({ ...active, timer: skipRest(active.timer, Date.now()) });
    },

    abortSession: () => {
      const active = get().activeSession;
      if (!active) return;
      const now = Date.now();
      const timer = endSession(active.timer, now);
      persistActiveSession({
        ...active,
        timer,
        aborted: true,
        endedAt: new Date(now).toISOString(),
      });
      logEvent('session_abandoned', {
        sessionId: active.id,
        setsReached: timer.completedSets.filter((s) => s.targetReached).length,
        phase: active.timer.phase,
      });
    },

    resumeInterrupted: () => {
      const active = get().activeSession;
      if (!active) return;
      persistActiveSession({
        ...active,
        timer: resumeAfterInterruption(active.timer, Date.now()),
      });
    },

    endInterrupted: () => {
      const active = get().activeSession;
      if (!active) return;
      const now = Date.now();
      const timer = endSession(active.timer, now);
      persistActiveSession({ ...active, timer, endedAt: new Date(now).toISOString() });
    },

    saveFeedback: (feedback) => {
      const active = get().activeSession;
      const participant = get().participant;
      if (!active) return;

      const session: TrainingSession = {
        id: active.id,
        date: active.date,
        programWeek: active.programWeek,
        variant: active.variant,
        targetSeconds: active.targetSeconds,
        optionalTargetSeconds: active.optionalTargetSeconds,
        sets: active.timer.completedSets,
        feedback,
        startedAt: active.startedAt,
        endedAt: active.endedAt ?? new Date().toISOString(),
        aborted: active.aborted,
        checkin: active.checkin,
        deviation: active.deviation,
      };

      const next = patchParticipant({ sessions: [...participant.sessions, session] });
      persistActiveSession(null);

      const setsReached = session.sets.filter((s) => s.targetReached).length;
      if (feedback.completion === 'full') {
        logEvent('session_completed', { sessionId: session.id, setsReached });
      } else if (feedback.completion === 'partial') {
        logEvent('session_partially_completed', { sessionId: session.id, setsReached });
      }
      logEvent('post_session_feedback_completed', {
        sessionId: session.id,
        completion: feedback.completion,
        exertion: feedback.exertion,
        complaints: feedback.complaints,
        wellbeing: feedback.wellbeing,
      });

      logCompletedWeeks(next);
      refreshMilestones(get().participant);
    },

    discardActiveSession: () => {
      persistActiveSession(null);
    },

    openLearningCard: (cardId) => {
      const participant = get().participant;
      if (!participant.learningCardsOpened.includes(cardId)) {
        patchParticipant({ learningCardsOpened: [...participant.learningCardsOpened, cardId] });
      }
      logEvent('learning_card_opened', { cardId });
    },

    setBpConsent: (value) => {
      patchParticipant({ bpConsent: value });
      if (value) logEvent('bp_diary_opt_in', {});
    },

    addBpEntry: (input) => {
      const entry = createBpEntry(input);
      set({ bpEntries: listBpEntries() });
      logEvent('bp_entry_created', {});
      return entry;
    },

    editBpEntry: (id, input) => {
      updateBpEntry(id, input);
      set({ bpEntries: listBpEntries() });
      logEvent('bp_entry_edited', {});
    },

    removeBpEntry: (id) => {
      if (!deleteBpEntry(id)) return;
      set({ bpEntries: listBpEntries() });
      logEvent('bp_entry_deleted', {});
    },

    removeAllBpEntries: () => {
      const count = countBpEntries();
      deleteAllBpEntries();
      set({ bpEntries: [] });
      for (let index = 0; index < count; index += 1) {
        logEvent('bp_entry_deleted', {});
      }
    },

    setReminders: (patch) => {
      const previous = get().participant.reminders;
      const reminders = { ...previous, ...patch };
      patchParticipant({ reminders });
      const channels: Array<[NotificationChannel, boolean, boolean]> = [
        ['training', previous.trainingEnabled, reminders.trainingEnabled],
        ['blood-pressure', previous.bpEnabled, reminders.bpEnabled],
        ['system', previous.systemNotifications, reminders.systemNotifications],
      ];
      for (const [channel, before, after] of channels) {
        if (before === after) continue;
        logEvent(after ? 'notification_enabled' : 'notification_disabled', { channel });
      }
    },

    setColorMode: (mode) => {
      patchParticipant({ colorMode: mode });
    },

    acknowledgeMilestones: () => {
      set({ pendingMilestones: [] });
    },

    replaceAll: ({ identity, participant, bpEntries }) => {
      if (identity) {
        adapter().write(STORAGE_KEYS.identity, identity);
      } else {
        adapter().remove(STORAGE_KEYS.identity);
      }
      adapter().write(STORAGE_KEYS.participant, participant);
      adapter().remove(STORAGE_KEYS.timer);
      set({ identity, participant, bpEntries, activeSession: null, pendingMilestones: [] });
    },

    deleteAllData: () => {
      const storage = adapter();
      storage.remove(STORAGE_KEYS.identity);
      storage.remove(STORAGE_KEYS.participant);
      storage.remove(STORAGE_KEYS.timer);
      deleteAllBpEntries();
      clearEvents();
      clearAdminLog();
      set({
        identity: null,
        participant: createEmptyParticipant(),
        activeSession: null,
        bpEntries: [],
        pendingMilestones: [],
      });
    },

    reload: () => {
      set({
        identity: loadIdentity(),
        participant: loadParticipant(),
        activeSession: loadActiveSession(),
        bpEntries: listBpEntries(),
      });
    },
  };
});

export function suggestedCompletion(active: ActiveSession): SessionFeedback['completion'] {
  return suggestCompletion(active.timer.completedSets, active.timer.config.setCount);
}
