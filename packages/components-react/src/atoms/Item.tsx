import { type ReactNode, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Item ---- */

export type ItemProps = {
  variant?: 'default' | 'outline' | 'muted';
  size?: 'default' | 'sm' | 'xs';
  href?: string;
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

export function Item({ variant = 'default', size = 'default', href, children, className, ...props }: ItemProps) {
  const classes = cn(
    'item',
    variant !== 'default' && `item--${variant}`,
    size !== 'default' && `item--${size}`,
    className,
  );

  if (href) {
    return <a href={href} className={classes} {...(props as any)}>{children}</a>;
  }

  return <div className={classes} {...props}>{children}</div>;
}

/* ---- Media ---- */

export type ItemMediaProps = {
  variant?: 'default' | 'icon' | 'image';
  children: ReactNode;
  className?: string;
};

export function ItemMedia({ variant = 'default', children, className }: ItemMediaProps) {
  return (
    <div className={cn('item__media', variant !== 'default' && `item__media--${variant}`, className)}>
      {children}
    </div>
  );
}

/* ---- Content ---- */

export function ItemContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('item__content', className)}>{children}</div>;
}

/* ---- Title ---- */

export function ItemTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('item__title', className)}>{children}</p>;
}

/* ---- Description ---- */

export function ItemDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('item__description', className)}>{children}</p>;
}

/* ---- Actions ---- */

export function ItemActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('item__actions', className)}>{children}</div>;
}

/* ---- Group ---- */

export type ItemGroupProps = {
  variant?: 'default' | 'outline';
  children: ReactNode;
  className?: string;
};

export function ItemGroup({ variant = 'default', children, className }: ItemGroupProps) {
  return (
    <div className={cn('item-group', variant === 'outline' && 'item-group--outline', className)}>
      {children}
    </div>
  );
}

/* ---- Separator ---- */

export function ItemSeparator({ className }: { className?: string }) {
  return <div className={cn('item-separator', className)} />;
}
