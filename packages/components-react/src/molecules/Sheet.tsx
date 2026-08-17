import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from 'react';
import { IconButton } from '../atoms/IconButton';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// Debe coincidir con la animacion de salida de sheet--exiting en el CSS.
const EXIT_DURATION_MS = 200;

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ---- Context ---- */

type SheetContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error('Sheet components must be used within <Sheet>');
  return ctx;
}

/* ---- Root ---- */

export type SheetProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function Sheet({ open: controlledOpen, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      onOpenChange ? onOpenChange(v) : setInternalOpen(v);
    },
    [onOpenChange],
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

/* ---- Trigger ---- */

export function SheetTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const { setOpen } = useSheet();
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

export type SheetContentProps = {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
  children: ReactNode;
  className?: string;
};

export function SheetContent({
  side = 'right',
  showCloseButton = true,
  children,
  className,
}: SheetContentProps) {
  const { open, setOpen } = useSheet();
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // `open` es lo unico que decide si el sheet esta abierto. Si el consumidor lo
  // controla y veta el cierre, el contenido tiene que quedarse: desmontar desde
  // aqui lo dejaba cerrado para siempre, porque `open` ya nunca vuelve a cambiar.
  // `mounted` solo estira la vida en el DOM lo que dura la animacion de salida.
  useEffect(() => {
    if (open) {
      setMounted(true);
      setExiting(false);
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

  useEffect(() => {
    if (!mounted) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mounted, handleClose]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mounted]);

  // Al abrir, el foco entra al sheet; al cerrar vuelve a quien lo abrio, que es
  // donde estaba el usuario antes de la interrupcion.
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

  if (!mounted) return null;

  return (
    <>
      <div
        className={cn('dialog__overlay', exiting && 'dialog__overlay--exiting')}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn('sheet', `sheet--${side}`, exiting && 'sheet--exiting', className)}
      >
        {children}
        {showCloseButton && (
          <IconButton
            variant="tertiary"
            size="xs"
            className="sheet__close"
            icon={<CloseIcon />}
            aria-label="Close"
            onClick={handleClose}
          />
        )}
      </div>
    </>
  );
}

/* ---- Header ---- */

export function SheetHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('sheet__header', className)}>{children}</div>;
}

/* ---- Title ---- */

export function SheetTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('sheet__title', className)}>{children}</h2>;
}

/* ---- Description ---- */

export function SheetDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('sheet__description', className)}>{children}</p>;
}

/* ---- Body ---- */

export function SheetBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('sheet__body', className)}>{children}</div>;
}

/* ---- Footer ---- */

export function SheetFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('sheet__footer', className)}>{children}</div>;
}
