import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionLink } from '../../components/ActionLink';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { t } from '../../content/registry';
import type { ContentId } from '../../content/registry';
import { useScrollToTopOnChange } from '../../app/scroll';
import { useAppStore } from '../../data/store';
import { OnboardingShell } from './OnboardingShell';
import type { WelcomeVisualKind } from './WelcomeVisual';
import { WelcomeVisual } from './WelcomeVisual';

interface WelcomeCard {
  titleId: ContentId;
  textId: ContentId;
  altId: ContentId;
  visual: WelcomeVisualKind;
}

export const welcomeCards: WelcomeCard[] = [
  {
    titleId: 'welcome.card1.title',
    textId: 'welcome.card1.text',
    altId: 'welcome.card1.visualAlt',
    visual: 'wallsit',
  },
  {
    titleId: 'welcome.card2.title',
    textId: 'welcome.card2.text',
    altId: 'welcome.card2.visualAlt',
    visual: 'week',
  },
  {
    titleId: 'welcome.card3.title',
    textId: 'welcome.card3.text',
    altId: 'welcome.card3.visualAlt',
    visual: 'variants',
  },
  {
    titleId: 'welcome.card4.title',
    textId: 'welcome.card4.text',
    altId: 'welcome.card4.visualAlt',
    visual: 'safety',
  },
];

/**
 * Haelt den Kartenindex im gueltigen Bereich.
 *
 * Ohne Begrenzung koennen zwei «Weiter»-Klicks innerhalb desselben React-Batches
 * — ein schneller Doppeltipp auf einem langsamen Geraet — den Index ueber die
 * letzte Karte hinaus erhoehen. Der zweite Klick greift dann, bevor das
 * Neuzeichnen die Schaltflaeche auf der letzten Karte entfernt hat. Die Karte
 * waere anschliessend `undefined` und die Ansicht wuerde abstuerzen.
 */
export function clampWelcomeIndex(index: number): number {
  if (!Number.isFinite(index)) return 0;
  return Math.min(Math.max(Math.trunc(index), 0), welcomeCards.length - 1);
}

/** Naechste Karte, hoechstens die letzte. */
export function nextWelcomeIndex(index: number): number {
  return clampWelcomeIndex(index + 1);
}

/** Vorherige Karte, mindestens die erste. */
export function previousWelcomeIndex(index: number): number {
  return clampWelcomeIndex(index - 1);
}

/**
 * Willkommens-Carousel (§10). Vier Karten, Fortschrittspunkte, vorwaerts und
 * rueckwaerts navigierbar. Kein Wischen, damit es nicht versehentlich verlassen wird.
 */
export function WelcomeCarouselScreen() {
  const navigate = useNavigate();
  const completeWelcome = useAppStore((state) => state.completeWelcome);
  const hasPlan = useAppStore((state) => state.participant.plan !== null);
  const [index, setIndex] = useState(0);

  /*
   * Gezeichnet wird immer aus dem begrenzten Index. Damit fuehrt selbst ein
   * ungueltiger Zustand nie zu einem Zugriff ausserhalb der Kartenliste.
   */
  const safeIndex = clampWelcomeIndex(index);
  const card = welcomeCards[safeIndex];
  const isLast = safeIndex === welcomeCards.length - 1;

  // Jede Karte beginnt oben, nicht auf der Scrollposition der vorigen.
  useScrollToTopOnChange(safeIndex);

  const finish = () => {
    completeWelcome();
    navigate(hasPlan ? '/einstellungen' : '/onboarding/profil', { replace: true });
  };

  return (
    <OnboardingShell
      footer={
        <div className="flex flex-col gap-snail">
          {isLast ? (
            <Button block onClick={finish}>
              {t('welcome.finish')}
            </Button>
          ) : (
            <Button block onClick={() => setIndex(nextWelcomeIndex)}>
              {t('welcome.next')}
            </Button>
          )}
          {safeIndex > 0 ? (
            <ActionLink iconLeft="chevron-left" onClick={() => setIndex(previousWelcomeIndex)}>
              {t('welcome.previous')}
            </ActionLink>
          ) : null}
        </div>
      }
    >
      <Card>
        <div className="flex flex-col gap-rat">
          <p className="helper-m text-secondary">
            {t('welcome.progressLabel', { current: safeIndex + 1, total: welcomeCards.length })}
          </p>
          <WelcomeVisual kind={card.visual} label={t(card.altId)} />
          <div className="flex flex-col gap-snail">
            <h1 className="h4">{t(card.titleId)}</h1>
            <p className="body-m-copy">{t(card.textId)}</p>
          </div>
        </div>
      </Card>

      <ol className="flex list-none justify-center gap-snail p-none m-none">
        {welcomeCards.map((entry, position) => (
          <li key={entry.titleId}>
            <button
              type="button"
              className="u-icon-btn u-focus-ring"
              aria-label={t('welcome.goToCard', { index: position + 1 })}
              aria-current={position === safeIndex ? 'step' : undefined}
              onClick={() => setIndex(position)}
            >
              <span
                className={
                  position === safeIndex
                    ? 'block h-frog w-frog rounded-full bg-interactive-primary'
                    : 'block h-snail w-snail rounded-full bg-border-light'
                }
              />
            </button>
          </li>
        ))}
      </ol>
    </OnboardingShell>
  );
}
