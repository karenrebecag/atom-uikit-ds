import { type ReactNode, type AnchorHTMLAttributes } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const ChevronLeft = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/* ---- Pagination ---- */

export function Pagination({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <nav aria-label="Pagination" className={cn('pagination', className)}>
      <ul className="pagination__list">{children}</ul>
    </nav>
  );
}

/* ---- Item ---- */

export function PaginationItem({ children, className }: { children: ReactNode; className?: string }) {
  return <li className={className}>{children}</li>;
}

/* ---- Link ---- */

export type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function PaginationLink({ isActive, disabled, children, className, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'pagination__link',
        isActive && 'pagination__link--active',
        disabled && 'pagination__link--disabled',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/* ---- Previous ---- */

export type PaginationPreviousProps = {
  disabled?: boolean;
  text?: string;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function PaginationPrevious({ disabled, text = 'Previous', className, ...props }: PaginationPreviousProps) {
  return (
    <PaginationLink disabled={disabled} className={className} {...props}>
      <span className="pagination__link-icon"><ChevronLeft /></span>
      {text}
    </PaginationLink>
  );
}

/* ---- Next ---- */

export type PaginationNextProps = {
  disabled?: boolean;
  text?: string;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function PaginationNext({ disabled, text = 'Next', className, ...props }: PaginationNextProps) {
  return (
    <PaginationLink disabled={disabled} className={className} {...props}>
      {text}
      <span className="pagination__link-icon"><ChevronRight /></span>
    </PaginationLink>
  );
}

/* ---- Ellipsis ---- */

export function PaginationEllipsis({ className }: { className?: string }) {
  return <span className={cn('pagination__ellipsis', className)} aria-hidden="true">...</span>;
}
