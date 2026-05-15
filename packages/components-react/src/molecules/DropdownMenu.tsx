import {
  type ReactNode,
  type KeyboardEvent,
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

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error('DropdownMenu components must be used within <DropdownMenu>');
  return ctx;
}

/* ---- Root ---- */

export type DropdownMenuProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

export function DropdownMenu({
  open: controlledOpen,
  onOpenChange,
  children,
  className,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      onOpenChange ? onOpenChange(v) : setInternalOpen(v);
    },
    [onOpenChange],
  );

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
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={rootRef} className={cn('dropdown-menu', className)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

/* ---- Trigger ---- */

export function DropdownMenuTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useDropdownMenu();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-haspopup="menu"
      className={cn('dropdown-menu__trigger', className)}
      onClick={() => setOpen(!open)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

/* ---- Content ---- */

export type DropdownMenuContentProps = {
  side?: 'top' | 'bottom';
  align?: 'start' | 'end';
  children: ReactNode;
  className?: string;
};

export function DropdownMenuContent({
  side = 'bottom',
  align = 'start',
  children,
  className,
}: DropdownMenuContentProps) {
  const { open } = useDropdownMenu();
  if (!open) return null;

  return (
    <div
      role="menu"
      className={cn(
        'dropdown-menu__content',
        `dropdown-menu__content--${side}`,
        `dropdown-menu__content--align-${align}`,
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---- Label ---- */

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('dropdown-menu__label', className)}>{children}</div>;
}

/* ---- Group ---- */

export function DropdownMenuGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div role="group" className={className}>{children}</div>;
}

/* ---- Item ---- */

export type DropdownMenuItemProps = {
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  onSelect?: () => void;
  children: ReactNode;
  className?: string;
};

export function DropdownMenuItem({
  variant = 'default',
  disabled = false,
  onSelect,
  children,
  className,
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu();

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

/* ---- Shortcut ---- */

export function DropdownMenuShortcut({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn('dropdown-menu__shortcut', className)}>{children}</span>;
}

/* ---- Separator ---- */

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cn('dropdown-menu__separator', className)} />;
}
