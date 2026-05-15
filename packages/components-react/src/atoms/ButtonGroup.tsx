import { type ReactNode } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Group ---- */

export type ButtonGroupProps = {
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
  className?: string;
};

export function ButtonGroup({ orientation = 'horizontal', children, className }: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn('button-group', orientation === 'vertical' && 'button-group--vertical', className)}
    >
      {children}
    </div>
  );
}

/* ---- Separator ---- */

export function ButtonGroupSeparator({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('button-group__separator', className)} />;
}

/* ---- Text ---- */

export function ButtonGroupText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('button-group__text', className)}>{children}</span>;
}
