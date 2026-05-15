import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../../../../packages/components-react/src/atoms/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Indicators/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'circle', 'text'],
      name: 'Variant',
    },
    className: { table: { disable: true } },
  },
  args: {
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

/* ---- Default ---- */

export const Default: Story = {
  render: (args) => (
    <Skeleton variant={args.variant} style={{ width: 200, height: 20 }} />
  ),
};

/* ---- Card Placeholder ---- */

export const Card: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: 320, padding: 'var(--spacing-4)', border: 'var(--stroke-hairline) solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
      <Skeleton style={{ width: '100%', height: 160 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Skeleton variant="text" style={{ width: '70%' }} />
        <Skeleton variant="text" style={{ width: '100%' }} />
        <Skeleton variant="text" style={{ width: '40%' }} />
      </div>
    </div>
  ),
};

/* ---- User Row ---- */

export const UserRow: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
      <Skeleton variant="circle" style={{ width: 40, height: 40 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Skeleton variant="text" style={{ width: 120 }} />
        <Skeleton variant="text" style={{ width: 180 }} />
      </div>
    </div>
  ),
};

/* ---- List ---- */

export const List: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: 320 }}>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <Skeleton variant="circle" style={{ width: 32, height: 32 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <Skeleton variant="text" style={{ width: '60%' }} />
            <Skeleton variant="text" style={{ width: '90%' }} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ---- Table ---- */

export const TableSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', width: 480 }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
        <Skeleton variant="text" style={{ flex: 2 }} />
        <Skeleton variant="text" style={{ flex: 1 }} />
        <Skeleton variant="text" style={{ flex: 1 }} />
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          <Skeleton variant="text" style={{ flex: 2 }} />
          <Skeleton variant="text" style={{ flex: 1 }} />
          <Skeleton variant="text" style={{ flex: 1 }} />
        </div>
      ))}
    </div>
  ),
};
