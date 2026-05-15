function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export type SpinnerProps = {
  size?: 'xs' | 's' | 'm' | 'l';
  className?: string;
};

export function Spinner({ size = 'm', className }: SpinnerProps) {
  return (
    <span role="status" aria-label="Loading" className={cn('spinner', `spinner--${size}`, className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
    </span>
  );
}
