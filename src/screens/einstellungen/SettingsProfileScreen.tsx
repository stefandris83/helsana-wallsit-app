import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { SelectField, TextField } from '../../components/Fields';
import { InlineNotification } from '../../components/InlineNotification';
import { t } from '../../content/registry';
import { dailyActivityLabels, sexLabels } from '../../content/mappings';
import type { DailyActivity, Sex } from '../../domain/types';
import { useAppStore } from '../../data/store';
import type { ProfileDraft, ProfileFormErrors } from '../onboarding/ProfileScreen';
import {
  emptyProfileDraft,
  profileDraftFrom,
  sexChoices,
  validateProfile,
} from '../onboarding/ProfileScreen';

/** Profilangaben bearbeiten (§25). Keine Bewertung der Angaben. */
export function SettingsProfileScreen() {
  const navigate = useNavigate();
  const stored = useAppStore((state) => state.participant.profile);
  const saveProfile = useAppStore((state) => state.saveProfile);

  const [draft, setDraft] = useState<ProfileDraft>(
    stored ? profileDraftFrom(stored) : emptyProfileDraft,
  );
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<ProfileDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setSaved(false);
  };

  const save = () => {
    const result = validateProfile(draft);
    setErrors(result.errors);
    if (!result.profile) return;
    saveProfile(result.profile);
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-cat">
      <h1 className="h2">{t('profile.title')}</h1>

      {saved ? (
        <InlineNotification type="success" iconLabel={t('profile.saved')}>
          {t('profile.saved')}
        </InlineNotification>
      ) : null}

      <InlineNotification type="neutral" iconLabel={t('profile.noEvaluationNote')}>
        {t('profile.noEvaluationNote')}
      </InlineNotification>

      <Card>
        <div className="flex flex-col gap-rat">
          <TextField
            label={t('profile.birthYear')}
            inputMode="numeric"
            value={draft.birthYear}
            onChange={(event) => update({ birthYear: event.target.value })}
            error={errors.birthYear}
          />
          <TextField
            label={t('profile.heightCm')}
            inputMode="numeric"
            value={draft.heightCm}
            onChange={(event) => update({ heightCm: event.target.value })}
            error={errors.heightCm}
          />
          <TextField
            label={t('profile.weightKg')}
            inputMode="decimal"
            value={draft.weightKg}
            onChange={(event) => update({ weightKg: event.target.value })}
            error={errors.weightKg}
          />
          <SelectField
            label={t('profile.sex')}
            value={draft.sex}
            onChange={(event) => update({ sex: event.target.value as Sex | '' })}
            error={errors.sex}
            hint={t('profile.sexHint')}
            options={[
              { value: '', label: t('profile.sex.placeholder') },
              ...sexChoices.map((value) => ({ value, label: t(sexLabels[value]) })),
            ]}
          />
          <p className="body-s text-secondary">{t('common.optionalHint')}</p>
          <TextField
            label={t('profile.waistCm')}
            inputMode="numeric"
            value={draft.waistCm}
            onChange={(event) => update({ waistCm: event.target.value })}
            error={errors.waistCm}
          />
          <SelectField
            label={t('profile.dailyActivity')}
            value={draft.dailyActivity}
            onChange={(event) => update({ dailyActivity: event.target.value as DailyActivity })}
            options={(['sitting', 'mixed', 'active', 'unspecified'] as DailyActivity[]).map(
              (value) => ({ value, label: t(dailyActivityLabels[value]) }),
            )}
          />
        </div>
      </Card>

      <Button block onClick={save}>
        {t('action.save')}
      </Button>
      <Button variant="secondary" block onClick={() => navigate('/einstellungen')}>
        {t('action.back')}
      </Button>
    </div>
  );
}
