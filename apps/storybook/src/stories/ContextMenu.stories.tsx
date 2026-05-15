import type { Meta, StoryObj } from '@storybook/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuSeparator,
} from '../../../../packages/components-react/src/molecules/ContextMenu';

const IconCopy = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const IconScissors = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const IconClipboard = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </svg>
);

const IconTrash = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const meta: Meta<typeof ContextMenu> = {
  title: 'Molecules/ContextMenu',
  component: ContextMenu,
  argTypes: {
    children: { table: { disable: true } },
    className: { table: { disable: true } },
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
type Story = StoryObj<typeof ContextMenu>;

const TriggerZone = ({ children }: { children?: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 320,
      height: 180,
      border: '1px dashed var(--border)',
      borderRadius: 'var(--radius-lg)',
      color: 'var(--muted-foreground)',
      fontSize: 'var(--font-size-sm)',
      userSelect: 'none',
    }}
  >
    {children || 'Right-click here'}
  </div>
);

/* ---- Default ---- */

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerZone />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => {}}>Back</ContextMenuItem>
        <ContextMenuItem onSelect={() => {}}>Forward</ContextMenuItem>
        <ContextMenuItem onSelect={() => {}}>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => {}}>View Source</ContextMenuItem>
        <ContextMenuItem onSelect={() => {}}>Inspect</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/* ---- With Icons ---- */

export const WithIcons: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerZone />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => {}}>
          <span className="dropdown-menu__item-icon"><IconScissors /></span>
          Cut
          <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => {}}>
          <span className="dropdown-menu__item-icon"><IconCopy /></span>
          Copy
          <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => {}}>
          <span className="dropdown-menu__item-icon"><IconClipboard /></span>
          Paste
          <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onSelect={() => {}}>
          <span className="dropdown-menu__item-icon"><IconTrash /></span>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/* ---- With Groups ---- */

export const WithGroups: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerZone />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Edit</ContextMenuLabel>
        <ContextMenuItem onSelect={() => {}}>Undo</ContextMenuItem>
        <ContextMenuItem onSelect={() => {}}>Redo</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Selection</ContextMenuLabel>
        <ContextMenuItem onSelect={() => {}}>Select All</ContextMenuItem>
        <ContextMenuItem onSelect={() => {}}>Deselect</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onSelect={() => {}}>Clear All</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/* ---- Disabled Items ---- */

export const DisabledItems: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerZone />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => {}}>Cut</ContextMenuItem>
        <ContextMenuItem onSelect={() => {}}>Copy</ContextMenuItem>
        <ContextMenuItem disabled>Paste (clipboard empty)</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" disabled>Delete (no selection)</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
