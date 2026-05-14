import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '../../../../packages/components-react/src/atoms/Chip';

const IconFilter = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h12M4 7h8M6 11h4" />
  </svg>
);

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  argTypes: {
    type: {
      control: 'select',
      options: ['outlined', 'filled'],
      name: 'Type',
    },
    iconLeft: {
      control: 'boolean',
      mapping: { true: <IconFilter />, false: undefined },
      name: 'Icon left',
    },
    onClose: {
      control: 'boolean',
      mapping: { true: () => alert('Close'), false: undefined },
      name: 'Closable',
    },
    disabled: { control: 'boolean', name: 'Disabled' },
    error: { control: 'boolean', name: 'Error' },
    focused: { table: { disable: true } },
    children: { control: 'text', name: 'Label' },
    className: { table: { disable: true } },
  },
  args: {
    type: 'outlined',
    children: 'Label',
    iconLeft: true as any,
    onClose: true as any,
    disabled: false,
    error: false,
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {};

export const AllStates: Story = {
  argTypes: {
    type: { table: { disable: true } },
    iconLeft: { table: { disable: true } },
    onClose: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '24px 48px' }}>
      <div>
        <strong style={{ fontSize: 11, color: '#71717b', display: 'block', marginBottom: 12 }}>Outlined</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
          <Chip type="outlined" iconLeft={<IconFilter />} onClose={() => {}}>Enabled</Chip>
          <Chip type="outlined" disabled iconLeft={<IconFilter />} onClose={() => {}}>Disabled</Chip>
          <Chip type="outlined" error iconLeft={<IconFilter />} onClose={() => {}}>Error</Chip>
          <Chip type="outlined" focused iconLeft={<IconFilter />} onClose={() => {}}>Focused</Chip>
        </div>
      </div>
      <div>
        <strong style={{ fontSize: 11, color: '#71717b', display: 'block', marginBottom: 12 }}>Filled</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
          <Chip type="filled" iconLeft={<IconFilter />} onClose={() => {}}>Enabled</Chip>
          <Chip type="filled" disabled iconLeft={<IconFilter />} onClose={() => {}}>Disabled</Chip>
          <Chip type="filled" error iconLeft={<IconFilter />} onClose={() => {}}>Error</Chip>
          <Chip type="filled" focused iconLeft={<IconFilter />} onClose={() => {}}>Focused</Chip>
        </div>
      </div>
    </div>
  ),
};

export const ChipGroup: Story = {
  argTypes: {
    type: { table: { disable: true } },
    iconLeft: { table: { disable: true } },
    onClose: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Chip type="filled" onClose={() => {}}>React</Chip>
      <Chip type="filled" onClose={() => {}}>TypeScript</Chip>
      <Chip type="filled" onClose={() => {}}>Astro</Chip>
      <Chip type="filled" onClose={() => {}}>Tailwind</Chip>
      <Chip type="outlined">+ Add</Chip>
    </div>
  ),
};
