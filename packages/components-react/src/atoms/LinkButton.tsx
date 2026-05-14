import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';

type LinkButtonSize = 's' | 'l';

export type LinkButtonProps = {
  size?: LinkButtonSize;
  disabled?: boolean;
  loading?: boolean;
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
      size = 's',
      disabled = false,
      loading = false,
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

    return (
      <a
        ref={ref}
        className={classes}
        aria-disabled={disabled || loading}
        {...props}
      >
        {!loading && iconLeft && <span className="link-button__icon">{iconLeft}</span>}
        <span className="link-button__label">{loading ? 'Loading...' : children}</span>
        {!loading && iconRight && <span className="link-button__icon">{iconRight}</span>}
      </a>
    );
  },
);

LinkButton.displayName = 'LinkButton';
