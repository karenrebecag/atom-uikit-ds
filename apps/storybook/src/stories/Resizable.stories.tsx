import type { Meta, StoryObj } from '@storybook/react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../../../../packages/components-react/src/atoms/Resizable';

const PanelContent = ({ label, bg }: { label: string; bg?: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: 120,
      fontSize: 'var(--font-size-sm)',
      color: 'var(--muted-foreground)',
      backgroundColor: bg || 'var(--background)',
      padding: 'var(--spacing-4)',
    }}
  >
    {label}
  </div>
);

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Atoms/Layout/Resizable',
  component: ResizablePanelGroup,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      name: 'Orientation',
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, height: 360, border: 'var(--stroke-hairline) solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

/* ---- Default (2 panels) ---- */

export const Default: Story = {
  render: (args) => (
    <ResizablePanelGroup orientation={args.orientation}>
      <ResizablePanel index={0}>
        <PanelContent label="Panel A" />
      </ResizablePanel>
      <ResizableHandle index={0} />
      <ResizablePanel index={1}>
        <PanelContent label="Panel B" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/* ---- With Visible Handle ---- */

export const WithHandle: Story = {
  render: (args) => (
    <ResizablePanelGroup orientation={args.orientation}>
      <ResizablePanel index={0}>
        <PanelContent label="Panel A" />
      </ResizablePanel>
      <ResizableHandle index={0} withHandle />
      <ResizablePanel index={1}>
        <PanelContent label="Panel B" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/* ---- 3 Panels ---- */

export const ThreePanels: Story = {
  render: (args) => (
    <ResizablePanelGroup orientation={args.orientation} panels={3}>
      <ResizablePanel index={0}>
        <PanelContent label="Sidebar" bg="var(--muted)" />
      </ResizablePanel>
      <ResizableHandle index={0} withHandle />
      <ResizablePanel index={1}>
        <PanelContent label="Main" />
      </ResizablePanel>
      <ResizableHandle index={1} withHandle />
      <ResizablePanel index={2}>
        <PanelContent label="Inspector" bg="var(--muted)" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/* ---- Vertical ---- */

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <ResizablePanelGroup orientation={args.orientation}>
      <ResizablePanel index={0}>
        <PanelContent label="Header" bg="var(--muted)" />
      </ResizablePanel>
      <ResizableHandle index={0} withHandle />
      <ResizablePanel index={1}>
        <PanelContent label="Content" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/* ---- Nested (horizontal + vertical) ---- */

export const Nested: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel index={0}>
        <PanelContent label="Sidebar" bg="var(--muted)" />
      </ResizablePanel>
      <ResizableHandle index={0} withHandle />
      <ResizablePanel index={1}>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel index={0}>
            <PanelContent label="Editor" />
          </ResizablePanel>
          <ResizableHandle index={0} withHandle />
          <ResizablePanel index={1}>
            <PanelContent label="Terminal" bg="var(--muted)" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
