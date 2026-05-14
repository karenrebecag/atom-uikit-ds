type DividerOrientation = 'horizontal' | 'vertical';

export type DividerProps = {
  orientation?: DividerOrientation;
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Divider({
  orientation = 'horizontal',
  className,
}: DividerProps) {
  return (
    <hr
      className={cn('divider', `divider--${orientation}`, className)}
      role={orientation === 'vertical' ? 'separator' : undefined}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
    />
  );
}
