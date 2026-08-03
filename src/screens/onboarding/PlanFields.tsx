import { CheckboxGroup, RadioGroup } from '../../components/Choice';
import { InlineNotification } from '../../components/InlineNotification';
import { t } from '../../content/registry';
import { daytimeLabels, weekdayLabels } from '../../content/mappings';
import type { PreferredDaytime, Weekday } from '../../domain/types';
import { weekdayOrder } from '../../domain/types';
import { hasAdjacentDays } from './QuestionnaireScreen';

/** Gemeinsame Felder fuer Wochenplan-Erstellung (§14) und Aenderung (§25). */
export interface PlanFieldsProps {
  trainingDays: Weekday[];
  preferredDaytime: PreferredDaytime;
  onChangeDays: (days: Weekday[]) => void;
  onChangeDaytime: (daytime: PreferredDaytime) => void;
}

export function PlanFields({
  trainingDays,
  preferredDaytime,
  onChangeDays,
  onChangeDaytime,
}: PlanFieldsProps) {
  return (
    <div className="flex flex-col gap-cat">
      <CheckboxGroup
        legend={t('plan.daysLabel')}
        hint={t('questionnaire.q4.hint')}
        values={trainingDays}
        maxSelected={3}
        onChange={onChangeDays}
        options={weekdayOrder.map((day) => ({ value: day, label: t(weekdayLabels[day]) }))}
        error={trainingDays.length === 3 ? undefined : t('questionnaire.q4.error')}
      />

      {trainingDays.length === 3 && hasAdjacentDays(trainingDays) ? (
        <InlineNotification type="neutral" iconLabel={t('questionnaire.q4.spacingHint')}>
          {t('questionnaire.q4.spacingHint')}
        </InlineNotification>
      ) : null}

      <RadioGroup
        legend={t('plan.timeLabel')}
        value={preferredDaytime}
        onChange={onChangeDaytime}
        options={(['morning', 'midday', 'evening', 'varies'] as PreferredDaytime[]).map(
          (value) => ({ value, label: t(daytimeLabels[value]) }),
        )}
      />
    </div>
  );
}
