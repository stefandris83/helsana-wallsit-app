import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Badge } from '../components/StatTile';
import { HelsanaLogo } from '../components/HelsanaLogo';
import { Icon } from '../components/Icon';
import type { IconName } from '../components/Icon';
import { IconButton } from '../components/IconButton';
import { InlineNotification } from '../components/InlineNotification';
import { t } from '../content/registry';
import type { ContentId } from '../content/registry';
import { useAppStore } from '../data/store';
import { useOnlineStatus } from './useOnlineStatus';
import { ReminderBanner } from './ReminderBanner';

interface NavEntry {
  to: string;
  labelId: ContentId;
  icon: IconName;
}

const navEntries: NavEntry[] = [
  { to: '/heute', labelId: 'nav.today', icon: 'home' },
  { to: '/fortschritt', labelId: 'nav.progress', icon: 'bar-chart' },
  { to: '/lernen', labelId: 'nav.learning', icon: 'menu-book' },
  { to: '/blutdruck', labelId: 'nav.bloodPressure', icon: 'health' },
];

/**
 * Rahmen der Teilnehmeransicht: Kopfzeile, Inhalt, Hauptnavigation (§7).
 * Die Hauptnavigation hat genau vier Bereiche; Einstellungen liegen daneben.
 */
export function AppLayout() {
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const storageBlocked = useAppStore((state) => state.storageBlocked);
  const demoLoaded = useAppStore((state) => state.participant.demoLoaded);

  return (
    <div className="flex min-h-screen flex-col bg-background-device">
      <a href="#main" className="u-visually-hidden">
        {t('nav.skipToContent')}
      </a>

      <header className="u-border-bottom sticky top-none z-10 bg-background-card">
        <div className="container flex items-center justify-between gap-snail py-snail">
          <div className="flex items-center gap-snail">
            <HelsanaLogo />
          </div>
          <div className="flex items-center gap-bee">
            {demoLoaded ? <Badge icon="info-circle">{t('common.demoBadge')}</Badge> : null}
            <IconButton
              icon="settings"
              label={t('nav.settings')}
              onClick={() => navigate('/einstellungen')}
            />
          </div>
        </div>
      </header>

      <main id="main" className="container flex flex-1 flex-col gap-cat py-cat">
        {storageBlocked ? (
          <InlineNotification type="warning" title={t('error.storage.title')} iconLabel={t('error.storage.title')}>
            {t('error.storage.text')}
          </InlineNotification>
        ) : null}

        {!online ? (
          <InlineNotification type="info" title={t('error.offline.title')} iconLabel={t('error.offline.title')}>
            {t('error.offline.text')}
          </InlineNotification>
        ) : null}

        <ReminderBanner />

        <Outlet />
      </main>

      <nav className="u-bottom-nav" aria-label={t('nav.mainLabel')}>
        {navEntries.map((entry) => (
          <NavLink key={entry.to} to={entry.to} className="u-bottom-nav__item u-focus-ring">
            <Icon name={entry.icon} size={24} />
            <span>{t(entry.labelId)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
