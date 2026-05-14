import { forwardRef, type InputHTMLAttributes } from 'react';

export type ToggleProps = {
  checked?: boolean;
  disabled?: boolean;
  animated?: boolean;
  label?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked = false,
      disabled = false,
      animated = false,
      label,
      className,
      onChange,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'toggle',
      disabled && 'toggle--disabled',
      animated && 'toggle--animated',
      className,
    );

    return (
      <label className={classes}>
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className="toggle__input"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          {...props}
        />
        <span className="toggle__track">
          <span className="toggle__thumb" />
        </span>
        {label && <span className="toggle__label">{label}</span>}
      </label>
    );
  },
);

Toggle.displayName = 'Toggle';
