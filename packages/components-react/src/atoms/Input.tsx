import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export type InputProps = {
  error?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, iconLeft, iconRight, className, ...props }, ref) => {
    const hasIcons = iconLeft || iconRight;

    if (hasIcons) {
      return (
        <div
          className={cn(
            'input-group',
            error && 'input-group--error',
            props.disabled && 'input-group--disabled',
            className,
          )}
        >
          {iconLeft && <span className="input-group__icon">{iconLeft}</span>}
          <input
            ref={ref}
            className="input-group__input"
            aria-invalid={error || undefined}
            {...props}
          />
          {iconRight && <span className="input-group__icon">{iconRight}</span>}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn('input', className)}
        aria-invalid={error || undefined}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
