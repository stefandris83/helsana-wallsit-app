import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { t } from '../../content/registry';

/** Datenschutzerklaerung und Impressum (§25). */
export function SettingsLegalScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-cat">
      <h1 className="h2">{t('settings.section.info')}</h1>

      <Card>
        <div className="flex flex-col gap-snail">
          <h2 className="h5">{t('legal.privacyPolicy.title')}</h2>
          <p className="body-m-copy">{t('legal.privacyPolicy.text')}</p>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-snail">
          <h2 className="h5">{t('legal.imprint.title')}</h2>
          <p className="body-m-copy">{t('legal.imprint.text')}</p>
        </div>
      </Card>

      <Button variant="secondary" block onClick={() => navigate('/einstellungen')}>
        {t('action.back')}
      </Button>
    </div>
  );
}
