import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SYNC_DEBOUNCE_MS, readSyncState, resetAutoSyncForTests, scheduleSync, startAutoSync, syncNow } from './auto-sync';
import { createBpEntry } from './bp-repository';
import type { Identity, ParticipantData } from './participant';
import { createEmptyParticipant } from './participant';
import { STORAGE_KEYS, getStorageAdapter } from './storage-adapter';
import { useAppStore } from './store';
import type { TrainingPlan } from '../domain/types';

/**
 * Automatische Uebermittlung (freigegeben 06.08.2026).
 *
 * Geprueft werden Entprellung, Nachholen nach einem Fehlschlag und die
 * Bedingungen, unter denen ueberhaupt uebermittelt wird.
 */

const identity: Identity = {
  accessCode: 'WS-2026-A1B2',
  pilotId: 'P-001',
  contact: null,
  activatedAt: '2026-08-01T08:00:00.000Z',
};

const plan: TrainingPlan = {
  startDate: '2026-08-03',
  trainingDays: ['mon', 'wed', 'fri'],
  preferredDaytime: 'evening',
  preciseTimes: null,
  routineCue: null,
  createdAt: '2026-08-01T08:00:00.000Z',
};

function seed(overrides: Partial<ParticipantData> = {}): void {
  const storage = getStorageAdapter();
  storage.clearAll();
  storage.write(STORAGE_KEYS.identity, identity);
  storage.write(STORAGE_KEYS.participant, {
    ...createEmptyParticipant(),
    plan,
    safetyConfirmed: true,
    onboardingStartedAt: '2026-08-01T07:30:00.000Z',
    onboardingCompletedAt: '2026-08-01T08:00:00.000Z',
    ...overrides,
  } satisfies ParticipantData);
  useAppStore.getState().reload();
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response);
  vi.stubGlobal('fetch', fetchMock);
  resetAutoSyncForTests();
});

afterEach(() => {
  resetAutoSyncForTests();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('Bedingungen der Uebermittlung', () => {
  it('uebermittelt nicht, solange das Onboarding nicht abgeschlossen ist', async () => {
    seed({ onboardingCompletedAt: null });
    await expect(syncNow()).resolves.toBe('skipped');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uebermittelt den Stand, sobald das Onboarding abgeschlossen ist', async () => {
    seed();
    await expect(syncNow()).resolves.toBe('success');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('sendet keine Blutdruckwerte ohne erteilte Einwilligung', async () => {
    seed({ bpConsent: false });
    createBpEntry({
      date: '2026-08-03',
      time: '07:15',
      systolic: 128,
      diastolic: 84,
      pulse: 62,
      note: null,
      daypart: 'morning',
    });
    useAppStore.getState().reload();

    await syncNow();
    const body = String((fetchMock.mock.calls[0]?.[1] as RequestInit).body);
    expect(JSON.parse(body).bpEntries).toEqual([]);
  });

  it('sendet die Blutdruckwerte bei erteilter Einwilligung', async () => {
    seed({ bpConsent: true });
    createBpEntry({
      date: '2026-08-03',
      time: '07:15',
      systolic: 128,
      diastolic: 84,
      pulse: 62,
      note: 'Freitext bleibt hier',
      daypart: 'morning',
    });
    useAppStore.getState().reload();

    await syncNow();
    const body = String((fetchMock.mock.calls[0]?.[1] as RequestInit).body);
    const payload = JSON.parse(body) as { bpEntries: { systolic: number; note: string | null }[] };
    expect(payload.bpEntries).toHaveLength(1);
    expect(payload.bpEntries[0].systolic).toBe(128);
    expect(payload.bpEntries[0].note).toBeNull();
    expect(body).not.toContain('Freitext bleibt hier');
  });
});

describe('Entprellung und Nachholen', () => {
  it('fasst mehrere Aenderungen zu einer Uebermittlung zusammen', async () => {
    vi.useFakeTimers();
    seed();

    scheduleSync();
    scheduleSync();
    scheduleSync();
    expect(fetchMock).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(SYNC_DEBOUNCE_MS + 10);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('merkt einen Fehlschlag vor und holt ihn beim naechsten Start nach', async () => {
    seed();
    fetchMock.mockResolvedValue({ ok: false, status: 500 } as Response);

    await expect(syncNow()).resolves.toBe('failed');
    expect(readSyncState().pendingSince).not.toBeNull();
    expect(readSyncState().lastSyncedAt).toBeNull();

    fetchMock.mockResolvedValue({ ok: true, status: 200 } as Response);
    resetAutoSyncForTests();
    startAutoSync();
    await vi.waitFor(() => expect(readSyncState().pendingSince).toBeNull());
    expect(readSyncState().lastSyncedAt).not.toBeNull();
  });

  it('vermerkt den Zeitpunkt der erfolgreichen Uebermittlung', async () => {
    seed();
    await syncNow();
    expect(readSyncState().lastSyncedAt).not.toBeNull();
    expect(readSyncState().pendingSince).toBeNull();
  });
});
