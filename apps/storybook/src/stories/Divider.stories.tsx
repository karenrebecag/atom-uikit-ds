import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '../../../../packages/components-react/src/atoms/Divider';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Layout/Divider',
  component: Divider,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      name: 'Orientation',
    },
    className: { table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <p style={{ fontSize: 13, color: '#71717b', marginBottom: 16 }}>Content above</p>
      <Divider />
      <p style={{ fontSize: 13, color: '#71717b', marginTop: 16 }}>Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 40 }}>
      <span style={{ fontSize: 13 }}>Left</span>
      <Divider orientation="vertical" />
      <span style={{ fontSize: 13 }}>Right</span>
    </div>
  ),
};

export const InNavbar: Story = {
  render: () => (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 16, height: 40 }}>
      <span style={{ fontSize: 13, fontWeight: 500 }}>Home</span>
      <span style={{ fontSize: 13 }}>Docs</span>
      <span style={{ fontSize: 13 }}>Components</span>
      <Divider orientation="vertical" />
      <span style={{ fontSize: 13, color: '#71717b' }}>v0.1.0</span>
    </nav>
  ),
};
