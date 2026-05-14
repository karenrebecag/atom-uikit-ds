import { type ReactNode } from 'react';
import { useSidebar } from './SidebarContext';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export type SidebarProps = {
  side?: 'left' | 'right';
  children: ReactNode;
  className?: string;
};

export function Sidebar({ side = 'left', children, className }: SidebarProps) {
  const { collapsed } = useSidebar();
  return (
    <aside
      data-sidebar=""
      className={cn(
        'sidebar',
        collapsed && 'sidebar--collapsed',
        side === 'right' && 'sidebar--right',
        className,
      )}
    >
      {children}
    </aside>
  );
}
