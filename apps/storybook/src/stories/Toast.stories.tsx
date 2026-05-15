import type { Meta, StoryObj } from '@storybook/react';
import { Toaster, toast } from '../../../../packages/components-react/src/molecules/Toast';
import { Button } from '../../../../packages/components-react/src/atoms/Button';

const meta: Meta<typeof Toaster> = {
  title: 'Molecules/Toast',
  component: Toaster,
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
      name: 'Position',
    },
    className: { table: { disable: true } },
  },
  args: {
    position: 'bottom-right',
  },
  decorators: [
    (Story, context) => (
      <div style={{ minHeight: 200 }}>
        <Story />
        <Toaster position={context.args.position} />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <Button
      variant="secondary"
      size="m"
      onClick={() => toast('Event has been created.')}
    >
      Show Toast
    </Button>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button variant="secondary" size="s" onClick={() => toast('Default notification')}>
        Default
      </Button>
      <Button variant="secondary" size="s" onClick={() => toast.success('Changes saved successfully.')}>
        Success
      </Button>
      <Button variant="secondary" size="s" onClick={() => toast.error('Something went wrong.')}>
        Error
      </Button>
      <Button variant="secondary" size="s" onClick={() => toast.warning('Please review your input.')}>
        Warning
      </Button>
      <Button variant="secondary" size="s" onClick={() => toast.info('New version available.')}>
        Info
      </Button>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button
        variant="secondary"
        size="s"
        onClick={() => toast('Event Created', {
          description: 'Your event has been scheduled for tomorrow at 3pm.',
        })}
      >
        With Description
      </Button>
      <Button
        variant="secondary"
        size="s"
        onClick={() => toast.error('Upload Failed', {
          description: 'The file exceeds the maximum size of 10MB.',
        })}
      >
        Error + Description
      </Button>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      variant="secondary"
      size="m"
      onClick={() => toast('Item deleted.', {
        action: {
          label: 'Undo',
          onClick: () => toast.success('Item restored.'),
        },
      })}
    >
      Delete Item
    </Button>
  ),
};

export const LongDuration: Story = {
  render: () => (
    <Button
      variant="secondary"
      size="m"
      onClick={() => toast.info('This will stay for 10 seconds.', {
        duration: 10000,
        description: 'You can close it manually or wait.',
      })}
    >
      Long Toast (10s)
    </Button>
  ),
};

export const Stacked: Story = {
  render: () => {
    let count = 0;
    return (
      <Button
        variant="secondary"
        size="m"
        onClick={() => {
          count++;
          const variants = [toast, toast.success, toast.error, toast.warning, toast.info];
          const labels = ['Default', 'Success', 'Error', 'Warning', 'Info'];
          const i = count % variants.length;
          variants[i](`${labels[i]} notification #${count}`);
        }}
      >
        Stack Multiple
      </Button>
    );
  },
};
