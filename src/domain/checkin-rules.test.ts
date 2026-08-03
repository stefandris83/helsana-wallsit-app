import { describe, expect, it } from 'vitest';
import { REENTRY_DAYS, blocksDirectStart, buildCheckinContext, suggestVariant } from './checkin-rules';
import type { CheckinContext } from './checkin-rules';
import type { TrainingSession } from './types';

/** B.11.5: Alle Regeln der Vorschlagslogik aus §16. */

const neutral: CheckinContext = {
  mood: 'good',
  wish: 'suggest',
  previousExertion: null,
  previousCompletion: null,
  previousComplaints: false,
  daysSinceLastSession: null,
};

function session(overrides: Partial<TrainingSession> = {}): TrainingSession {
  return {
    id: 'ses_1',
    date: '2026-03-02',
    programWeek: 1,
    variant: 'light',
    targetSeconds: 30,
    optionalTargetSeconds: 60,
    sets: [],
    feedback: { completion: 'full', exertion: 'fitting', complaints: false, wellbeing: 'good' },
    startedAt: '2026-03-02T18:00:00.000Z',
    endedAt: '2026-03-02T18:12:00.000Z',
    aborted: false,
    checkin: { mood: 'good', wish: 'suggest' },
    deviation: 'none',
    ...overrides,
  };
}

describe('Vorschlagslogik des Check-ins (§16)', () => {
  it('folgt dem ausdruecklichen Wunsch nach der leichten Variante', () => {
    expect(suggestVariant({ ...neutral, wish: 'light' })).toEqual({
      variant: 'light',
      reason: 'wish',
    });
  });

  it('folgt dem ausdruecklichen Wunsch nach der normalen Variante auch bei Muedigkeit', () => {
    expect(suggestVariant({ ...neutral, mood: 'tired', wish: 'standard' })).toEqual({
      variant: 'standard',
      reason: 'wish',
    });
  });

  it('schlaegt leicht vor bei «etwas muede oder gestresst»', () => {
    expect(suggestVariant({ ...neutral, mood: 'tired' })).toEqual({
      variant: 'light',
      reason: 'mood',
    });
  });

  it('schlaegt leicht vor bei «heute nicht ganz fit»', () => {
    expect(suggestVariant({ ...neutral, mood: 'not-fit' })).toEqual({
      variant: 'light',
      reason: 'mood',
    });
  });

  it('schlaegt leicht vor, wenn die vorherige Einheit sehr anstrengend war', () => {
    expect(suggestVariant({ ...neutral, previousExertion: 'hard' })).toEqual({
      variant: 'light',
      reason: 'previous-hard',
    });
  });

  it('schlaegt leicht vor, wenn die vorherige Einheit nur teilweise beendet wurde', () => {
    expect(suggestVariant({ ...neutral, previousCompletion: 'partial' })).toEqual({
      variant: 'light',
      reason: 'previous-partial',
    });
  });

  it('schlaegt leicht vor, wenn bei der letzten Einheit Beschwerden auftraten (§19)', () => {
    expect(suggestVariant({ ...neutral, previousComplaints: true })).toEqual({
      variant: 'light',
      reason: 'previous-complaints',
    });
  });

  it('schlaegt leicht vor beim Wiedereinstieg nach einer laengeren Pause', () => {
    expect(suggestVariant({ ...neutral, daysSinceLastSession: REENTRY_DAYS })).toEqual({
      variant: 'light',
      reason: 'reentry',
    });
    expect(suggestVariant({ ...neutral, daysSinceLastSession: REENTRY_DAYS - 1 }).variant).toBe(
      'standard',
    );
  });

  it('schlaegt normal vor bei «gut und bereit» und guter Vorgeschichte', () => {
    expect(
      suggestVariant({
        ...neutral,
        previousExertion: 'fitting',
        previousCompletion: 'full',
        daysSinceLastSession: 2,
      }),
    ).toEqual({ variant: 'standard', reason: 'ready' });
  });

  it('schlaegt normal vor, wenn die vorherige Einheit leicht war', () => {
    expect(suggestVariant({ ...neutral, previousExertion: 'easy' }).variant).toBe('standard');
  });

  it('blockiert den direkten Start bei gemeldeten Beschwerden', () => {
    expect(blocksDirectStart({ mood: 'complaints', wish: 'suggest' })).toBe(true);
    expect(blocksDirectStart({ mood: 'good', wish: 'suggest' })).toBe(false);
  });
});

describe('Kontextaufbau aus vergangenen Einheiten', () => {
  it('verwendet die zuletzt beendete Einheit', () => {
    const context = buildCheckinContext(
      [
        session({ id: 'a', endedAt: '2026-03-01T18:00:00.000Z', date: '2026-03-01' }),
        session({
          id: 'b',
          endedAt: '2026-03-04T18:00:00.000Z',
          date: '2026-03-04',
          feedback: {
            completion: 'partial',
            exertion: 'hard',
            complaints: true,
            wellbeing: 'neutral',
          },
        }),
      ],
      '2026-03-06',
      { mood: 'good', wish: 'suggest' },
    );

    expect(context.previousExertion).toBe('hard');
    expect(context.previousCompletion).toBe('partial');
    expect(context.previousComplaints).toBe(true);
    expect(context.daysSinceLastSession).toBe(2);
  });

  it('kommt ohne vorherige Einheit zurecht', () => {
    const context = buildCheckinContext([], '2026-03-06', { mood: 'good', wish: 'suggest' });
    expect(context.daysSinceLastSession).toBeNull();
    expect(suggestVariant(context).variant).toBe('standard');
  });
});
