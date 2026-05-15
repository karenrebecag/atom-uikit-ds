import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from '../../../../packages/components-react/src/atoms/ToggleGroup';

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

const meta: Meta<typeof ToggleGroup> = {
  title: 'Atoms/Buttons/ToggleGroup',
  component: ToggleGroup,
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      name: 'Type',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      name: 'Variant',
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l'],
      name: 'Size',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      name: 'Orientation',
    },
    animated: {
      control: 'boolean',
      name: 'Animated',
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: {
    type: 'single',
    variant: 'default',
    size: 'm',
    orientation: 'horizontal',
    animated: false,
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

/* ---- Single (icons) ---- */

export const Single: Story = {
  render: (args) => {
    const [value, setValue] = useState('left');
    return (
      <ToggleGroup type="single" variant={args.variant} size={args.size} orientation={args.orientation} animated={args.animated} value={value} onValueChange={(v) => setValue(v as string)}>
        <ToggleGroupItem value="left">
          <span className="toggle-group__item-icon"><IconAlignLeft /></span>
        </ToggleGroupItem>
        <ToggleGroupItem value="center">
          <span className="toggle-group__item-icon"><IconAlignCenter /></span>
        </ToggleGroupItem>
        <ToggleGroupItem value="right">
          <span className="toggle-group__item-icon"><IconAlignRight /></span>
        </ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

/* ---- Multiple (text formatting) ---- */

export const Multiple: Story = {
  args: { type: 'multiple' },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['bold']);
    return (
      <ToggleGroup type="multiple" variant={args.variant} size={args.size} orientation={args.orientation} animated={args.animated} value={value} onValueChange={(v) => setValue(v as string[])}>
        <ToggleGroupItem value="bold">
          <span className="toggle-group__item-icon"><IconBold /></span>
        </ToggleGroupItem>
        <ToggleGroupItem value="italic">
          <span className="toggle-group__item-icon"><IconItalic /></span>
        </ToggleGroupItem>
        <ToggleGroupItem value="underline">
          <span className="toggle-group__item-icon"><IconUnderline /></span>
        </ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

/* ---- Outline ---- */

export const Outline: Story = {
  args: { variant: 'outline' },
  render: (args) => {
    const [value, setValue] = useState('center');
    return (
      <ToggleGroup type="single" variant={args.variant} size={args.size} orientation={args.orientation} animated={args.animated} value={value} onValueChange={(v) => setValue(v as string)}>
        <ToggleGroupItem value="left">
          <span className="toggle-group__item-icon"><IconAlignLeft /></span>
        </ToggleGroupItem>
        <ToggleGroupItem value="center">
          <span className="toggle-group__item-icon"><IconAlignCenter /></span>
        </ToggleGroupItem>
        <ToggleGroupItem value="right">
          <span className="toggle-group__item-icon"><IconAlignRight /></span>
        </ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

/* ---- With Text Labels ---- */

export const WithLabels: Story = {
  render: (args) => {
    const [value, setValue] = useState('monthly');
    return (
      <ToggleGroup type="single" variant={args.variant} size={args.size} animated={args.animated} value={value} onValueChange={(v) => setValue(v as string)}>
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

/* ---- Disabled ---- */

export const Disabled: Story = {
  render: (args) => (
    <ToggleGroup type="single" variant={args.variant} size={args.size} animated={args.animated} value="left">
      <ToggleGroupItem value="left">
        <span className="toggle-group__item-icon"><IconAlignLeft /></span>
      </ToggleGroupItem>
      <ToggleGroupItem value="center" disabled>
        <span className="toggle-group__item-icon"><IconAlignCenter /></span>
      </ToggleGroupItem>
      <ToggleGroupItem value="right">
        <span className="toggle-group__item-icon"><IconAlignRight /></span>
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/* ---- Vertical ---- */

export const Vertical: Story = {
  args: { orientation: 'vertical', variant: 'outline' },
  render: (args) => {
    const [value, setValue] = useState('left');
    return (
      <ToggleGroup type="single" variant={args.variant} size={args.size} orientation={args.orientation} animated={args.animated} value={value} onValueChange={(v) => setValue(v as string)}>
        <ToggleGroupItem value="left">
          <span className="toggle-group__item-icon"><IconAlignLeft /></span>
        </ToggleGroupItem>
        <ToggleGroupItem value="center">
          <span className="toggle-group__item-icon"><IconAlignCenter /></span>
        </ToggleGroupItem>
        <ToggleGroupItem value="right">
          <span className="toggle-group__item-icon"><IconAlignRight /></span>
        </ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

/* ---- All Sizes ---- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}>
      {(['xs', 's', 'm', 'l'] as const).map((size) => (
        <ToggleGroup key={size} type="single" size={size} value="center">
          <ToggleGroupItem value="left">
            <span className="toggle-group__item-icon"><IconAlignLeft /></span>
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <span className="toggle-group__item-icon"><IconAlignCenter /></span>
          </ToggleGroupItem>
          <ToggleGroupItem value="right">
            <span className="toggle-group__item-icon"><IconAlignRight /></span>
          </ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
};
