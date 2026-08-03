import type { HTMLAttributes, ReactNode } from 'react';

/** Card mit Radius 4 px (design-system.md Kapitel 1, Regel 4). */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  children: ReactNode;
}

export function Card({ elevated = false, children, className, ...rest }: CardProps) {
  return (
    <div
      className={['u-card', elevated ? 'u-card--elevated' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

