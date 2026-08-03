import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { WeekStrip } from '../../components/WeekStrip';
import { StatTile } from '../../components/StatTile';
import { t } from '../../content/registry';
import { exertionLabels, milestoneLabels, weekdayLabels } from '../../content/mappings';
import { formatIsoDate, weekdayOf } from '../../domain/dates';
import { evaluateMilestones, milestoneIds } from '../../domain/milestones';
import { buildWeekDays, isBeforeProgramStart } from '../../domain/progress';
import { PROGRAM_WEEKS } from '../../domain/week-matrix';
import { selectProgress, selectToday } from '../../data/selectors';
import { useAppStore } from '../../data/store';

const exertionScale: Record<number, keyof typeof exertionLabels> = {
  1: 'easy',
  2: 'fitting',
  3: 'hard',
};

/** Fortschrittsbereich (§20). Ausschliesslich Verhaltens- und Trainingsfortschritt. */
export function ProgressScreen() {
  const state = useAppStore();
  const plan = state.participant.plan;
  const sessions = state.participant.sessions;
  const summary = selectProgress(state);
  const today = selectToday();

  if (!plan || !summary) return null;

  const reachedMilestones = new Set(evaluateMilestones(summary));

  const averageExertionLabel =
    summary.averageExertion === null
      ? t('progress.averageExertionEmpty')
      : t(exertionLabels[exertionScale[Math.round(summary.averageExertion)] ?? 'fitting']);

  return (
    <div className="flex flex-col gap-cat">
      <div className="flex flex-col gap-bee">
        <h1 className="h2">{t('progress.title')}</h1>
        <p className="body-s text-secondary">{t('progress.lead')}</p>
      </div>

      {isBeforeProgramStart(plan, today) ? (
        <Card>
          <p className="body-m-copy">
            {t('progress.beforeStart', {
              day: `${t(weekdayLabels[weekdayOf(plan.startDate)])}, ${formatIsoDate(plan.startDate)}`,
            })}
          </p>
        </Card>
      ) : summary.sessionsTotal === 0 ? (
        <Card>
          <p className="body-m-copy">{t('progress.empty')}</p>
        </Card>
      ) : null}

      <div className="grid gap-frog tablet:grid-cols-2 desktop:grid-cols-3">
        <StatTile
          label={t('progress.currentWeek')}
          value={`${summary.programWeek} / ${PROGRAM_WEEKS}`}
          icon="calendar"
        />
        <StatTile
          label={t('progress.completedWeeks')}
          value={summary.completedWeeks}
          icon="checkmark"
        />
        <StatTile
          label={t('progress.sessionsThisWeek')}
          value={`${summary.sessionsThisWeek} / ${summary.weeklyGoal}`}
          icon="timer"
        />
        <StatTile label={t('progress.sessionsTotal')} value={summary.sessionsTotal} icon="list-view" />
        <StatTile
          label={t('progress.targetsReached')}
          value={summary.targetsReached}
          icon="check-circle"
        />
        <StatTile
          label={t('progress.optionalTargets')}
          value={summary.optionalTargetsReached}
          icon="add"
        />
        <StatTile
          label={t('progress.streakCurrent')}
          value={summary.currentStreak}
          hint={t('progress.streakUnit')}
          icon="replay"
        />
        <StatTile
          label={t('progress.streakLongest')}
          value={summary.longestStreak}
          hint={t('progress.streakUnit')}
          icon="trophy"
        />
        <StatTile
          label={t('progress.averageExertion')}
          value={averageExertionLabel}
          icon="bar-chart"
        />
        <StatTile
          label={t('progress.averageHold')}
          value={
            summary.averageHoldSeconds === null
              ? '–'
              : `${Math.round(summary.averageHoldSeconds)} ${t('common.secondsShort')}`
          }
          icon="clock"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('progress.completionSplit')}</h2>
          <ul className="flex flex-col gap-snail list-none p-none m-none body-m">
            <li className="flex justify-between">
              <span>{t('progress.completionSplit.full')}</span>
              <span>{summary.completionSplit.full}</span>
            </li>
            <li className="flex justify-between">
              <span>{t('progress.completionSplit.partial')}</span>
              <span>{summary.completionSplit.partial}</span>
            </li>
            <li className="flex justify-between">
              <span>{t('progress.completionSplit.none')}</span>
              <span>{summary.completionSplit.none}</span>
            </li>
          </ul>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('progress.calendarTitle')}</h2>
          <p className="helper-m text-secondary">{t('progress.streakExplainer')}</p>

          {/* Eine Zeile ist eine Programmwoche, also eine Kalenderwoche Mo–So (B.13.1). */}
          <div className="flex flex-col gap-frog overflow-x-auto">
            {Array.from({ length: PROGRAM_WEEKS }, (_, index) => index + 1).map((week) => (
              <div key={week} className="flex flex-col gap-bee">
                <p className="helper-m text-secondary">
                  {t('progress.calendarWeekLabel', { week })}
                </p>
                <WeekStrip
                  days={buildWeekDays(plan, sessions, week, today)}
                  showHeader={week === 1}
                />
              </div>
            ))}
          </div>

          <ul className="flex flex-wrap gap-frog list-none p-none m-none helper-m text-secondary">
            <li className="flex items-center gap-bee">
              <Icon name="checkmark" size={16} />
              {t('progress.calendarLegendDone')}
            </li>
            <li className="flex items-center gap-bee">
              <span aria-hidden="true">·</span>
              {t('progress.calendarLegendPlanned')}
            </li>
          </ul>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('milestone.title')}</h2>
          <ul className="flex flex-col gap-snail list-none p-none m-none">
            {milestoneIds.map((milestone) => {
              const reached = reachedMilestones.has(milestone);
              return (
                <li key={milestone} className="flex items-start justify-between gap-frog">
                  <span className={reached ? 'body-m' : 'body-m text-secondary'}>
                    {t(milestoneLabels[milestone])}
                  </span>
                  <span className="flex shrink-0 items-center gap-bee helper-m text-secondary">
                    {reached ? <Icon name="check-circle" size={16} /> : null}
                    {reached ? t('milestone.reachedBadge') : t('milestone.openBadge')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
    </div>
  );
}
