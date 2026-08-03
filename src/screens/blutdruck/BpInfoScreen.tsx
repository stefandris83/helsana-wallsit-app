import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CheckList } from '../../components/CheckList';
import { contentEntry, t, tList } from '../../content/registry';

/**
 * Statische Informationskarte zur Messung (§23 «Messinformationen»).
 * Allgemeine Hinweise zur Durchfuehrung, keine Bewertung und keine Zielwerte.
 */
export function BpInfoScreen() {
  const navigate = useNavigate();
  const entry = contentEntry('bpInfo.items');

  return (
    <div className="flex flex-col gap-cat">
      <div className="flex flex-col gap-bee">
        <h1 className="h2">{t('bpInfo.title')}</h1>
        <p className="body-s text-secondary">{t('bpInfo.lead')}</p>
      </div>

      <Card>
        <CheckList items={tList('bpInfo.items')} />
      </Card>

      <Card>
        <div className="flex flex-col gap-snail">
          <h2 className="h5">{t('bpInfo.measurementWeekTitle')}</h2>
          <p className="body-m-copy">{t('bpInfo.measurementWeekText')}</p>
          <p className="body-s text-secondary">{t('bpInfo.measurementWeekNote')}</p>
        </div>
      </Card>

      {entry.source ? (
        <p className="helper-m text-secondary">
          {t('learning.sourceLabel')}: {entry.source}
        </p>
      ) : null}

      <Button variant="secondary" block onClick={() => navigate('/blutdruck')}>
        {t('action.back')}
      </Button>
    </div>
  );
}
