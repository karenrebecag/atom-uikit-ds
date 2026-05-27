import { useEffect, useState } from 'react';
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
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

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

const IconMsg = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const IconDoc = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

const IconBook = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

const IconBox = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
  </svg>
);

const IconGear = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.65.77 1.09 1.45 1.09H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const IconHelp = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r=".5" />
  </svg>
);

const IconUser = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const meta: Meta<typeof Sidebar> = {
  title: 'Molecules/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => {
    type Side = 'left' | 'right';

    const sideOptions: { value: Side; label: string }[] = [
      { value: 'left', label: 'Izquierda' },
      { value: 'right', label: 'Derecha' },
    ];

    const [side, setSide] = useState<Side>('left');
    const [withCollapsible, setWithCollapsible] = useState(true);
    const [withFooter, setWithFooter] = useState(true);
    const [withBadge, setWithBadge] = useState(true);

    const { animateTransition, transitionStyle } = useTransition();

    useEffect(() => {
      const cleanup = initSidebarAnimation();
      return cleanup;
    }, []);

    const sidebar = (
      <Sidebar side={side}>
        <SidebarHeader>
          <span style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>A</span>
          <span data-sidebar-label="" style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Atom UIKit</span>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Principal">
            <SidebarItem icon={<IconHome />} label="Inicio" href="#" active />
            <SidebarItem icon={<IconBell />} label="Notificaciones" href="#" badge={withBadge ? '3' : undefined} />
            <SidebarItem icon={<IconSearch />} label="Buscar" href="#" />
            <SidebarItem icon={<IconMsg />} label="Mensajes" href="#" />
          </SidebarGroup>
          <SidebarDivider />
          {withCollapsible ? (
            <SidebarGroup label="Documentacion">
              <SidebarCollapsible icon={<IconBook />} label="Guias" defaultOpen>
                <SidebarItem icon={<IconDoc />} label="Introduccion" href="#" />
                <SidebarItem icon={<IconDoc />} label="Instalacion" href="#" />
              </SidebarCollapsible>
              <SidebarCollapsible icon={<IconBox />} label="Componentes">
                <SidebarItem icon={<IconDoc />} label="Button" href="#" />
                <SidebarItem icon={<IconDoc />} label="Input" href="#" />
                <SidebarItem icon={<IconDoc />} label="Tabs" href="#" />
              </SidebarCollapsible>
            </SidebarGroup>
          ) : (
            <SidebarGroup label="Documentacion">
              <SidebarItem icon={<IconBook />} label="Guias" href="#" />
              <SidebarItem icon={<IconBox />} label="Componentes" href="#" />
            </SidebarGroup>
          )}
          <SidebarDivider />
          <SidebarGroup label="Sistema">
            <SidebarItem icon={<IconHelp />} label="Ayuda" href="#" />
            <SidebarItem icon={<IconGear />} label="Ajustes" href="#" />
          </SidebarGroup>
        </SidebarContent>
        {withFooter && (
          <SidebarFooter>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ width: 16, height: 16, color: 'var(--muted-foreground)' }}><IconUser /></span>
              </span>
              <div data-sidebar-label="" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>John Doe</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--muted-foreground)' }}>john@example.com</div>
              </div>
            </div>
          </SidebarFooter>
        )}
      </Sidebar>
    );

    const controls = (
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>
        <div>
          <div style={sectionLabelRow}><IconLayers />Lado</div>
          <Tabs value={side} onValueChange={(v) => animateTransition(() => setSide(v as Side))}>
            <TabsList animated>
              {sideOptions.map((o) => (
                <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div>
          <div style={sectionLabelRow}><IconSettings />Propiedades</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={switchRow}>
              <span style={switchLabel}>Collapsibles</span>
              <Toggle animated checked={withCollapsible} onChange={(v) => animateTransition(() => setWithCollapsible(v))} />
            </div>
            <div style={switchRow}>
              <span style={switchLabel}>Footer</span>
              <Toggle animated checked={withFooter} onChange={(v) => animateTransition(() => setWithFooter(v))} />
            </div>
            <div style={switchRow}>
              <span style={switchLabel}>Badge</span>
              <Toggle animated checked={withBadge} onChange={(v) => animateTransition(() => setWithBadge(v))} />
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <SidebarProvider>
        <div style={{ display: 'flex', height: 'calc(100vh - 32px)', margin: 16, border: 'var(--stroke-hairline) solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--background)' }}>
          {side === 'left' && sidebar}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <div style={{ ...transitionStyle, flex: 1, display: 'flex', justifyContent: 'center' }}>
              {controls}
            </div>
          </div>
          {side === 'right' && sidebar}
        </div>
      </SidebarProvider>
    );
  },
};
