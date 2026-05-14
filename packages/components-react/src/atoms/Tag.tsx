import { type ReactNode } from 'react';

type TagVariant = 'ghost' | 'filled' | 'outlined';
type TagIntent = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand' | 'ai' | 'disabled';
type TagSize = 'xs' | 's' | 'm';

export type TagProps = {
  variant?: TagVariant;
  intent?: TagIntent;
  size?: TagSize;
  dot?: boolean;
  icon?: ReactNode;
  avatar?: string;
  children: string;
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Tag({
  variant = 'filled',
  intent = 'neutral',
  size = 's',
  dot = false,
  icon,
  avatar,
  children,
  className,
}: TagProps) {
  const classes = cn(
    'tag',
    `tag--${variant}`,
    `tag--${intent}`,
    `tag--${size}`,
    className,
  );

  return (
    <span className={classes}>
      {dot && <span className="tag__dot" />}
      {avatar && (
        <span className="tag__avatar">
          <img src={avatar} alt="" />
        </span>
      )}
      {icon && <span className="tag__icon">{icon}</span>}
      <span className="tag__label">{children}</span>
    </span>
  );
}
