import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { t } from '../content/registry';
import { useAppStore } from '../data/store';

/**
 * Schlanker Durchstich durch Routing und Zugangslogik (§7, §8).
 * Prueft zugleich, dass die Oberflaeche ihre Texte aus der Content-Registry bezieht.
 */

describe('Einstieg in die App', () => {
  it('leitet ohne Zugang auf den Codebildschirm', async () => {
    window.history.pushState({}, '', '/');
    useAppStore.getState().reload();

    render(<App />);

    expect(
      await screen.findByRole('heading', { name: t('access.title') }),
    ).toBeInTheDocument();
  });

  it('fuehrt nach dem Einloesen eines gueltigen Codes zur Einwilligung', async () => {
    window.history.pushState({}, '', '/');
    useAppStore.getState().reload();

    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(t('access.codeLabel')), 'WS-2026-A1B2');
    await user.click(screen.getByRole('button', { name: t('access.submit') }));

    expect(await screen.findByRole('heading', { name: t('consent.title') })).toBeInTheDocument();
    expect(useAppStore.getState().identity?.pilotId).toBe('P-001');
  });

  it('zeigt einen Hinweis bei ungueltigem Code', async () => {
    window.history.pushState({}, '', '/');
    useAppStore.getState().reload();

    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(t('access.codeLabel')), 'FALSCH');
    await user.click(screen.getByRole('button', { name: t('access.submit') }));

    expect(await screen.findByText(t('access.invalid'))).toBeInTheDocument();
    expect(useAppStore.getState().identity).toBeNull();
  });
});
