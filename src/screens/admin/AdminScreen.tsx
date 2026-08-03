import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Checkbox } from '../../components/Choice';
import { SelectField, TextField } from '../../components/Fields';
import { InlineNotification } from '../../components/InlineNotification';
import { StatTile } from '../../components/StatTile';
import { config } from '../../app/config';
import { downloadTextFile } from '../../app/download';
import { t } from '../../content/registry';
import type { ContentId } from '../../content/registry';
import {
  activityLevelLabels,
  barrierLabels,
  daytimeLabels,
  exertionLabels,
  supportLabels,
  wallsitExperienceLabels,
  weekdayLabels,
  wellbeingLabels,
} from '../../content/mappings';
import type { DashboardFilters } from '../../data/aggregation';
import { aggregate, defaultFilters } from '../../data/aggregation';
import type { DistributionEntry } from '../../data/aggregation';
import { logAdminAction } from '../../data/admin-log';
import { exportEventsCsv, exportSessionsCsv } from '../../data/export';
import { buildPilotDataset, todayIso } from '../../data/pilot-dataset';
import type { PilotParticipantRecord } from '../../data/pilot-dataset';
import { importReportFiles } from '../../data/report-import';
import { demoPilotRecords } from '../../demo/demo-data';
import { PROGRAM_WEEKS } from '../../domain/week-matrix';

function labelledList<T extends string>(
  entries: DistributionEntry<T>[],
  labels: Record<T, ContentId>,
): { label: string; count: number }[] {
  return entries.map((entry) => ({ label: t(labels[entry.key]), count: entry.count }));
}

function DistributionCard({
  title,
  entries,
}: {
  title: string;
  entries: { label: string; count: number }[];
}) {
  return (
    <Card>
      <div className="flex flex-col gap-frog">
        <h3 className="body-l-bold">{title}</h3>
        {entries.length === 0 ? (
          <p className="body-s text-secondary">{t('admin.empty')}</p>
        ) : (
          <ul className="flex flex-col gap-snail list-none p-none m-none body-m">
            {entries.map((entry) => (
              <li key={entry.label} className="flex justify-between gap-snail">
                <span>{entry.label}</span>
                <span>{entry.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

/**
 * Anonymisiertes Pilot-Dashboard (§26).
 *
 * Der Codeschutz ist ein Platzhalter fuer den Pilot und kein produktiver
 * Authentisierungsmechanismus (CLAUDE.md B.9). Angezeigt werden ausschliesslich
 * aggregierte Nutzungsdaten; einzelne Blutdruckwerte, Freitexte, Namen und
 * Kontaktangaben sind im zugrunde liegenden Datentyp gar nicht enthalten.
 */
export function AdminScreen() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [includeDemo, setIncludeDemo] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  /**
   * Eingelesene Ergebnisberichte. Bewusst nur im Arbeitsspeicher: sie werden
   * auf dem Geraet der auswertenden Person nicht abgelegt.
   */
  const [imported, setImported] = useState<PilotParticipantRecord[]>([]);
  const [importNotice, setImportNotice] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const readReports = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const outcome = await importReportFiles([...fileList], imported);
    setImported(outcome.records);
    const messages = [t('admin.import.done', { count: fileList.length - outcome.rejected.length })];
    if (outcome.replaced.length > 0) {
      messages.push(t('admin.import.replaced', { count: outcome.replaced.length }));
    }
    if (outcome.rejected.length > 0) {
      messages.push(t('admin.import.rejected', { count: outcome.rejected.length }));
    }
    setImportNotice(messages);
    logAdminAction('reports_imported');
    if (fileInput.current) fileInput.current.value = '';
  };

  const today = todayIso();
  const records = useMemo(
    () => buildPilotDataset([...(includeDemo ? demoPilotRecords() : []), ...imported]),
    [includeDemo, imported],
  );
  const metrics = useMemo(
    () => aggregate(records, filters, today, config.minGroupSize),
    [records, filters, today],
  );

  if (!config.adminCode) {
    return (
      <div className="container flex min-h-screen flex-col justify-center gap-cat py-cat">
        <h1 className="h2">{t('admin.login.title')}</h1>
        <InlineNotification type="warning" iconLabel={t('admin.login.notConfigured')}>
          {t('admin.login.notConfigured')}
        </InlineNotification>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container flex min-h-screen flex-col justify-center gap-cat py-cat">
        <h1 className="h2">{t('admin.login.title')}</h1>
        <p className="body-m-copy">{t('admin.login.lead')}</p>
        <form
          className="flex flex-col gap-rat"
          onSubmit={(event) => {
            event.preventDefault();
            if (code === config.adminCode) {
              setAuthenticated(true);
              setLoginError(false);
              logAdminAction('login_success');
              logAdminAction('dashboard_viewed');
              return;
            }
            setLoginError(true);
            logAdminAction('login_failed');
          }}
        >
          <TextField
            type="password"
            label={t('admin.login.codeLabel')}
            value={code}
            autoComplete="off"
            onChange={(event) => {
              setCode(event.target.value);
              setLoginError(false);
            }}
            error={loginError ? t('admin.login.invalid') : undefined}
          />
          <Button type="submit" block>
            {t('admin.login.submit')}
          </Button>
        </form>
        <InlineNotification type="info" iconLabel={t('admin.login.securityNote')}>
          {t('admin.login.securityNote')}
        </InlineNotification>
        <Button variant="secondary" block onClick={() => navigate('/heute')}>
          {t('admin.backToApp')}
        </Button>
      </div>
    );
  }

  const percentage = (value: number, total: number) =>
    total === 0 ? '–' : `${Math.round((value / total) * 100)} %`;

  return (
    <div className="container flex min-h-screen flex-col gap-cat py-cat">
      <div className="flex flex-col gap-bee">
        <h1 className="h2">{t('admin.title')}</h1>
        <p className="body-s text-secondary">{t('admin.subtitle')}</p>
      </div>

      <InlineNotification type="info" iconLabel={t('admin.privacyNotice')}>
        {t('admin.privacyNotice')}
      </InlineNotification>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('admin.import.title')}</h2>
          <p className="body-m-copy">{t('admin.import.text')}</p>
          <input
            ref={fileInput}
            id="admin-import"
            type="file"
            accept="application/json,.json"
            multiple
            className="u-visually-hidden"
            onChange={(event) => void readReports(event.target.files)}
          />
          <Button
            variant="secondary"
            block
            iconLeft="upload"
            onClick={() => fileInput.current?.click()}
          >
            {t('admin.import.action')}
          </Button>
          {importNotice.length > 0 ? (
            <InlineNotification type="success" iconLabel={importNotice[0]}>
              {importNotice.join(' ')}
            </InlineNotification>
          ) : null}
          {imported.length > 0 ? (
            <>
              <p className="body-m">{t('admin.import.count', { count: imported.length })}</p>
              <Button
                variant="secondary"
                block
                onClick={() => {
                  setImported([]);
                  setImportNotice([]);
                  logAdminAction('reports_cleared');
                }}
              >
                {t('admin.import.clear')}
              </Button>
            </>
          ) : null}
          <p className="helper-m text-secondary">{t('admin.import.retention')}</p>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('admin.section.filter')}</h2>
          <Checkbox
            checked={includeDemo}
            onChange={(checked) => {
              setIncludeDemo(checked);
              logAdminAction('filter_changed');
            }}
            label={t('settings.demo.title')}
            hint={t('settings.demo.text')}
          />
          <div className="grid gap-frog tablet:grid-cols-2">
            <SelectField
              label={t('admin.filter.programWeek')}
              value={String(filters.programWeek)}
              onChange={(event) => {
                const value = event.target.value;
                setFilters({
                  ...filters,
                  programWeek: value === 'all' ? 'all' : Number(value),
                });
                logAdminAction('filter_changed');
              }}
              options={[
                { value: 'all', label: t('admin.filter.all') },
                ...Array.from({ length: PROGRAM_WEEKS }, (_, index) => ({
                  value: String(index + 1),
                  label: String(index + 1),
                })),
              ]}
            />
            <SelectField
              label={t('admin.filter.participation')}
              value={filters.participation}
              onChange={(event) => {
                setFilters({
                  ...filters,
                  participation: event.target.value as DashboardFilters['participation'],
                });
                logAdminAction('filter_changed');
              }}
              options={[
                { value: 'all', label: t('admin.filter.participation.all') },
                { value: 'active', label: t('admin.filter.participation.active') },
                { value: 'inactive', label: t('admin.filter.participation.inactive') },
              ]}
            />
            <SelectField
              label={t('admin.filter.variant')}
              value={filters.variant}
              onChange={(event) => {
                setFilters({
                  ...filters,
                  variant: event.target.value as DashboardFilters['variant'],
                });
                logAdminAction('filter_changed');
              }}
              options={[
                { value: 'all', label: t('admin.filter.all') },
                { value: 'light', label: t('common.variant.light') },
                { value: 'standard', label: t('common.variant.standard') },
              ]}
            />
            <div className="grid grid-cols-2 gap-frog">
              <TextField
                type="date"
                label={t('admin.filter.from')}
                value={filters.from ?? ''}
                onChange={(event) =>
                  setFilters({ ...filters, from: event.target.value || null })
                }
              />
              <TextField
                type="date"
                label={t('admin.filter.to')}
                value={filters.to ?? ''}
                onChange={(event) => setFilters({ ...filters, to: event.target.value || null })}
              />
            </div>
          </div>
          <Button variant="secondary" block onClick={() => setFilters(defaultFilters)}>
            {t('admin.filter.reset')}
          </Button>
        </div>
      </Card>

      {!metrics.sufficientData ? (
        <InlineNotification
          type="info"
          iconLabel={t('admin.minGroupNotice', { min: config.minGroupSize })}
        >
          {t('admin.minGroupNotice', { min: config.minGroupSize })}
        </InlineNotification>
      ) : (
        <>
          <section className="flex flex-col gap-frog">
            <h2 className="h5">{t('admin.section.overview')}</h2>
            <div className="grid gap-frog tablet:grid-cols-2 desktop:grid-cols-3">
              <StatTile label={t('admin.metric.activatedIds')} value={metrics.activatedIds} />
              <StatTile
                label={t('admin.metric.onboardingStarted')}
                value={metrics.onboardingStarted}
              />
              <StatTile
                label={t('admin.metric.onboardingCompleted')}
                value={metrics.onboardingCompleted}
              />
              <StatTile
                label={t('admin.metric.programsStarted')}
                value={metrics.programsStarted}
              />
              <StatTile
                label={t('admin.metric.activeParticipants')}
                value={metrics.activeParticipants}
              />
              <StatTile
                label={t('admin.metric.programsCompleted')}
                value={metrics.programsCompleted}
              />
              <StatTile
                label={t('admin.metric.trainingLocked')}
                value={metrics.trainingLocked}
              />
              <StatTile label={t('admin.metric.sessionsTotal')} value={metrics.sessionsTotal} />
              <StatTile
                label={t('admin.metric.sessionsPerWeek')}
                value={metrics.sessionsPerWeek.toFixed(1)}
              />
              <StatTile
                label={t('admin.metric.lightVariant')}
                value={percentage(metrics.lightVariantSessions, metrics.sessionsTotal)}
              />
              <StatTile
                label={t('admin.metric.standardVariant')}
                value={percentage(metrics.standardVariantSessions, metrics.sessionsTotal)}
              />
              <StatTile
                label={t('admin.metric.optionalTarget')}
                value={metrics.optionalTargetSets}
              />
              <StatTile
                label={t('admin.metric.aboveRecommendation')}
                value={metrics.sessionsAboveRecommendation}
              />
              <StatTile
                label={t('admin.metric.averageHold')}
                value={
                  metrics.averageHoldSeconds === null
                    ? '–'
                    : `${Math.round(metrics.averageHoldSeconds)} ${t('common.secondsShort')}`
                }
              />
              <StatTile label={t('admin.metric.learningUsage')} value={metrics.learningUsers} />
              <StatTile
                label={t('admin.metric.notifications')}
                value={metrics.notificationsEnabled}
              />
              <StatTile label={t('admin.metric.bpUsage')} value={metrics.bpDiaryUsers} />
              <StatTile label={t('admin.metric.bpEntries')} value={metrics.bpEntries} />
            </div>
          </section>

          <section className="flex flex-col gap-frog">
            <h2 className="h5">{t('admin.section.sessions')}</h2>
            <div className="grid gap-frog tablet:grid-cols-2">
              <DistributionCard
                title={t('admin.metric.completionSplit')}
                entries={[
                  {
                    label: t('progress.completionSplit.full'),
                    count: metrics.completionSplit.full,
                  },
                  {
                    label: t('progress.completionSplit.partial'),
                    count: metrics.completionSplit.partial,
                  },
                  {
                    label: t('progress.completionSplit.none'),
                    count: metrics.completionSplit.none,
                  },
                ]}
              />
              <DistributionCard
                title={t('admin.metric.abortPoints')}
                entries={metrics.abortPoints.map((entry) => ({
                  label: entry.key,
                  count: entry.count,
                }))}
              />
              <DistributionCard
                title={t('admin.metric.learningCards')}
                entries={metrics.learningCardOpens.map((entry) => ({
                  label: entry.key,
                  count: entry.count,
                }))}
              />
            </div>
          </section>

          <section className="flex flex-col gap-frog">
            <h2 className="h5">{t('admin.section.questionnaire')}</h2>
            <div className="grid gap-frog tablet:grid-cols-2">
              <DistributionCard
                title={t('admin.q.activityLevel')}
                entries={labelledList(metrics.activityLevels, activityLevelLabels)}
              />
              <DistributionCard
                title={t('admin.q.wallsitExperience')}
                entries={labelledList(metrics.wallsitExperience, wallsitExperienceLabels)}
              />
              <DistributionCard
                title={t('admin.q.barriers')}
                entries={labelledList(metrics.barriers, barrierLabels)}
              />
              <DistributionCard
                title={t('admin.q.support')}
                entries={labelledList(metrics.support, supportLabels)}
              />
              <DistributionCard
                title={t('admin.q.trainingDays')}
                entries={labelledList(metrics.trainingDays, weekdayLabels)}
              />
              <DistributionCard
                title={t('admin.q.trainingTime')}
                entries={labelledList(metrics.trainingDaytime, daytimeLabels)}
              />
              <DistributionCard
                title={t('admin.q.exertion')}
                entries={labelledList(
                  metrics.exertion as DistributionEntry<keyof typeof exertionLabels>[],
                  exertionLabels,
                )}
              />
              <DistributionCard
                title={t('admin.q.wellbeing')}
                entries={labelledList(
                  metrics.wellbeing as DistributionEntry<keyof typeof wellbeingLabels>[],
                  wellbeingLabels,
                )}
              />
              <StatTile
                label={t('admin.q.confidence')}
                value={
                  metrics.confidenceAverage === null
                    ? '–'
                    : metrics.confidenceAverage.toFixed(1)
                }
              />
              <StatTile
                label={t('admin.q.complaints')}
                value={`${metrics.complaintsReported} (${percentage(
                  metrics.complaintsReported,
                  metrics.sessionsTotal,
                )})`}
              />
            </div>
          </section>
        </>
      )}

      <Card>
        <div className="flex flex-col gap-frog">
          <h2 className="h5">{t('admin.export.title')}</h2>
          <p className="body-m-copy">{t('admin.export.text')}</p>
          <Button
            variant="secondary"
            block
            iconLeft="download"
            onClick={() => {
              logAdminAction('export_sessions');
              downloadTextFile(
                'pilot-einheiten-anonymisiert.csv',
                exportSessionsCsv(records),
                'text/csv',
              );
            }}
          >
            {t('admin.export.sessions')}
          </Button>
          <Button
            variant="secondary"
            block
            iconLeft="download"
            onClick={() => {
              logAdminAction('export_events');
              downloadTextFile(
                'pilot-ereignisse-anonymisiert.csv',
                exportEventsCsv(records),
                'text/csv',
              );
            }}
          >
            {t('admin.export.events')}
          </Button>
          <p className="helper-m text-secondary">{t('admin.export.rawNote')}</p>
        </div>
      </Card>

      <p className="helper-m text-secondary">{t('admin.dataSourceNote')}</p>
      <p className="helper-m text-secondary">{t('admin.accessLogNote')}</p>

      <Button
        variant="secondary"
        block
        iconLeft="logout"
        onClick={() => {
          logAdminAction('logout');
          setAuthenticated(false);
          setCode('');
        }}
      >
        {t('admin.logout')}
      </Button>
      <Button variant="secondary" block onClick={() => navigate('/heute')}>
        {t('admin.backToApp')}
      </Button>
    </div>
  );
}
