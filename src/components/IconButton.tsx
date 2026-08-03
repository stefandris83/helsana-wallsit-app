import type { ButtonHTMLAttributes } from 'react';
import type { IconName } from './Icon';
import { Icon } from './Icon';

/** Icon Button nach design-system.md Kapitel 12.5. Hit-Area exakt 44 px. */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Pflichtbeschriftung fuer Screenreader. Kommt aus der Content-Registry. */
  label: string;
}

export function IconButton({ icon, label, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={['u-icon-btn', 'u-focus-ring', className ?? ''].filter(Boolean).join(' ')}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon name={icon} size={24} />
    </button>
  );
}
