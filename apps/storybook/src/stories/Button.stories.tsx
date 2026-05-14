import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
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
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const id = requestAnimationFrame(() => {
      initButtonHover({ scope: ref.current ?? undefined });
    });
    return () => cancelAnimationFrame(id);
  }, [key, children]);

  return <div ref={ref}>{children}</div>;
};

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
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
      options: ['primary', 'secondary', 'tertiary', 'destructive-primary', 'destructive-secondary', 'destructive-tertiary'],
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
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
    variant: 'primary',
    size: 'm',
    iconLeft: false as any,
    iconRight: false as any,
    animated: false,
    disabled: false,
    loading: false,
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const AllVariants: Story = {
  argTypes: {
    variant: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button {...args} variant="primary">Primary</Button>
        <Button {...args} variant="secondary">Secondary</Button>
        <Button {...args} variant="tertiary">Tertiary</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button {...args} variant="destructive-primary">Destructive Primary</Button>
        <Button {...args} variant="destructive-secondary">Dest. Secondary</Button>
        <Button {...args} variant="destructive-tertiary">Dest. Tertiary</Button>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button {...args} size="xs">XS</Button>
      <Button {...args} size="s">S</Button>
      <Button {...args} size="m">M</Button>
      <Button {...args} size="l">L</Button>
      <Button {...args} size="xl">XL</Button>
    </div>
  ),
};
