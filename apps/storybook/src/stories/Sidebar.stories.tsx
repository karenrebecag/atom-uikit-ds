import type { Meta, StoryObj } from '@storybook/react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarTrigger,
  SidebarDivider,
} from '../../../../packages/components-react/src/molecules/sidebar';

const IconHome = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6.5L8 2l5.5 4.5V13a1 1 0 01-1 1h-10a1 1 0 01-1-1V6.5z" />
  </svg>
);

const IconDoc = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 2H4.5A1.5 1.5 0 003 3.5v9A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5V6L9 2z" />
    <path d="M9 2v4h4" />
  </svg>
);

const IconBox = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 5L8 2l5.5 3v6L8 14l-5.5-3V5z" />
    <path d="M8 8v6M8 8l5.5-3M8 8L2.5 5" />
  </svg>
);

const IconSettings = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="2" />
    <path d="M13.5 8a5.5 5.5 0 01-.3 1.8l1.2.7-1 1.7-1.2-.7a5.5 5.5 0 01-1.5 1V14h-2v-1.5a5.5 5.5 0 01-1.5-1l-1.2.7-1-1.7 1.2-.7A5.5 5.5 0 014.5 8c0-.6.1-1.2.3-1.8L3.6 5.5l1-1.7 1.2.7a5.5 5.5 0 011.5-1V2h2v1.5a5.5 5.5 0 011.5 1l1.2-.7 1 1.7-1.2.7c.2.6.3 1.2.3 1.8z" />
  </svg>
);

const IconUser = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="5" r="3" />
    <path d="M2.5 14a5.5 5.5 0 0111 0" />
  </svg>
);

const meta: Meta<typeof Sidebar> = {
  title: 'Molecules/Sidebar',
  component: Sidebar,
  argTypes: {
    side: { table: { disable: true } },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 500, display: 'flex', border: '1px solid #e4e4e7', borderRadius: 8, overflow: 'hidden' }}>
        <Story />
        <div style={{ flex: 1, padding: 24, background: '#fafafa' }}>
          <p style={{ fontSize: 13, color: '#71717b' }}>Main content area</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Atom UIKit</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Navigation">
            <SidebarItem icon={<IconHome />} label="Home" href="#" active />
            <SidebarItem icon={<IconDoc />} label="Documentation" href="#" badge="12" />
            <SidebarItem icon={<IconBox />} label="Components" href="#" />
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup label="Settings">
            <SidebarItem icon={<IconSettings />} label="Preferences" href="#" />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarItem icon={<IconUser />} label="Karen Ortiz" href="#" />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultCollapsed>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem icon={<IconHome />} label="Home" href="#" active />
            <SidebarItem icon={<IconDoc />} label="Documentation" href="#" />
            <SidebarItem icon={<IconBox />} label="Components" href="#" />
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup>
            <SidebarItem icon={<IconSettings />} label="Preferences" href="#" />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarItem icon={<IconUser />} label="Karen Ortiz" href="#" />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  ),
};
