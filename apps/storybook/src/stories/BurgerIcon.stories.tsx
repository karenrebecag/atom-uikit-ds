import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../../../../packages/components-react/src/atoms/IconButton';
import { BurgerIcon } from '../../../../packages/components-react/src/atoms/BurgerIcon';
import { initMenuButton } from '../../../../packages/animations/src/menu-button';

const meta: Meta = {
  title: 'Atoms/Buttons/BurgerIcon',
  argTypes: {
    animated: { control: 'boolean', name: 'Animated (GSAP)' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      name: 'Variant',
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
      name: 'Size',
    },
  },
  args: {
    animated: false,
    variant: 'secondary',
    size: 'm',
  },
  decorators: [
    (Story, context) => {
      const animated = context.args.animated as boolean;
      useEffect(() => {
        if (!animated) return;
        let cleanup: (() => void) | undefined;
        const raf = requestAnimationFrame(() => {
          cleanup = initMenuButton();
        });
        return () => {
          cancelAnimationFrame(raf);
          cleanup?.();
        };
      }, [animated]);
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj;

/* ---- Default (CSS transition) ---- */

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const animated = args.animated as boolean;

    return (
      <IconButton
        variant={args.variant as any}
        size={args.size as any}
        icon={<BurgerIcon />}
        aria-label={open ? 'Close menu' : 'Open menu'}
        data-menu-button={open ? 'close' : 'burger'}
        {...(animated ? { 'data-menu-button-animate': '' } : {})}
        onClick={() => {
          if (!animated) setOpen((v) => !v);
        }}
      />
    );
  },
};

/* ---- All Sizes ---- */

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
        <IconButton
          key={size}
          variant={args.variant as any}
          size={size}
          icon={<BurgerIcon />}
          aria-label="Menu"
          data-menu-button="burger"
        />
      ))}
    </div>
  ),
};

/* ---- All Variants ---- */

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <IconButton
          key={variant}
          variant={variant}
          size={args.size as any}
          icon={<BurgerIcon />}
          aria-label="Menu"
          data-menu-button="burger"
        />
      ))}
    </div>
  ),
};
