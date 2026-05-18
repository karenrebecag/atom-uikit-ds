export type BadgeVariant = 'neutral' | 'inbox';
export type BadgeState = 'enabled' | 'focused' | 'subtle';

export type BadgeProps = {
  variant?: BadgeVariant;
  state?: BadgeState;
  children: string;
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Badge({
  variant = 'neutral',
  state = 'enabled',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        `badge--${variant}`,
        `badge--${state}`,
        className,
      )}
    >
      <span className="badge__label">{children}</span>
    </span>
  );
}
