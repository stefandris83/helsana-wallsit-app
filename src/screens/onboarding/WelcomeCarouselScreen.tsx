import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionLink } from '../../components/ActionLink';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { t } from '../../content/registry';
import type { ContentId } from '../../content/registry';
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

const cards: WelcomeCard[] = [
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
 * Willkommens-Carousel (§10). Vier Karten, Fortschrittspunkte, vorwaerts und
 * rueckwaerts navigierbar. Kein Wischen, damit es nicht versehentlich verlassen wird.
 */
export function WelcomeCarouselScreen() {
  const navigate = useNavigate();
  const completeWelcome = useAppStore((state) => state.completeWelcome);
  const hasPlan = useAppStore((state) => state.participant.plan !== null);
  const [index, setIndex] = useState(0);

  const card = cards[index];
  const isLast = index === cards.length - 1;

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
            <Button block onClick={() => setIndex((value) => value + 1)}>
              {t('welcome.next')}
            </Button>
          )}
          {index > 0 ? (
            <ActionLink iconLeft="chevron-left" onClick={() => setIndex((value) => value - 1)}>
              {t('welcome.previous')}
            </ActionLink>
          ) : null}
        </div>
      }
    >
      <Card>
        <div className="flex flex-col gap-rat">
          <p className="helper-m text-secondary">
            {t('welcome.progressLabel', { current: index + 1, total: cards.length })}
          </p>
          <WelcomeVisual kind={card.visual} label={t(card.altId)} />
          <div className="flex flex-col gap-snail">
            <h1 className="h4">{t(card.titleId)}</h1>
            <p className="body-m-copy">{t(card.textId)}</p>
          </div>
        </div>
      </Card>

      <ol className="flex list-none justify-center gap-snail p-none m-none">
        {cards.map((entry, position) => (
          <li key={entry.titleId}>
            <button
              type="button"
              className="u-icon-btn u-focus-ring"
              aria-label={t('welcome.goToCard', { index: position + 1 })}
              aria-current={position === index ? 'step' : undefined}
              onClick={() => setIndex(position)}
            >
              <span
                className={
                  position === index
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
