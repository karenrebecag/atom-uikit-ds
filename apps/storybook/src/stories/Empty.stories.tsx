import type { Meta, StoryObj } from '@storybook/react';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '../../../../packages/components-react/src/atoms/Empty';
import { Avatar } from '../../../../packages/components-react/src/atoms/Avatar';
import { AvatarGroup } from '../../../../packages/components-react/src/atoms/AvatarGroup';
import { Button } from '../../../../packages/components-react/src/atoms/Button';

/* ---- Icons ---- */

const IconFolder = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const IconUsers = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const IconInbox = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
  </svg>
);

const IconSearch = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const meta: Meta<typeof Empty> = {
  title: 'Atoms/Layout/Empty',
  component: Empty,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'filled'],
      name: 'Variant',
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    variant: 'default',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Empty>;

/* ---- Default ---- */

export const Default: Story = {
  render: (args) => (
    <Empty variant={args.variant}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolder />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          Get started by creating your first project. You can always come back and manage them here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="primary" size="m">Create Project</Button>
      </EmptyContent>
    </Empty>
  ),
};

/* ---- Outline ---- */

export const Outline: Story = {
  args: { variant: 'outline' },
  render: (args) => (
    <Empty variant={args.variant}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconInbox />
        </EmptyMedia>
        <EmptyTitle>Your inbox is empty</EmptyTitle>
        <EmptyDescription>
          New messages and notifications will appear here when you receive them.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

/* ---- Filled ---- */

export const Filled: Story = {
  args: { variant: 'filled' },
  render: (args) => (
    <Empty variant={args.variant}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconSearch />
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          Try adjusting your search or filter to find what you are looking for.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="secondary" size="m">Clear filters</Button>
      </EmptyContent>
    </Empty>
  ),
};

/* ---- With Avatar ---- */

export const WithAvatar: Story = {
  render: (args) => (
    <Empty variant={args.variant}>
      <EmptyHeader>
        <EmptyMedia>
          <Avatar type="image" shape="circle" size="l" src="https://i.pravatar.cc/96?u=empty" alt="User" />
        </EmptyMedia>
        <EmptyTitle>Welcome back</EmptyTitle>
        <EmptyDescription>
          You have no pending tasks. Enjoy your day or create something new.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="primary" size="m">New Task</Button>
        <Button variant="secondary" size="m">Browse Templates</Button>
      </EmptyContent>
    </Empty>
  ),
};

/* ---- With Avatar Group ---- */

export const WithAvatarGroup: Story = {
  render: (args) => (
    <Empty variant={args.variant}>
      <EmptyHeader>
        <EmptyMedia>
          <AvatarGroup size="m" max={4}>
            <Avatar type="image" shape="circle" size="m" src="https://i.pravatar.cc/80?u=a1" alt="" />
            <Avatar type="image" shape="circle" size="m" src="https://i.pravatar.cc/80?u=a2" alt="" />
            <Avatar type="image" shape="circle" size="m" src="https://i.pravatar.cc/80?u=a3" alt="" />
            <Avatar type="image" shape="circle" size="m" src="https://i.pravatar.cc/80?u=a4" alt="" />
            <Avatar type="image" shape="circle" size="m" src="https://i.pravatar.cc/80?u=a5" alt="" />
            <Avatar type="image" shape="circle" size="m" src="https://i.pravatar.cc/80?u=a6" alt="" />
          </AvatarGroup>
        </EmptyMedia>
        <EmptyTitle>Invite your team</EmptyTitle>
        <EmptyDescription>
          Collaborate with your team by inviting them to your workspace.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="primary" size="m">Invite Members</Button>
      </EmptyContent>
    </Empty>
  ),
};

/* ---- With Actions Only (no media) ---- */

export const Minimal: Story = {
  render: (args) => (
    <Empty variant={args.variant}>
      <EmptyHeader>
        <EmptyTitle>Nothing here yet</EmptyTitle>
        <EmptyDescription>
          Create your first item to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="primary" size="s">Add Item</Button>
      </EmptyContent>
    </Empty>
  ),
};
