import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { RadioGroup } from '../../components/Choice';
import type { ChoiceOption } from '../../components/Choice';
import { TextAreaField } from '../../components/Fields';
import { InlineNotification } from '../../components/InlineNotification';
import { t } from '../../content/registry';
import { formatIsoDate, toIsoDate } from '../../domain/dates';
import {
  plannedDatesLeftInCalendarWeek,
  startDateFor,
  suggestStartChoice,
} from '../../domain/progress';
import type { ProgramStartChoice } from '../../domain/progress';
import type { PreferredDaytime, Weekday } from '../../domain/types';
import { useAppStore } from '../../data/store';
import { OnboardingShell } from './OnboardingShell';
import { PlanFields } from './PlanFields';

/**
 * Persoenlicher Wochenplan (§14).
 *
 * Woche 1 beginnt in der laufenden oder in der kommenden Kalenderwoche — die
 * Person waehlt das hier (B.13.1). Vorausgewaehlt ist die kommende Woche, wenn
 * in der laufenden Woche weniger als zwei geplante Trainingstage uebrig sind;
 * eine reine Kalenderregel ohne Gesundheitsbezug.
 */
export function PlanScreen() {
  const navigate = useNavigate();
  const questionnaire = useAppStore((state) => state.participant.questionnaire);
  const createPlan = useAppStore((state) => state.createPlan);

  const [trainingDays, setTrainingDays] = useState<Weekday[]>(
    questionnaire?.trainingDays ?? ['mon', 'wed', 'fri'],
  );
  const [preferredDaytime, setPreferredDaytime] = useState<PreferredDaytime>(
    questionnaire?.preferredDaytime ?? 'evening',
  );
  const [routineCue, setRoutineCue] = useState('');
  /** `null` = noch keine eigene Wahl; dann gilt der Vorschlag zu den Trainingstagen. */
  const [chosenStart, setChosenStart] = useState<ProgramStartChoice | null>(null);

  const today = toIsoDate(new Date());
  const daysLeftThisWeek = plannedDatesLeftInCalendarWeek(trainingDays, today);
  const canStartThisWeek = daysLeftThisWeek.length > 0;
  const startChoice: ProgramStartChoice = !canStartThisWeek
    ? 'next-week'
    : (chosenStart ?? suggestStartChoice(trainingDays, today));
  const nextWeekStart = startDateFor('next-week', today);

  const startOptions: ChoiceOption<ProgramStartChoice>[] = [
    {
      value: 'this-week',
      label: t('plan.start.thisWeek'),
      description:
        daysLeftThisWeek.length === 1
          ? t('plan.start.thisWeekHintOne')
          : t('plan.start.thisWeekHint', { count: daysLeftThisWeek.length }),
    },
    {
      value: 'next-week',
      label: t('plan.start.nextWeek'),
      description: t('plan.start.nextWeekHint', { date: formatIsoDate(nextWeekStart) }),
    },
  ];

  const submit = () => {
    if (trainingDays.length !== 3) return;
    createPlan({
      startDate: startDateFor(startChoice, today),
      trainingDays,
      preferredDaytime,
      preciseTimes: questionnaire?.preciseTimes ?? null,
      routineCue: routineCue.trim() === '' ? null : routineCue.trim(),
    });
    navigate('/heute', { replace: true });
  };

  return (
    <OnboardingShell
      title={t('plan.title')}
      lead={t('plan.lead')}
      footer={
        <Button block onClick={submit} disabled={trainingDays.length !== 3}>
          {t('plan.create')}
        </Button>
      }
    >
      <Card>
        <PlanFields
          trainingDays={trainingDays}
          preferredDaytime={preferredDaytime}
          onChangeDays={setTrainingDays}
          onChangeDaytime={setPreferredDaytime}
        />
      </Card>

      <Card>
        {canStartThisWeek ? (
          <RadioGroup
            legend={t('plan.startLabel')}
            options={startOptions}
            value={startChoice}
            onChange={setChosenStart}
            hint={t('plan.start.note')}
          />
        ) : (
          <div className="flex flex-col gap-bee">
            <p className="h5">{t('plan.startLabel')}</p>
            <p className="body-m-copy">{t('plan.start.thisWeekUnavailable')}</p>
            <p className="body-s text-secondary">
              {t('plan.start.nextWeekHint', { date: formatIsoDate(nextWeekStart) })}
            </p>
          </div>
        )}
      </Card>

      <Card>
        <TextAreaField
          label={t('plan.routineLabel')}
          placeholder={t('plan.routinePlaceholder')}
          hint={t('plan.routineHint')}
          value={routineCue}
          maxLength={140}
          onChange={(event) => setRoutineCue(event.target.value)}
        />
      </Card>

      <InlineNotification
        type="neutral"
        title={t('plan.weeklyGoal')}
        iconLabel={t('plan.weeklyGoal')}
      >
        <div className="flex flex-col gap-bee">
          <span>{t('plan.sessionStructure')}</span>
          <span>
            {startChoice === 'this-week'
              ? t('plan.startsToday')
              : t('plan.start.nextWeekHint', { date: formatIsoDate(nextWeekStart) })}
          </span>
        </div>
      </InlineNotification>
    </OnboardingShell>
  );
}
