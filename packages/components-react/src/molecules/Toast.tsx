import { type ReactNode, useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Icons ---- */

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const variantIcons: Record<string, () => ReactNode> = {
  success: () => <IconCheck />,
  error: () => <IconX />,
  warning: () => <IconAlertTriangle />,
  info: () => <IconInfo />,
};

/* ---- Store ---- */

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

type ToastData = {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
};

type ToastState = {
  toasts: ToastData[];
};

let state: ToastState = { toasts: [] };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

let nextId = 0;

function addToast(data: Omit<ToastData, 'id'>) {
  const id = String(++nextId);
  state = { toasts: [...state.toasts, { ...data, id }] };
  emit();
  return id;
}

function removeToast(id: string) {
  state = { toasts: state.toasts.filter((t) => t.id !== id) };
  emit();
}

/* ---- Imperative API ---- */

type ToastOptions = {
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
};

export function toast(title: string, options?: ToastOptions) {
  return addToast({ variant: 'default', title, ...options });
}

toast.success = (title: string, options?: ToastOptions) =>
  addToast({ variant: 'success', title, ...options });

toast.error = (title: string, options?: ToastOptions) =>
  addToast({ variant: 'error', title, ...options });

toast.warning = (title: string, options?: ToastOptions) =>
  addToast({ variant: 'warning', title, ...options });

toast.info = (title: string, options?: ToastOptions) =>
  addToast({ variant: 'info', title, ...options });

/* ---- Single Toast ---- */

function ToastItem({ data, onRemove }: { data: ToastData; onRemove: (id: string) => void }) {
  const [exiting, setExiting] = useState(false);
  const duration = data.duration ?? 4000;

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onRemove(data.id), 200);
  }, [data.id, onRemove]);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  const icon = variantIcons[data.variant];

  return (
    <div
      className={cn(
        'toast',
        data.variant !== 'default' && `toast--${data.variant}`,
        exiting && 'toast--exiting',
      )}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <span className="toast__icon">{icon()}</span>
      )}
      <div className="toast__content">
        <div className="toast__title">{data.title}</div>
        {data.description && (
          <div className="toast__description">{data.description}</div>
        )}
        {data.action && (
          <Button
            variant="primary"
            size="xs"
            className="toast__action"
            onClick={() => {
              data.action!.onClick();
              dismiss();
            }}
          >
            {data.action.label}
          </Button>
        )}
      </div>
      <IconButton
        variant="tertiary"
        size="xs"
        className="toast__close"
        icon={<IconX />}
        aria-label="Close"
        onClick={dismiss}
      />
    </div>
  );
}

/* ---- Toaster Container ---- */

export type ToasterProps = {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  className?: string;
};

export function Toaster({ position = 'bottom-right', className }: ToasterProps) {
  const { toasts } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const handleRemove = useCallback((id: string) => {
    removeToast(id);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className={cn('toaster', `toaster--${position}`, className)}>
      {toasts.map((t) => (
        <ToastItem key={t.id} data={t} onRemove={handleRemove} />
      ))}
    </div>
  );
}
