import type { ReactNode } from 'react';
import { HelsanaLogo } from '../../components/HelsanaLogo';

/** Rahmen fuer alle Onboarding-Screens: ohne Hauptnavigation, ruhig, fokussiert. */
export interface OnboardingShellProps {
  /**
   * Seitentitel ueber dem Inhalt. Entfaellt, wenn der Screen seine eigene
   * Ueberschrift mitbringt — im Willkommens-Carousel steht sie in der Karte.
   */
  title?: string;
  lead?: string;
  children: ReactNode;
  footer?: ReactNode;
  aside?: ReactNode;
}

export function OnboardingShell({ title, lead, children, footer, aside }: OnboardingShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background-device">
      <header className="u-border-bottom bg-background-card">
        <div className="container flex items-center gap-snail py-snail">
          <HelsanaLogo />
        </div>
      </header>

      <main className="container flex flex-1 flex-col gap-cat py-cat">
        {aside}
        {title || lead ? (
          <div className="flex flex-col gap-snail">
            {title ? <h1 className="h2">{title}</h1> : null}
            {lead ? <p className="lead text-secondary">{lead}</p> : null}
          </div>
        ) : null}
        {children}
      </main>

      {footer ? (
        <footer className="u-border-top sticky bottom-none bg-background-card">
          <div className="container flex flex-col gap-snail py-frog">{footer}</div>
        </footer>
      ) : null}
    </div>
  );
}
