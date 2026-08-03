import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CheckList } from '../../components/CheckList';
import { ErrorList } from '../../components/ErrorList';
import { Icon } from '../../components/Icon';
import { NumberedList } from '../../components/NumberedList';
import { InlineNotification } from '../../components/InlineNotification';
import { t, tList } from '../../content/registry';
import { config } from '../../app/config';
import { useAppStore } from '../../data/store';
import { WelcomeVisual } from '../onboarding/WelcomeVisual';

/**
 * Wandsitz-Anleitung (§17). Vor der ersten Einheit verpflichtend, spaeter
 * jederzeit erneut aufrufbar. Video ueber Umgebungsvariable konfigurierbar,
 * Standard ist ein klar gekennzeichneter Platzhalter (B.13.4).
 */
export function InstructionScreen() {
  const navigate = useNavigate();
  const markInstructionSeen = useAppStore((state) => state.markInstructionSeen);
  const alreadySeen = useAppStore((state) => state.participant.instructionSeen);

  const confirm = () => {
    markInstructionSeen();
    navigate(alreadySeen ? '/heute' : '/heute/checkin', { replace: true });
  };

  return (
    <div className="flex flex-col gap-cat">
      <div className="flex flex-col gap-bee">
        <h1 className="h2">{t('instruction.title')}</h1>
        <p className="body-s text-secondary">{t('instruction.lead')}</p>
      </div>

      <Card>
        {config.instructionVideoUrl ? (
          <video
            className="w-full rounded-md"
            controls
            preload="none"
            src={config.instructionVideoUrl}
          >
            {config.instructionVideoTrackUrl ? (
              <track
                kind="subtitles"
                srcLang="de"
                default
                src={config.instructionVideoTrackUrl}
                label={t('instruction.videoCaptionsNote')}
              />
            ) : null}
          </video>
        ) : (
          <div className="flex flex-col gap-frog">
            <div className="flex items-center gap-snail text-secondary">
              <Icon name="play" size={24} />
              <p className="body-m-bold">{t('instruction.videoPlaceholder')}</p>
            </div>
            <p className="body-s text-secondary">{t('instruction.videoPlaceholderHint')}</p>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('instruction.stepsTitle')}</h2>
          <NumberedList items={tList('instruction.steps')} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('instruction.imagesTitle')}</h2>
          <WelcomeVisual kind="wallsit" label={t('instruction.imageAlt')} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('instruction.keyPointsTitle')}</h2>
          <CheckList items={tList('instruction.keyPoints')} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('instruction.mistakesTitle')}</h2>
          <ErrorList items={tList('instruction.mistakes')} />
        </div>
      </Card>

      <InlineNotification
        type="neutral"
        title={t('instruction.safetyTitle')}
        iconLabel={t('instruction.safetyTitle')}
      >
        {t('instruction.safetyText')}
      </InlineNotification>

      <Button block onClick={confirm}>
        {alreadySeen ? t('action.back') : t('instruction.confirm')}
      </Button>
    </div>
  );
}
