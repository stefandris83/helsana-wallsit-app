import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { TextAreaField } from '../../components/Fields';
import { InlineNotification } from '../../components/InlineNotification';
import { t } from '../../content/registry';
import type { PreferredDaytime, Weekday } from '../../domain/types';
import { useAppStore } from '../../data/store';
import { PlanFields } from '../onboarding/PlanFields';

/** Trainingstage und Trainingszeit aendern (§25). */
export function SettingsPlanScreen() {
  const navigate = useNavigate();
  const plan = useAppStore((state) => state.participant.plan);
  const updatePlan = useAppStore((state) => state.updatePlan);

  const [trainingDays, setTrainingDays] = useState<Weekday[]>(plan?.trainingDays ?? []);
  const [preferredDaytime, setPreferredDaytime] = useState<PreferredDaytime>(
    plan?.preferredDaytime ?? 'evening',
  );
  const [routineCue, setRoutineCue] = useState(plan?.routineCue ?? '');
  const [saved, setSaved] = useState(false);

  if (!plan) return null;

  const save = () => {
    if (trainingDays.length !== 3) return;
    updatePlan({
      trainingDays,
      preferredDaytime,
      routineCue: routineCue.trim() === '' ? null : routineCue.trim(),
    });
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-cat">
      <h1 className="h2">{t('plan.title')}</h1>

      {saved ? (
        <InlineNotification type="success" iconLabel={t('settings.planSaved')}>
          {t('settings.planSaved')}
        </InlineNotification>
      ) : null}

      <Card>
        <PlanFields
          trainingDays={trainingDays}
          preferredDaytime={preferredDaytime}
          onChangeDays={(days) => {
            setTrainingDays(days);
            setSaved(false);
          }}
          onChangeDaytime={(daytime) => {
            setPreferredDaytime(daytime);
            setSaved(false);
          }}
        />
      </Card>

      <Card>
        <TextAreaField
          label={t('plan.routineLabel')}
          placeholder={t('plan.routinePlaceholder')}
          hint={t('plan.routineHint')}
          maxLength={140}
          value={routineCue}
          onChange={(event) => {
            setRoutineCue(event.target.value);
            setSaved(false);
          }}
        />
      </Card>

      <p className="helper-m text-secondary">{t('settings.planChangeNote')}</p>

      <Button block onClick={save} disabled={trainingDays.length !== 3}>
        {t('action.save')}
      </Button>
      <Button variant="secondary" block onClick={() => navigate('/einstellungen')}>
        {t('action.back')}
      </Button>
    </div>
  );
}
