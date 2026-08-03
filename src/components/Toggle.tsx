import { useId } from 'react';

/**
 * Toggle nach design-system.md Kapitel 12.12.
 * Nutzt `status-success` als Zustandsfarbe fuer einen rein technischen
 * Ein-/Aus-Zustand (Einstellung aktiv). Das bewertet keinen Gesundheits-,
 * Blutdruck- oder Trainingszustand (CLAUDE.md B.8).
 */
export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Zusatztext, der den Zustand auch ohne Farbe benennt (Kapitel 13). */
  stateLabel: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  stateLabel,
}: ToggleProps) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-frog">
      <div className="flex flex-col gap-ant">
        <span className="body-m" id={id}>
          {label}
        </span>
        {description ? <span className="body-s text-secondary">{description}</span> : null}
        <span className="helper-m text-secondary">{stateLabel}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        disabled={disabled}
        className="u-toggle u-focus-ring"
        onClick={() => onChange(!checked)}
      >
        <span className="u-toggle__knob" />
      </button>
    </div>
  );
}
