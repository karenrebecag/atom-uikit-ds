import type { Meta, StoryObj } from '@storybook/react';
import { NavLink } from '../../../../packages/components-react/src/atoms/NavLink';

const meta: Meta<typeof NavLink> = {
  title: 'Atoms/Navigation/NavLink',
  component: NavLink,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    active: { control: 'boolean' },
    children: { control: 'text' },
    disabled: { table: { disable: true } },
    href: { table: { disable: true } },
  },
  args: {
    size: 'default',
    active: false,
    children: 'Documentation',
    href: '/docs',
  },
};

export default meta;
type Story = StoryObj<typeof NavLink>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
};

export const NavBar: Story = {
  argTypes: {
    active: { table: { disable: true } },
  },
  render: (args) => (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <NavLink {...args} href="/" active>Home</NavLink>
      <NavLink {...args} href="/docs">Documentation</NavLink>
      <NavLink {...args} href="/components">Components</NavLink>
      <NavLink {...args} href="/tokens">Tokens</NavLink>
      <NavLink {...args} href="/about">About</NavLink>
    </nav>
  ),
};

export const AllSizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <NavLink {...args} size="sm">Small</NavLink>
      <NavLink {...args} size="default">Default</NavLink>
      <NavLink {...args} size="lg">Large</NavLink>
    </div>
  ),
};
