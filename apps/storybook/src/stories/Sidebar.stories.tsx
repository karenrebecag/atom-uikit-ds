import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { initSidebarAnimation } from '../../../../packages/animations/src/sidebar';
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
  SidebarCollapsible,
} from '../../../../packages/components-react/src/molecules/sidebar';
import { UserProfile } from '../../../../packages/components-react/src/molecules/UserProfile';

const AtomLogo = () => (
  <img src="/Logo Mark - Atom.svg" alt="Atom" width="24" height="24" />
);

// Lucide icons (viewBox 0 0 24 24)
const IconHome = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const IconBell = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const IconSearch = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const IconMessageSquare = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconBox = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const IconSettings = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconHelpCircle = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const IconDoc = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
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
    (Story) => {
      useEffect(() => {
        const cleanup = initSidebarAnimation();
        return cleanup;
      }, []);
      return (
      <div style={{ height: 500, display: 'flex', border: '1px solid #e4e4e7', borderRadius: 8, overflow: 'hidden' }}>
        <Story />
        <div style={{ flex: 1, padding: 24, background: '#fafafa' }}>
          <p style={{ fontSize: 13, color: '#71717b' }}>Main content area</p>
        </div>
      </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <AtomLogo />
          <span data-sidebar-label="" style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Atom UIKit</span>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Main">
            <SidebarItem icon={<IconHome />} label="Home" href="#" active />
            <SidebarItem icon={<IconBell />} label="Notifications" href="#" />
            <SidebarItem icon={<IconSearch />} label="Search" href="#" />
            <SidebarItem icon={<IconMessageSquare />} label="Messages" href="#" />
            <SidebarItem icon={<IconBox />} label="Components" href="#" badge="12" />
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup label="Settings">
            <SidebarItem icon={<IconHelpCircle />} label="Help" href="#" />
            <SidebarItem icon={<IconSettings />} label="Settings" href="#" />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserProfile name="John Doe" org="Atom Design" />
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
          <AtomLogo />
          <span data-sidebar-label="" style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Atom UIKit</span>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem icon={<IconHome />} label="Home" href="#" active />
            <SidebarItem icon={<IconBell />} label="Notifications" href="#" />
            <SidebarItem icon={<IconSearch />} label="Search" href="#" />
            <SidebarItem icon={<IconMessageSquare />} label="Messages" href="#" />
            <SidebarItem icon={<IconBox />} label="Components" href="#" />
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup>
            <SidebarItem icon={<IconHelpCircle />} label="Help" href="#" />
            <SidebarItem icon={<IconSettings />} label="Settings" href="#" />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserProfile name="John Doe" org="Atom Design" />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  ),
};

const IconCode = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4L1.5 8 5 12M11 4l3.5 4L11 12" />
  </svg>
);

const IconPalette = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="10" cy="6" r="1" fill="currentColor" />
    <circle cx="6" cy="10" r="1" fill="currentColor" />
  </svg>
);

const IconBook = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h4.5a2 2 0 012 2v8.5a1.5 1.5 0 00-1.5-1.5H2V3zM14 3H9.5a2 2 0 00-2 2v8.5A1.5 1.5 0 019 12h5V3z" />
  </svg>
);

export const WithCollapsible: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <AtomLogo />
          <span data-sidebar-label="" style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Atom UIKit</span>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Documentation">
            <SidebarCollapsible icon={<IconBook />} label="Getting Started" defaultOpen>
              <SidebarItem icon={<IconDoc />} label="Introduction" href="#" active />
              <SidebarItem icon={<IconDoc />} label="Installation" href="#" />
              <SidebarItem icon={<IconDoc />} label="Quick Start" href="#" />
            </SidebarCollapsible>
            <SidebarCollapsible icon={<IconPalette />} label="Foundations">
              <SidebarItem icon={<IconDoc />} label="Colors" href="#" />
              <SidebarItem icon={<IconDoc />} label="Typography" href="#" />
              <SidebarItem icon={<IconDoc />} label="Spacing" href="#" />
            </SidebarCollapsible>
            <SidebarCollapsible icon={<IconCode />} label="Components">
              <SidebarItem icon={<IconDoc />} label="Button" href="#" />
              <SidebarItem icon={<IconDoc />} label="Input" href="#" />
              <SidebarItem icon={<IconDoc />} label="Checkbox" href="#" />
              <SidebarItem icon={<IconDoc />} label="Tag" href="#" />
            </SidebarCollapsible>
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup label="Settings">
            <SidebarItem icon={<IconSettings />} label="Preferences" href="#" />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserProfile name="John Doe" org="Atom Design" />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  ),
};
