import { type ReactNode } from 'react';

export function SidebarGroup({ label, children, className }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`sidebar__group ${className || ''}`}>
      {label && <span className="sidebar__group-label">{label}</span>}
      {children}
    </div>
  );
}
