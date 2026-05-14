import { type ReactNode } from 'react';

export function SidebarContent({ children, className }: { children: ReactNode; className?: string }) {
  return <nav className={`sidebar__content ${className || ''}`}>{children}</nav>;
}
