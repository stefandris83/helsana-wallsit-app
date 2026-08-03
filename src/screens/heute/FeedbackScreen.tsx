import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { RadioGroup } from '../../components/Choice';
import { Icon } from '../../components/Icon';
import { InlineNotification } from '../../components/InlineNotification';
import { t } from '../../content/registry';
import type { ContentId } from '../../content/registry';
import {
  completionLabels,
  exertionLabels,
  weekdayLabels,
  wellbeingLabels,
} from '../../content/mappings';
import { formatIsoDate, weekdayOf } from '../../domain/dates';
import type { Exertion, SessionCompletion, Wellbeing } from '../../domain/types';
import { selectNextPlannedDate, selectProgress } from '../../data/selectors';
import { suggestedCompletion, useAppStore } from '../../data/store';

/** Rueckmeldung nach der Einheit (§19). Maximal vier kurze Fragen. */
export function FeedbackScreen() {
  const navigate = useNavigate();
  const state = useAppStore();
  const activeSession = state.activeSession;
  const saveFeedback = useAppStore((store) => store.saveFeedback);

  const [completion, setCompletion] = useState<SessionCompletion | null>(() =>
    activeSession ? suggestedCompletion(activeSession) : null,
  );
  const [exertion, setExertion] = useState<Exertion | null>(null);
  const [complaints, setComplaints] = useState<boolean | null>(null);
  const [wellbeing, setWellbeing] = useState<Wellbeing | null>(null);
  const [saved, setSaved] = useState(false);

  const summary = selectProgress(state);
  const nextDate = selectNextPlannedDate(state);

  if (saved) {
    return (
      <div className="flex flex-col gap-cat">
        <h1 className="h2">{t('feedback.savedTitle')}</h1>
        <Card elevated>
          <div className="flex flex-col gap-snail">
            <p className="body-m-copy">
              {t('feedback.savedWeek', {
                done: summary?.sessionsThisWeek ?? 0,
                total: summary?.weeklyGoal ?? 0,
              })}
            </p>
            {nextDate ? (
              <p className="body-s text-secondary">
                {t('feedback.savedNext', {
                  day: `${t(weekdayLabels[weekdayOf(nextDate)])}, ${formatIsoDate(nextDate)}`,
                })}
              </p>
            ) : null}
          </div>
        </Card>
        <Button block onClick={() => navigate('/heute', { replace: true })}>
          {t('feedback.toToday')}
        </Button>
      </div>
    );
  }

  if (!activeSession) {
    return (
      <div className="flex flex-col gap-cat">
        <h1 className="h2">{t('error.noSession.title')}</h1>
        <p className="body-m-copy">{t('error.noSession.text')}</p>
        <Button block onClick={() => navigate('/heute', { replace: true })}>
          {t('feedback.toToday')}
        </Button>
      </div>
    );
  }

  const sets = activeSession.timer.completedSets;
  const setCount = activeSession.timer.config.setCount;
  const reached = sets.filter((set) => set.targetReached).length;
  const optionalReached = sets.filter((set) => set.optionalTargetReached).length;
  const allReached = reached >= setCount;

  const isFirstEver = state.participant.sessions.length === 0;
  const weeklyGoal = summary?.weeklyGoal ?? 0;
  const sessionsAfter = (summary?.sessionsThisWeek ?? 0) + 1;
  const exceeded = sessionsAfter > weeklyGoal;

  /** Kopfzeile richtet sich nach dem Ausgang der Einheit — nie tadelnd (§6, §21 D). */
  const headline: ContentId = !allReached
    ? 'feedback.head.partial'
    : isFirstEver
      ? 'feedback.head.first'
      : sessionsAfter === weeklyGoal
        ? 'feedback.head.weekGoal'
        : 'feedback.head.done';

  const complete =
    completion !== null && exertion !== null && complaints !== null && wellbeing !== null;

  const submit = () => {
    if (!complete) return;
    saveFeedback({ completion, exertion, complaints, wellbeing });
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-cat">
      <div className="u-milestone flex flex-col gap-snail">
        <h1 className="flex items-center gap-snail h2">
          {/* Farbe ist nie alleiniger Bedeutungstraeger: Icon plus Text. */}
          {allReached ? (
            <span className="text-decorative-green">
              <Icon name="check-circle" size={32} />
            </span>
          ) : null}
          {t(headline)}
        </h1>

        <p className="lead text-secondary">
          {exceeded
            ? t('feedback.head.weekExceeded', { done: sessionsAfter, total: weeklyGoal })
            : t('feedback.head.week', { done: sessionsAfter, total: weeklyGoal })}
        </p>

        <p className="body-s text-secondary">
          {allReached
            ? t('feedback.head.setsAll', { total: setCount })
            : t('feedback.head.setsSome', { reached, total: setCount })}
          {optionalReached > 0 ? ` ${t('feedback.head.optional', { count: optionalReached })}` : ''}
          {!allReached ? ` ${t('feedback.head.encourage')}` : ''}
        </p>
      </div>

      <div className="flex flex-col gap-bee">
        <h2 className="h5">{t('feedback.title')}</h2>
        <p className="body-s text-secondary">{t('feedback.lead')}</p>
      </div>

      <Card>
        <RadioGroup
          legend={t('feedback.q1.title')}
          value={completion}
          onChange={setCompletion}
          options={(['full', 'partial', 'none'] as SessionCompletion[]).map((value) => ({
            value,
            label: t(completionLabels[value]),
          }))}
        />
      </Card>

      <Card>
        <RadioGroup
          legend={t('feedback.q2.title')}
          value={exertion}
          onChange={setExertion}
          options={(['easy', 'fitting', 'hard'] as Exertion[]).map((value) => ({
            value,
            label: t(exertionLabels[value]),
          }))}
        />
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <RadioGroup
            legend={t('feedback.q3.title')}
            value={complaints === null ? null : complaints ? 'yes' : 'no'}
            onChange={(value) => setComplaints(value === 'yes')}
            options={[
              { value: 'no', label: t('common.no') },
              { value: 'yes', label: t('common.yes') },
            ]}
          />
          {complaints === true ? (
            <InlineNotification type="neutral" iconLabel={t('feedback.q3.note')}>
              {t('feedback.q3.note')}
            </InlineNotification>
          ) : null}
        </div>
      </Card>

      <Card>
        <RadioGroup
          legend={t('feedback.q4.title')}
          value={wellbeing}
          onChange={setWellbeing}
          options={(['good', 'neutral', 'bad'] as Wellbeing[]).map((value) => ({
            value,
            label: t(wellbeingLabels[value]),
          }))}
        />
      </Card>

      <Button block onClick={submit} disabled={!complete}>
        {t('feedback.save')}
      </Button>
    </div>
  );
}
