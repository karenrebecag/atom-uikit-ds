import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../packages/components-react/src/atoms/Tabs';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';
import { Button } from '../../../../packages/components-react/src/atoms/Button';

const IconUser = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const IconSettings = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.65.77 1.09 1.45 1.09H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const IconBell = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const meta: Meta<typeof Tabs> = {
  title: 'Atoms/Navigation/Tabs',
  component: Tabs,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      name: 'Orientation',
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
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
type Story = StoryObj<typeof Tabs>;

/* ---- Default ---- */

export const Default: Story = {
  render: (args) => (
    <Tabs defaultValue="account" orientation={args.orientation}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Field label="Name"><Input placeholder="John Doe" /></Field>
          <Field label="Email"><Input placeholder="john@example.com" type="email" /></Field>
          <Button variant="primary" size="m" style={{ alignSelf: 'flex-start' }}>Save</Button>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Field label="Current password"><Input type="password" /></Field>
          <Field label="New password"><Input type="password" /></Field>
          <Button variant="primary" size="m" style={{ alignSelf: 'flex-start' }}>Update</Button>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

/* ---- Line Variant ---- */

export const Line: Story = {
  render: (args) => (
    <Tabs defaultValue="overview" orientation={args.orientation}>
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
          Overview content goes here.
        </p>
      </TabsContent>
      <TabsContent value="analytics">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
          Analytics dashboard.
        </p>
      </TabsContent>
      <TabsContent value="reports">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
          Reports and exports.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/* ---- With Icons ---- */

export const WithIcons: Story = {
  render: (args) => (
    <Tabs defaultValue="profile" orientation={args.orientation}>
      <TabsList>
        <TabsTrigger value="profile">
          <span className="tabs__trigger-icon"><IconUser /></span>
          Profile
        </TabsTrigger>
        <TabsTrigger value="settings">
          <span className="tabs__trigger-icon"><IconSettings /></span>
          Settings
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <span className="tabs__trigger-icon"><IconBell /></span>
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Profile settings.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>General settings.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Notification preferences.</p>
      </TabsContent>
    </Tabs>
  ),
};

/* ---- Disabled ---- */

export const Disabled: Story = {
  render: (args) => (
    <Tabs defaultValue="active" orientation={args.orientation}>
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        <TabsTrigger value="another">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Active tab content.</p>
      </TabsContent>
      <TabsContent value="another">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Another tab content.</p>
      </TabsContent>
    </Tabs>
  ),
};

/* ---- Vertical ---- */

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <Tabs defaultValue="general" orientation={args.orientation}>
      <TabsList variant="line">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>General settings panel.</p>
      </TabsContent>
      <TabsContent value="security">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Security options.</p>
      </TabsContent>
      <TabsContent value="billing">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Billing information.</p>
      </TabsContent>
      <TabsContent value="team">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Team management.</p>
      </TabsContent>
    </Tabs>
  ),
};
