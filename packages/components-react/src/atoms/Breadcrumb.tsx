import { type ReactNode, type AnchorHTMLAttributes } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const ChevronRight = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const Dots = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
  </svg>
);

export function Breadcrumb({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('breadcrumb', className)}>
      <ol className="breadcrumb__list">{children}</ol>
    </nav>
  );
}

export function BreadcrumbItem({ children, className }: { children: ReactNode; className?: string }) {
  return <li className={cn('breadcrumb__item', className)}>{children}</li>;
}

export type BreadcrumbLinkProps = {
  children: ReactNode;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function BreadcrumbLink({ children, className, ...props }: BreadcrumbLinkProps) {
  return <a className={cn('breadcrumb__link', className)} {...props}>{children}</a>;
}

export function BreadcrumbPage({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('breadcrumb__page', className)} aria-current="page">{children}</span>;
}

export function BreadcrumbSeparator({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <li role="presentation" aria-hidden="true" className={cn('breadcrumb__separator', className)}>
      {children || <ChevronRight />}
    </li>
  );
}

export function BreadcrumbEllipsis({ className }: { className?: string }) {
  return (
    <li className={cn('breadcrumb__ellipsis', className)}>
      <Dots />
    </li>
  );
}
