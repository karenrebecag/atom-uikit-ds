import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../../../packages/components-react/src/atoms/Avatar';

const sampleImg = 'https://i.pravatar.cc/150?img=12';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Indicators/Avatar',
  component: Avatar,
  argTypes: {
    type: {
      control: 'select',
      options: ['image', 'image-border', 'initials', 'icon'],
      name: 'Type',
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
      name: 'Shape',
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l'],
      name: 'Size',
    },
    status: { control: 'boolean', name: 'Status dot' },
    skeleton: { control: 'boolean', name: 'Skeleton' },
    src: { table: { disable: true } },
    alt: { table: { disable: true } },
    initials: { table: { disable: true } },
    icon: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    type: 'image-border',
    shape: 'circle',
    size: 's',
    status: true,
    skeleton: false,
    src: sampleImg,
    initials: 'KO',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const AllTypes: Story = {
  argTypes: {
    type: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} type="image" src={sampleImg} />
        <p style={{ fontSize: 10, color: '#71717b', marginTop: 4 }}>Image</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} type="image-border" src={sampleImg} />
        <p style={{ fontSize: 10, color: '#71717b', marginTop: 4 }}>Image border</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} type="initials" initials="KO" />
        <p style={{ fontSize: 10, color: '#71717b', marginTop: 4 }}>Initials</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} type="icon" />
        <p style={{ fontSize: 10, color: '#71717b', marginTop: 4 }}>Icon</p>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} size="xs" src={sampleImg} />
        <p style={{ fontSize: 10, color: '#71717b', marginTop: 4 }}>XS</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} size="s" src={sampleImg} />
        <p style={{ fontSize: 10, color: '#71717b', marginTop: 4 }}>S</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} size="m" src={sampleImg} />
        <p style={{ fontSize: 10, color: '#71717b', marginTop: 4 }}>M</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} size="l" src={sampleImg} />
        <p style={{ fontSize: 10, color: '#71717b', marginTop: 4 }}>L</p>
      </div>
    </div>
  ),
};

export const Shapes: Story = {
  argTypes: {
    shape: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '16px 24px', alignItems: 'center' }}>
      <strong style={{ fontSize: 10, color: '#71717b' }}>Circle</strong>
      <Avatar {...args} shape="circle" type="image-border" size="s" src={sampleImg} />
      <Avatar {...args} shape="circle" type="initials" size="s" initials="KO" />
      <Avatar {...args} shape="circle" type="icon" size="s" />

      <strong style={{ fontSize: 10, color: '#71717b' }}>Square</strong>
      <Avatar {...args} shape="square" type="image-border" size="s" src={sampleImg} />
      <Avatar {...args} shape="square" type="initials" size="s" initials="KO" />
      <Avatar {...args} shape="square" type="icon" size="s" />
    </div>
  ),
};

export const Skeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar size="xs" skeleton shape="circle" />
      <Avatar size="s" skeleton shape="circle" />
      <Avatar size="m" skeleton shape="circle" />
      <Avatar size="l" skeleton shape="circle" />
      <Avatar size="s" skeleton shape="square" />
      <Avatar size="m" skeleton shape="square" />
    </div>
  ),
};
