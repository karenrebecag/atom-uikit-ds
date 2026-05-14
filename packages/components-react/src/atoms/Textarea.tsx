import { forwardRef, type TextareaHTMLAttributes } from 'react';

export type TextareaProps = {
  error?: boolean;
  className?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn('textarea', className)}
        aria-invalid={error || undefined}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
