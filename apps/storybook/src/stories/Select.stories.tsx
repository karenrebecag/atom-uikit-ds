import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
} from '../../../../packages/components-react/src/atoms/Select';
import { Field } from '../../../../packages/components-react/src/atoms/Field';
import { Button } from '../../../../packages/components-react/src/atoms/Button';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Forms/Select',
  component: Select,
  argTypes: {
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 320, padding: 24, maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Select>;

/* ---- Default ---- */

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger placeholder="Select theme..." />
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

/* ---- Groups ---- */

export const Groups: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger placeholder="Select timezone..." />
        <SelectContent>
          <SelectGroup label="North America">
            <SelectItem value="est">Eastern (EST)</SelectItem>
            <SelectItem value="cst">Central (CST)</SelectItem>
            <SelectItem value="mst">Mountain (MST)</SelectItem>
            <SelectItem value="pst">Pacific (PST)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup label="Europe">
            <SelectItem value="gmt">GMT</SelectItem>
            <SelectItem value="cet">Central European (CET)</SelectItem>
            <SelectItem value="eet">Eastern European (EET)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup label="Asia">
            <SelectItem value="ist">India (IST)</SelectItem>
            <SelectItem value="jst">Japan (JST)</SelectItem>
            <SelectItem value="cst-cn">China (CST)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
};

/* ---- Scrollable ---- */

export const Scrollable: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const items = Array.from({ length: 20 }, (_, i) => ({
      value: `item-${i + 1}`,
      label: `Option ${i + 1}`,
    }));
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger placeholder="Select option..." />
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
};

/* ---- Disabled ---- */

export const Disabled: Story = {
  render: () => (
    <Select>
      <SelectTrigger placeholder="Select theme..." disabled />
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/* ---- Disabled Items ---- */

export const DisabledItems: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger placeholder="Select plan..." />
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise" disabled>Enterprise (contact sales)</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

/* ---- Form (Invalid) ---- */

export const Form: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const isInvalid = submitted && !value;

    return (
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <Field
          label="Theme"
          description="Choose your preferred theme."
          error={isInvalid ? 'Please select a theme.' : undefined}
        >
          <Select value={value} onValueChange={(v) => { setValue(v); setSubmitted(false); }}>
            <SelectTrigger placeholder="Select theme..." invalid={isInvalid} />
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Button variant="primary" size="m" type="submit" style={{ alignSelf: 'flex-start' }}>
          Submit
        </Button>
      </form>
    );
  },
};
