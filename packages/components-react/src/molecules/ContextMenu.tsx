import {
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Context ---- */

type ContextMenuContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  position: { x: number; y: number };
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenu() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error('ContextMenu components must be used within <ContextMenu>');
  return ctx;
}

/* ---- Root ---- */

export type ContextMenuProps = {
  children: ReactNode;
  className?: string;
};

export function ContextMenu({ children, className }: ContextMenuProps) {
  const [open, setOpenRaw] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rootRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback((v: boolean) => {
    setOpenRaw(v);
  }, []);

  const handleContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  return (
    <ContextMenuContext.Provider value={{ open, setOpen, position }}>
      <div ref={rootRef} className={className} onContextMenu={handleContextMenu}>
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
}

/* ---- Trigger (zone that receives right-click) ---- */

export function ContextMenuTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('context-menu__trigger', className)}>{children}</div>;
}

/* ---- Content ---- */

export function ContextMenuContent({ children, className }: { children: ReactNode; className?: string }) {
  const { open, position } = useContextMenu();
  if (!open) return null;

  return (
    <div
      role="menu"
      className={cn('context-menu__content', className)}
      style={{ top: position.y, left: position.x }}
    >
      {children}
    </div>
  );
}

/* ---- Item (reuses dropdown-menu styling) ---- */

export type ContextMenuItemProps = {
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  onSelect?: () => void;
  children: ReactNode;
  className?: string;
};

export function ContextMenuItem({
  variant = 'default',
  disabled = false,
  onSelect,
  children,
  className,
}: ContextMenuItemProps) {
  const { setOpen } = useContextMenu();

  const handleClick = () => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      className={cn(
        'dropdown-menu__item',
        variant === 'destructive' && 'dropdown-menu__item--destructive',
        disabled && 'dropdown-menu__item--disabled',
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

/* ---- Label ---- */

export function ContextMenuLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('dropdown-menu__label', className)}>{children}</div>;
}

/* ---- Shortcut ---- */

export function ContextMenuShortcut({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('dropdown-menu__shortcut', className)}>{children}</span>;
}

/* ---- Separator ---- */

export function ContextMenuSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cn('dropdown-menu__separator', className)} />;
}
