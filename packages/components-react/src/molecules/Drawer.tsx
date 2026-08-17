import {
  type ReactNode,
  type TouchEvent,
  type MouseEvent as ReactMouseEvent,
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Context ---- */

type DrawerContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('Drawer components must be used within <Drawer>');
  return ctx;
}

/* ---- Root ---- */

export type DrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function Drawer({ open: controlledOpen, onOpenChange, children }: DrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (v: boolean) => { onOpenChange ? onOpenChange(v) : setInternalOpen(v); },
    [onOpenChange],
  );

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

/* ---- Trigger ---- */

export function DrawerTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const { setOpen } = useDrawer();
  return (
    <div
      role="button"
      tabIndex={0}
      className={className}
      style={{ display: 'inline-flex' }}
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); }
      }}
    >
      {children}
    </div>
  );
}

/* ---- Content ---- */

export type DrawerContentProps = {
  direction?: 'top' | 'right' | 'bottom' | 'left';
  children: ReactNode;
  className?: string;
};

const DISMISS_THRESHOLD = 100;

// Debe coincidir con la animacion de salida de drawer--exiting en el CSS.
const EXIT_DURATION_MS = 200;

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function DrawerContent({ direction = 'bottom', children, className }: DrawerContentProps) {
  const { open, setOpen } = useDrawer();
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startPos = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // `open` es lo unico que decide si el drawer esta abierto. Si el consumidor lo
  // controla y veta el cierre, el contenido tiene que quedarse: desmontar desde
  // aqui lo dejaba cerrado para siempre, porque `open` ya nunca vuelve a cambiar.
  // `mounted` solo estira la vida en el DOM lo que dura la animacion de salida.
  useEffect(() => {
    if (open) {
      setMounted(true);
      setExiting(false);
      setDragOffset(0);
      return;
    }
    if (!mounted) return;
    setExiting(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setExiting(false);
    }, EXIT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [open, mounted]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // Escape
  useEffect(() => {
    if (!mounted) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mounted, handleClose]);

  // Scroll lock
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mounted]);

  // Al abrir, el foco entra al drawer; al cerrar vuelve a quien lo abrio. Antes no
  // se movia en absoluto: el foco se quedaba en el disparador, detras del overlay.
  useEffect(() => {
    if (!mounted) return;
    const opener = document.activeElement as HTMLElement | null;
    contentRef.current?.focus();
    return () => {
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [mounted]);

  // Focus trap real: con aria-modal el lector de pantalla ya ignora el fondo, pero
  // el Tab del navegador no, y sin esto el foco se escapa a la pagina de atras.
  useEffect(() => {
    if (!mounted) return;
    const node = contentRef.current;
    if (!node) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) {
        e.preventDefault();
        node.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const outside = !node.contains(active);

      if (e.shiftKey && (active === first || active === node || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mounted]);

  // Drag helpers
  const isVertical = direction === 'top' || direction === 'bottom';

  const getTranslate = () => {
    if (dragOffset === 0) return undefined;
    if (isVertical) return `translateY(${dragOffset}px)`;
    return `translateX(${dragOffset}px)`;
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    startPos.current = isVertical ? clientY : clientX;
    setDragging(true);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragging) return;
    const current = isVertical ? clientY : clientX;
    let delta = current - startPos.current;

    // Only allow dragging in dismiss direction
    if (direction === 'bottom' && delta < 0) delta = 0;
    if (direction === 'top' && delta > 0) delta = 0;
    if (direction === 'right' && delta < 0) delta = 0;
    if (direction === 'left' && delta > 0) delta = 0;

    setDragOffset(delta);
  };

  const handleDragEnd = () => {
    setDragging(false);
    if (Math.abs(dragOffset) > DISMISS_THRESHOLD) {
      handleClose();
    } else {
      setDragOffset(0);
    }
  };

  // Touch events
  const onTouchStart = (e: TouchEvent) => {
    handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchMove = (e: TouchEvent) => {
    handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchEnd = () => handleDragEnd();

  // Mouse events (for desktop testing)
  const onMouseDown = (e: ReactMouseEvent) => {
    handleDragStart(e.clientX, e.clientY);
    const onMove = (ev: MouseEvent) => handleDragMove(ev.clientX, ev.clientY);
    const onUp = () => { handleDragEnd(); document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  if (!mounted) return null;

  return (
    <>
      <div
        className={cn('dialog__overlay', exiting && 'dialog__overlay--exiting')}
        style={{ opacity: dragOffset ? 1 - Math.abs(dragOffset) / 300 : undefined }}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          'drawer',
          `drawer--${direction}`,
          exiting && 'drawer--exiting',
          dragging && 'drawer--dragging',
          className,
        )}
        style={{ transform: getTranslate() }}
      >
        <div
          className="drawer__handle"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
        />
        {children}
      </div>
    </>
  );
}

/* ---- Header ---- */

export function DrawerHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('drawer__header', className)}>{children}</div>;
}

/* ---- Title ---- */

export function DrawerTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('drawer__title', className)}>{children}</h2>;
}

/* ---- Description ---- */

export function DrawerDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('drawer__description', className)}>{children}</p>;
}

/* ---- Body ---- */

export function DrawerBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('drawer__body', className)}>{children}</div>;
}

/* ---- Footer ---- */

export function DrawerFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('drawer__footer', className)}>{children}</div>;
}
