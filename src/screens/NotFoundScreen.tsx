import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { t } from '../content/registry';

export function NotFoundScreen() {
  const navigate = useNavigate();
  return (
    <div className="container flex min-h-screen flex-col justify-center gap-cat py-cat">
      <h1 className="h2">{t('error.notFound.title')}</h1>
      <p className="body-m-copy">{t('error.notFound.text')}</p>
      <Button block onClick={() => navigate('/heute', { replace: true })}>
        {t('error.notFound.action')}
      </Button>
    </div>
  );
}
