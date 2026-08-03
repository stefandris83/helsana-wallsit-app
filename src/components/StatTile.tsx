import type { ReactNode } from 'react';
import type { IconName } from './Icon';
import { Icon } from './Icon';

/** Kennzahl-Kachel fuer Fortschritt und Dashboard. Ohne bewertende Farbe. */
export interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: IconName;
}

export function StatTile({ label, value, hint, icon }: StatTileProps) {
  return (
    <div className="u-card flex flex-col gap-bee">
      <div className="flex items-center gap-snail text-secondary">
        {icon ? <Icon name={icon} size={16} /> : null}
        <span className="helper-m">{label}</span>
      </div>
      <p className="h4">{value}</p>
      {hint ? <p className="helper-m text-secondary">{hint}</p> : null}
    </div>
  );
}

export interface BadgeProps {
  children: ReactNode;
  icon?: IconName;
}

/** Neutrale Kennzeichnung, z. B. «Demodaten» oder «Entwurf». */
export function Badge({ children, icon }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-bee rounded-full bg-background-medium-neutral px-frog py-ant helper-m text-primary">
      {icon ? <Icon name={icon} size={16} /> : null}
      {children}
    </span>
  );
}
