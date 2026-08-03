import { useNavigate } from 'react-router-dom';
import { ActionLink } from '../../components/ActionLink';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { InlineNotification } from '../../components/InlineNotification';
import { t, tField } from '../../content/registry';
import { learningCardContentIds } from '../../content/mappings';
import { personalize } from '../../domain/personalization';
import { useAppStore } from '../../data/store';

/** Learning-Bereich (§22). Reihenfolge regelbasiert personalisiert (§13). */
export function LearningScreen() {
  const navigate = useNavigate();
  const questionnaire = useAppStore((state) => state.participant.questionnaire);
  const profile = useAppStore((state) => state.participant.profile);
  const opened = useAppStore((state) => state.participant.learningCardsOpened);
  const { learningOrder, learningOrderPersonalized } = personalize(questionnaire, {
    profile,
    openedCardIds: opened,
  });

  return (
    <div className="flex flex-col gap-cat">
      <div className="flex flex-col gap-bee">
        <h1 className="h2">{t('learning.title')}</h1>
        <p className="body-s text-secondary">{t('learning.lead')}</p>
      </div>

      <div className="flex flex-col gap-frog">
        {learningOrder.map((cardId) => {
          const contentId = learningCardContentIds[cardId];
          const isRead = opened.includes(cardId);
          return (
            <Card key={cardId}>
              <div className="flex flex-col gap-snail">
                <div className="flex items-start justify-between gap-snail">
                  <p className="helper-m text-secondary">{tField(contentId, 'topic')}</p>
                  {isRead ? (
                    <span className="flex shrink-0 items-center gap-bee helper-m text-secondary">
                      <Icon name="check-circle" size={16} />
                      {t('learning.readBadge')}
                    </span>
                  ) : null}
                </div>
                <h2 className="h5">{tField(contentId, 'title')}</h2>
                <p className="body-m-copy">{tField(contentId, 'intro')}</p>
                <ActionLink iconRight="arrow-right" onClick={() => navigate(`/lernen/${cardId}`)}>
                  {t('learning.openCard')}
                </ActionLink>
              </div>
            </Card>
          );
        })}
      </div>

      {learningOrderPersonalized ? (
        <p className="helper-m text-secondary">{t('learning.orderNote')}</p>
      ) : null}

      <InlineNotification type="neutral" iconLabel={t('learning.disclaimer')}>
        {t('learning.disclaimer')}
      </InlineNotification>
    </div>
  );
}
