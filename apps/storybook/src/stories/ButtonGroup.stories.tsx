import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '../../../../packages/components-react/src/atoms/ButtonGroup';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { IconButton } from '../../../../packages/components-react/src/atoms/IconButton';
import { initButtonHover } from '../../../../packages/animations/src/button-hover';

const IconBold = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
    <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
  </svg>
);

const IconItalic = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const IconUnderline = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v7a6 6 0 0012 0V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </svg>
);

const IconAlignLeft = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
  </svg>
);

const IconAlignCenter = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" />
  </svg>
);

const IconAlignRight = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const meta: Meta<typeof ButtonGroup> = {
  title: 'Atoms/Buttons/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      name: 'Orientation',
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
  },
  decorators: [
    (Story, context) => {
      const animated = context.args.animated as boolean;
      useEffect(() => {
        if (!animated) return;
        const cleanup = initButtonHover();
        return cleanup;
      }, [animated]);
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup & { animated: boolean }>;

/* ---- Default ---- */

export const Default: Story = {
  argTypes: {
    animated: { control: 'boolean', name: 'Animated' },
  },
  args: { animated: false },
  render: (args) => (
    <ButtonGroup orientation={args.orientation}>
      <Button variant="secondary" size="m" animated={args.animated as boolean}>Left</Button>
      <Button variant="secondary" size="m" animated={args.animated as boolean}>Center</Button>
      <Button variant="secondary" size="m" animated={args.animated as boolean}>Right</Button>
    </ButtonGroup>
  ),
};

/* ---- Icon Buttons (toolbar) ---- */

export const IconToolbar: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
      <ButtonGroup orientation={args.orientation}>
        <IconButton variant="secondary" size="s" icon={<IconBold />} aria-label="Bold" />
        <IconButton variant="secondary" size="s" icon={<IconItalic />} aria-label="Italic" />
        <IconButton variant="secondary" size="s" icon={<IconUnderline />} aria-label="Underline" />
      </ButtonGroup>
      <ButtonGroup orientation={args.orientation}>
        <IconButton variant="secondary" size="s" icon={<IconAlignLeft />} aria-label="Align left" />
        <IconButton variant="secondary" size="s" icon={<IconAlignCenter />} aria-label="Align center" />
        <IconButton variant="secondary" size="s" icon={<IconAlignRight />} aria-label="Align right" />
      </ButtonGroup>
    </div>
  ),
};

/* ---- Split Button ---- */

export const SplitButton: Story = {
  argTypes: {
    animated: { control: 'boolean', name: 'Animated' },
  },
  args: { animated: false },
  render: (args) => (
    <ButtonGroup orientation={args.orientation}>
      <Button variant="primary" size="m" animated={args.animated as boolean}>Save</Button>
      <ButtonGroupSeparator />
      <IconButton variant="primary" size="m" icon={<IconChevronDown />} aria-label="More options" />
    </ButtonGroup>
  ),
};

/* ---- With Text ---- */

export const WithText: Story = {
  argTypes: {
    animated: { control: 'boolean', name: 'Animated' },
  },
  args: { animated: false },
  render: (args) => (
    <ButtonGroup orientation={args.orientation}>
      <Button variant="secondary" size="m" animated={args.animated as boolean}>Prev</Button>
      <ButtonGroupText>Page 1 of 10</ButtonGroupText>
      <Button variant="secondary" size="m" animated={args.animated as boolean}>Next</Button>
    </ButtonGroup>
  ),
};

/* ---- Vertical ---- */

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  argTypes: {
    animated: { control: 'boolean', name: 'Animated' },
  },
  render: (args) => (
    <ButtonGroup orientation={args.orientation}>
      <Button variant="secondary" size="m" animated={args.animated as boolean}>Top</Button>
      <Button variant="secondary" size="m" animated={args.animated as boolean}>Middle</Button>
      <Button variant="secondary" size="m" animated={args.animated as boolean}>Bottom</Button>
    </ButtonGroup>
  ),
};

/* ---- All Sizes ---- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}>
      {(['xs', 's', 'm', 'l'] as const).map((size) => (
        <ButtonGroup key={size}>
          <Button variant="secondary" size={size}>A</Button>
          <Button variant="secondary" size={size}>B</Button>
          <Button variant="secondary" size={size}>C</Button>
        </ButtonGroup>
      ))}
    </div>
  ),
};
