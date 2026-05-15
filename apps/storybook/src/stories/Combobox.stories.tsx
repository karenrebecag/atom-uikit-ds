import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxSeparator,
} from '../../../../packages/components-react/src/molecules/Combobox';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

/* ---- Shared data ---- */

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'svelte', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

/* ---- Icons for CustomItems ---- */

const IconGlobe = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const IconServer = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <circle cx="6" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="6" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const IconZap = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconLayers = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconRocket = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const meta: Meta<typeof Combobox> = {
  title: 'Molecules/Combobox',
  component: Combobox,
  argTypes: {
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    autoHighlight: {
      control: 'boolean',
      name: 'Auto Highlight',
    },
  },
  args: {
    autoHighlight: false,
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 360, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

/* ---- Basic ---- */

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const selected = frameworks.find((f) => f.value === value);
    return (
      <Combobox value={value} onValueChange={setValue} autoHighlight={args.autoHighlight}>
        <ComboboxTrigger placeholder="Select framework...">
          {selected?.label}
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search framework..." />
          <ComboboxList>
            <ComboboxEmpty />
            {frameworks.map((f) => (
              <ComboboxItem key={f.value} value={f.value}>
                {f.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/* ---- Groups ---- */

export const Groups: Story = {
  render: (args) => {
    const [value, setValue] = useState('');

    const frontend = [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'angular', label: 'Angular' },
    ];

    const backend = [
      { value: 'node', label: 'Node.js' },
      { value: 'deno', label: 'Deno' },
      { value: 'bun', label: 'Bun' },
    ];

    const allItems = [...frontend, ...backend];
    const selected = allItems.find((f) => f.value === value);

    return (
      <Combobox value={value} onValueChange={setValue} autoHighlight={args.autoHighlight}>
        <ComboboxTrigger placeholder="Select technology...">
          {selected?.label}
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search..." />
          <ComboboxList>
            <ComboboxEmpty />
            <ComboboxGroup label="Frontend">
              {frontend.map((f) => (
                <ComboboxItem key={f.value} value={f.value}>
                  {f.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
            <ComboboxSeparator />
            <ComboboxGroup label="Backend">
              {backend.map((f) => (
                <ComboboxItem key={f.value} value={f.value}>
                  {f.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/* ---- Custom Items (rich content: icon + label + description) ---- */

export const CustomItems: Story = {
  render: (args) => {
    const [value, setValue] = useState('');

    const items = [
      { value: 'next', label: 'Next.js', desc: 'React framework for production', icon: <IconGlobe /> },
      { value: 'remix', label: 'Remix', desc: 'Full stack web framework', icon: <IconServer /> },
      { value: 'astro', label: 'Astro', desc: 'Content-driven websites', icon: <IconRocket /> },
      { value: 'svelte', label: 'SvelteKit', desc: 'Cybernetically enhanced apps', icon: <IconZap /> },
      { value: 'nuxt', label: 'Nuxt.js', desc: 'Intuitive Vue framework', icon: <IconLayers /> },
    ];

    const selected = items.find((f) => f.value === value);

    return (
      <Combobox value={value} onValueChange={setValue} autoHighlight={args.autoHighlight}>
        <ComboboxTrigger placeholder="Select framework...">
          {selected?.label}
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search framework..." />
          <ComboboxList>
            <ComboboxEmpty />
            {items.map((f) => (
              <ComboboxItem key={f.value} value={f.value} label={f.label}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <span style={{ width: 16, height: 16, flexShrink: 0, color: 'var(--muted-foreground)' }}>
                    {f.icon}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>{f.label}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--muted-foreground)' }}>{f.desc}</span>
                  </span>
                </span>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/* ---- Form (inside Field with invalid state) ---- */

export const Form: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const isInvalid = submitted && !value;
    const selected = frameworks.find((f) => f.value === value);

    return (
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 280 }}
      >
        <Field
          label="Framework"
          description="Choose your preferred framework."
          error={isInvalid ? 'Please select a framework.' : undefined}
        >
          <Combobox value={value} onValueChange={(v) => { setValue(v); setSubmitted(false); }} autoHighlight={args.autoHighlight}>
            <ComboboxTrigger placeholder="Select framework..." invalid={isInvalid}>
              {selected?.label}
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxInput placeholder="Search..." />
              <ComboboxList>
                <ComboboxEmpty />
                {frameworks.map((f) => (
                  <ComboboxItem key={f.value} value={f.value}>
                    {f.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
        <button
          type="submit"
          className="button button--primary button--m"
          style={{ alignSelf: 'flex-start' }}
        >
          Submit
        </button>
      </form>
    );
  },
};

/* ---- Auto Highlight ---- */

export const AutoHighlight: Story = {
  args: {
    autoHighlight: true,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    const selected = frameworks.find((f) => f.value === value);
    return (
      <Combobox value={value} onValueChange={setValue} autoHighlight={args.autoHighlight}>
        <ComboboxTrigger placeholder="Select framework...">
          {selected?.label}
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Type to highlight first match..." />
          <ComboboxList>
            <ComboboxEmpty />
            {frameworks.map((f) => (
              <ComboboxItem key={f.value} value={f.value}>
                {f.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/* ---- Disabled ---- */

export const Disabled: Story = {
  render: () => (
    <Combobox>
      <ComboboxTrigger placeholder="Select framework..." disabled />
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxList>
          {frameworks.map((f) => (
            <ComboboxItem key={f.value} value={f.value}>
              {f.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/* ---- Disabled Items ---- */

export const DisabledItems: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const items = [
      { value: 'next', label: 'Next.js', disabled: false },
      { value: 'gatsby', label: 'Gatsby (deprecated)', disabled: true },
      { value: 'remix', label: 'Remix', disabled: false },
      { value: 'cra', label: 'Create React App (deprecated)', disabled: true },
      { value: 'astro', label: 'Astro', disabled: false },
    ];
    const selected = items.find((f) => f.value === value);

    return (
      <Combobox value={value} onValueChange={setValue} autoHighlight={args.autoHighlight}>
        <ComboboxTrigger placeholder="Select framework...">
          {selected?.label}
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search..." />
          <ComboboxList>
            <ComboboxEmpty />
            {items.map((f) => (
              <ComboboxItem key={f.value} value={f.value} disabled={f.disabled}>
                {f.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};
