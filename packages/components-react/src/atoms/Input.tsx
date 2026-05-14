import { forwardRef, type InputHTMLAttributes } from 'react';

export type InputProps = {
  error?: boolean;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, className, ...props }, ref) => {
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
