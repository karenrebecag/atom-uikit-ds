import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from '../../../../packages/components-react/src/atoms/Tag';

const IconStar = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="currentColor" stroke="none">
    <path d="M8 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L8 10.67l-3.52 1.68.67-3.93L2.3 5.64l3.94-.57L8 1.5z" />
  </svg>
);

const intents = ['success', 'warning', 'danger', 'info', 'neutral', 'brand', 'ai', 'disabled'] as const;

const meta: Meta<typeof Tag> = {
  title: 'Atoms/Indicators/Tag',
  component: Tag,
  argTypes: {
    variant: {
      control: 'select',
      options: ['ghost', 'filled', 'outlined'],
      name: 'Variant',
    },
    intent: {
      control: 'select',
      options: [...intents],
      name: 'Intent',
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm'],
      name: 'Size',
    },
    dot: { control: 'boolean', name: 'Dot' },
    icon: {
      control: 'boolean',
      mapping: { true: <IconStar />, false: undefined },
      name: 'Icon',
    },
    children: { control: 'text', name: 'Label' },
    avatar: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    variant: 'filled',
    intent: 'success',
    size: 's',
    dot: false,
    icon: false as any,
    children: 'Label',
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {};

export const AllIntents: Story = {
  argTypes: {
    intent: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <strong style={{ fontSize: 11, color: '#71717b', display: 'block', marginBottom: 8 }}>Filled</strong>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {intents.map((i) => <Tag key={i} {...args} variant="filled" intent={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</Tag>)}
        </div>
      </div>
      <div>
        <strong style={{ fontSize: 11, color: '#71717b', display: 'block', marginBottom: 8 }}>Ghost</strong>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {intents.map((i) => <Tag key={i} {...args} variant="ghost" intent={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</Tag>)}
        </div>
      </div>
      <div>
        <strong style={{ fontSize: 11, color: '#71717b', display: 'block', marginBottom: 8 }}>Outlined</strong>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {intents.map((i) => <Tag key={i} {...args} variant="outlined" intent={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</Tag>)}
        </div>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Tag {...args} size="xs">XS</Tag>
      <Tag {...args} size="s">S</Tag>
      <Tag {...args} size="m">M</Tag>
    </div>
  ),
};

export const WithFeatures: Story = {
  argTypes: {
    dot: { table: { disable: true } },
    icon: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Tag {...args} intent="success" dot>With dot</Tag>
        <Tag {...args} intent="warning" dot>With dot</Tag>
        <Tag {...args} intent="danger" dot>With dot</Tag>
        <Tag {...args} intent="info" dot>With dot</Tag>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Tag {...args} intent="brand" icon={<IconStar />}>With icon</Tag>
        <Tag {...args} intent="ai" icon={<IconStar />}>With icon</Tag>
        <Tag {...args} intent="neutral" icon={<IconStar />}>With icon</Tag>
      </div>
    </div>
  ),
};
