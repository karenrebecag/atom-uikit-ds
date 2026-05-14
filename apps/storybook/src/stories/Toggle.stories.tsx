import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  argTypes: {
    checked: {
      control: 'boolean',
      name: 'Checked',
    },
    disabled: {
      control: 'boolean',
      name: 'State: Disabled',
    },
    label: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: {
    checked: false,
    disabled: false,
    label: 'Enable notifications',
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const AllStates: Story = {
  argTypes: {
    checked: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '16px 32px', alignItems: 'center' }}>
      <strong style={{ fontSize: 11, color: '#71717b' }}>State</strong>
      <strong style={{ fontSize: 11, color: '#71717b' }}>Checked: false</strong>
      <strong style={{ fontSize: 11, color: '#71717b' }}>Checked: true</strong>

      <span style={{ fontSize: 12 }}>Enabled</span>
      <Toggle label="Off" />
      <Toggle checked label="On" />

      <span style={{ fontSize: 12 }}>Hovered</span>
      <span style={{ fontSize: 11, color: '#a1a1a1' }}>hover to see</span>
      <span style={{ fontSize: 11, color: '#a1a1a1' }}>hover to see</span>

      <span style={{ fontSize: 12 }}>Disabled</span>
      <Toggle disabled label="Disabled off" />
      <Toggle disabled checked label="Disabled on" />
    </div>
  ),
};
