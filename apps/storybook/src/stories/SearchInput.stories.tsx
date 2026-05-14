import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from '../../../../packages/components-react/src/atoms/SearchInput';

const InteractiveSearch = (args: any) => {
  const [value, setValue] = useState('');
  return (
    <SearchInput
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue('')}
    />
  );
};

const FilledSearch = () => {
  const [value, setValue] = useState('Components');
  return (
    <SearchInput
      placeholder="Search..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue('')}
    />
  );
};

const meta: Meta<typeof SearchInput> = {
  title: 'Atoms/SearchInput',
  component: SearchInput,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placeholder: { control: 'text', name: 'Placeholder' },
    disabled: { control: 'boolean', name: 'Disabled' },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    onClear: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: {
    placeholder: 'Search...',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: (args) => <InteractiveSearch {...args} />,
};

export const AllStates: Story = {
  argTypes: {
    placeholder: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
      <div>
        <strong style={{ fontSize: 11, color: '#71717b', display: 'block', marginBottom: 8 }}>Enabled (empty)</strong>
        <SearchInput placeholder="Search..." value="" onChange={() => {}} />
      </div>
      <div>
        <strong style={{ fontSize: 11, color: '#71717b', display: 'block', marginBottom: 8 }}>Filled (with clear)</strong>
        <FilledSearch />
      </div>
      <div>
        <strong style={{ fontSize: 11, color: '#71717b', display: 'block', marginBottom: 8 }}>Disabled</strong>
        <SearchInput placeholder="Search..." disabled />
      </div>
    </div>
  ),
};
