import { describe, expect, it } from 'vitest';
import { emptyProfileDraft, profileDraftFrom, sexChoices, validateProfile } from './ProfileScreen';
import type { ProfileDraft } from './ProfileScreen';
import type { Profile } from '../../domain/types';

/**
 * Profilvalidierung (§11). Geschlecht ist seit 01.08.2026 Pflichtangabe
 * (Freigabe des Auftraggebers); die uebrigen Wahlfelder bleiben freiwillig.
 */

const validDraft: ProfileDraft = {
  birthYear: '1975',
  heightCm: '174',
  weightKg: '78',
  sex: 'female',
  waistCm: '',
  dailyActivity: 'unspecified',
};

describe('Pflichtangabe Geschlecht (§11)', () => {
  it('lehnt ein Profil ohne Auswahl ab', () => {
    const result = validateProfile({ ...validDraft, sex: '' });
    expect(result.profile).toBeNull();
    expect(result.errors.sex).toBeTruthy();
  });

  it('nimmt jede angebotene Auswahl an', () => {
    for (const sex of sexChoices) {
      const result = validateProfile({ ...validDraft, sex });
      expect(result.errors.sex, `Auswahl ${sex}`).toBeUndefined();
      expect(result.profile?.sex).toBe(sex);
    }
  });

  it('bietet «keine Angabe» nicht mehr an', () => {
    expect(sexChoices).not.toContain('unspecified');
    expect(emptyProfileDraft.sex).toBe('');
  });

  it('laesst ein Bestandsprofil ohne Angabe die Wahl nachholen', () => {
    const stored: Profile = {
      birthYear: 1975,
      heightCm: 174,
      weightKg: 78,
      sex: 'unspecified',
      waistCm: null,
      dailyActivity: 'sitting',
    };
    const draft = profileDraftFrom(stored);
    expect(draft.sex).toBe('');
    expect(validateProfile(draft).profile).toBeNull();
  });

  it('uebernimmt eine vorhandene Angabe unveraendert', () => {
    const stored: Profile = {
      birthYear: 1980,
      heightCm: 180,
      weightKg: 82,
      sex: 'male',
      waistCm: 90,
      dailyActivity: 'mixed',
    };
    expect(profileDraftFrom(stored).sex).toBe('male');
  });
});

describe('Uebrige Profilfelder', () => {
  it('haelt Taillenumfang und Alltagstaetigkeit freiwillig', () => {
    const result = validateProfile(validDraft);
    expect(result.profile).not.toBeNull();
    expect(result.profile?.waistCm).toBeNull();
    expect(result.profile?.dailyActivity).toBe('unspecified');
  });

  it('meldet unplausible Pflichtwerte weiterhin', () => {
    const result = validateProfile({ ...validDraft, birthYear: '1800', heightCm: '10' });
    expect(result.profile).toBeNull();
    expect(result.errors.birthYear).toBeTruthy();
    expect(result.errors.heightCm).toBeTruthy();
  });
});
