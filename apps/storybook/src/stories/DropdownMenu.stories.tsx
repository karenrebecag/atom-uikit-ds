import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from '../../../../packages/components-react/src/molecules/DropdownMenu';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Avatar } from '../../../../packages/components-react/src/atoms/Avatar';
import { UserProfile } from '../../../../packages/components-react/src/molecules/UserProfile';

/* ---- Icons ---- */

const IconUser = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCreditCard = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconSettings = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.65.77 1.09 1.45 1.09H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const IconBell = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const IconLogOut = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconTrash = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const IconChevronUp = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const meta: Meta<typeof DropdownMenu> = {
  title: 'Molecules/DropdownMenu',
  component: DropdownMenu,
  argTypes: {
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
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
type Story = StoryObj<typeof DropdownMenu>;

/* ---- Default ---- */

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary" size="m">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => {}}>Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>Settings</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>Notifications</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => {}}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/* ---- With Icons ---- */

export const WithIcons: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary" size="m">Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => {}}>
            <span className="dropdown-menu__item-icon"><IconUser /></span>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>
            <span className="dropdown-menu__item-icon"><IconCreditCard /></span>
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>
            <span className="dropdown-menu__item-icon"><IconSettings /></span>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>
            <span className="dropdown-menu__item-icon"><IconBell /></span>
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => {}}>
          <span className="dropdown-menu__item-icon"><IconLogOut /></span>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/* ---- With Shortcuts ---- */

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary" size="m">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => {}}>
          New File
          <DropdownMenuShortcut>Ctrl+N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>
          Open
          <DropdownMenuShortcut>Ctrl+O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>
          Save
          <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => {}}>
          Export
          <DropdownMenuShortcut>Ctrl+E</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/* ---- Destructive ---- */

export const Destructive: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary" size="m">Manage</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => {}}>Archive</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={() => {}}>
          <span className="dropdown-menu__item-icon"><IconTrash /></span>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/* ---- Disabled Items ---- */

export const DisabledItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary" size="m">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled>Duplicate (unavailable)</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>Share</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled>Delete (no permission)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/* ---- Avatar Trigger (Account Switcher) ---- */

export const AvatarTrigger: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar type="image" shape="circle" size="m" src="https://i.pravatar.cc/80?u=dropdown" alt="User" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>john@example.com</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => {}}>
          <span className="dropdown-menu__item-icon"><IconUser /></span>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>
          <span className="dropdown-menu__item-icon"><IconSettings /></span>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => {}}>
          <span className="dropdown-menu__item-icon"><IconLogOut /></span>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/* ---- Sidebar User Menu (shadcn pattern) ---- */

export const SidebarUserMenu: Story = {
  render: () => (
    <div style={{ width: 256, padding: 12, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--sidebar-bg)' }}>
      <DropdownMenu>
        <DropdownMenuTrigger className="dropdown-menu__trigger" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <UserProfile name="John Doe" org="Atom Design" />
            <span style={{ marginLeft: 'auto', width: 16, height: 16, color: 'var(--muted-foreground)' }}>
              <IconChevronUp />
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start">
          <DropdownMenuLabel>John Doe</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => {}}>
              <span className="dropdown-menu__item-icon"><IconUser /></span>
              Account
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              <span className="dropdown-menu__item-icon"><IconCreditCard /></span>
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              <span className="dropdown-menu__item-icon"><IconBell /></span>
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => {}}>
            <span className="dropdown-menu__item-icon"><IconLogOut /></span>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/* ---- Top Aligned ---- */

export const TopAligned: Story = {
  decorators: [
    (Story) => (
      <div style={{ minHeight: 360, padding: 24, display: 'flex', alignItems: 'flex-end' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary" size="m">Open Up</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        <DropdownMenuItem onSelect={() => {}}>Option A</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>Option B</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>Option C</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
