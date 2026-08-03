import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionLink } from '../../components/ActionLink';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Checkbox } from '../../components/Choice';
import { Dialog } from '../../components/Dialog';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../components/Icon';
import { InlineNotification } from '../../components/InlineNotification';
import { WandsitzFigure } from '../../components/WandsitzFigure';
import { WeekStrip } from '../../components/WeekStrip';
import { t, tField } from '../../content/registry';
import type { ContentId } from '../../content/registry';
import {
  learningCardContentIds,
  milestoneLabels,
  motivationLabels,
  weekdayLabels,
} from '../../content/mappings';
import { formatIsoDate, weekdayOf } from '../../domain/dates';
import { personalize } from '../../domain/personalization';
import {
  buildWeekDays,
  isBeforeProgramStart,
  isProgramFinished,
  isTrainingDay,
  nextPlannedDate,
} from '../../domain/progress';
import { evaluateStartGate, needsConfirmation } from '../../domain/session-gate';
import type { StartGateKind } from '../../domain/session-gate';
import {
  selectNeedsReentry,
  selectProgress,
  selectToday,
  selectTrainingUnlocked,
} from '../../data/selectors';
import { useAppStore } from '../../data/store';
import { BeforeStartCard } from './BeforeStartCard';

/** Text- und Bedienlogik je Tageslage. */
const gateDialogs: Record<
  Exclude<StartGateKind, 'open' | 'rest-day'>,
  { title: ContentId; text: ContentId; confirm: ContentId; cancel: ContentId }
> = {
  'already-trained-today': {
    title: 'gate.sameDay.title',
    text: 'gate.sameDay.text',
    confirm: 'gate.sameDay.confirm',
    cancel: 'gate.sameDay.cancel',
  },
  'weekly-goal-reached': {
    title: 'gate.weeklyGoal.title',
    text: 'gate.weeklyGoal.text',
    confirm: 'gate.weeklyGoal.confirm',
    cancel: 'gate.weeklyGoal.cancel',
  },
  'consecutive-day': {
    title: 'gate.consecutive.title',
    text: 'gate.consecutive.text',
    confirm: 'gate.consecutive.confirm',
    cancel: 'gate.consecutive.cancel',
  },
};

/** Startseite «Heute» (§14, §21 B). Zeigt immer genau eine primaere Aktion. */
export function TodayScreen() {
  const navigate = useNavigate();
  const state = useAppStore();
  const { participant, activeSession, pendingMilestones } = state;
  const acknowledgeMilestones = useAppStore((store) => store.acknowledgeMilestones);
  const confirmSafety = useAppStore((store) => store.confirmSafety);
  const startProgramToday = useAppStore((store) => store.startProgramToday);
  const [showGate, setShowGate] = useState(false);

  const today = selectToday();
  const summary = selectProgress(state);
  const unlocked = selectTrainingUnlocked(state);
  const needsReentry = selectNeedsReentry(state);
  const personalization = personalize(participant.questionnaire, {
    profile: participant.profile,
  });

  const plan = participant.plan;

  useEffect(() => {
    if (pendingMilestones.length === 0) return;
    const handle = window.setTimeout(() => acknowledgeMilestones(), 8000);
    return () => window.clearTimeout(handle);
  }, [pendingMilestones, acknowledgeMilestones]);

  if (!plan || !summary) return null;

  const beforeStart = isBeforeProgramStart(plan, today);
  const programOver = isProgramFinished(plan, today);
  const upcoming = nextPlannedDate(plan, today);
  const gate = evaluateStartGate(plan, participant.sessions, today);
  const weekDays = buildWeekDays(plan, participant.sessions, summary.programWeek, today);

  const nextLearningCard = personalization.learningOrder.find(
    (cardId) => !participant.learningCardsOpened.includes(cardId),
  );

  /** Beendete, aber noch nicht bewertete Einheit (§19, §29). */
  const feedbackPending = activeSession !== null && activeSession.endedAt !== null;

  const goToTraining = () => {
    if (!participant.instructionSeen) {
      navigate('/heute/anleitung');
      return;
    }
    navigate('/heute/checkin');
  };

  const startTraining = () => {
    if (needsConfirmation(gate)) {
      setShowGate(true);
      return;
    }
    goToTraining();
  };

  /*
   * Der Tagesstatus beschreibt die Tagesart laut Plan. Die Rueckfrage aus dem
   * Tor steuert nur die Gewichtung der Aktion, nicht die Beschriftung.
   */
  const trainingToday = isTrainingDay(plan, today);
  /*
   * Das Check-Icon bei «Heute erledigt» nutzt das dekorative Helsana-Gruen als
   * Vollzugsakzent — freigegebene Einzelausnahme des Auftraggebers vom
   * 31.07.2026 (CLAUDE.md B.8). Kein Status-Token, keine Bewertung anderer
   * Tageslagen: nur dieses eine Icon ist betroffen.
   */
  const dayStatus: { labelId: ContentId; icon: IconName; accent?: 'decorative-green' } =
    gate.kind === 'already-trained-today'
      ? { labelId: 'today.dayStatus.doneToday', icon: 'check-circle', accent: 'decorative-green' }
      : gate.kind === 'weekly-goal-reached'
        ? { labelId: 'today.dayStatus.weekGoalReached', icon: 'trophy' }
        : trainingToday
          ? { labelId: 'today.dayStatus.trainingDay', icon: 'timer' }
          : { labelId: 'today.dayStatus.restDay', icon: 'clock' };

  /** Nur an einem offenen, geplanten Trainingstag ist der Start die primaere Aktion. */
  const startIsPrimary =
    trainingToday && gate.kind !== 'already-trained-today' && gate.kind !== 'weekly-goal-reached';
  const dialog = gate.kind === 'open' || gate.kind === 'rest-day' ? null : gateDialogs[gate.kind];

  return (
    <div className="flex flex-col gap-cat">
      {/*
        Die Illustration steht neben dem Titel und bleibt bewusst klein: Sie
        beansprucht keine eigene Zeile und veraendert die Abstaende nicht.
      */}
      <div className="flex items-start justify-between gap-rat">
        <div className="flex flex-col gap-bee">
          <h1 className="h2">{t('today.title')}</h1>
          {beforeStart ? null : (
            <p className="body-s text-secondary">
              {t('today.programWeek', { week: summary.programWeek })}
            </p>
          )}
        </div>
        <WandsitzFigure sex={participant.profile?.sex ?? 'unspecified'} />
      </div>

      {dialog ? (
        <Dialog
          open={showGate}
          title={t(dialog.title)}
          description={t(dialog.text, {
            done: gate.sessionsThisWeek,
            total: gate.weeklyGoal,
          })}
          confirmLabel={t(dialog.confirm)}
          cancelLabel={t(dialog.cancel)}
          onConfirm={() => {
            setShowGate(false);
            goToTraining();
          }}
          onCancel={() => setShowGate(false)}
        />
      ) : null}

      {pendingMilestones.length > 0 ? (
        <div className="u-milestone">
          <InlineNotification
            type="neutral"
            title={t('milestone.title')}
            iconLabel={t('milestone.title')}
          >
            <ul className="list-none p-none m-none flex flex-col gap-bee">
              {pendingMilestones.map((milestone) => (
                <li key={milestone}>{t(milestoneLabels[milestone])}</li>
              ))}
            </ul>
          </InlineNotification>
        </div>
      ) : null}

      {!unlocked ? (
        <Card>
          <div className="flex flex-col gap-frog">
            <h2 className="h5">{t('safety.title')}</h2>
            <p className="body-m-copy">{t('safety.text')}</p>
            <Checkbox
              checked={false}
              onChange={(checked) => {
                if (checked) confirmSafety();
              }}
              label={t('safety.confirmLabel')}
            />
            <p className="helper-m text-secondary">{t('safety.lockedHint')}</p>
          </div>
        </Card>
      ) : null}

      {programOver ? (
        <Card>
          <div className="flex flex-col gap-snail">
            <h2 className="h5">{t('today.programFinishedTitle')}</h2>
            <p className="body-m-copy">{t('today.programFinishedText')}</p>
          </div>
        </Card>
      ) : null}

      {beforeStart ? (
        <BeforeStartCard
          plan={plan}
          today={today}
          onShowInstruction={() => navigate('/heute/anleitung')}
          onStartToday={startProgramToday}
        />
      ) : (
        <Card elevated>
          <div className="flex flex-col gap-rat">
            <p className="flex items-center gap-snail h4">
              {dayStatus.accent === 'decorative-green' ? (
                <span className="text-decorative-green">
                  <Icon name={dayStatus.icon} size={24} />
                </span>
              ) : (
                <Icon name={dayStatus.icon} size={24} />
              )}
              {t(dayStatus.labelId)}
            </p>

            <p className="body-m">
              {summary.weeklyGoalExceeded
                ? t('today.weeklyGoalExceeded', {
                    done: summary.sessionsThisWeek,
                    total: summary.weeklyGoal,
                  })
                : t('today.weeklyGoal', {
                    done: summary.sessionsThisWeek,
                    total: summary.weeklyGoal,
                  })}
            </p>

            <div className="flex flex-col gap-snail">
              <p className="helper-m text-secondary">{t('today.weekStripLabel')}</p>
              <WeekStrip days={weekDays} showHeader />
            </div>

            {upcoming && upcoming !== today ? (
              <p className="body-s text-secondary">
                {t('today.nextSession', {
                  day: `${t(weekdayLabels[weekdayOf(upcoming)])}, ${formatIsoDate(upcoming)}`,
                })}
              </p>
            ) : null}

            {gate.kind === 'rest-day' ? (
              <p className="body-s text-secondary">{t('today.restDayHint')}</p>
            ) : null}

            {feedbackPending ? (
              <Button block onClick={() => navigate('/heute/rueckmeldung')}>
                {t('today.feedbackPending')}
              </Button>
            ) : activeSession ? (
              <Button block onClick={() => navigate('/heute/training')}>
                {t('today.resumeSession')}
              </Button>
            ) : (
              <Button
                variant={startIsPrimary ? 'primary' : 'secondary'}
                block
                onClick={startTraining}
                disabled={!unlocked}
              >
                {startIsPrimary ? t('today.start') : t('today.startAnyway')}
              </Button>
            )}

            {!participant.instructionSeen ? (
              <ActionLink iconRight="arrow-right" onClick={() => navigate('/heute/anleitung')}>
                {t('today.instructionLink')}
              </ActionLink>
            ) : null}
          </div>
        </Card>
      )}

      {needsReentry ? (
        <Card>
          <div className="flex flex-col gap-frog">
            <h2 className="h5">{t('today.restart.title')}</h2>
            <p className="body-m-copy">{t('today.restart.text')}</p>
            <Button variant="secondary" block onClick={startTraining} disabled={!unlocked}>
              {t('today.restart.action')}
            </Button>
          </div>
        </Card>
      ) : null}

      {/*
        Der personalisierte Hinweis bezieht sich auf die heutige Einheit und
        passt daher nur an einem offenen Trainingstag. Sonst der neutrale Text.
      */}
      <InlineNotification type="neutral" iconLabel={t('motivation.default')}>
        {gate.kind === 'open' && !beforeStart
          ? t(motivationLabels[personalization.motivation])
          : t('motivation.default')}
      </InlineNotification>

      {plan.routineCue ? (
        <Card>
          <div className="flex flex-col gap-bee">
            <p className="helper-m text-secondary">{t('plan.routineLabel')}</p>
            <p className="body-m">{plan.routineCue}</p>
          </div>
        </Card>
      ) : null}

      {nextLearningCard ? (
        <Card>
          <div className="flex flex-col gap-snail">
            <p className="helper-m text-secondary">{t('today.learningTeaser')}</p>
            <h2 className="h5">{tField(learningCardContentIds[nextLearningCard], 'title')}</h2>
            <ActionLink
              iconRight="arrow-right"
              onClick={() => navigate(`/lernen/${nextLearningCard}`)}
            >
              {t('learning.openCard')}
            </ActionLink>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
