import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionLink } from '../../components/ActionLink';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Dialog } from '../../components/Dialog';
import { Icon } from '../../components/Icon';
import { InlineNotification } from '../../components/InlineNotification';
import { LiveRegion } from '../../components/LiveRegion';
import { ProgressRing } from '../../components/ProgressRing';
import { WandsitzFigure } from '../../components/WandsitzFigure';
import { config } from '../../app/config';
import { t } from '../../content/registry';
import { variantLabels } from '../../content/mappings';
import { formatDuration } from '../../domain/dates';
import { deriveTimerView } from '../../domain/timer-engine';
import type { TimerView } from '../../domain/timer-engine';
import { useAppStore } from '../../data/store';

const TICK_MS = 1000;
/** Dauer der kurzen Bestaetigung beim Zwischenziel. Der Timer laeuft dabei weiter. */
const FLASH_MS = 5000;

interface PreviousView {
  phase: string;
  setNumber: number;
  targetReached: boolean;
  reachedTargets: number;
}

/** Geführter Trainingstimer (§18, B.7). */
export function TimerScreen() {
  const navigate = useNavigate();
  const activeSession = useAppStore((state) => state.activeSession);
  const participant = useAppStore((state) => state.participant);
  const tickTimer = useAppStore((state) => state.tickTimer);
  const pauseSession = useAppStore((state) => state.pauseSession);
  const resumeSession = useAppStore((state) => state.resumeSession);
  const finishSet = useAppStore((state) => state.finishSet);
  const skipRestPhase = useAppStore((state) => state.skipRestPhase);
  const abortSession = useAppStore((state) => state.abortSession);
  const resumeInterrupted = useAppStore((state) => state.resumeInterrupted);
  const endInterrupted = useAppStore((state) => state.endInterrupted);

  const [now, setNow] = useState(() => Date.now());
  const [showAbort, setShowAbort] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [flashUntil, setFlashUntil] = useState(0);
  const previous = useRef<PreviousView | null>(null);

  useEffect(() => {
    const handle = window.setInterval(() => {
      tickTimer();
      setNow(Date.now());
    }, TICK_MS);
    tickTimer();
    return () => window.clearInterval(handle);
  }, [tickTimer]);

  const view: TimerView | null = activeSession
    ? deriveTimerView(activeSession.timer, now)
    : null;

  useEffect(() => {
    if (!view) return;
    const current: PreviousView = {
      phase: view.phase,
      setNumber: view.setNumber,
      targetReached: view.targetReached,
      reachedTargets: view.reachedTargets,
    };
    const before = previous.current;
    previous.current = current;
    if (!before) return;

    // Zwischenziel neu erreicht — waehrend des Satzes oder beim Satzabschluss.
    const targetJustReached =
      (view.phase === 'set' && view.targetReached && !before.targetReached) ||
      view.reachedTargets > before.reachedTargets;

    if (targetJustReached) {
      setAnnouncement(t('timer.announce.targetReached'));
      setFlashUntil(Date.now() + FLASH_MS);
      return;
    }
    if (view.phase === 'set' && (before.phase !== 'set' || before.setNumber !== view.setNumber)) {
      setAnnouncement(
        t('timer.announce.setStart', { current: view.setNumber, total: view.setCount }),
      );
    } else if (view.phase === 'rest' && before.phase !== 'rest') {
      setAnnouncement(t('timer.announce.restStart'));
    } else if (view.phase === 'completed' && before.phase !== 'completed') {
      setAnnouncement(t('timer.announce.completed'));
    }
  }, [view]);

  // Die Rueckmeldung folgt unmittelbar auf die letzte Wiederholung (§19).
  useEffect(() => {
    if (view?.phase !== 'completed') return;
    navigate('/heute/rueckmeldung', { replace: true });
  }, [view?.phase, navigate]);

  if (!activeSession || !view) {
    return (
      <div className="flex flex-col gap-cat">
        <h1 className="h2">{t('error.noSession.title')}</h1>
        <p className="body-m-copy">{t('error.noSession.text')}</p>
        <Button block onClick={() => navigate('/heute')}>
          {t('feedback.toToday')}
        </Button>
      </div>
    );
  }

  const phaseLabel =
    view.phase === 'preparation'
      ? t('timer.phase.preparation')
      : view.phase === 'rest'
        ? t('timer.phase.rest')
        : t('timer.phase.set', { current: view.setNumber, total: view.setCount });

  // Waehrend der Weiterleitung zur Rueckmeldung wird nichts mehr gezeichnet.
  if (view.phase === 'completed') return null;

  const showFlash = now < flashUntil;

  return (
    <div className="flex flex-col gap-cat">
      <LiveRegion message={announcement} />

      <div className="flex items-start justify-between gap-rat">
        <div className="flex flex-col gap-bee">
          <h1 className="h2">{phaseLabel}</h1>
          <p className="body-s text-secondary">{t(variantLabels[activeSession.variant])}</p>
        </div>
        <WandsitzFigure sex={participant.profile?.sex ?? 'unspecified'} />
      </div>

      <Dialog
        open={showAbort}
        title={t('timer.abortDialogTitle')}
        description={t('timer.abortDialogText')}
        confirmLabel={t('timer.abortDialogConfirm')}
        cancelLabel={t('timer.abortDialogCancel')}
        onConfirm={() => {
          abortSession();
          setShowAbort(false);
          navigate('/heute/rueckmeldung', { replace: true });
        }}
        onCancel={() => setShowAbort(false)}
      />

      {view.isInterrupted ? (
        <Card>
          <div className="flex flex-col gap-frog">
            <h2 className="h5">{t('timer.interruptedTitle')}</h2>
            <p className="body-m-copy">{t('timer.interruptedText')}</p>
            <Button block onClick={resumeInterrupted}>
              {t('timer.interruptedResume')}
            </Button>
            <Button
              variant="secondary"
              block
              onClick={() => {
                endInterrupted();
                navigate('/heute/rueckmeldung', { replace: true });
              }}
            >
              {t('timer.interruptedEnd')}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <ProgressRing
            progress={view.progress}
            targetShare={view.targetShare}
            targetApproach={view.targetApproach}
            inOptionalPhase={view.inOptionalPhase}
            label={t('timer.progressLabel')}
          >
            <span className="helper-m text-secondary">{t('timer.remainingLabel')}</span>
            <span className="display-m">{formatDuration(view.remainingSeconds)}</span>
            {view.phase === 'set' ? (
              <span className="body-s text-secondary">
                {view.holdSeconds} / {view.phaseTotalSeconds} {t('common.secondsShort')}
              </span>
            ) : null}
          </ProgressRing>

          {/*
            Kurze, nicht blockierende Bestaetigung: der Timer bleibt sichtbar und
            laeuft weiter, die Einblendung verschwindet von selbst.
          */}
          {showFlash ? (
            <p className="u-milestone flex items-center justify-center gap-snail body-l-bold text-primary">
              {/* Farbe ist nie alleiniger Bedeutungstraeger: Icon plus Text. */}
              <span className="text-decorative-green">
                <Icon name="check-circle" size={24} />
              </span>
              {t('timer.targetReachedTitle')}
            </p>
          ) : null}

          {view.phase === 'set' ? (
            <Card>
              <div className="flex flex-col gap-bee">
                <p className="body-m-bold">
                  {t('timer.targetLabel', { seconds: view.targetSeconds })}
                </p>
                {view.optionalTargetSeconds !== null ? (
                  <p className="body-s text-secondary">
                    {t('timer.optionalLabel', { seconds: view.optionalTargetSeconds })}
                  </p>
                ) : null}
                {view.inOptionalPhase ? (
                  <p className="body-s text-decorative">{t('timer.optionalPhaseLabel')}</p>
                ) : null}
              </div>
            </Card>
          ) : null}

          {view.phase === 'preparation' ? (
            <InlineNotification type="neutral" iconLabel={t('timer.phase.preparation')}>
              {t('timer.phase.preparationHint')}
            </InlineNotification>
          ) : null}

          {view.phase === 'rest' ? (
            <InlineNotification
              type="neutral"
              title={t('timer.phase.restNext', {
                next: Math.min(view.setNumber + 1, view.setCount),
                total: view.setCount,
              })}
              iconLabel={t('timer.phase.rest')}
            >
              {t('timer.phase.restHint')}
            </InlineNotification>
          ) : null}

          <div className="flex flex-col gap-snail">
            {view.phase === 'set' ? (
              <Button variant="secondary" block onClick={finishSet}>
                {view.targetReached ? t('timer.finishSet') : t('timer.stopSet')}
              </Button>
            ) : null}

            {view.isPaused ? (
              <Button variant="secondary" block iconLeft="play" onClick={resumeSession}>
                {t('timer.resume')}
              </Button>
            ) : (
              <Button variant="secondary" block iconLeft="pause" onClick={pauseSession}>
                {t('timer.pause')}
              </Button>
            )}

            {view.phase === 'rest' && config.featureSkipRest ? (
              <ActionLink onClick={skipRestPhase}>{t('timer.skipRest')}</ActionLink>
            ) : null}

            <ActionLink onClick={() => setShowAbort(true)}>{t('timer.abort')}</ActionLink>
          </div>

          {view.phase !== 'rest' ? (
            <div className="flex flex-col gap-bee">
              <p className="body-s text-secondary">{t('timer.breathingHint')}</p>
              <p className="body-s text-secondary">
                {view.inOptionalPhase ? t('timer.formHint') : t('timer.todayHint')}
              </p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
