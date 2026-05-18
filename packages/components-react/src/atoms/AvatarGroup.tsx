import { type ReactNode } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

type AvatarGroupSize = 'xs' | 's' | 'm' | 'l';

type AvatarGroupShape = 'circle' | 'square';

export type AvatarGroupProps = {
  size?: AvatarGroupSize;
  shape?: AvatarGroupShape;
  max?: number;
  children: ReactNode;
  className?: string;
};

export function AvatarGroup({ size = 's', shape = 'circle', max, children, className }: AvatarGroupProps) {
  const items = Array.isArray(children) ? children : [children];
  const visible = max ? items.slice(0, max) : items;
  const remaining = max ? items.length - max : 0;

  return (
    <div className={cn('avatar-group', `avatar-group--${size}`, shape === 'square' && 'avatar-group--square', className)}>
      {visible}
      {remaining > 0 && (
        <span className="avatar-group__count">+{remaining}</span>
      )}
    </div>
  );
}
