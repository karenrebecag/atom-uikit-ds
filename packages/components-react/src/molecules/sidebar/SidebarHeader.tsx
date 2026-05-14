import { type ReactNode } from 'react';

export function SidebarHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`sidebar__header ${className || ''}`}>{children}</div>;
}
