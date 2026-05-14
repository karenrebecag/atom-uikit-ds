import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../../packages/components-react/src/atoms/Button';

const IconPlus = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

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

export const WithLeftIcon: Story = {
  args: {
    iconLeft: <IconPlus />,
    children: 'Create',
  },
};

export const WithRightIcon: Story = {
  args: {
    iconRight: <IconChevronDown />,
    children: 'Options',
  },
};

export const WithBothIcons: Story = {
  args: {
    iconLeft: <IconPlus />,
    iconRight: <IconChevronDown />,
    children: 'Create',
  },
};

export const IconCombinations: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button {...args}>Label only</Button>
        <Button {...args} iconLeft={<IconPlus />}>Left icon</Button>
        <Button {...args} iconRight={<IconChevronDown />}>Right icon</Button>
        <Button {...args} iconLeft={<IconPlus />} iconRight={<IconChevronDown />}>Both icons</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button {...args} variant="secondary">Label only</Button>
        <Button {...args} variant="secondary" iconLeft={<IconPlus />}>Left icon</Button>
        <Button {...args} variant="secondary" iconRight={<IconChevronDown />}>Right icon</Button>
        <Button {...args} variant="secondary" iconLeft={<IconPlus />} iconRight={<IconChevronDown />}>Both icons</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button {...args} variant="tertiary">Label only</Button>
        <Button {...args} variant="tertiary" iconLeft={<IconPlus />}>Left icon</Button>
        <Button {...args} variant="tertiary" iconRight={<IconChevronDown />}>Right icon</Button>
        <Button {...args} variant="tertiary" iconLeft={<IconPlus />} iconRight={<IconChevronDown />}>Both icons</Button>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button {...args} size="xs" iconLeft={<IconPlus />}>XS</Button>
      <Button {...args} size="s" iconLeft={<IconPlus />}>Small</Button>
      <Button {...args} size="m" iconLeft={<IconPlus />}>Medium</Button>
      <Button {...args} size="l" iconLeft={<IconPlus />}>Large</Button>
      <Button {...args} size="xl" iconLeft={<IconPlus />}>XL</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button {...args} variant="primary" iconLeft={<IconPlus />}>Primary</Button>
        <Button {...args} variant="secondary" iconLeft={<IconPlus />}>Secondary</Button>
        <Button {...args} variant="tertiary" iconLeft={<IconPlus />}>Tertiary</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button {...args} variant="destructive" iconLeft={<IconPlus />}>Destructive</Button>
        <Button {...args} variant="destructive-secondary" iconLeft={<IconPlus />}>Dest. Secondary</Button>
        <Button {...args} variant="destructive-tertiary" iconLeft={<IconPlus />}>Dest. Tertiary</Button>
      </div>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving...' },
};

export const Disabled: Story = {
  args: { disabled: true, iconLeft: <IconPlus />, iconRight: <IconChevronDown /> },
};
