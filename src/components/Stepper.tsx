import { Icon } from './Icon';

/** Stepper nach design-system.md Kapitel 12.18. */
export interface StepperProps {
  /** 1-basierter aktueller Schritt. */
  current: number;
  total: number;
  label: string;
}

export function Stepper({ current, total, label }: StepperProps) {
  const steps = Array.from({ length: total }, (_, index) => index + 1);
  return (
    <div className="flex flex-col gap-snail">
      <p className="helper-m text-secondary">{label}</p>
      <ol className="u-stepper list-none p-none m-none" aria-hidden="true">
        {steps.map((step, index) => (
          <li key={step} className="flex flex-1 items-center gap-bee">
            <span
              className={[
                'u-stepper__circle',
                step === current ? 'u-stepper__circle--current' : '',
                step < current ? 'u-stepper__circle--done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {step < current ? <Icon name="checkmark" size={16} /> : step}
            </span>
            {index < steps.length - 1 ? (
              <span
                className={[
                  'u-stepper__connector',
                  step < current ? 'u-stepper__connector--done' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
