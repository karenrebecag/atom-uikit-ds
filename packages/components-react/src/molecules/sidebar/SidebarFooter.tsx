import { type ReactNode } from 'react';

export function SidebarFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`sidebar__footer ${className || ''}`}>{children}</div>;
}
