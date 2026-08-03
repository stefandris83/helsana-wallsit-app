import type { ReactNode } from 'react';
import type { IconName } from './Icon';
import { Icon } from './Icon';

/**
 * Inline Notification nach design-system.md Kapitel 12.15.
 *
 * REGULATORISCHE GRENZE (CLAUDE.md B.8): Die Typen `info | success | warning |
 * error` sind ausschliesslich fuer technische UI-Zustaende zulaessig — etwa
 * Formularvalidierung, Speicherbestaetigung oder Offline-Hinweis. Fuer
 * gesundheits-, blutdruck- oder trainingsbezogene Hinweise ist `neutral` zu
 * verwenden; Statusfarbe darf dort nichts bewerten.
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'neutral';

const icons: Record<NotificationType, IconName> = {
  info: 'info-circle',
  success: 'check-circle',
  warning: 'warning',
  error: 'cancel-circle',
  neutral: 'info-circle',
};

export interface InlineNotificationProps {
  type?: NotificationType;
  title?: string;
  children: ReactNode;
  /** Beschriftung des Icons — immer Icon plus Text (Kapitel 13). */
  iconLabel: string;
}

export function InlineNotification({
  type = 'neutral',
  title,
  children,
  iconLabel,
}: InlineNotificationProps) {
  const role = type === 'error' || type === 'warning' ? 'alert' : 'status';
  return (
    <div className={`u-notification u-notification--${type}`} role={role}>
      <span className="shrink-0">
        <Icon name={icons[type]} size={24} label={iconLabel} />
      </span>
      <div className="flex flex-col gap-bee">
        {title ? <p className="body-m-bold">{title}</p> : null}
        <div className="body-m-copy">{children}</div>
      </div>
    </div>
  );
}
