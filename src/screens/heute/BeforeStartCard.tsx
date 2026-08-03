import { ActionLink } from '../../components/ActionLink';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { WeekStrip } from '../../components/WeekStrip';
import { t } from '../../content/registry';
import { weekdayLabels } from '../../content/mappings';
import { formatIsoDate, weekdayOf } from '../../domain/dates';
import { buildWeekDays, nextPlannedDate } from '../../domain/progress';
import type { IsoDate, TrainingPlan } from '../../domain/types';

export interface BeforeStartCardProps {
  plan: TrainingPlan;
  today: IsoDate;
  onShowInstruction: () => void;
  onStartToday: () => void;
}

/**
 * Zeit zwischen Planerstellung und gewaehltem Programmstart (§14, B.13.1).
 *
 * Vor dem Startdatum laeuft keine Programmwoche: es gibt kein Wochenziel und
 * keine verpasste Einheit. Statt eines Trainingsstarts zeigt die Karte, wann es
 * losgeht — und laesst den Start jederzeit auf heute vorziehen. Damit entstehen
 * keine Einheiten ausserhalb des Programms.
 */
export function BeforeStartCard({
  plan,
  today,
  onShowInstruction,
  onStartToday,
}: BeforeStartCardProps) {
  const firstSession = nextPlannedDate(plan, plan.startDate);
  const weekDays = buildWeekDays(plan, [], 1, today);
  const startLabel = `${t(weekdayLabels[weekdayOf(plan.startDate)])}, ${formatIsoDate(plan.startDate)}`;

  return (
    <Card elevated>
      <div className="flex flex-col gap-rat">
        <p className="flex items-center gap-snail h4">
          <Icon name="calendar" size={24} />
          {t('today.beforeStart.status')}
        </p>

        <p className="body-m">{t('today.beforeStart.lead', { day: startLabel })}</p>

        {firstSession ? (
          <p className="body-s text-secondary">
            {t('today.beforeStart.firstSession', {
              day: `${t(weekdayLabels[weekdayOf(firstSession)])}, ${formatIsoDate(firstSession)}`,
            })}
          </p>
        ) : null}

        <div className="flex flex-col gap-snail">
          <p className="helper-m text-secondary">{t('today.beforeStart.weekStripLabel')}</p>
          <WeekStrip days={weekDays} showHeader />
        </div>

        <p className="body-s text-secondary">{t('today.beforeStart.prepare')}</p>

        <Button block onClick={onShowInstruction}>
          {t('today.instructionLink')}
        </Button>

        <div className="flex flex-col gap-bee">
          <ActionLink iconRight="arrow-right" onClick={onStartToday}>
            {t('today.beforeStart.startNow')}
          </ActionLink>
          <p className="helper-m text-secondary">{t('today.beforeStart.startNowHint')}</p>
        </div>
      </div>
    </Card>
  );
}
