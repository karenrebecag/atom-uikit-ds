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
      name: 'Disabled',
    },
    error: {
      control: 'boolean',
      name: 'Error',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox label="Enabled" />
      <Checkbox checked label="Checked" />
      <Checkbox checked="indeterminate" label="Indeterminate" />
      <Checkbox disabled label="Disabled" />
      <Checkbox disabled checked label="Disabled Checked" />
      <Checkbox disabled checked="indeterminate" label="Disabled Indeterminate" />
      <Checkbox error label="Error" />
    </div>
  ),
};
