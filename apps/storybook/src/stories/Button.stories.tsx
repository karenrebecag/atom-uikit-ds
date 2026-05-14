import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../../packages/components-react/src/atoms/Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'destructive-secondary', 'destructive-tertiary'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with spinner',
    },
    children: {
      control: 'text',
      description: 'Button label',
    },
  },
  args: {
    variant: 'primary',
    size: 'm',
    disabled: false,
    loading: false,
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Tertiary: Story = {
  args: { variant: 'tertiary' },
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
};

export const DestructiveSecondary: Story = {
  args: { variant: 'destructive-secondary' },
};

export const DestructiveTertiary: Story = {
  args: { variant: 'destructive-tertiary' },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button {...args} size="xs">XS</Button>
      <Button {...args} size="s">Small</Button>
      <Button {...args} size="m">Medium</Button>
      <Button {...args} size="l">Large</Button>
      <Button {...args} size="xl">XL</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button {...args} variant="primary">Primary</Button>
        <Button {...args} variant="secondary">Secondary</Button>
        <Button {...args} variant="tertiary">Tertiary</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button {...args} variant="destructive">Destructive</Button>
        <Button {...args} variant="destructive-secondary">Dest. Secondary</Button>
        <Button {...args} variant="destructive-tertiary">Dest. Tertiary</Button>
      </div>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving...' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AsLink: Story = {
  args: {
    children: 'Go to Atom',
    href: 'https://atomchat.io',
  } as any,
};
