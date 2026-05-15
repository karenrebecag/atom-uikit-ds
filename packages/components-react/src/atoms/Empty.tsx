import { type ReactNode } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Root ---- */

export type EmptyProps = {
  variant?: 'default' | 'outline' | 'filled';
  children: ReactNode;
  className?: string;
};

export function Empty({ variant = 'default', children, className }: EmptyProps) {
  return (
    <div
      className={cn(
        'empty',
        variant !== 'default' && `empty--${variant}`,
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---- Header ---- */

export function EmptyHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('empty__header', className)}>{children}</div>;
}

/* ---- Media ---- */

export type EmptyMediaProps = {
  variant?: 'default' | 'icon';
  children: ReactNode;
  className?: string;
};

export function EmptyMedia({ variant = 'default', children, className }: EmptyMediaProps) {
  return (
    <div className={cn('empty__media', variant === 'icon' && 'empty__media--icon', className)}>
      {children}
    </div>
  );
}

/* ---- Title ---- */

export function EmptyTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('empty__title', className)}>{children}</h3>;
}

/* ---- Description ---- */

export function EmptyDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('empty__description', className)}>{children}</p>;
}

/* ---- Content (actions) ---- */

export function EmptyContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('empty__content', className)}>{children}</div>;
}
