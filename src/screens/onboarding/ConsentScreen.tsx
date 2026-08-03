import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Checkbox } from '../../components/Choice';
import { InlineNotification } from '../../components/InlineNotification';
import { t } from '../../content/registry';
import type { ContentId } from '../../content/registry';
import type { ConsentState } from '../../domain/access';
import { emptyConsent, isConsentComplete } from '../../domain/access';
import { useAppStore } from '../../data/store';
import { OnboardingShell } from './OnboardingShell';

type ConsentKey = keyof Omit<ConsentState, 'completedAt'>;

const items: { key: ConsentKey; labelId: ContentId }[] = [
  { key: 'voluntary', labelId: 'consent.item.voluntary' },
  { key: 'privacy', labelId: 'consent.item.privacy' },
  { key: 'noMedicalAdvice', labelId: 'consent.item.noMedicalAdvice' },
  { key: 'analytics', labelId: 'consent.item.analytics' },
  { key: 'profileStorage', labelId: 'consent.item.profile' },
];

/** Einwilligung (§9). Keine vorausgewaehlten Checkboxen. */
export function ConsentScreen() {
  const navigate = useNavigate();
  const stored = useAppStore((state) => state.participant.consent);
  const setConsent = useAppStore((state) => state.setConsent);
  const [draft, setDraft] = useState<ConsentState>({ ...emptyConsent, ...stored, completedAt: null });
  const [showError, setShowError] = useState(false);

  const complete = isConsentComplete(draft);

  const submit = () => {
    if (!complete) {
      setShowError(true);
      return;
    }
    setConsent({ ...draft, completedAt: new Date().toISOString() });
    navigate('/onboarding/willkommen', { replace: true });
  };

  return (
    <OnboardingShell
      title={t('consent.title')}
      lead={t('consent.lead')}
      footer={
        <Button block onClick={submit} disabled={!complete}>
          {t('consent.submit')}
        </Button>
      }
    >
      <Card>
        <div className="flex flex-col gap-snail">
          {items.map((item) => (
            <Checkbox
              key={item.key}
              checked={draft[item.key]}
              onChange={(checked) => {
                setDraft((current) => ({ ...current, [item.key]: checked }));
                setShowError(false);
              }}
              label={t(item.labelId)}
            />
          ))}
        </div>
      </Card>

      <InlineNotification iconLabel={t('consent.privacyText')}>
        {t('consent.privacyText')}
      </InlineNotification>

      {showError ? (
        <InlineNotification type="error" iconLabel={t('consent.incomplete')}>
          {t('consent.incomplete')}
        </InlineNotification>
      ) : null}
    </OnboardingShell>
  );
}
