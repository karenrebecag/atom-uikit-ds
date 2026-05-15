import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../../../packages/components-react/src/atoms/Avatar';
import { AvatarGroup } from '../../../../packages/components-react/src/atoms/AvatarGroup';

const meta: Meta<typeof AvatarGroup> = {
  title: 'Atoms/Indicators/AvatarGroup',
  component: AvatarGroup,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l'],
      name: 'Size',
    },
    max: {
      control: 'number',
      name: 'Max Visible',
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    size: 's',
    max: undefined,
  },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

const avatars = [
  'https://i.pravatar.cc/80?u=g1',
  'https://i.pravatar.cc/80?u=g2',
  'https://i.pravatar.cc/80?u=g3',
  'https://i.pravatar.cc/80?u=g4',
  'https://i.pravatar.cc/80?u=g5',
];

export const Default: Story = {
  render: (args) => (
    <AvatarGroup size={args.size}>
      {avatars.map((src, i) => (
        <Avatar key={i} type="image" shape="circle" size={args.size} src={src} alt="" />
      ))}
    </AvatarGroup>
  ),
};

export const WithMax: Story = {
  args: { max: 3 },
  render: (args) => (
    <AvatarGroup size={args.size} max={args.max}>
      {avatars.map((src, i) => (
        <Avatar key={i} type="image" shape="circle" size={args.size} src={src} alt="" />
      ))}
    </AvatarGroup>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      {(['xs', 's', 'm', 'l'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--muted-foreground)', width: 20 }}>{size}</span>
          <AvatarGroup size={size} max={4}>
            {avatars.map((src, i) => (
              <Avatar key={i} type="image" shape="circle" size={size} src={src} alt="" />
            ))}
          </AvatarGroup>
        </div>
      ))}
    </div>
  ),
};

export const WithInitials: Story = {
  render: (args) => (
    <AvatarGroup size={args.size} max={4}>
      <Avatar type="initials" shape="circle" size={args.size} initials="JD" />
      <Avatar type="initials" shape="circle" size={args.size} initials="KR" />
      <Avatar type="initials" shape="circle" size={args.size} initials="AB" />
      <Avatar type="initials" shape="circle" size={args.size} initials="MN" />
      <Avatar type="initials" shape="circle" size={args.size} initials="OP" />
      <Avatar type="initials" shape="circle" size={args.size} initials="QR" />
    </AvatarGroup>
  ),
};
