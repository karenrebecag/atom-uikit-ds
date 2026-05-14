import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LinkButton } from '../../../../packages/components-react/src/atoms/LinkButton';
import { initButtonHover } from '../../../../packages/animations/src/button-hover';

const IconPlus = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const AnimationScope = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      initButtonHover({ scope: ref.current ?? undefined });
    });
    return () => cancelAnimationFrame(id);
  });

  return <div ref={ref}>{children}</div>;
};

const meta: Meta<typeof LinkButton> = {
  title: 'Atoms/LinkButton',
  component: LinkButton,
  decorators: [
    (Story, context) => {
      if (context.args.animated) {
        return (
          <AnimationScope>
            <Story />
          </AnimationScope>
        );
      }
      return <Story />;
    },
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    iconLeft: {
      control: 'boolean',
      mapping: { true: <IconPlus />, false: undefined },
    },
    iconRight: {
      control: 'boolean',
      mapping: { true: <IconChevronDown />, false: undefined },
    },
    animated: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    size: 'default',
    iconLeft: true as any,
    iconRight: true as any,
    animated: false,
    disabled: false,
    loading: false,
    children: 'Enabled',
    href: '#',
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
      <LinkButton {...args} size="xs">XS</LinkButton>
      <LinkButton {...args} size="sm">Small</LinkButton>
      <LinkButton {...args} size="default">Default</LinkButton>
      <LinkButton {...args} size="lg">Large</LinkButton>
      <LinkButton {...args} size="xl">XL</LinkButton>
    </div>
  ),
};

export const AllStates: Story = {
  argTypes: {
    disabled: { table: { disable: true } },
    loading: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <LinkButton {...args}>Enabled</LinkButton>
      <LinkButton {...args} disabled>Disabled</LinkButton>
      <LinkButton {...args} loading>Loading</LinkButton>
    </div>
  ),
};
