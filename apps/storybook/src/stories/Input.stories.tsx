import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      name: 'Type',
    },
    placeholder: { control: 'text', name: 'Placeholder' },
    disabled: { control: 'boolean', name: 'Disabled' },
    error: { control: 'boolean', name: 'Error' },
    className: { table: { disable: true } },
  },
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    disabled: false,
    error: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const AllStates: Story = {
  argTypes: {
    type: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
      <Field label="Enabled" htmlFor="s-default">
        <Input id="s-default" placeholder="Placeholder" />
      </Field>
      <Field label="Filled" htmlFor="s-value">
        <Input id="s-value" defaultValue="Hello world" />
      </Field>
      <Field label="Disabled" disabled htmlFor="s-disabled">
        <Input id="s-disabled" disabled placeholder="Disabled" />
      </Field>
      <Field label="Error enabled" error="This field is required." htmlFor="s-error">
        <Input id="s-error" error placeholder="Error" />
      </Field>
      <Field label="Error filled" error="Invalid email address." htmlFor="s-error-filled">
        <Input id="s-error-filled" error defaultValue="invalid@" />
      </Field>
      <Field label="With description" description="Supportive text" htmlFor="s-desc">
        <Input id="s-desc" placeholder="With description" />
      </Field>
      <Field label="Required" required htmlFor="s-req">
        <Input id="s-req" placeholder="Required field" />
      </Field>
    </div>
  ),
};
