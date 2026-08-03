import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionLink } from '../../components/ActionLink';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { RadioGroup } from '../../components/Choice';
import { InlineNotification } from '../../components/InlineNotification';
import { t } from '../../content/registry';
import { moodLabels, suggestionReasonLabels, variantLabels, wishLabels } from '../../content/mappings';
import { blocksDirectStart } from '../../domain/checkin-rules';
import { getSetTargets } from '../../domain/week-matrix';
import type { CheckinMood, CheckinWish, TrainingVariant } from '../../domain/types';
import { selectProgress, selectVariantSuggestion } from '../../data/selectors';
import { useAppStore } from '../../data/store';

/** Tages-Check-in vor jeder Einheit (§16). */
export function CheckinScreen() {
  const navigate = useNavigate();
  const state = useAppStore();
  const startSession = useAppStore((store) => store.startSession);

  const [mood, setMood] = useState<CheckinMood | null>(null);
  const [wish, setWish] = useState<CheckinWish | null>(null);
  const [override, setOverride] = useState<TrainingVariant | null>(null);

  const summary = selectProgress(state);
  if (!summary) return null;

  const answered = mood !== null && wish !== null;
  const answers = answered ? { mood, wish } : null;
  const suggestion = answers ? selectVariantSuggestion(state, answers) : null;
  const variant = override ?? suggestion?.variant ?? 'light';
  const targets = getSetTargets(summary.programWeek, variant);

  const complaints = mood !== null && blocksDirectStart({ mood, wish: wish ?? 'suggest' });

  const start = () => {
    if (!answers) return;
    startSession(answers, variant);
    navigate('/heute/training', { replace: true });
  };

  return (
    <div className="flex flex-col gap-cat">
      <div className="flex flex-col gap-bee">
        <h1 className="h2">{t('checkin.title')}</h1>
        <p className="body-s text-secondary">{t('checkin.lead')}</p>
      </div>

      <Card>
        <RadioGroup
          legend={t('checkin.q1.title')}
          value={mood}
          onChange={setMood}
          options={(['good', 'tired', 'not-fit', 'complaints'] as CheckinMood[]).map((value) => ({
            value,
            label: t(moodLabels[value]),
          }))}
        />
      </Card>

      {complaints ? (
        <>
          <InlineNotification
            type="neutral"
            title={t('checkin.complaints.title')}
            iconLabel={t('checkin.complaints.title')}
          >
            {t('checkin.complaints.text')}
          </InlineNotification>
          <div className="flex flex-col gap-snail">
            <Button
              block
              onClick={() => {
                navigate('/heute', { replace: true });
              }}
            >
              {t('checkin.complaints.skip')}
            </Button>
            <ActionLink onClick={() => setMood(null)}>{t('checkin.complaints.back')}</ActionLink>
          </div>
        </>
      ) : (
        <>
          {mood !== null ? (
            <Card>
              <RadioGroup
                legend={t('checkin.q2.title')}
                value={wish}
                onChange={(value) => {
                  setWish(value);
                  setOverride(null);
                }}
                options={(['light', 'standard', 'suggest'] as CheckinWish[]).map((value) => ({
                  value,
                  label: t(wishLabels[value]),
                }))}
              />
            </Card>
          ) : null}

          {suggestion ? (
            <Card elevated>
              <div className="flex flex-col gap-frog">
                <p className="body-m-copy">
                  {variant === 'light'
                    ? t('checkin.suggestion.light')
                    : t('checkin.suggestion.standard')}
                </p>
                <p className="body-s text-secondary">
                  {t(suggestionReasonLabels[suggestion.reason])}
                </p>
                <div className="flex flex-col gap-bee">
                  <p className="h5">{t(variantLabels[variant])}</p>
                  <p className="body-m">
                    {t('checkin.targetPreview', { seconds: targets.targetSeconds })}
                  </p>
                  {targets.optionalTargetSeconds !== null ? (
                    <p className="body-s text-secondary">
                      {t('checkin.optionalPreview', {
                        seconds: targets.optionalTargetSeconds,
                      })}
                    </p>
                  ) : null}
                </div>
                <ActionLink
                  onClick={() => setOverride(variant === 'light' ? 'standard' : 'light')}
                >
                  {t('checkin.suggestion.override')}
                </ActionLink>
              </div>
            </Card>
          ) : null}

          <Button block onClick={start} disabled={!answered}>
            {t('checkin.start')}
          </Button>
        </>
      )}
    </div>
  );
}
