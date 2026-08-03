import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionLink } from '../../components/ActionLink';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { RadioGroup } from '../../components/Choice';
import { TextField } from '../../components/Fields';
import { InlineNotification } from '../../components/InlineNotification';
import { Toggle } from '../../components/Toggle';
import { t } from '../../content/registry';
import { overlapsTrainingTime } from '../../domain/personalization';
import type { ColorModePreference } from '../../data/participant';
import { useAppStore } from '../../data/store';
import { loadDemoState, removeDemoState } from '../../demo/demo-data';
import { notificationPermission, requestNotificationPermission } from '../../app/reminders';

/** Einstellungen (§25). */
export function SettingsScreen() {
  const navigate = useNavigate();
  const participant = useAppStore((state) => state.participant);
  const setReminders = useAppStore((state) => state.setReminders);
  const setColorMode = useAppStore((state) => state.setColorMode);
  const replaceAll = useAppStore((state) => state.replaceAll);
  const [permissionNote, setPermissionNote] = useState<string | null>(null);

  const { reminders } = participant;
  const trainingTime = reminders.trainingEnabled ? reminders.trainingTime : null;

  const enableSystemNotifications = async () => {
    const result = await requestNotificationPermission();
    if (result === 'granted') {
      setReminders({ systemNotifications: true });
      setPermissionNote(null);
      return;
    }
    setReminders({ systemNotifications: false });
    setPermissionNote(
      result === 'unsupported'
        ? t('notification.permissionUnsupported')
        : t('notification.permissionDenied'),
    );
  };

  return (
    <div className="flex flex-col gap-cat">
      <h1 className="h2">{t('settings.title')}</h1>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('settings.section.program')}</h2>
          <ActionLink iconRight="chevron-right" onClick={() => navigate('/einstellungen/plan')}>
            {t('settings.trainingDays')}
          </ActionLink>
          <ActionLink iconRight="chevron-right" onClick={() => navigate('/einstellungen/profil')}>
            {t('settings.profile.edit')}
          </ActionLink>
          <ActionLink iconRight="chevron-right" onClick={() => navigate('/onboarding/willkommen')}>
            {t('settings.reopenWelcome')}
          </ActionLink>
          <ActionLink iconRight="chevron-right" onClick={() => navigate('/heute/anleitung')}>
            {t('settings.reopenInstruction')}
          </ActionLink>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-rat">
          <h2 className="h5">{t('settings.section.reminders')}</h2>

          <Toggle
            checked={reminders.trainingEnabled}
            onChange={(checked) => setReminders({ trainingEnabled: checked })}
            label={t('settings.reminders.training')}
            stateLabel={reminders.trainingEnabled ? t('common.yes') : t('common.no')}
          />
          {reminders.trainingEnabled ? (
            <TextField
              type="time"
              label={t('settings.reminders.trainingTime')}
              value={reminders.trainingTime}
              onChange={(event) => setReminders({ trainingTime: event.target.value })}
            />
          ) : null}

          <hr className="u-divider" />

          <Toggle
            checked={reminders.bpEnabled}
            onChange={(checked) => setReminders({ bpEnabled: checked })}
            label={t('settings.reminders.bp')}
            description={t('bp.reminder.text')}
            stateLabel={reminders.bpEnabled ? t('common.yes') : t('common.no')}
          />
          {reminders.bpEnabled ? (
            <div className="flex flex-col gap-frog">
              <TextField
                type="time"
                label={t('bp.reminder.morning')}
                value={reminders.bpMorningTime}
                onChange={(event) => setReminders({ bpMorningTime: event.target.value })}
              />
              <TextField
                type="time"
                label={t('bp.reminder.evening')}
                value={reminders.bpEveningTime}
                onChange={(event) => setReminders({ bpEveningTime: event.target.value })}
              />
              {overlapsTrainingTime(reminders.bpEveningTime, trainingTime) ||
              overlapsTrainingTime(reminders.bpMorningTime, trainingTime) ? (
                <InlineNotification type="neutral" iconLabel={t('bp.reminder.overlapHint')}>
                  {t('bp.reminder.overlapHint')}
                </InlineNotification>
              ) : null}
            </div>
          ) : null}

          <hr className="u-divider" />

          <Toggle
            checked={reminders.systemNotifications}
            onChange={(checked) => {
              if (checked) {
                void enableSystemNotifications();
              } else {
                setReminders({ systemNotifications: false });
              }
            }}
            label={t('settings.reminders.systemToggle')}
            description={t('notification.permissionExplainer')}
            stateLabel={reminders.systemNotifications ? t('common.yes') : t('common.no')}
            disabled={notificationPermission() === 'unsupported'}
          />
          {permissionNote ? (
            <InlineNotification type="info" iconLabel={permissionNote}>
              {permissionNote}
            </InlineNotification>
          ) : null}
          <p className="helper-m text-secondary">{t('notification.quietHoursNote')}</p>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('settings.section.appearance')}</h2>
          <RadioGroup
            legend={t('settings.appearance.mode')}
            legendClassName="body-s text-secondary"
            asCards={false}
            value={participant.colorMode}
            onChange={(value) => setColorMode(value as ColorModePreference)}
            options={[
              { value: 'system', label: t('settings.appearance.system') },
              { value: 'light', label: t('settings.appearance.light') },
              { value: 'dark', label: t('settings.appearance.dark') },
            ]}
          />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('settings.section.privacy')}</h2>
          <ActionLink iconRight="chevron-right" onClick={() => navigate('/einstellungen/daten')}>
            {t('settings.section.privacy')}
          </ActionLink>
          <ActionLink
            iconRight="chevron-right"
            onClick={() => navigate('/einstellungen/rechtliches')}
          >
            {t('settings.section.info')}
          </ActionLink>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('settings.demo.title')}</h2>
          <p className="body-m-copy">{t('settings.demo.text')}</p>
          <p className="helper-m text-secondary">{t('settings.demo.warning')}</p>
          {participant.demoLoaded ? (
            <Button
              variant="secondary"
              block
              onClick={() => {
                replaceAll(removeDemoState());
                navigate('/heute', { replace: true });
              }}
            >
              {t('settings.demo.remove')}
            </Button>
          ) : (
            <Button
              variant="secondary"
              block
              onClick={() => {
                replaceAll(loadDemoState());
                navigate('/heute', { replace: true });
              }}
            >
              {t('settings.demo.load')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
