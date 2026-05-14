import { useSidebar } from './SidebarContext';

const CircleChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M9.25 5.5L6.75 8l2.5 2.5" />
  </svg>
);

const CircleChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M6.75 5.5L9.25 8l-2.5 2.5" />
  </svg>
);

export function SidebarTrigger({ className }: { className?: string }) {
  const { collapsed, toggle } = useSidebar();

  return (
    <button
      type="button"
      data-sidebar-trigger=""
      className={`sidebar__trigger ${className || ''}`}
      onClick={toggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {collapsed ? <CircleChevronRight /> : <CircleChevronLeft />}
    </button>
  );
}
