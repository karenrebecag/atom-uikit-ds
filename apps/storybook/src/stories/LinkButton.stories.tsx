import type { Meta, StoryObj } from '@storybook/react';
import { LinkButton } from '../../../../packages/components-react/src/atoms/LinkButton';

const meta: Meta<typeof LinkButton> = {
  title: 'Atoms/LinkButton',
  component: LinkButton,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    size: 'default',
    disabled: false,
    children: 'View documentation',
    href: 'https://uikit.atomchat.io',
  },
};

export default meta;
type Story = StoryObj<typeof LinkButton>;

export const Default: Story = {};

export const AllSizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <LinkButton {...args} size="xs">Extra small</LinkButton>
      <LinkButton {...args} size="sm">Small</LinkButton>
      <LinkButton {...args} size="default">Default</LinkButton>
      <LinkButton {...args} size="lg">Large</LinkButton>
      <LinkButton {...args} size="xl">Extra large</LinkButton>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
