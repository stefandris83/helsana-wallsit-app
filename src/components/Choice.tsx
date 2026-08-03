import { useId } from 'react';
import { Icon } from './Icon';

/**
 * Checkbox und Radio Button nach design-system.md Kapitel 12.10 und 12.11
 * sowie die Auswahlkarte aus Kapitel 12.22 (Checkbox-Box).
 *
 * Es gibt keine vorausgewaehlten Checkboxen (spec.md §9).
 */

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, hint, error, disabled }: CheckboxProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-bee">
      <label
        className={['u-choice', disabled ? 'u-choice--disabled' : ''].filter(Boolean).join(' ')}
        htmlFor={id}
      >
        <input
          id={id}
          type="checkbox"
          className="u-visually-hidden"
          checked={checked}
          disabled={disabled}
          aria-describedby={hint ? `${id}-hint` : undefined}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span
          aria-hidden="true"
          className={[
            'u-choice__box',
            'u-focus-ring',
            checked ? 'u-choice__box--checked' : '',
            error ? 'u-choice__box--error' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {checked ? <Icon name="checkmark" size={16} /> : null}
        </span>
        <span className="u-choice__label">{label}</span>
      </label>
      {hint ? (
        <p className="helper-m text-secondary" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="u-input-error" role="alert">
          <Icon name="alert-circle" size={16} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export interface RadioGroupProps<T extends string> {
  legend: string;
  options: ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  hint?: string;
  error?: string;
  /** Als Auswahlkarten darstellen (grosse Touch-Targets, mobile-first). */
  asCards?: boolean;
  legendClassName?: string;
}

export function RadioGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  hint,
  error,
  asCards = true,
  legendClassName = 'h5',
}: RadioGroupProps<T>) {
  const name = useId();
  /*
   * Bewusst `role="radiogroup"` statt `fieldset`/`legend`: Ein `legend` wird von
   * Browsern ausserhalb des Flusses gerendert, wodurch der Abstand zwischen
   * Frage und erster Antwortoption nicht zuverlaessig steuerbar ist. Der
   * zugaengliche Name kommt ueber `aria-labelledby`.
   */
  return (
    <div
      role="radiogroup"
      aria-labelledby={`${name}-legend`}
      aria-describedby={hint ? `${name}-hint` : undefined}
      className="flex flex-col gap-rat"
    >
      <div className="flex flex-col gap-bee">
        <p className={legendClassName} id={`${name}-legend`}>
          {legend}
        </p>
        {hint ? (
          <p className="body-s text-secondary" id={`${name}-hint`}>
            {hint}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-snail">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={
                asCards
                  ? ['u-choice-card', 'u-focus-ring', selected ? 'u-choice-card--selected' : '']
                      .filter(Boolean)
                      .join(' ')
                  : 'u-choice'
              }
            >
              <input
                id={id}
                type="radio"
                name={name}
                className="u-visually-hidden"
                checked={selected}
                value={option.value}
                onChange={() => onChange(option.value)}
              />
              <span
                aria-hidden="true"
                className={[
                  'u-choice__box',
                  'u-choice__box--round',
                  selected ? 'u-choice__box--checked' : '',
                  error ? 'u-choice__box--error' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {selected ? <span className="u-choice__dot" /> : null}
              </span>
              <span className="flex flex-col gap-ant">
                <span className="u-choice__label">{option.label}</span>
                {option.description ? (
                  <span className="body-s text-secondary">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="u-input-error" role="alert">
          <Icon name="alert-circle" size={16} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export interface CheckboxGroupProps<T extends string> {
  legend: string;
  options: ChoiceOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  hint?: string;
  error?: string;
  maxSelected?: number;
}

export function CheckboxGroup<T extends string>({
  legend,
  options,
  values,
  onChange,
  hint,
  error,
  maxSelected,
}: CheckboxGroupProps<T>) {
  const name = useId();
  const toggle = (value: T) => {
    if (values.includes(value)) {
      onChange(values.filter((entry) => entry !== value));
      return;
    }
    if (maxSelected !== undefined && values.length >= maxSelected) {
      onChange([...values.slice(1), value]);
      return;
    }
    onChange([...values, value]);
  };

  return (
    <div
      role="group"
      aria-labelledby={`${name}-legend`}
      aria-describedby={hint ? `${name}-hint` : undefined}
      className="flex flex-col gap-rat"
    >
      <div className="flex flex-col gap-bee">
        <p className="h5" id={`${name}-legend`}>
          {legend}
        </p>
        {hint ? (
          <p className="body-s text-secondary" id={`${name}-hint`}>
            {hint}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-snail">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const selected = values.includes(option.value);
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={['u-choice-card', 'u-focus-ring', selected ? 'u-choice-card--selected' : '']
                .filter(Boolean)
                .join(' ')}
            >
              <input
                id={id}
                type="checkbox"
                className="u-visually-hidden"
                checked={selected}
                onChange={() => toggle(option.value)}
              />
              <span
                aria-hidden="true"
                className={['u-choice__box', selected ? 'u-choice__box--checked' : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                {selected ? <Icon name="checkmark" size={16} /> : null}
              </span>
              <span className="u-choice__label">{option.label}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="u-input-error" role="alert">
          <Icon name="alert-circle" size={16} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
