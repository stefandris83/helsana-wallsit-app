import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CheckList } from '../../components/CheckList';
import { InlineNotification } from '../../components/InlineNotification';
import { t, tField, tFieldOptional, tList } from '../../content/registry';
import { learningCardContentIds, learningCardStepIds } from '../../content/mappings';
import type { LearningCardId } from '../../content/learning-cards';
import { learningCardIds } from '../../content/learning-cards';
import { useAppStore } from '../../data/store';

function isLearningCardId(value: string | undefined): value is LearningCardId {
  return value !== undefined && (learningCardIds as readonly string[]).includes(value);
}

/** Einzelne Lernkarte (§22). Keine individuelle medizinische Empfehlung. */
export function LearningCardScreen() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const openLearningCard = useAppStore((state) => state.openLearningCard);
  const valid = isLearningCardId(cardId);

  useEffect(() => {
    if (valid) openLearningCard(cardId);
  }, [valid, cardId, openLearningCard]);

  if (!valid) {
    return (
      <div className="flex flex-col gap-cat">
        <h1 className="h2">{t('error.notFound.title')}</h1>
        <Button block onClick={() => navigate('/lernen')}>
          {t('learning.back')}
        </Button>
      </div>
    );
  }

  const contentId = learningCardContentIds[cardId];
  const stepsId = learningCardStepIds[cardId];
  const safety = tFieldOptional(contentId, 'safety');

  return (
    <div className="flex flex-col gap-cat">
      <div className="flex flex-col gap-bee">
        <p className="helper-m text-secondary">{tField(contentId, 'topic')}</p>
        <h1 className="h2">{tField(contentId, 'title')}</h1>
      </div>
      <p className="lead text-secondary">{tField(contentId, 'intro')}</p>

      {stepsId ? (
        <Card>
          <div className="flex flex-col gap-frog">
            <h2 className="h5">{tField(stepsId, 'title')}</h2>
            <ol className="flex flex-col gap-snail p-none m-none list-none body-m-copy">
              {tList(stepsId).map((step, index) => (
                <li key={step} className="flex items-start gap-snail">
                  <span className="body-m-bold text-secondary">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('learning.keyMessages')}</h2>
          <CheckList items={tList(contentId)} />
        </div>
      </Card>

      <InlineNotification type="neutral" title={t('learning.tip')} iconLabel={t('learning.tip')}>
        {tField(contentId, 'tip')}
      </InlineNotification>

      {safety ? (
        <InlineNotification
          type="neutral"
          icon="shield-check"
          title={t('learning.safety')}
          iconLabel={t('learning.safety')}
        >
          {safety}
        </InlineNotification>
      ) : null}

      <p className="helper-m text-secondary">{t('learning.disclaimer')}</p>

      <Button variant="secondary" block onClick={() => navigate('/lernen')}>
        {t('learning.back')}
      </Button>
    </div>
  );
}
