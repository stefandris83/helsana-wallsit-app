import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconName } from './Icon';
import { Icon } from './Icon';

/** Action-Link nach design-system.md Kapitel 12.6. Tertiaere Aktion. */
export interface ActionLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconLeft?: IconName;
  iconRight?: IconName;
  children: ReactNode;
}

export function ActionLink({
  iconLeft,
  iconRight,
  children,
  className,
  type = 'button',
  ...rest
}: ActionLinkProps) {
  return (
    <button
      type={type}
      className={['u-link', 'u-focus-ring', className ?? ''].filter(Boolean).join(' ')}
      {...rest}
    >
      {iconLeft ? <Icon name={iconLeft} size={24} /> : null}
      <span>{children}</span>
      {iconRight ? <Icon name={iconRight} size={24} /> : null}
    </button>
  );
}
