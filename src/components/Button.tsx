import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconName } from './Icon';
import { Icon } from './Icon';

/**
 * Button nach design-system.md Kapitel 12.4.
 * Genau eine Primary Action pro Screen (§6, Kapitel 12.4 «Verwendung»).
 */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'large' | 'small';
  onColoredBg?: boolean;
  block?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'large',
  onColoredBg = false,
  block = false,
  iconLeft,
  iconRight,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    'u-btn',
    'u-focus-ring',
    variant === 'primary' ? 'u-btn--primary' : 'u-btn--secondary',
    size === 'small' ? 'u-btn--small' : '',
    onColoredBg ? 'u-btn--on-colored' : '',
    block ? 'u-btn--block' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'small' ? 16 : 24;

  return (
    <button type={type} className={classes} {...rest}>
      {iconLeft ? <Icon name={iconLeft} size={iconSize} /> : null}
      <span>{children}</span>
      {iconRight ? <Icon name={iconRight} size={iconSize} /> : null}
    </button>
  );
}
