import { forwardRef, type ReactNode } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Group ---- */

export type ButtonGroupProps = {
  orientation?: 'horizontal' | 'vertical';
  'aria-label'?: string;
  children: ReactNode;
  className?: string;
};

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ orientation = 'horizontal', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn('button-group', orientation === 'vertical' && 'button-group--vertical', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ButtonGroup.displayName = 'ButtonGroup';

/* ---- Separator ---- */

export type ButtonGroupSeparatorProps = {
  className?: string;
};

export function ButtonGroupSeparator({ className }: ButtonGroupSeparatorProps) {
  return <div aria-hidden="true" className={cn('button-group__separator', className)} />;
}

/* ---- Text ---- */

export type ButtonGroupTextProps = {
  children: ReactNode;
  className?: string;
};

export function ButtonGroupText({ children, className }: ButtonGroupTextProps) {
  return <span className={cn('button-group__text', className)}>{children}</span>;
}
