import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

const IconSearch = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="7" cy="7" r="4" />
    <path d="M10 10l3.5 3.5" />
  </svg>
);

const IconInfo = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 7v4" />
    <circle cx="8" cy="5.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

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
    iconLeft: {
      control: 'boolean',
      mapping: { true: <IconSearch />, false: undefined },
      name: 'Icon left',
    },
    iconRight: {
      control: 'boolean',
      mapping: { true: <IconInfo />, false: undefined },
      name: 'Icon right',
    },
    disabled: { control: 'boolean', name: 'Disabled' },
    error: { control: 'boolean', name: 'Error' },
    className: { table: { disable: true } },
  },
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    iconLeft: false as any,
    iconRight: false as any,
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
    iconLeft: { table: { disable: true } },
    iconRight: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
      <Field label="Enabled" htmlFor="s-default">
        <Input id="s-default" placeholder="Placeholder" iconLeft={<IconSearch />} iconRight={<IconInfo />} />
      </Field>
      <Field label="Filled" htmlFor="s-value">
        <Input id="s-value" defaultValue="Hello world" iconLeft={<IconSearch />} iconRight={<IconInfo />} />
      </Field>
      <Field label="Disabled" disabled htmlFor="s-disabled">
        <Input id="s-disabled" disabled placeholder="Disabled" iconLeft={<IconSearch />} iconRight={<IconInfo />} />
      </Field>
      <Field label="Error enabled" error="This field is required." htmlFor="s-error">
        <Input id="s-error" error placeholder="Error" iconLeft={<IconSearch />} iconRight={<IconInfo />} />
      </Field>
      <Field label="Error filled" error="Invalid email address." htmlFor="s-error-filled">
        <Input id="s-error-filled" error defaultValue="invalid@" iconLeft={<IconSearch />} iconRight={<IconInfo />} />
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
