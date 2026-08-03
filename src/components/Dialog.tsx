import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';
import { Button } from './Button';

/**
 * Dialog nach design-system.md Kapitel 12.14.
 * Mobile: Buttons gestapelt, Primary oben. Tablet/Desktop: nebeneinander,
 * Secondary links, Primary rechts.
 */
export interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export function Dialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  children,
}: DialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="u-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="u-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-snail">
          <h2 className="h4" id={titleId}>
            {title}
          </h2>
          {description ? <p className="body-m text-secondary">{description}</p> : null}
          {children}
        </div>
        <div className="flex flex-col gap-snail tablet:flex-row tablet:justify-end">
          <div className="tablet:order-2">
            {/* Fokus liegt beim Oeffnen auf der primaeren Aktion (Kapitel 12.14). */}
            <Button variant="primary" block autoFocus onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
          <div className="tablet:order-1">
            <Button variant="secondary" block onClick={onCancel}>
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
