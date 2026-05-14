import { forwardRef, type InputHTMLAttributes } from 'react';

export type RadioProps = {
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked = false,
      disabled = false,
      error = false,
      label,
      className,
      onChange,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'radio',
      disabled && 'radio--disabled',
      error && 'radio--error',
      className,
    );

    return (
      <label className={classes}>
        <input
          ref={ref}
          type="radio"
          className="radio__input"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          {...props}
        />
        <span className="radio__circle">
          <span className="radio__dot" />
        </span>
        {label && <span className="radio__label">{label}</span>}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
