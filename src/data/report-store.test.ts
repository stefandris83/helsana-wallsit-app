import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadReports, signIn } from './report-store';
import type { ReportSession } from './report-store';
import { REPORT_SCHEMA } from './report-sharing';
import { createEmptyParticipant } from './participant';

/**
 * Lesender Zugriff des Dashboards auf die Berichtsablage.
 *
 * Der Zugriff haengt an der Anmeldung der auswertenden Person, nicht am
 * ausgelieferten Schluessel. Die Tests belegen den Ablauf gegen eine
 * kontrollierte Netzwerkschicht; die Berechtigungsregel selbst liegt in der
 * Datenbank (siehe docs/schnittstellen.md).
 */

const session: ReportSession = { accessToken: 'token-xyz', email: 'auswertung@example.invalid' };

function report(pilotId: string, sessionCount: number) {
  return {
    schema: REPORT_SCHEMA,
    createdAt: '2026-08-03T10:00:00.000Z',
    pilotId,
    bpEntryCount: 2,
    demo: false,
    participant: {
      ...createEmptyParticipant(),
      profile: null,
      sessions: Array.from({ length: sessionCount }, (_, index) => ({
        id: `ses_${pilotId}_${index}`,
        date: '2026-08-03',
        programWeek: 1,
        variant: 'light',
        targetSeconds: 30,
        optionalTargetSeconds: null,
        sets: [],
        feedback: { completion: 'full', exertion: 'fitting', complaints: false, wellbeing: 'good' },
        startedAt: '2026-08-03T18:00:00.000Z',
        endedAt: '2026-08-03T18:10:00.000Z',
        aborted: false,
        checkin: { mood: 'good', wish: 'suggest' },
        deviation: 'none',
      })),
    },
    events: [],
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Anmeldung an der Berichtsablage', () => {
  it('liefert bei falschen Angaben «invalid», ohne zu werfen', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: 'invalid grant' }, 400));
    await expect(signIn('a@example.invalid', 'falsch')).resolves.toEqual({ status: 'invalid' });
  });

  it('gibt bei Netzfehlern «failed» zurueck', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));
    await expect(signIn('a@example.invalid', 'x')).resolves.toEqual({ status: 'failed' });
  });

  it('reicht das Zugangstoken der erfolgreichen Anmeldung weiter', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ access_token: 'token-xyz' }));
    const result = await signIn('auswertung@example.invalid', 'geheim');
    expect(result).toEqual({
      status: 'success',
      session: { accessToken: 'token-xyz', email: 'auswertung@example.invalid' },
    });
  });

  it('sendet das Passwort nur an die Anmeldeschnittstelle', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ access_token: 'token-xyz' }));
    await signIn('auswertung@example.invalid', 'geheim');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/auth/v1/token');
    expect(String(init.body)).toContain('geheim');
  });
});

describe('Berichte laden', () => {
  it('fuehrt mehrere Berichte zu einem Datensatz je Pilotnummer zusammen', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse([
          { name: 'P-001-2026-08-01.json' },
          { name: 'P-001-2026-08-03.json' },
          { name: 'P-002-2026-08-02.json' },
        ]),
      )
      .mockResolvedValueOnce(jsonResponse(report('P-001', 1)))
      .mockResolvedValueOnce(jsonResponse(report('P-001', 5)))
      .mockResolvedValueOnce(jsonResponse(report('P-002', 2)));

    const outcome = await loadReports(session);

    expect(outcome.status).toBe('success');
    if (outcome.status !== 'success') return;
    expect(outcome.records).toHaveLength(2);
    // Der zuletzt abgelegte Bericht derselben Pilotnummer gewinnt.
    const first = outcome.records.find((record) => record.pilotId === 'P-001');
    expect(first?.participant.sessions).toHaveLength(5);
  });

  it('meldet fehlendes Leserecht getrennt von einem Fehler', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'not authorised' }, 403));
    await expect(loadReports(session)).resolves.toEqual({ status: 'unauthorised' });
  });

  it('ueberspringt unlesbare Dateien, statt den ganzen Ladevorgang abzubrechen', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse([{ name: 'P-003-2026-08-03.json' }, { name: 'P-999-kaputt.json' }]),
      )
      .mockResolvedValueOnce(jsonResponse(report('P-003', 3)))
      .mockResolvedValueOnce(jsonResponse({ etwas: 'anderes' }));

    const outcome = await loadReports(session);

    expect(outcome.status).toBe('success');
    if (outcome.status !== 'success') return;
    expect(outcome.records).toHaveLength(1);
    expect(outcome.rejected).toEqual(['P-999-kaputt.json']);
  });

  it('meldet sich mit dem Token der Person an, nicht mit dem Schreibschluessel', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    await loadReports(session);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers.authorization).toBe('Bearer token-xyz');
  });
});
