import { useEffect, useMemo, useState } from 'react';
import { ActionLink } from '../components/ActionLink';
import { InlineNotification } from '../components/InlineNotification';
import { t } from '../content/registry';
import { useAppStore } from '../data/store';
import type { DueReminder } from './reminders';
import { findDueReminder, reminderKey, showSystemNotification } from './reminders';

const CHECK_INTERVAL_MS = 60_000;

/**
 * In-App-Erinnerung (§24, B.13.2). Erscheint hoechstens einmal je geplantem
 * Zeitpunkt und laesst sich mit einem Klick schliessen.
 */
export function ReminderBanner() {
  const participant = useAppStore((state) => state.participant);
  const [shown, setShown] = useState<string[]>([]);
  const [due, setDue] = useState<DueReminder | null>(null);

  useEffect(() => {
    const check = () => {
      setDue((current) => current ?? findDueReminder(participant, new Date(), shown));
    };
    check();
    const handle = window.setInterval(check, CHECK_INTERVAL_MS);
    return () => window.clearInterval(handle);
  }, [participant, shown]);

  const message = useMemo(() => {
    if (!due) return null;
    return due.kind === 'training' ? t('notification.training.planned') : t('notification.bp.due');
  }, [due]);

  useEffect(() => {
    if (!due || !message) return;
    if (participant.reminders.systemNotifications) {
      showSystemNotification(t('notification.training.title'), message);
    }
  }, [due, message, participant.reminders.systemNotifications]);

  if (!due || !message) return null;

  return (
    <InlineNotification
      type="info"
      title={t('notification.inAppTitle')}
      iconLabel={t('notification.inAppTitle')}
    >
      <div className="flex flex-col items-start gap-snail">
        <span>{message}</span>
        <ActionLink
          onClick={() => {
            setShown((previous) => [...previous, reminderKey(due)]);
            setDue(null);
          }}
        >
          {t('notification.dismiss')}
        </ActionLink>
      </div>
    </InlineNotification>
  );
}
