import { type ReactNode } from 'react';

export type FieldProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Field({
  label,
  description,
  error,
  required = false,
  disabled = false,
  htmlFor,
  children,
  className,
}: FieldProps) {
  return (
    <div
      className={cn('field', disabled && 'field--disabled', className)}
      role="group"
      {...(error ? { 'data-invalid': '' } : {})}
    >
      {label && (
        <label
          className={cn('field__label', required && 'field__label--required')}
          htmlFor={htmlFor}
        >
          {label}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="field__description">{description}</p>
      )}
      {error && (
        <p className="field__error" role="alert">{error}</p>
      )}
    </div>
  );
}
