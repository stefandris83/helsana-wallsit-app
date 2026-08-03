import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { TextField } from '../../components/Fields';
import { InlineNotification } from '../../components/InlineNotification';
import { t } from '../../content/registry';
import { useAppStore } from '../../data/store';
import { OnboardingShell } from './OnboardingShell';

/** Zugang ueber anonymen Einladungscode (§8, B.9). */
export function AccessScreen() {
  const navigate = useNavigate();
  const redeem = useAppStore((state) => state.redeemAccessCode);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const submit = () => {
    if (redeem(code)) {
      navigate('/onboarding/einwilligung', { replace: true });
      return;
    }
    setError(true);
  };

  return (
    <OnboardingShell title={t('access.title')} lead={t('access.lead')}>
      <form
        className="flex flex-col gap-cat"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <TextField
          label={t('access.codeLabel')}
          placeholder={t('access.codePlaceholder')}
          value={code}
          autoComplete="one-time-code"
          inputMode="text"
          onChange={(event) => {
            setCode(event.target.value);
            setError(false);
          }}
          error={error ? t('access.invalid') : undefined}
          hint={t('access.demoHint')}
        />

        <InlineNotification iconLabel={t('access.privacyNote')}>
          {t('access.privacyNote')}
        </InlineNotification>

        <Button type="submit" block disabled={code.trim().length === 0}>
          {t('access.submit')}
        </Button>
      </form>
    </OnboardingShell>
  );
}
