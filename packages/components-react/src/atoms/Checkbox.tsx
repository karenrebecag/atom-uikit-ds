import { forwardRef, useRef, useEffect, type InputHTMLAttributes } from 'react';

export type CheckboxProps = {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6L5 8.5L9.5 3.5" />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2.5 6H9.5" />
  </svg>
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      disabled = false,
      error = false,
      label,
      className,
      onChange,
      ...props
    },
    forwardedRef,
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLInputElement>) || innerRef;

    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const classes = cn(
      'checkbox',
      disabled && 'checkbox--disabled',
      error && 'checkbox--error',
      className,
    );

    return (
      <label className={classes}>
        <input
          ref={ref}
          type="checkbox"
          className="checkbox__input"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          {...(indeterminate ? { 'data-indeterminate': '' } : {})}
          {...props}
        />
        <span className="checkbox__box">
          <span className="checkbox__icon checkbox__icon--check">
            <CheckIcon />
          </span>
          <span className="checkbox__icon checkbox__icon--minus">
            <MinusIcon />
          </span>
        </span>
        {label && <span className="checkbox__label">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
