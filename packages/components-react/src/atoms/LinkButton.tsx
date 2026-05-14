import { forwardRef, type AnchorHTMLAttributes } from 'react';

type LinkButtonSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';

export type LinkButtonProps = {
  size?: LinkButtonSize;
  disabled?: boolean;
  children: string;
  className?: string;
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      size = 'default',
      disabled = false,
      children,
      className,
      href,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'link-button',
      `link-button--${size}`,
      disabled && 'link-button--disabled',
      className,
    );

    return (
      <a
        ref={ref}
        className={classes}
        href={href}
        aria-disabled={disabled || undefined}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        <span className="link-button__text">{children}</span>
      </a>
    );
  },
);

LinkButton.displayName = 'LinkButton';
