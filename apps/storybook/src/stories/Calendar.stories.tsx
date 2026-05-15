import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '../../../../packages/components-react/src/atoms/Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Atoms/Forms/Calendar',
  component: Calendar,
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range'],
      name: 'Mode',
    },
    className: { table: { disable: true } },
    selected: { table: { disable: true } },
    rangeFrom: { table: { disable: true } },
    rangeTo: { table: { disable: true } },
    onSelect: { table: { disable: true } },
    onRangeSelect: { table: { disable: true } },
    disabledDates: { table: { disable: true } },
  },
  args: {
    mode: 'single',
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'inline-flex', border: 'var(--stroke-hairline) solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

/* ---- Single ---- */

export const Single: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}>
        <Calendar mode="single" selected={date} onSelect={setDate} />
        {date && (
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)', padding: '0 var(--spacing-3)' }}>
            Selected: {date.toLocaleDateString()}
          </span>
        )}
      </div>
    );
  },
};

/* ---- Range ---- */

export const Range: Story = {
  args: { mode: 'range' },
  render: () => {
    const [from, setFrom] = useState<Date | null>(null);
    const [to, setTo] = useState<Date | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}>
        <Calendar
          mode="range"
          rangeFrom={from}
          rangeTo={to}
          onRangeSelect={(f, t) => { setFrom(f); setTo(t); }}
        />
        {from && (
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)', padding: '0 var(--spacing-3)' }}>
            {from.toLocaleDateString()} {to ? `- ${to.toLocaleDateString()}` : '(select end date)'}
          </span>
        )}
      </div>
    );
  },
};

/* ---- Disabled Dates (weekends) ---- */

export const DisabledWeekends: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabledDates={(d) => d.getDay() === 0 || d.getDay() === 6}
      />
    );
  },
};

/* ---- Disabled Past Dates ---- */

export const DisabledPast: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabledDates={(d) => d.getTime() < today.getTime()}
      />
    );
  },
};

/* ---- Preselected ---- */

export const Preselected: Story = {
  render: () => {
    const [date, setDate] = useState<Date>(new Date());
    return <Calendar mode="single" selected={date} onSelect={setDate} />;
  },
};
