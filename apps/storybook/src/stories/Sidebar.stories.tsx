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

// Simple stroke icons (viewBox 0 0 24 24, no fill)
const IconHome = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z" />
    <path d="M9 21v-7h6v7" />
  </svg>
);

const IconBell = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const IconSearch = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const IconMessageSquare = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const IconBox = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
  </svg>
);

const IconSettings = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15.2 19.1L14.2 22H9.8L8.8 19.1L7.5 18.3L4.5 18.9L2.2 15.1L4.3 12.8V11.2L2.2 8.9L4.5 5.1L7.5 5.7L8.8 4.9L9.8 2H14.2L15.2 4.9L16.5 5.7L19.5 5.1L21.8 8.9L19.7 11.2V12.8L21.8 15.1L19.5 18.9L16.5 18.3L15.2 19.1Z" />
    <circle cx="12" cy="12" r="3" strokeMiterlimit="10" />
  </svg>
);

const IconHelpCircle = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r=".5" />
  </svg>
);

const IconDoc = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
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
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', border: '1px solid #e4e4e7', borderRadius: 8 }}>
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

const IconCode = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
  </svg>
);

const IconPalette = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="9" cy="9" r="1.5" stroke="none" fill="currentColor" />
    <circle cx="15" cy="9" r="1.5" stroke="none" fill="currentColor" />
    <circle cx="9" cy="15" r="1.5" stroke="none" fill="currentColor" />
  </svg>
);

const IconBook = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

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
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup label="Documentation">
            <SidebarCollapsible icon={<IconBook />} label="Getting Started" defaultOpen>
              <SidebarItem icon={<IconDoc />} label="Introduction" href="#" />
              <SidebarItem icon={<IconDoc />} label="Installation" href="#" />
              <SidebarItem icon={<IconDoc />} label="Quick Start" href="#" />
            </SidebarCollapsible>
            <SidebarCollapsible icon={<IconPalette />} label="Foundations">
              <SidebarItem icon={<IconDoc />} label="Colors" href="#" />
              <SidebarItem icon={<IconDoc />} label="Typography" href="#" />
              <SidebarItem icon={<IconDoc />} label="Spacing" href="#" />
            </SidebarCollapsible>
            <SidebarCollapsible icon={<IconCode />} label="Components">
              <SidebarItem icon={<IconBox />} label="Button" href="#" badge="12" />
              <SidebarItem icon={<IconDoc />} label="Input" href="#" />
              <SidebarItem icon={<IconDoc />} label="Checkbox" href="#" />
              <SidebarItem icon={<IconDoc />} label="Tag" href="#" />
            </SidebarCollapsible>
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
