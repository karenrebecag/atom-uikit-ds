import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../../../../packages/components-react/src/atoms/Textarea';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    rows: { control: 'number' },
    className: { table: { disable: true } },
  },
  args: {
    placeholder: 'Type your message...',
    disabled: false,
    error: false,
    rows: 3,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithField: Story = {
  render: (args) => (
    <Field label="Message" description="Max 500 characters." htmlFor="msg-textarea">
      <Textarea {...args} id="msg-textarea" placeholder="Tell us what you think..." />
    </Field>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
      <Field label="Default" htmlFor="ta-default">
        <Textarea id="ta-default" placeholder="Default" />
      </Field>
      <Field label="Disabled" disabled htmlFor="ta-disabled">
        <Textarea id="ta-disabled" disabled placeholder="Disabled" />
      </Field>
      <Field label="Error" error="Message is too short." htmlFor="ta-error">
        <Textarea id="ta-error" error placeholder="Error" />
      </Field>
    </div>
  ),
};
