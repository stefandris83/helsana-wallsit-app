import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { SelectField, TextField } from '../../components/Fields';
import { InlineNotification } from '../../components/InlineNotification';
import { t } from '../../content/registry';
import { dailyActivityLabels, sexLabels } from '../../content/mappings';
import type { DailyActivity, Profile, Sex } from '../../domain/types';
import { useAppStore } from '../../data/store';
import { OnboardingShell } from './OnboardingShell';

export interface ProfileFormErrors {
  birthYear?: string;
  heightCm?: string;
  weightKg?: string;
  sex?: string;
  waistCm?: string;
}

/** Auswahlwerte des Geschlechts im Formular; «keine Angabe» wird nicht angeboten (§11). */
export const sexChoices: Sex[] = ['female', 'male', 'diverse'];

export interface ProfileDraft {
  birthYear: string;
  heightCm: string;
  weightKg: string;
  /** Leer, solange nichts gewaehlt wurde — das Feld ist ein Pflichtfeld. */
  sex: Sex | '';
  waistCm: string;
  dailyActivity: DailyActivity;
}

export const emptyProfileDraft: ProfileDraft = {
  birthYear: '',
  heightCm: '',
  weightKg: '',
  sex: '',
  waistCm: '',
  dailyActivity: 'unspecified',
};

export function profileDraftFrom(profile: Profile): ProfileDraft {
  return {
    birthYear: String(profile.birthYear),
    heightCm: String(profile.heightCm),
    weightKg: String(profile.weightKg),
    // Bestandsprofile ohne Angabe muessen die Wahl nachholen (§11, Pflichtfeld).
    sex: profile.sex === 'unspecified' ? '' : profile.sex,
    waistCm: profile.waistCm === null ? '' : String(profile.waistCm),
    dailyActivity: profile.dailyActivity,
  };
}

/** Validierung der Pflicht- und Wahlfelder (§11). Keine Gesundheitsbewertung. */
export function validateProfile(draft: ProfileDraft): {
  errors: ProfileFormErrors;
  profile: Profile | null;
} {
  const errors: ProfileFormErrors = {};
  const currentYear = new Date().getFullYear();

  const birthYear = Number.parseInt(draft.birthYear, 10);
  if (!Number.isFinite(birthYear) || birthYear < 1900 || birthYear > currentYear) {
    errors.birthYear = t('profile.error.birthYear');
  }

  const heightCm = Number.parseInt(draft.heightCm, 10);
  if (!Number.isFinite(heightCm) || heightCm < 100 || heightCm > 250) {
    errors.heightCm = t('profile.error.heightCm');
  }

  const weightKg = Number.parseFloat(draft.weightKg.replace(',', '.'));
  if (!Number.isFinite(weightKg) || weightKg < 30 || weightKg > 300) {
    errors.weightKg = t('profile.error.weightKg');
  }

  if (draft.sex === '') {
    errors.sex = t('profile.error.sex');
  }

  let waistCm: number | null = null;
  if (draft.waistCm.trim() !== '') {
    const parsed = Number.parseInt(draft.waistCm, 10);
    if (!Number.isFinite(parsed) || parsed < 40 || parsed > 200) {
      errors.waistCm = t('profile.error.waistCm');
    } else {
      waistCm = parsed;
    }
  }

  if (Object.keys(errors).length > 0 || draft.sex === '') return { errors, profile: null };

  return {
    errors,
    profile: {
      birthYear,
      heightCm,
      weightKg,
      sex: draft.sex,
      waistCm,
      dailyActivity: draft.dailyActivity,
    },
  };
}

/** Profil im Onboarding (§11). Kein BMI, keine Bewertung von Angaben. */
export function ProfileScreen() {
  const navigate = useNavigate();
  const stored = useAppStore((state) => state.participant.profile);
  const saveProfile = useAppStore((state) => state.saveProfile);
  const [draft, setDraft] = useState<ProfileDraft>(
    stored ? profileDraftFrom(stored) : emptyProfileDraft,
  );
  const [errors, setErrors] = useState<ProfileFormErrors>({});

  const submit = () => {
    const result = validateProfile(draft);
    setErrors(result.errors);
    if (!result.profile) return;
    saveProfile(result.profile);
    navigate('/onboarding/fragebogen', { replace: true });
  };

  const update = (patch: Partial<ProfileDraft>) =>
    setDraft((current) => ({ ...current, ...patch }));

  return (
    <OnboardingShell
      title={t('profile.title')}
      lead={t('profile.lead')}
      footer={
        <Button block onClick={submit}>
          {t('action.continue')}
        </Button>
      }
    >
      <InlineNotification iconLabel={t('profile.noEvaluationNote')}>
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
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-rat">
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
    </OnboardingShell>
  );
}
