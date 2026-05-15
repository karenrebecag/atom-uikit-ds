import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider, RangeSlider } from '../../../../packages/components-react/src/atoms/Slider';

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Forms/Slider',
  component: Slider,
  argTypes: {
    min: { control: 'number', name: 'Min' },
    max: { control: 'number', name: 'Max' },
    step: { control: 'number', name: 'Step' },
    disabled: { control: 'boolean', name: 'Disabled' },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360, padding: 'var(--spacing-4)' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Slider>;

/* ---- Default ---- */

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(50);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <Slider value={value} onValueChange={setValue} min={args.min} max={args.max} step={args.step} disabled={args.disabled} />
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Value: {value}</span>
      </div>
    );
  },
};

/* ---- With Steps ---- */

export const WithSteps: Story = {
  args: { step: 10 },
  render: (args) => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <Slider value={value} onValueChange={setValue} min={args.min} max={args.max} step={args.step} />
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Value: {value} (step: {args.step})</span>
      </div>
    );
  },
};

/* ---- Range ---- */

export const Range: Story = {
  render: (args) => {
    const [value, setValue] = useState<[number, number]>([25, 75]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <RangeSlider value={value} onValueChange={setValue} min={args.min} max={args.max} step={args.step} disabled={args.disabled} />
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Range: {value[0]} - {value[1]}</span>
      </div>
    );
  },
};

/* ---- Disabled ---- */

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Slider defaultValue={40} disabled={args.disabled} />
  ),
};

/* ---- Price Range (practical) ---- */

export const PriceRange: Story = {
  render: () => {
    const [value, setValue] = useState<[number, number]>([200, 800]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Price range</span>
        <RangeSlider value={value} onValueChange={setValue} min={0} max={1000} step={50} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
          <span>${value[0]}</span>
          <span>${value[1]}</span>
        </div>
      </div>
    );
  },
};
