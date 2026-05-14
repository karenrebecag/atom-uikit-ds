import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../../../../packages/components-react/src/atoms/Textarea';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placeholder: { control: 'text', name: 'Placeholder' },
    disabled: { control: 'boolean', name: 'Disabled' },
    error: { control: 'boolean', name: 'Error' },
    rows: { control: 'number', name: 'Rows' },
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

export const AllStates: Story = {
  argTypes: {
    placeholder: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
    rows: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
      <Field label="Enabled" htmlFor="ta-default">
        <Textarea id="ta-default" placeholder="Placeholder" />
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
