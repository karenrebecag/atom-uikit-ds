import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconSettings } from '../utils/SectionIcons';

const IconUser = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const IconGear = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.65.77 1.09 1.45 1.09H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const IconBell = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const tabItems = [
  { value: 'cuenta', label: 'Cuenta', icon: IconUser },
  { value: 'ajustes', label: 'Ajustes', icon: IconGear },
  { value: 'notificaciones', label: 'Notificaciones', icon: IconBell },
];

const meta: Meta<typeof Tabs> = {
  title: 'Atoms/Navigation/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => {
    type Variant = 'default' | 'line';
    type Orientation = 'horizontal' | 'vertical';

    const variantOptions: { value: Variant; label: string }[] = [
      { value: 'default', label: 'Pill' },
      { value: 'line', label: 'Line' },
    ];
    const orientationOptions: { value: Orientation; label: string }[] = [
      { value: 'horizontal', label: 'Horizontal' },
      { value: 'vertical', label: 'Vertical' },
    ];

    const [variant, setVariant] = useState<Variant>('default');
    const [orientation, setOrientation] = useState<Orientation>('horizontal');
    const [animated, setAnimated] = useState(true);
    const [withIcons, setWithIcons] = useState(false);
    const [withDisabled, setWithDisabled] = useState(false);

    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Variante</div>
              <Tabs value={variant} onValueChange={(v) => animateTransition(() => setVariant(v as Variant))}>
                <TabsList animated>
                  {variantOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconRuler />{`Orientaci\u00f3n`}</div>
              <Tabs value={orientation} onValueChange={(v) => animateTransition(() => setOrientation(v as Orientation))}>
                <TabsList animated>
                  {orientationOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Animado</span>
                  <Toggle animated checked={animated} onChange={setAnimated} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Con iconos</span>
                  <Toggle animated checked={withIcons} onChange={setWithIcons} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Tab deshabilitada</span>
                  <Toggle animated checked={withDisabled} onChange={(v) => animateTransition(() => setWithDisabled(v))} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <div style={{ ...transitionStyle, width: orientation === 'horizontal' ? '100%' : undefined, maxWidth: 480 }}>
            <Tabs defaultValue="cuenta" orientation={orientation}>
              <TabsList variant={variant} animated={animated}>
                {tabItems.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    disabled={withDisabled && tab.value === 'notificaciones'}
                  >
                    {withIcons && <span className="tabs__trigger-icon"><tab.icon /></span>}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabItems.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
                    Contenido de {tab.label.toLowerCase()}.
                  </p>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </StoryPreviewLayout>
    );
  },
};
