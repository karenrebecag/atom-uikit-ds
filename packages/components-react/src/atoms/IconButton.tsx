import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type IconButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive-primary'
  | 'destructive-secondary'
  | 'destructive-tertiary';

type IconButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export type IconButtonProps = {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  loading?: boolean;
  animated?: boolean;
  icon: ReactNode;
  'aria-label': string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const Spinner = () => (
  <svg className="button__spinner-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'primary',
      size = 'm',
      disabled = false,
      loading = false,
      animated = false,
      icon,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'icon-button',
      `icon-button--${variant}`,
      `icon-button--${size}`,
      disabled && 'icon-button--disabled',
      loading && 'icon-button--loading',
      className,
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        {...(animated ? { 'data-icon-button-animate': '' } : {})}
        {...props}
      >
        <span className="icon-button__icon">{icon}</span>
        {loading && (
          <span className="icon-button__spinner">
            <Spinner />
          </span>
        )}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
