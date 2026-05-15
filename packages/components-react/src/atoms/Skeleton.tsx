import { type HTMLAttributes } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export type SkeletonProps = {
  variant?: 'default' | 'circle' | 'text';
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Skeleton({ variant = 'default', className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'skeleton',
        variant !== 'default' && `skeleton--${variant}`,
        className,
      )}
      {...props}
    />
  );
}
