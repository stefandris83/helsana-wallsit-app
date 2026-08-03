import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionLink } from '../../components/ActionLink';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Checkbox, CheckboxGroup, RadioGroup } from '../../components/Choice';
import { TextField } from '../../components/Fields';
import { InlineNotification } from '../../components/InlineNotification';
import { Stepper } from '../../components/Stepper';
import { t } from '../../content/registry';
import type { ContentId } from '../../content/registry';
import {
  activityLevelLabels,
  barrierLabels,
  complaintLevelLabels,
  daytimeLabels,
  supportLabels,
  wallsitExperienceLabels,
  weekdayLabels,
} from '../../content/mappings';
import { suggestReminderTime } from '../../domain/personalization';
import { isBlockingComplaint } from '../../domain/access';
import type {
  ActivityLevel,
  Barrier,
  ClockTime,
  ComplaintLevel,
  PreferredDaytime,
  Questionnaire,
  SupportPreference,
  WallsitExperience,
  Weekday,
} from '../../domain/types';
import { weekdayOrder } from '../../domain/types';
import { useAppStore } from '../../data/store';
import { OnboardingShell } from './OnboardingShell';

const DEFAULT_DAYS: Weekday[] = ['mon', 'wed', 'fri'];

/** Prueft, ob zwischen den gewaehlten Tagen mindestens ein freier Tag liegt (§12 Frage 4). */
export function hasAdjacentDays(days: readonly Weekday[]): boolean {
  const indices = days.map((day) => weekdayOrder.indexOf(day)).sort((a, b) => a - b);
  for (let index = 1; index < indices.length; index += 1) {
    if (indices[index] - indices[index - 1] === 1) return true;
  }
  if (indices.length > 1 && indices[0] === 0 && indices[indices.length - 1] === 6) return true;
  return false;
}

interface Draft {
  activityLevel: ActivityLevel | null;
  wallsitExperience: WallsitExperience | null;
  complaints: ComplaintLevel | null;
  trainingDays: Weekday[];
  preferredDaytime: PreferredDaytime | null;
  usePreciseTimes: boolean;
  preciseTimes: Partial<Record<Weekday, ClockTime>>;
  barriers: Barrier[];
  support: SupportPreference | null;
  confidence: number;
  remindersWanted: boolean | null;
  reminderTime: ClockTime;
}

const initialDraft: Draft = {
  activityLevel: null,
  wallsitExperience: null,
  complaints: null,
  trainingDays: DEFAULT_DAYS,
  preferredDaytime: null,
  usePreciseTimes: false,
  preciseTimes: {},
  barriers: [],
  support: null,
  confidence: 6,
  remindersWanted: null,
  reminderTime: '18:00',
};

type StepId = 'basics' | 'schedule' | 'support' | 'reminders';

interface StepDefinition {
  id: StepId;
  titleId: ContentId;
  /** Pflichtangaben dieses Schritts; optionale Fragen bleiben unberuecksichtigt. */
  isComplete: (draft: Draft) => boolean;
}

/**
 * Die neun Fragen aus §12 bleiben unveraendert, sind aber thematisch zu vier
 * Schritten gebuendelt: Neun einzelne Schritte liessen den kurzen Fragebogen
 * laenger wirken, als er ist. Zusammengehoerende Fragen stehen jetzt auf einer
 * Seite (Tage und Tageszeit, Huerden und Unterstuetzung), was das Ausfuellen
 * zusaetzlich erleichtert.
 */
const steps: StepDefinition[] = [
  {
    id: 'basics',
    titleId: 'questionnaire.section.basics',
    isComplete: (draft) =>
      draft.activityLevel !== null && draft.wallsitExperience !== null && draft.complaints !== null,
  },
  {
    id: 'schedule',
    titleId: 'questionnaire.section.schedule',
    isComplete: (draft) => draft.trainingDays.length === 3 && draft.preferredDaytime !== null,
  },
  {
    id: 'support',
    titleId: 'questionnaire.section.support',
    isComplete: (draft) => draft.support !== null,
  },
  {
    id: 'reminders',
    titleId: 'questionnaire.section.reminders',
    isComplete: (draft) => draft.remindersWanted !== null,
  },
];

/** Persoenlicher Startfragebogen (§12) inklusive Sicherheitsbestaetigung (B.13.9). */
export function QuestionnaireScreen() {
  const navigate = useNavigate();
  const stored = useAppStore((state) => state.participant.questionnaire);
  const saveQuestionnaire = useAppStore((state) => state.saveQuestionnaire);
  const confirmSafety = useAppStore((state) => state.confirmSafety);
  const [draft, setDraft] = useState<Draft>(() =>
    stored
      ? {
          activityLevel: stored.activityLevel,
          wallsitExperience: stored.wallsitExperience,
          complaints: stored.complaints,
          trainingDays: stored.trainingDays,
          preferredDaytime: stored.preferredDaytime,
          usePreciseTimes: stored.preciseTimes !== null,
          preciseTimes: stored.preciseTimes ?? {},
          barriers: stored.barriers,
          support: stored.support,
          confidence: stored.confidence,
          remindersWanted: stored.remindersWanted,
          reminderTime: stored.reminderTime ?? '18:00',
        }
      : initialDraft,
  );
  const [step, setStep] = useState(1);
  const [safetyChecked, setSafetyChecked] = useState(false);

  const needsSafety = isBlockingComplaint(draft.complaints);
  const totalSteps = steps.length;
  const isSafetyStep = step === totalSteps + 1;
  const currentStep = steps[Math.min(step, totalSteps) - 1];
  const activeStep: StepId | null = isSafetyStep ? null : currentStep.id;

  const update = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));

  const canContinue = useMemo(
    () => (isSafetyStep ? true : currentStep.isComplete(draft)),
    [isSafetyStep, currentStep, draft],
  );

  const buildQuestionnaire = (): Questionnaire | null => {
    if (
      draft.activityLevel === null ||
      draft.wallsitExperience === null ||
      draft.complaints === null ||
      draft.preferredDaytime === null ||
      draft.support === null ||
      draft.remindersWanted === null
    ) {
      return null;
    }
    return {
      activityLevel: draft.activityLevel,
      wallsitExperience: draft.wallsitExperience,
      complaints: draft.complaints,
      trainingDays: draft.trainingDays,
      preferredDaytime: draft.preferredDaytime,
      preciseTimes: draft.usePreciseTimes ? draft.preciseTimes : null,
      barriers: draft.barriers,
      support: draft.support,
      confidence: draft.confidence,
      remindersWanted: draft.remindersWanted,
      reminderTime: draft.remindersWanted ? draft.reminderTime : null,
    };
  };

  const finish = () => {
    const questionnaire = buildQuestionnaire();
    if (!questionnaire) return;
    saveQuestionnaire(questionnaire);
    if (safetyChecked) confirmSafety();
    navigate('/onboarding/plan', { replace: true });
  };

  const next = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }
    if (needsSafety && step === totalSteps) {
      setStep(totalSteps + 1);
      return;
    }
    finish();
  };

  /*
   * Ein Schritt umfasst jetzt mehrere Fragen und ist damit laenger als eine
   * Bildschirmhoehe. Nach dem Wechsel beginnt die naechste Seite deshalb wieder
   * oben, und der Fokus wandert auf die Schrittueberschrift.
   */
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, [step]);

  return (
    <OnboardingShell
      title={isSafetyStep ? t('safety.title') : t('questionnaire.title')}
      lead={isSafetyStep || step > 1 ? undefined : t('questionnaire.lead')}
      aside={
        <Stepper
          current={Math.min(step, totalSteps)}
          total={totalSteps}
          label={t('questionnaire.stepLabel', {
            current: Math.min(step, totalSteps),
            total: totalSteps,
          })}
        />
      }
      footer={
        <div className="flex flex-col gap-snail">
          <Button block onClick={isSafetyStep ? finish : next} disabled={!canContinue}>
            {isSafetyStep && safetyChecked ? t('safety.confirmButton') : t('action.continue')}
          </Button>
          {step > 1 ? (
            <ActionLink iconLeft="chevron-left" onClick={() => setStep(step - 1)}>
              {t('action.back')}
            </ActionLink>
          ) : null}
        </div>
      }
    >
      {isSafetyStep ? null : (
        <h2 className="h4" ref={headingRef} tabIndex={-1}>
          {t(currentStep.titleId)}
        </h2>
      )}

      {activeStep === 'basics' ? (
        <>
          <Card>
            <RadioGroup
              legend={t('questionnaire.q1.title')}
              value={draft.activityLevel}
              onChange={(value) => update({ activityLevel: value })}
              options={(
                ['rarely', 'one-to-two', 'three-to-four', 'five-plus'] as ActivityLevel[]
              ).map((value) => ({ value, label: t(activityLevelLabels[value]) }))}
            />
          </Card>

          <Card>
            <RadioGroup
              legend={t('questionnaire.q2.title')}
              value={draft.wallsitExperience}
              onChange={(value) => update({ wallsitExperience: value })}
              options={(['never', 'tried', 'regular'] as WallsitExperience[]).map((value) => ({
                value,
                label: t(wallsitExperienceLabels[value]),
              }))}
            />
          </Card>

          <Card>
            <div className="flex flex-col gap-rat">
              <RadioGroup
                legend={t('questionnaire.q3.title')}
                value={draft.complaints}
                onChange={(value) => update({ complaints: value })}
                options={(['none', 'mild', 'strong', 'unsure'] as ComplaintLevel[]).map((value) => ({
                  value,
                  label: t(complaintLevelLabels[value]),
                }))}
              />
              {needsSafety ? (
                <InlineNotification
                  type="neutral"
                  title={t('safety.title')}
                  iconLabel={t('safety.title')}
                >
                  {t('questionnaire.q3.clarifyNotice')}
                </InlineNotification>
              ) : null}
            </div>
          </Card>
        </>
      ) : null}

      {activeStep === 'schedule' ? (
        <>
          <Card>
            <div className="flex flex-col gap-rat">
              <CheckboxGroup
                legend={t('questionnaire.q4.title')}
                hint={t('questionnaire.q4.hint')}
                values={draft.trainingDays}
                maxSelected={3}
                onChange={(values) => update({ trainingDays: values })}
                options={weekdayOrder.map((day) => ({ value: day, label: t(weekdayLabels[day]) }))}
                error={draft.trainingDays.length === 3 ? undefined : t('questionnaire.q4.error')}
              />
              {draft.trainingDays.length === 3 && hasAdjacentDays(draft.trainingDays) ? (
                <InlineNotification type="neutral" iconLabel={t('questionnaire.q4.spacingHint')}>
                  {t('questionnaire.q4.spacingHint')}
                </InlineNotification>
              ) : null}
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-rat">
              <RadioGroup
                legend={t('questionnaire.q5.title')}
                value={draft.preferredDaytime}
                onChange={(value) =>
                  update({ preferredDaytime: value, reminderTime: suggestReminderTime(value) })
                }
                options={(['morning', 'midday', 'evening', 'varies'] as PreferredDaytime[]).map(
                  (value) => ({ value, label: t(daytimeLabels[value]) }),
                )}
              />
              <Checkbox
                checked={draft.usePreciseTimes}
                onChange={(checked) => update({ usePreciseTimes: checked })}
                label={t('questionnaire.q5.preciseToggle')}
                hint={t('common.optionalHint')}
              />
              {draft.usePreciseTimes ? (
                <div className="flex flex-col gap-frog">
                  {draft.trainingDays.map((day) => (
                    <TextField
                      key={day}
                      type="time"
                      label={t(weekdayLabels[day])}
                      value={draft.preciseTimes[day] ?? draft.reminderTime}
                      onChange={(event) =>
                        update({
                          preciseTimes: { ...draft.preciseTimes, [day]: event.target.value },
                        })
                      }
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </Card>
        </>
      ) : null}

      {activeStep === 'support' ? (
        <>
          <Card>
            <CheckboxGroup
              legend={t('questionnaire.q6.title')}
              hint={t('questionnaire.q6.hint')}
              values={draft.barriers}
              maxSelected={2}
              onChange={(values) => update({ barriers: values })}
              options={(
                ['time', 'forget', 'motivation', 'tired', 'physical', 'how-to-start'] as Barrier[]
              ).map((value) => ({ value, label: t(barrierLabels[value]) }))}
            />
          </Card>

          <Card>
            <RadioGroup
              legend={t('questionnaire.q7.title')}
              value={draft.support}
              onChange={(value) => update({ support: value })}
              options={(
                ['feedback', 'plan', 'reminders', 'knowledge', 'progress'] as SupportPreference[]
              ).map((value) => ({ value, label: t(supportLabels[value]) }))}
            />
          </Card>

          <Card>
            <div className="flex flex-col gap-frog">
              <label className="h5" htmlFor="confidence">
                {t('questionnaire.q8.title')}
              </label>
              <input
                id="confidence"
                type="range"
                min={1}
                max={10}
                step={1}
                value={draft.confidence}
                className="w-full"
                onChange={(event) => update({ confidence: Number(event.target.value) })}
              />
              <div className="flex justify-between helper-m text-secondary">
                <span>{t('questionnaire.q8.low')}</span>
                <span>{t('questionnaire.q8.high')}</span>
              </div>
              <p className="h4" aria-live="polite">
                {draft.confidence}
              </p>
              <p className="body-s text-secondary">{t('questionnaire.q8.hint')}</p>
            </div>
          </Card>
        </>
      ) : null}

      {activeStep === 'reminders' ? (
        <Card>
          <div className="flex flex-col gap-rat">
            <RadioGroup
              legend={t('questionnaire.q9.title')}
              value={draft.remindersWanted === null ? null : draft.remindersWanted ? 'yes' : 'no'}
              onChange={(value) => update({ remindersWanted: value === 'yes' })}
              options={[
                { value: 'yes', label: t('common.yes') },
                { value: 'no', label: t('common.no') },
              ]}
            />
            {draft.remindersWanted ? (
              <>
                <TextField
                  type="time"
                  label={t('questionnaire.q9.timeLabel')}
                  value={draft.reminderTime}
                  onChange={(event) => update({ reminderTime: event.target.value })}
                />
                <InlineNotification iconLabel={t('questionnaire.q9.permissionHint')}>
                  {t('questionnaire.q9.permissionHint')}
                </InlineNotification>
              </>
            ) : null}
          </div>
        </Card>
      ) : null}

      {isSafetyStep ? (
        <Card>
          <div className="flex flex-col gap-rat">
            <InlineNotification
              type="neutral"
              title={t('safety.lockedBadge')}
              iconLabel={t('safety.lockedBadge')}
            >
              {t('safety.text')}
            </InlineNotification>
            <Checkbox
              checked={safetyChecked}
              onChange={setSafetyChecked}
              label={t('safety.confirmLabel')}
            />
            <p className="helper-m text-secondary">{t('safety.lockedHint')}</p>
          </div>
        </Card>
      ) : null}
    </OnboardingShell>
  );
}
