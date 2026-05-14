import { type ReactNode } from 'react';

type AvatarType = 'image' | 'image-border' | 'initials' | 'icon';
type AvatarShape = 'circle' | 'square';
type AvatarSize = 'xs' | 's' | 'm' | 'l';

export type AvatarProps = {
  type?: AvatarType;
  shape?: AvatarShape;
  size?: AvatarSize;
  src?: string;
  alt?: string;
  initials?: string;
  icon?: ReactNode;
  status?: boolean;
  skeleton?: boolean;
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const DefaultIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2">
    <circle cx="8" cy="6" r="3" />
    <path d="M3 14a5 5 0 0110 0" />
  </svg>
);

export function Avatar({
  type = 'image-border',
  shape = 'circle',
  size = 's',
  src,
  alt = '',
  initials,
  icon,
  status = false,
  skeleton = false,
  className,
}: AvatarProps) {
  const classes = cn(
    'avatar',
    `avatar--${type}`,
    `avatar--${shape}`,
    `avatar--${size}`,
    skeleton && 'avatar--skeleton',
    className,
  );

  const renderContent = () => {
    if (skeleton) return null;

    if (type === 'image' || type === 'image-border') {
      return src ? <img className="avatar__image" src={src} alt={alt} /> : <span className="avatar__icon"><DefaultIcon /></span>;
    }

    if (type === 'initials') {
      return <span>{initials || '??'}</span>;
    }

    if (type === 'icon') {
      return <span className="avatar__icon">{icon || <DefaultIcon />}</span>;
    }

    return null;
  };

  return (
    <span className={classes}>
      {renderContent()}
      {status && !skeleton && <span className="avatar__status" />}
    </span>
  );
}
