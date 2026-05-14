import { forwardRef, type AnchorHTMLAttributes } from 'react';

type NavLinkSize = 'sm' | 'default' | 'lg';

export type NavLinkProps = {
  size?: NavLinkSize;
  active?: boolean;
  disabled?: boolean;
  children: string;
  href: string;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      size = 'default',
      active = false,
      disabled = false,
      children,
      href,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'nav-link',
      `nav-link--${size}`,
      active && 'nav-link--active',
      disabled && 'nav-link--disabled',
      className,
    );

    return (
      <a
        ref={ref}
        className={classes}
        href={href}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        {...props}
      >
        <span className="nav-link__text">{children}</span>
      </a>
    );
  },
);

NavLink.displayName = 'NavLink';
