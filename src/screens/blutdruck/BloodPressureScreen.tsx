import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionLink } from '../../components/ActionLink';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Checkbox } from '../../components/Choice';
import { Dialog } from '../../components/Dialog';
import { IconButton } from '../../components/IconButton';
import { InlineNotification } from '../../components/InlineNotification';
import { downloadTextFile } from '../../app/download';
import { t } from '../../content/registry';
import { daypartLabels } from '../../content/mappings';
import { formatIsoDate } from '../../domain/dates';
import { exportBpEntriesCsv } from '../../data/bp-repository';
import { useAppStore } from '../../data/store';

/**
 * Blutdrucktagebuch (§23). Reine Dokumentation: keine Bewertung, keine
 * Farbcodierung, keine Durchschnitte, keine Verknuepfung mit dem Training.
 */
export function BloodPressureScreen() {
  const navigate = useNavigate();
  const entries = useAppStore((state) => state.bpEntries);
  const bpConsent = useAppStore((state) => state.participant.bpConsent);
  const setBpConsent = useAppStore((state) => state.setBpConsent);
  const removeBpEntry = useAppStore((state) => state.removeBpEntry);

  const [consentDraft, setConsentDraft] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  if (!bpConsent) {
    return (
      <div className="flex flex-col gap-cat">
        <div className="flex flex-col gap-bee">
          <h1 className="h2">{t('bp.title')}</h1>
          <p className="body-s text-secondary">{t('bp.lead')}</p>
        </div>

        <Card>
          <div className="flex flex-col gap-frog">
            <h2 className="h5">{t('bp.consent.title')}</h2>
            <p className="body-m-copy">{t('bp.consent.text')}</p>
            <Checkbox
              checked={consentDraft}
              onChange={setConsentDraft}
              label={t('bp.consent.checkbox')}
            />
            <Button block disabled={!consentDraft} onClick={() => setBpConsent(true)}>
              {t('bp.consent.activate')}
            </Button>
          </div>
        </Card>

        <InlineNotification type="neutral" iconLabel={t('bp.separationNote')}>
          {t('bp.separationNote')}
        </InlineNotification>

        <ActionLink iconRight="arrow-right" onClick={() => navigate('/blutdruck/hinweise')}>
          {t('bp.infoLink')}
        </ActionLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-cat">
      <div className="flex flex-col gap-bee">
        <h1 className="h2">{t('bp.title')}</h1>
        <p className="body-s text-secondary">{t('bp.lead')}</p>
      </div>

      <Dialog
        open={pendingDelete !== null}
        title={t('bp.delete.title')}
        description={t('bp.delete.text')}
        confirmLabel={t('bp.delete.confirm')}
        cancelLabel={t('action.cancel')}
        onConfirm={() => {
          if (pendingDelete) removeBpEntry(pendingDelete);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />

      <Button block iconLeft="add" onClick={() => navigate('/blutdruck/neu')}>
        {t('bp.list.add')}
      </Button>

      <Card>
        <div className="flex flex-col gap-frog">
          <div className="flex items-baseline justify-between gap-snail">
            <h2 className="h5">{t('bp.list.title')}</h2>
            <span className="helper-m text-secondary">
              {t('bp.list.count', { count: entries.length })}
            </span>
          </div>

          {entries.length === 0 ? (
            <p className="body-m text-secondary">{t('bp.list.empty')}</p>
          ) : (
            <ul className="flex flex-col gap-snail list-none p-none m-none">
              {entries.map((entry) => (
                <li key={entry.id} className="u-border-bottom flex items-center gap-snail py-snail">
                  <div className="flex flex-1 flex-col gap-ant">
                    <span className="body-m-bold">
                      {entry.systolic} / {entry.diastolic} {t('bp.form.unitMmhg')}
                    </span>
                    <span className="helper-m text-secondary">
                      {formatIsoDate(entry.date)} · {entry.time}
                      {entry.daypart === 'unspecified'
                        ? ''
                        : ` · ${t(daypartLabels[entry.daypart])}`}
                      {entry.pulse === null ? '' : ` · ${entry.pulse} ${t('bp.form.unitBpm')}`}
                    </span>
                    {entry.note ? <span className="body-s">{entry.note}</span> : null}
                  </div>
                  <IconButton
                    icon="edit"
                    label={t('action.edit')}
                    onClick={() => navigate(`/blutdruck/${entry.id}/bearbeiten`)}
                  />
                  <IconButton
                    icon="delete"
                    label={t('action.delete')}
                    onClick={() => setPendingDelete(entry.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <InlineNotification type="neutral" iconLabel={t('bp.medicalNote')}>
        {t('bp.medicalNote')}
      </InlineNotification>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('bp.export.title')}</h2>
          <p className="body-m-copy">{t('bp.export.text')}</p>
          <Button
            variant="secondary"
            block
            iconLeft="download"
            disabled={entries.length === 0}
            onClick={() =>
              downloadTextFile('blutdruck-eigene-rohdaten.csv', exportBpEntriesCsv(), 'text/csv')
            }
          >
            {t('bp.export.action')}
          </Button>
        </div>
      </Card>

      <ActionLink iconRight="arrow-right" onClick={() => navigate('/blutdruck/hinweise')}>
        {t('bp.infoLink')}
      </ActionLink>
    </div>
  );
}
