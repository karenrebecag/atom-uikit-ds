import { Avatar, type AvatarProps } from '../atoms/Avatar';

export type UserProfileProps = {
  name: string;
  org?: string;
  avatar?: Omit<AvatarProps, 'className'>;
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function UserProfile({
  name,
  org,
  avatar,
  className,
}: UserProfileProps) {
  return (
    <div className={cn('user-profile', className)}>
      <Avatar
        type="initials"
        shape="square"
        size="s"
        status
        {...avatar}
        initials={avatar?.initials || name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
      />
      <div className="user-profile__info">
        <span className="user-profile__name">{name}</span>
        {org && <span className="user-profile__org">{org}</span>}
      </div>
    </div>
  );
}
