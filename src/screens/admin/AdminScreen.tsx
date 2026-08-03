import { useMemo, useState } from 'react';
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
import { loadReports, signIn } from '../../data/report-store';
import type { ReportSession } from '../../data/report-store';
import { isReportSharingConfigured } from '../../app/config';
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
  const [signInError, setSignInError] = useState<string | null>(null);
  const [includeDemo, setIncludeDemo] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  /** Anmeldung an der Berichtsablage. Nur im Arbeitsspeicher, nie persistiert. */
  const [session, setSession] = useState<ReportSession | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  /**
   * Geladene Ergebnisberichte. Bewusst nur im Arbeitsspeicher: auf dem Geraet
   * der auswertenden Person bleibt nichts zurueck.
   */
  const [loaded, setLoaded] = useState<PilotParticipantRecord[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportNotice, setReportNotice] = useState<string[]>([]);
  const [reportError, setReportError] = useState<string | null>(null);

  const accountLogin = isReportSharingConfigured();

  const submitSignIn = async () => {
    setSigningIn(true);
    setLoginError(false);
    const result = await signIn(email, password);
    setSigningIn(false);
    setPassword('');
    if (result.status === 'success') {
      setSession(result.session);
      setAuthenticated(true);
      logAdminAction('login_success');
      logAdminAction('dashboard_viewed');
      return;
    }
    setLoginError(true);
    setSignInError(
      result.status === 'invalid' ? t('admin.login.accountInvalid') : t('admin.login.accountFailed'),
    );
    logAdminAction('login_failed');
  };

  const fetchReports = async () => {
    if (!session) return;
    setLoadingReports(true);
    setReportError(null);
    setReportNotice([]);
    const outcome = await loadReports(session);
    setLoadingReports(false);
    if (outcome.status !== 'success') {
      setReportError(
        outcome.status === 'unauthorised'
          ? t('admin.reports.unauthorised')
          : t('admin.reports.failed'),
      );
      return;
    }
    setLoaded(outcome.records);
    const messages =
      outcome.records.length === 0
        ? [t('admin.reports.empty')]
        : [t('admin.reports.loaded', { count: outcome.records.length })];
    if (outcome.rejected.length > 0) {
      messages.push(t('admin.reports.rejected', { count: outcome.rejected.length }));
    }
    setReportNotice(messages);
    logAdminAction('reports_loaded');
  };

  const today = todayIso();
  const records = useMemo(
    () => buildPilotDataset([...(includeDemo ? demoPilotRecords() : []), ...loaded]),
    [includeDemo, loaded],
  );
  const metrics = useMemo(
    () => aggregate(records, filters, today, config.minGroupSize),
    [records, filters, today],
  );

  /**
   * Anmeldung mit einem echten Konto, sobald eine Berichtsablage konfiguriert
   * ist. Die Leseberechtigung haengt an diesem Konto; der ausgelieferte
   * Schluessel darf weiterhin nur schreiben.
   */
  if (accountLogin && !authenticated) {
    return (
      <div className="container flex min-h-screen flex-col justify-center gap-cat py-cat">
        <h1 className="h2">{t('admin.login.title')}</h1>
        <p className="body-m-copy">{t('admin.login.accountLead')}</p>
        <form
          className="flex flex-col gap-rat"
          onSubmit={(event) => {
            event.preventDefault();
            void submitSignIn();
          }}
        >
          <TextField
            type="email"
            label={t('admin.login.emailLabel')}
            value={email}
            autoComplete="username"
            onChange={(event) => {
              setEmail(event.target.value);
              setSignInError(null);
            }}
          />
          <TextField
            type="password"
            label={t('admin.login.passwordLabel')}
            value={password}
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value);
              setSignInError(null);
            }}
            error={signInError ?? undefined}
          />
          <Button type="submit" block disabled={signingIn || email === '' || password === ''}>
            {signingIn ? t('admin.login.pending') : t('admin.login.submit')}
          </Button>
        </form>
        <InlineNotification type="info" iconLabel={t('admin.login.accountNote')}>
          {t('admin.login.accountNote')}
        </InlineNotification>
        <Button variant="secondary" block onClick={() => navigate('/heute')}>
          {t('admin.backToApp')}
        </Button>
      </div>
    );
  }

  if (!accountLogin && !config.adminCode) {
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

      {session ? (
        <Card>
          <div className="flex flex-col gap-frog">
            <h2 className="h5">{t('admin.reports.title')}</h2>
            <p className="body-m-copy">{t('admin.reports.text')}</p>
            {reportError ? (
              <InlineNotification type="error" iconLabel={reportError}>
                {reportError}
              </InlineNotification>
            ) : null}
            <Button
              variant="secondary"
              block
              iconLeft="download"
              disabled={loadingReports}
              onClick={() => void fetchReports()}
            >
              {loadingReports ? t('admin.reports.loading') : t('admin.reports.load')}
            </Button>
            {reportNotice.length > 0 ? (
              <InlineNotification type="success" iconLabel={reportNotice[0]}>
                {reportNotice.join(' ')}
              </InlineNotification>
            ) : null}
            {loaded.length > 0 ? (
              <>
                <p className="body-m">{t('admin.reports.count', { count: loaded.length })}</p>
                <Button
                  variant="secondary"
                  block
                  onClick={() => {
                    setLoaded([]);
                    setReportNotice([]);
                    logAdminAction('reports_cleared');
                  }}
                >
                  {t('admin.reports.clear')}
                </Button>
              </>
            ) : null}
            <p className="helper-m text-secondary">{t('admin.reports.retention')}</p>
          </div>
        </Card>
      ) : null}

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
