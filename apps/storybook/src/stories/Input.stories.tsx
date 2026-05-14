import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

const IconSearch = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="7" cy="7" r="4" />
    <path d="M10 10l3.5 3.5" />
  </svg>
);

const IconMail = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
    <path d="M2 5l6 4 6-4" />
  </svg>
);

const IconEye = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8z" />
    <circle cx="8" cy="8" r="2" />
  </svg>
);

const IconLock = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
  </svg>
);

const IconHash = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 2.5L4.5 13.5M11.5 2.5L10 13.5M2.5 5.5h11M2.5 10.5h11" />
  </svg>
);

const IconPhone = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 1.5h3l1.5 3.5-2 1.5a8 8 0 003.5 3.5l1.5-2 3.5 1.5v3c0 .5-.5 1.5-2 1.5C5.5 14.5 1.5 9 1.5 5c0-1.5 1-2 2-3.5z" />
  </svg>
);

const IconLink = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 9.5a3 3 0 004-4" />
    <path d="M9.5 6.5a3 3 0 00-4 4" />
    <path d="M5 11L3.5 12.5M11 5l1.5-1.5" />
  </svg>
);

const typeIcons: Record<string, { left?: React.ReactNode; right?: React.ReactNode }> = {
  text: {},
  email: { left: <IconMail /> },
  password: { left: <IconLock />, right: <IconEye /> },
  number: { left: <IconHash /> },
  search: { left: <IconSearch /> },
  tel: { left: <IconPhone /> },
  url: { left: <IconLink /> },
};

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
      name: 'Icon left',
    },
    iconRight: {
      control: 'boolean',
      name: 'Icon right',
    },
    disabled: { control: 'boolean', name: 'Disabled' },
    error: { control: 'boolean', name: 'Error' },
    className: { table: { disable: true } },
  },
  args: {
    type: 'email',
    placeholder: 'Enter text...',
    iconLeft: true as any,
    iconRight: false as any,
    disabled: false,
    error: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

const placeholders: Record<string, string> = {
  text: 'Enter text...',
  email: 'you@example.com',
  password: 'Enter password',
  number: '0',
  search: 'Search...',
  tel: '+1 (555) 000-0000',
  url: 'https://',
};

export const Default: Story = {
  render: (args) => {
    const type = (args.type as string) || 'text';
    const icons = typeIcons[type] || {};
    const placeholder = args.placeholder === 'Enter text...' ? placeholders[type] || args.placeholder : args.placeholder;
    return (
      <Input
        {...args}
        placeholder={placeholder}
        iconLeft={args.iconLeft ? icons.left || <IconSearch /> : undefined}
        iconRight={args.iconRight ? icons.right || <IconSearch /> : undefined}
      />
    );
  },
};

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
