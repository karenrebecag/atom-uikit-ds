import { type ReactNode, type AnchorHTMLAttributes } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;

export function SidebarItem({
  icon,
  label,
  badge,
  active = false,
  disabled = false,
  className,
  ...props
}: SidebarItemProps) {
  const classes = cn(
    'sidebar__item',
    active && 'sidebar__item--active',
    disabled && 'sidebar__item--disabled',
    className,
  );

  return (
    <a data-sidebar-item="" data-tooltip={label} className={classes} aria-current={active ? 'page' : undefined} aria-disabled={disabled || undefined} {...props}>
      <span className="sidebar__item-icon">{icon}</span>
      <span className="sidebar__item-label" data-sidebar-label="">{label}</span>
      {badge && <span className="sidebar__item-badge" data-sidebar-label="">{badge}</span>}
    </a>
  );
}
