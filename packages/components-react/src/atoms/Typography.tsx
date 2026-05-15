import { type ReactNode, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

type TypographyProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

export function TypographyH1({ children, className, ...props }: TypographyProps) {
  return <h1 className={cn('h1', className)} {...props}>{children}</h1>;
}

export function TypographyH2({ children, className, ...props }: TypographyProps) {
  return <h2 className={cn('h2', className)} {...props}>{children}</h2>;
}

export function TypographyH3({ children, className, ...props }: TypographyProps) {
  return <h3 className={cn('h3', className)} {...props}>{children}</h3>;
}

export function TypographyH4({ children, className, ...props }: TypographyProps) {
  return <h4 className={cn('h4', className)} {...props}>{children}</h4>;
}

export function TypographyP({ children, className, ...props }: TypographyProps) {
  return <p className={cn('body', className)} {...props}>{children}</p>;
}

export function TypographyLead({ children, className, ...props }: TypographyProps) {
  return <p className={cn('lead', className)} {...props}>{children}</p>;
}

export function TypographyLarge({ children, className, ...props }: TypographyProps) {
  return <div className={cn('large', className)} {...props}>{children}</div>;
}

export function TypographySmall({ children, className, ...props }: TypographyProps) {
  return <small className={cn('small', className)} {...props}>{children}</small>;
}

export function TypographyMuted({ children, className, ...props }: TypographyProps) {
  return <p className={cn('muted', className)} {...props}>{children}</p>;
}

export function TypographyBlockquote({ children, className, ...props }: TypographyProps) {
  return <blockquote className={cn('blockquote', className)} {...props}>{children}</blockquote>;
}

export function TypographyInlineCode({ children, className, ...props }: TypographyProps) {
  return <code className={cn('code-inline', className)} {...props}>{children}</code>;
}

export function TypographyList({ children, className, ...props }: TypographyProps) {
  return <ul className={cn('list', className)} {...props}>{children}</ul>;
}
