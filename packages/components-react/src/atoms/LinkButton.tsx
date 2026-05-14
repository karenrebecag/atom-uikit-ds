import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';

type LinkButtonSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';

export type LinkButtonProps = {
  size?: LinkButtonSize;
  disabled?: boolean;
  loading?: boolean;
  animated?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
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
      'link-button',
      `link-button--${size}`,
      disabled && 'link-button--disabled',
      loading && 'link-button--loading',
      className,
    );

    const animateAttrs = animated
      ? { 'data-link-button-animate': '' }
      : {};

    const label = animated && !loading ? (
      <span className="link-button__label">
        <span className="button__label-inner">
          <span className="button__text is--default" data-button-text="">{children}</span>
          <span className="button__text is--hover" data-button-text="" aria-hidden="true">{children}</span>
        </span>
      </span>
    ) : (
      <span className="link-button__label">{loading ? 'Loading...' : children}</span>
    );

    return (
      <a
        ref={ref}
        className={classes}
        aria-disabled={disabled || loading}
        {...animateAttrs}
        {...props}
      >
        {!loading && iconLeft && <span className="link-button__icon">{iconLeft}</span>}
        {label}
        {!loading && iconRight && <span className="link-button__icon">{iconRight}</span>}
      </a>
    );
  },
);

LinkButton.displayName = 'LinkButton';
