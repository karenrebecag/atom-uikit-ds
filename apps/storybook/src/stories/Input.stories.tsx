import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
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

export const WithField: Story = {
  render: (args) => (
    <Field label="Email" description="We'll never share your email." htmlFor="email-input">
      <Input {...args} id="email-input" type="email" placeholder="you@example.com" />
    </Field>
  ),
};

export const Required: Story = {
  render: (args) => (
    <Field label="Full name" required htmlFor="name-input">
      <Input {...args} id="name-input" placeholder="John Doe" />
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field label="Email" error="Please enter a valid email address." htmlFor="error-input">
      <Input id="error-input" type="email" error placeholder="you@example.com" defaultValue="invalid" />
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field label="Email" disabled htmlFor="disabled-input">
      <Input id="disabled-input" disabled placeholder="you@example.com" />
    </Field>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
      <Field label="Default" htmlFor="s-default">
        <Input id="s-default" placeholder="Default" />
      </Field>
      <Field label="With value" htmlFor="s-value">
        <Input id="s-value" defaultValue="Hello world" />
      </Field>
      <Field label="Disabled" disabled htmlFor="s-disabled">
        <Input id="s-disabled" disabled placeholder="Disabled" />
      </Field>
      <Field label="Error" error="This field is required." htmlFor="s-error">
        <Input id="s-error" error placeholder="Error" />
      </Field>
      <Field label="With description" description="Helper text goes here." htmlFor="s-desc">
        <Input id="s-desc" placeholder="With description" />
      </Field>
      <Field label="Required" required htmlFor="s-req">
        <Input id="s-req" placeholder="Required field" />
      </Field>
    </div>
  ),
};
