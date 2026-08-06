import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Checkbox } from '../../components/Choice';
import { Dialog } from '../../components/Dialog';
import { Icon } from '../../components/Icon';
import { InlineNotification } from '../../components/InlineNotification';
import { downloadTextFile } from '../../app/download';
import { t } from '../../content/registry';
import type { ContentId } from '../../content/registry';
import { formatIsoDate } from '../../domain/dates';
import { buildOwnDataExport } from '../../data/export';
import { loadEvents } from '../../data/event-log';
import { useAppStore } from '../../data/store';

const consentItems: { key: 'voluntary' | 'privacy' | 'noMedicalAdvice' | 'analytics' | 'profileStorage'; labelId: ContentId }[] = [
  { key: 'voluntary', labelId: 'consent.item.voluntary' },
  { key: 'privacy', labelId: 'consent.item.privacy' },
  { key: 'noMedicalAdvice', labelId: 'consent.item.noMedicalAdvice' },
  { key: 'analytics', labelId: 'consent.item.analytics' },
  { key: 'profileStorage', labelId: 'consent.item.profile' },
];

/** Einwilligungen ansehen, Daten exportieren und loeschen (§25, §30). */
export function SettingsDataScreen() {
  const navigate = useNavigate();
  const identity = useAppStore((state) => state.identity);
  const participant = useAppStore((state) => state.participant);
  const bpEntries = useAppStore((state) => state.bpEntries);
  const setBpConsent = useAppStore((state) => state.setBpConsent);
  const removeAllBpEntries = useAppStore((state) => state.removeAllBpEntries);
  const deleteAllData = useAppStore((state) => state.deleteAllData);

  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [deleteAllChecked, setDeleteAllChecked] = useState(false);
  const [confirmDeleteBp, setConfirmDeleteBp] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const exportOwnData = () => {
    const payload = buildOwnDataExport(identity, participant, bpEntries, loadEvents());
    downloadTextFile(
      'wandsitz-pilot-eigene-daten.json',
      JSON.stringify(payload, null, 2),
      'application/json',
    );
  };

  return (
    <div className="flex flex-col gap-cat">
      <h1 className="h2">{t('settings.section.privacy')}</h1>

      {notice ? (
        <InlineNotification type="success" iconLabel={notice}>
          {notice}
        </InlineNotification>
      ) : null}

      <Dialog
        open={confirmDeleteBp}
        title={t('settings.deleteBp.title')}
        description={t('settings.deleteBp.text')}
        confirmLabel={t('settings.deleteBp.action')}
        cancelLabel={t('action.cancel')}
        onConfirm={() => {
          removeAllBpEntries();
          setConfirmDeleteBp(false);
          setNotice(t('settings.deleteBp.done'));
        }}
        onCancel={() => setConfirmDeleteBp(false)}
      />

      <Dialog
        open={confirmDeleteAll}
        title={t('settings.deleteAll.title')}
        description={t('settings.deleteAll.text')}
        confirmLabel={t('settings.deleteAll.action')}
        cancelLabel={t('action.cancel')}
        onConfirm={() => {
          if (!deleteAllChecked) return;
          deleteAllData();
          setConfirmDeleteAll(false);
          navigate('/zugang', { replace: true });
        }}
        onCancel={() => {
          setConfirmDeleteAll(false);
          setDeleteAllChecked(false);
        }}
      >
        <Checkbox
          checked={deleteAllChecked}
          onChange={setDeleteAllChecked}
          label={t('settings.deleteAll.confirmLabel')}
        />
      </Dialog>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('settings.consents.title')}</h2>
          <ul className="flex flex-col gap-snail list-none p-none m-none body-m">
            {consentItems.map((item) => (
              <li key={item.key} className="flex items-start gap-snail">
                <Icon name={participant.consent[item.key] ? 'check-circle' : 'info-circle'} size={16} />
                <span>{t(item.labelId)}</span>
              </li>
            ))}
          </ul>
          {participant.consent.completedAt ? (
            <p className="helper-m text-secondary">
              {t('settings.consents.givenAt', {
                date: formatIsoDate(participant.consent.completedAt.slice(0, 10)),
              })}
            </p>
          ) : null}

          <hr className="u-divider" />

          <div className="flex items-center justify-between gap-snail">
            <span className="body-m">{t('settings.consents.bpTitle')}</span>
            <span className="helper-m text-secondary">
              {participant.bpConsent
                ? t('settings.consents.bpActive')
                : t('settings.consents.bpInactive')}
            </span>
          </div>
          {participant.bpConsent ? (
            <>
              <Button variant="secondary" block onClick={() => setBpConsent(false)}>
                {t('bp.consent.revoke')}
              </Button>
              <p className="helper-m text-secondary">{t('bp.consent.revokeHint')}</p>
            </>
          ) : null}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('settings.export.title')}</h2>
          <p className="body-m-copy">{t('settings.export.text')}</p>
          <Button variant="secondary" block iconLeft="download" onClick={exportOwnData}>
            {t('settings.export.action')}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('settings.deleteBp.title')}</h2>
          <p className="body-m-copy">{t('settings.deleteBp.text')}</p>
          <Button
            variant="secondary"
            block
            disabled={bpEntries.length === 0}
            onClick={() => setConfirmDeleteBp(true)}
          >
            {t('settings.deleteBp.action')}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('settings.deleteAll.title')}</h2>
          <p className="body-m-copy">{t('settings.deleteAll.text')}</p>
          <Button
            variant="secondary"
            block
            onClick={() => {
              setDeleteAllChecked(false);
              setConfirmDeleteAll(true);
            }}
          >
            {t('settings.deleteAll.action')}
          </Button>
        </div>
      </Card>

      <Button variant="secondary" block onClick={() => navigate('/einstellungen')}>
        {t('action.back')}
      </Button>
    </div>
  );
}
