import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from 'react';
import { Button } from '../atoms/Button';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Context ---- */

type AlertDialogContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialog() {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) throw new Error('AlertDialog components must be used within <AlertDialog>');
  return ctx;
}

/* ---- Root ---- */

export type AlertDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function AlertDialog({ open: controlledOpen, onOpenChange, children }: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      onOpenChange ? onOpenChange(v) : setInternalOpen(v);
    },
    [onOpenChange],
  );

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

/* ---- Trigger ---- */

export function AlertDialogTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const { setOpen } = useAlertDialog();
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

export type AlertDialogContentProps = {
  size?: 'default' | 'sm';
  children: ReactNode;
  className?: string;
};

export function AlertDialogContent({ size = 'default', children, className }: AlertDialogContentProps) {
  const { open, setOpen } = useAlertDialog();
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setExiting(false);
    }
  }, [open]);

  // Escape triggers cancel (closes)
  useEffect(() => {
    if (!mounted) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExiting(true);
        setTimeout(() => { setOpen(false); setMounted(false); }, 200);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mounted, setOpen]);

  // Scroll lock
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mounted]);

  // Focus
  useEffect(() => {
    if (mounted && contentRef.current) contentRef.current.focus();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div className={cn('dialog__overlay', exiting && 'dialog__overlay--exiting')} aria-hidden="true" />
      <div
        ref={contentRef}
        role="alertdialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn('alert-dialog', size === 'sm' && 'alert-dialog--sm', exiting && 'alert-dialog--exiting', className)}
      >
        {children}
      </div>
    </>
  );
}

/* ---- Header ---- */

export function AlertDialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('alert-dialog__header', className)}>{children}</div>;
}

/* ---- Media ---- */

export type AlertDialogMediaProps = {
  variant?: 'default' | 'destructive';
  children: ReactNode;
  className?: string;
};

export function AlertDialogMedia({ variant = 'default', children, className }: AlertDialogMediaProps) {
  return (
    <div className={cn('alert-dialog__media', variant === 'destructive' && 'alert-dialog__media--destructive', className)}>
      {children}
    </div>
  );
}

/* ---- Title ---- */

export function AlertDialogTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('alert-dialog__title', className)}>{children}</h2>;
}

/* ---- Description ---- */

export function AlertDialogDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('alert-dialog__description', className)}>{children}</p>;
}

/* ---- Footer ---- */

export function AlertDialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('alert-dialog__footer', className)}>{children}</div>;
}

/* ---- Cancel ---- */

export type AlertDialogCancelProps = {
  children?: ReactNode;
  className?: string;
};

export function AlertDialogCancel({ children = 'Cancel', className }: AlertDialogCancelProps) {
  const { setOpen } = useAlertDialog();
  return (
    <Button variant="secondary" size="m" className={className} onClick={() => setOpen(false)}>
      {children}
    </Button>
  );
}

/* ---- Action ---- */

export type AlertDialogActionProps = {
  variant?: 'primary' | 'destructive-primary';
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
};

export function AlertDialogAction({
  variant = 'primary',
  onAction,
  children = 'Continue',
  className,
}: AlertDialogActionProps) {
  const { setOpen } = useAlertDialog();
  return (
    <Button
      variant={variant}
      size="m"
      className={className}
      onClick={() => {
        onAction?.();
        setOpen(false);
      }}
    >
      {children}
    </Button>
  );
}
