import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../../../../packages/components-react/src/atoms/Spinner';
import { Button } from '../../../../packages/components-react/src/atoms/Button';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Indicators/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l'],
      name: 'Size',
    },
    className: { table: { disable: true } },
  },
  args: {
    size: 'm',
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
      {(['xs', 's', 'm', 'l'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <Spinner size={size} />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--muted-foreground)' }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
      <Button variant="primary" size="m" disabled>
        <Spinner size="xs" />
        Loading...
      </Button>
      <Button variant="secondary" size="m" disabled>
        <Spinner size="xs" />
        Saving...
      </Button>
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
      <Spinner size="m" style={{ color: 'var(--destructive)' }} />
      <Spinner size="m" style={{ color: 'var(--success)' }} />
      <Spinner size="m" style={{ color: 'var(--info)' }} />
      <Spinner size="m" style={{ color: 'var(--warning)' }} />
      <Spinner size="m" style={{ color: 'var(--brand)' }} />
    </div>
  ),
};
