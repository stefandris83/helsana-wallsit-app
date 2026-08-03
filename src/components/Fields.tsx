import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useId } from 'react';
import { Icon } from './Icon';

/**
 * Formularfelder nach design-system.md Kapitel 12.7–12.9.
 * Platform = App: Label steht als eigene Zeile ueber dem Feld (mobile-first).
 */

interface FieldFrameProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

function FieldFrame({ id, label, hint, error, children }: FieldFrameProps) {
  return (
    <div className="u-field">
      <label className="u-field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint ? (
        <p className="helper-m text-secondary" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="u-input-error" id={`${id}-error`} role="alert">
          <Icon name="alert-circle" size={16} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const parts = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : undefined;
}

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({ label, hint, error, className, ...rest }: TextFieldProps) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        className={['u-input', className ?? ''].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldFrame>
  );
}

export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function SelectField({
  label,
  hint,
  error,
  options,
  className,
  ...rest
}: SelectFieldProps) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        className={['u-input', 'u-select', className ?? ''].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldFrame>
  );
}

export interface TextAreaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextAreaField({ label, hint, error, className, ...rest }: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        rows={3}
        className={['u-input', 'u-textarea', className ?? ''].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldFrame>
  );
}
