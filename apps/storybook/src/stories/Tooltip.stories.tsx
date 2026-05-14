import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { IconButton } from '../../../../packages/components-react/src/atoms/IconButton';

const IconPlus = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const IconTrash = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
  </svg>
);

const meta: Meta = {
  title: 'Atoms/Tooltip',
  argTypes: {},
  decorators: [
    (Story) => (
      <div style={{ padding: '80px 120px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const Directions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', alignItems: 'center' }}>
      <Button variant="secondary" size="m" data-tooltip="Tooltip on top" data-tooltip-dir="top">
        Top
      </Button>
      <div style={{ display: 'flex', gap: '80px' }}>
        <Button variant="secondary" size="m" data-tooltip="Tooltip on left" data-tooltip-dir="left">
          Left
        </Button>
        <Button variant="secondary" size="m" data-tooltip="Tooltip on right" data-tooltip-dir="right">
          Right
        </Button>
      </div>
      <Button variant="secondary" size="m" data-tooltip="Tooltip on bottom" data-tooltip-dir="bottom">
        Bottom
      </Button>
    </div>
  ),
};

export const Themes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <Button variant="primary" size="m" data-tooltip="Dark theme (default)">
        Dark tooltip
      </Button>
      <Button variant="secondary" size="m" data-tooltip="Light theme" data-tooltip-theme="light">
        Light tooltip
      </Button>
    </div>
  ),
};

export const OnIconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <span data-tooltip="Add item" data-tooltip-dir="bottom">
        <IconButton icon={<IconPlus />} aria-label="Add" variant="primary" size="m" />
      </span>
      <span data-tooltip="Delete item" data-tooltip-dir="bottom" data-tooltip-theme="light">
        <IconButton icon={<IconTrash />} aria-label="Delete" variant="destructive-primary" size="m" />
      </span>
      <span data-tooltip="Settings" data-tooltip-dir="right">
        <IconButton icon={<IconPlus />} aria-label="Settings" variant="secondary" size="m" />
      </span>
    </div>
  ),
};
