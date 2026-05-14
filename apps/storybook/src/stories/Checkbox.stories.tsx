import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../../../../packages/components-react/src/atoms/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      control: 'select',
      options: [false, true, 'indeterminate'],
      name: 'Checked',
    },
    disabled: {
      control: 'boolean',
      name: 'State: Disabled',
    },
    error: {
      control: 'boolean',
      name: 'State: Error',
    },
    label: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: {
    checked: false,
    disabled: false,
    error: false,
    label: 'Accept terms and conditions',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const AllStates: Story = {
  argTypes: {
    checked: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '16px 32px', alignItems: 'center' }}>
      {/* Row headers */}
      <strong style={{ fontSize: 11, color: '#71717b' }}>State</strong>
      <strong style={{ fontSize: 11, color: '#71717b' }}>Checked: false</strong>
      <strong style={{ fontSize: 11, color: '#71717b' }}>Checked: true</strong>

      {/* Enabled */}
      <span style={{ fontSize: 12 }}>Enabled</span>
      <Checkbox label="Unchecked" />
      <Checkbox checked label="Checked" />

      {/* Enabled + Indeterminate */}
      <span style={{ fontSize: 12 }}>Indeterminate</span>
      <span style={{ fontSize: 11, color: '#a1a1a1' }}>—</span>
      <Checkbox checked="indeterminate" label="Indeterminate" />

      {/* Disabled */}
      <span style={{ fontSize: 12 }}>Disabled</span>
      <Checkbox disabled label="Disabled" />
      <Checkbox disabled checked label="Disabled checked" />

      {/* Disabled + Indeterminate */}
      <span style={{ fontSize: 12 }}>Disabled indeterminate</span>
      <span style={{ fontSize: 11, color: '#a1a1a1' }}>—</span>
      <Checkbox disabled checked="indeterminate" label="Disabled indeterminate" />

      {/* Error */}
      <span style={{ fontSize: 12 }}>Error</span>
      <Checkbox error label="Error" />
      <span style={{ fontSize: 11, color: '#a1a1a1' }}>—</span>
    </div>
  ),
};
