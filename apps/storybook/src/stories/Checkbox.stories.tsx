import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../../../../packages/components-react/src/atoms/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      control: 'select',
      options: [false, true, 'indeterminate'],
    },
    label: { table: { disable: true } },
    error: { table: { disable: true } },
    disabled: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: {
    checked: false,
    label: 'Accept terms and conditions',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

const Interactive = (args: any) => {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(args.checked);
  return <Checkbox {...args} checked={checked} onChange={(v) => setChecked(v)} />;
};

export const Default: Story = {
  render: (args) => <Interactive {...args} />,
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox label="Unchecked" />
      <Checkbox checked label="Checked" />
      <Checkbox checked="indeterminate" label="Indeterminate" />
      <Checkbox disabled label="Disabled" />
      <Checkbox disabled checked label="Disabled checked" />
      <Checkbox disabled checked="indeterminate" label="Disabled indeterminate" />
      <Checkbox error label="Error" />
    </div>
  ),
};
