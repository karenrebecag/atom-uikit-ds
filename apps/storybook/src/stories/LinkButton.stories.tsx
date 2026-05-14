import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LinkButton } from '../../../../packages/components-react/src/atoms/LinkButton';
import { initLinkButtonHover } from '../../../../packages/animations/src/link-button-hover';

const AnimationScope = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      initLinkButtonHover({ scope: ref.current ?? undefined });
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
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    animated: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'default',
    size: 'default',
    animated: false,
    disabled: false,
    children: 'Learn more',
    href: '#',
  },
};

export default meta;
type Story = StoryObj<typeof LinkButton>;

export const Default: Story = {};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete account' },
};

export const AllSizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <LinkButton {...args} size="sm">Small</LinkButton>
      <LinkButton {...args} size="default">Default</LinkButton>
      <LinkButton {...args} size="lg">Large</LinkButton>
    </div>
  ),
};
