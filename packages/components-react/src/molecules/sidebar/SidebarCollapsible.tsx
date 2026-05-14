import { useState, type ReactNode } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

export type SidebarCollapsibleProps = {
  icon: ReactNode;
  label: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

export function SidebarCollapsible({
  icon,
  label,
  defaultOpen = false,
  children,
  className,
}: SidebarCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('sidebar-collapsible', open && 'sidebar-collapsible--open', className)}>
      <button
        type="button"
        className="sidebar-collapsible__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="sidebar__item-icon">{icon}</span>
        <span className="sidebar-collapsible__label" data-sidebar-label="">{label}</span>
        <span className="sidebar-collapsible__chevron" data-sidebar-chevron="">
          <ChevronDown />
        </span>
        <span className="sidebar__item-tooltip">{label}</span>
      </button>
      <div className="sidebar-collapsible__content">
        <div className="sidebar-collapsible__inner">
          {children}
        </div>
      </div>
    </div>
  );
}
