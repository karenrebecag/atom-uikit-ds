import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../../../../packages/components-react/src/atoms/Textarea';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Forms/Textarea',
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
      <strong style={{ fontSize: 11, color: '#71717b' }}>States (Hovered, Pressed, Focused are CSS-native — hover/click to see)</strong>

      <Field label="Enabled" htmlFor="ta-enabled">
        <Textarea id="ta-enabled" placeholder="Placeholder" />
      </Field>
      <Field label="Filled" htmlFor="ta-filled">
        <Textarea id="ta-filled" defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
      </Field>
      <Field label="Disabled" disabled htmlFor="ta-disabled">
        <Textarea id="ta-disabled" disabled placeholder="Disabled" />
      </Field>
      <Field label="Error enabled" error="Supportive text negative" htmlFor="ta-error-enabled">
        <Textarea id="ta-error-enabled" error placeholder="Error enabled" />
      </Field>
      <Field label="Error filled" error="Supportive text negative" htmlFor="ta-error-filled">
        <Textarea id="ta-error-filled" error defaultValue="Invalid content here" />
      </Field>
      <Field label="Error focused" error="Supportive text negative" htmlFor="ta-error-focused">
        <Textarea id="ta-error-focused" error autoFocus defaultValue="Click to see ring" />
      </Field>
    </div>
  ),
};
