import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive'
  | 'destructive-secondary'
  | 'destructive-tertiary';

type ButtonSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  animated?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const Spinner = () => (
  <svg className="button__spinner-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.75s" repeatCount="indefinite" />
    </path>
  </svg>
);

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'default',
      disabled = false,
      loading = false,
      animated = false,
      iconLeft,
      iconRight,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'button',
      `button--${variant}`,
      `button--${size}`,
      disabled && 'button--disabled',
      loading && 'button--loading',
      className,
    );

    const animateAttrs = animated
      ? { 'data-button-animate': '' }
      : {};

    const content = (
      <>
        {iconLeft && (
          <span className="button__icon" {...(animated ? { 'data-button-icon': '' } : {})}>
            {iconLeft}
          </span>
        )}
        <span className="button__label" {...(animated ? { 'data-button-text': '' } : {})}>
          {children}
        </span>
        {iconRight && (
          <span className="button__icon" {...(animated ? { 'data-button-icon': '' } : {})}>
            {iconRight}
          </span>
        )}
        {loading && (
          <span className="button__spinner">
            <Spinner />
          </span>
        )}
      </>
    );

    if ('href' in props && props.href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          aria-disabled={disabled || loading}
          {...animateAttrs}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        {...animateAttrs}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
