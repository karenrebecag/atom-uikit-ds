import type { Meta, StoryObj } from '@storybook/react';
import {
  Item, ItemMedia, ItemContent, ItemTitle, ItemDescription,
  ItemActions, ItemGroup, ItemSeparator,
} from '../../../../packages/components-react/src/atoms/Item';
import { Avatar } from '../../../../packages/components-react/src/atoms/Avatar';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Tag } from '../../../../packages/components-react/src/atoms/Tag';

const IconShield = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconBell = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const IconMail = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
  </svg>
);

const IconLock = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const meta: Meta<typeof Item> = {
  title: 'Atoms/Layout/Item',
  component: Item,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'muted'],
      name: 'Variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'xs'],
      name: 'Size',
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    href: { table: { disable: true } },
  },
  args: {
    variant: 'default',
    size: 'default',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Item>;

/* ---- With Icon ---- */

export const WithIcon: Story = {
  render: (args) => (
    <Item variant={args.variant} size={args.size}>
      <ItemMedia variant="icon">
        <IconShield />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Two-factor authentication</ItemTitle>
        <ItemDescription>Add an extra layer of security to your account.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="secondary" size="s">Enable</Button>
      </ItemActions>
    </Item>
  ),
};

/* ---- With Avatar ---- */

export const WithAvatar: Story = {
  render: (args) => (
    <Item variant={args.variant} size={args.size}>
      <ItemMedia>
        <Avatar type="image" shape="circle" size="s" src="https://i.pravatar.cc/64?u=item1" alt="" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Alice Johnson</ItemTitle>
        <ItemDescription>alice@example.com</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Tag variant="filled" intent="success" size="s">Active</Tag>
      </ItemActions>
    </Item>
  ),
};

/* ---- With Image ---- */

export const WithImage: Story = {
  render: (args) => (
    <Item variant={args.variant} size={args.size}>
      <ItemMedia variant="image">
        <img src="https://picsum.photos/seed/item/96/96" alt="" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Summer Vibes</ItemTitle>
        <ItemDescription>12 tracks - 45 min</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

/* ---- Group (outline) ---- */

export const Group: Story = {
  render: () => (
    <ItemGroup variant="outline">
      <Item>
        <ItemMedia variant="icon"><IconBell /></ItemMedia>
        <ItemContent>
          <ItemTitle>Notifications</ItemTitle>
          <ItemDescription>Manage how you receive alerts.</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="icon"><IconMail /></ItemMedia>
        <ItemContent>
          <ItemTitle>Email preferences</ItemTitle>
          <ItemDescription>Choose what emails you receive.</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="icon"><IconLock /></ItemMedia>
        <ItemContent>
          <ItemTitle>Privacy</ItemTitle>
          <ItemDescription>Control your data and visibility.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
};

/* ---- Small Size ---- */

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <ItemGroup variant="outline">
      {['Dashboard', 'Projects', 'Team', 'Settings'].map((label) => (
        <Item key={label} size={args.size} href="#">
          <ItemContent>
            <ItemTitle>{label}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  ),
};

/* ---- Muted Variant ---- */

export const Muted: Story = {
  args: { variant: 'muted' },
  render: (args) => (
    <Item variant={args.variant}>
      <ItemMedia variant="icon"><IconShield /></ItemMedia>
      <ItemContent>
        <ItemTitle>Security alert</ItemTitle>
        <ItemDescription>Unusual login detected from a new device.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="primary" size="s">Review</Button>
        <Button variant="secondary" size="s">Dismiss</Button>
      </ItemActions>
    </Item>
  ),
};
