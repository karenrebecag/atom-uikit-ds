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

// Debe coincidir con la animacion de salida de dialog__content--exiting en el CSS.
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

type DialogContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('Dialog components must be used within <Dialog>');
  return ctx;
}

/* ---- Root ---- */

export type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      onOpenChange ? onOpenChange(v) : setInternalOpen(v);
    },
    [onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

/* ---- Trigger ---- */

export function DialogTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const { setOpen } = useDialog();
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

export type DialogContentProps = {
  showCloseButton?: boolean;
  children: ReactNode;
  className?: string;
};

export function DialogContent({ showCloseButton = true, children, className }: DialogContentProps) {
  const { open, setOpen } = useDialog();
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // `open` es lo unico que decide si el dialogo esta abierto. Si el consumidor lo
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

  // Escape key
  useEffect(() => {
    if (!mounted) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
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

  // Al abrir, el foco entra al dialogo; al cerrar vuelve a quien lo abrio, que es
  // donde estaba el usuario antes de la interrupcion. Sin esta vuelta, el foco cae
  // al principio del documento y quien navega con teclado pierde el sitio.
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
        className={cn('dialog__content', exiting && 'dialog__content--exiting', className)}
      >
        {children}
        {showCloseButton && (
          <IconButton
            variant="tertiary"
            size="xs"
            className="dialog__close"
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

export function DialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('dialog__header', className)}>{children}</div>;
}

/* ---- Title ---- */

export function DialogTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('dialog__title', className)}>{children}</h2>;
}

/* ---- Description ---- */

export function DialogDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('dialog__description', className)}>{children}</p>;
}

/* ---- Body ---- */

export function DialogBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('dialog__body', className)}>{children}</div>;
}

/* ---- Footer ---- */

export type DialogFooterProps = {
  sticky?: boolean;
  children: ReactNode;
  className?: string;
};

export function DialogFooter({ sticky = false, children, className }: DialogFooterProps) {
  return (
    <div className={cn('dialog__footer', sticky && 'dialog__footer--sticky', className)}>
      {children}
    </div>
  );
}
