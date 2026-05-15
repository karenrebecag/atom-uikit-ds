import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '../../../../packages/components-react/src/atoms/Chip';

const IconFilter = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h12M4 7h8M6 11h4" />
  </svg>
);

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Indicators/Chip',
  component: Chip,
  argTypes: {
    type: {
      control: 'select',
      options: ['outlined', 'filled'],
      name: 'Type',
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
      name: 'Size',
    },
    iconLeft: {
      control: 'boolean',
      mapping: { true: <IconFilter />, false: undefined },
      name: 'Icon left',
    },
    onClose: {
      control: 'boolean',
      mapping: { true: () => {}, false: undefined },
      name: 'Closable',
    },
    animated: { control: 'boolean', name: 'Animated' },
    disabled: { control: 'boolean', name: 'Disabled' },
    error: { control: 'boolean', name: 'Error' },
    focused: { table: { disable: true } },
    children: { control: 'text', name: 'Label' },
    className: { table: { disable: true } },
  },
  args: {
    type: 'outlined',
    size: 's',
    children: 'Label',
    iconLeft: true as any,
    onClose: true as any,
    animated: false,
    disabled: false,
    error: false,
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {};

export const AllVariants: Story = {
  argTypes: {
    type: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '24px 48px' }}>
      <div>
        <strong style={{ fontSize: 11, color: '#71717b', display: 'block', marginBottom: 12 }}>Outlined</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
          <Chip {...args} type="outlined">Enabled</Chip>
          <Chip {...args} type="outlined" disabled>Disabled</Chip>
          <Chip {...args} type="outlined" error>Error</Chip>
          <Chip {...args} type="outlined" focused>Focused</Chip>
        </div>
      </div>
      <div>
        <strong style={{ fontSize: 11, color: '#71717b', display: 'block', marginBottom: 12 }}>Filled</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
          <Chip {...args} type="filled">Enabled</Chip>
          <Chip {...args} type="filled" disabled>Disabled</Chip>
          <Chip {...args} type="filled" error>Error</Chip>
          <Chip {...args} type="filled" focused>Focused</Chip>
        </div>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Chip {...args} size="xs">XS</Chip>
      <Chip {...args} size="s">S</Chip>
      <Chip {...args} size="m">M</Chip>
      <Chip {...args} size="l">L</Chip>
      <Chip {...args} size="xl">XL</Chip>
    </div>
  ),
};

export const ChipGroup: Story = {
  argTypes: {
    type: { table: { disable: true } },
    size: { table: { disable: true } },
    iconLeft: { table: { disable: true } },
    onClose: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Chip type="filled" size="s" onClose={() => {}}>React</Chip>
      <Chip type="filled" size="s" onClose={() => {}}>TypeScript</Chip>
      <Chip type="filled" size="s" onClose={() => {}}>Astro</Chip>
      <Chip type="filled" size="s" onClose={() => {}}>Tailwind</Chip>
      <Chip type="outlined" size="s">+ Add</Chip>
    </div>
  ),
};
