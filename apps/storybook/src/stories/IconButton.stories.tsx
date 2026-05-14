import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../../../../packages/components-react/src/atoms/IconButton';

const IconPlus = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const IconArrow = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10">
    <path d="M14 19L21 12L14 5" />
    <path d="M21 12H2" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'destructive-secondary', 'destructive-tertiary'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    animated: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    icon: { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
  args: {
    variant: 'primary',
    size: 'default',
    animated: false,
    disabled: false,
    loading: false,
    icon: <IconPlus />,
    'aria-label': 'Add item',
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const AllVariants: Story = {
  argTypes: {
    variant: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <IconButton {...args} variant="primary" aria-label="Primary" />
        <IconButton {...args} variant="secondary" aria-label="Secondary" />
        <IconButton {...args} variant="tertiary" aria-label="Tertiary" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <IconButton {...args} variant="destructive" aria-label="Destructive" />
        <IconButton {...args} variant="destructive-secondary" aria-label="Dest. Secondary" />
        <IconButton {...args} variant="destructive-tertiary" aria-label="Dest. Tertiary" />
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <IconButton {...args} size="xs" aria-label="XS" />
      <IconButton {...args} size="sm" aria-label="Small" />
      <IconButton {...args} size="default" aria-label="Default" />
      <IconButton {...args} size="lg" aria-label="Large" />
      <IconButton {...args} size="xl" aria-label="XL" />
    </div>
  ),
};

export const WithArrowIcon: Story = {
  args: {
    icon: <IconArrow />,
    'aria-label': 'Next',
  },
};
