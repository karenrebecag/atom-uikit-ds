import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '../../../../packages/components-react/src/atoms/Radio';

const meta: Meta<typeof Radio> = {
  title: 'Atoms/Forms/Radio',
  component: Radio,
  argTypes: {
    checked: {
      control: 'boolean',
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
    name: { table: { disable: true } },
    value: { table: { disable: true } },
  },
  args: {
    checked: false,
    disabled: false,
    error: false,
    label: 'Option one',
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {};

export const AllStates: Story = {
  argTypes: {
    checked: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '16px 32px', alignItems: 'center' }}>
      <strong style={{ fontSize: 11, color: '#71717b' }}>State</strong>
      <strong style={{ fontSize: 11, color: '#71717b' }}>Checked: false</strong>
      <strong style={{ fontSize: 11, color: '#71717b' }}>Checked: true</strong>

      <span style={{ fontSize: 12 }}>Enabled</span>
      <Radio label="Unchecked" name="enabled" />
      <Radio checked label="Checked" name="enabled-checked" />

      <span style={{ fontSize: 12 }}>Disabled</span>
      <Radio disabled label="Disabled" name="disabled" />
      <Radio disabled checked label="Disabled checked" name="disabled-checked" />

      <span style={{ fontSize: 12 }}>Error</span>
      <Radio error label="Error" name="error" />
      <span style={{ fontSize: 11, color: '#a1a1a1' }}>—</span>
    </div>
  ),
};

export const RadioGroup: Story = {
  argTypes: {
    checked: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
  },
  render: () => (
    <fieldset style={{ border: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Radio name="plan" value="free" label="Free" checked />
      <Radio name="plan" value="pro" label="Pro" />
      <Radio name="plan" value="enterprise" label="Enterprise" />
    </fieldset>
  ),
};
