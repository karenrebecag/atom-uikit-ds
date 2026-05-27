import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuItem, ContextMenuLabel, ContextMenuShortcut,
  ContextMenuSeparator,
} from '../../../../packages/components-react/src/molecules/ContextMenu';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

const IconCopy = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const IconScissors = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
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

type Scenario = 'browser' | 'editor' | 'file';

const meta: Meta<typeof ContextMenu> = {
  title: 'Molecules/ContextMenu',
  component: ContextMenu,
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => {
    const scenarioOptions: { value: Scenario; label: string }[] = [
      { value: 'browser', label: 'Navegador' },
      { value: 'editor', label: 'Editor' },
      { value: 'file', label: 'Archivo' },
    ];

    const [scenario, setScenario] = useState<Scenario>('editor');
    const [withIcons, setWithIcons] = useState(true);
    const [withShortcuts, setWithShortcuts] = useState(true);
    const [withDisabled, setWithDisabled] = useState(false);

    const { animateTransition } = useTransition();

    return (
      <div style={{ display: 'flex', gap: 'var(--spacing-6)', padding: 24, minHeight: 420 }}>
        {/* Controls */}
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
          <div>
            <div style={sectionLabelRow}><IconLayers />Escenario</div>
            <Tabs value={scenario} onValueChange={(v) => animateTransition(() => setScenario(v as Scenario))}>
              <TabsList animated>
                {scenarioOptions.map((o) => (
                  <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div>
            <div style={sectionLabelRow}><IconSettings />Propiedades</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={switchRow}>
                <span style={switchLabel}>Con iconos</span>
                <Toggle animated checked={withIcons} onChange={setWithIcons} />
              </div>
              <div style={switchRow}>
                <span style={switchLabel}>Shortcuts</span>
                <Toggle animated checked={withShortcuts} onChange={setWithShortcuts} />
              </div>
              <div style={switchRow}>
                <span style={switchLabel}>Items deshabilitados</span>
                <Toggle animated checked={withDisabled} onChange={setWithDisabled} />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 320, height: 180,
                border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)',
                color: 'var(--muted-foreground)', fontSize: 'var(--font-size-sm)', userSelect: 'none',
              }}>
                Click derecho aqui
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>

              {scenario === 'editor' && (
                <>
                  <ContextMenuItem onSelect={() => {}}>
                    {withIcons && <span className="dropdown-menu__item-icon"><IconScissors /></span>}
                    Cortar
                    {withShortcuts && <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>}
                  </ContextMenuItem>
                  <ContextMenuItem onSelect={() => {}}>
                    {withIcons && <span className="dropdown-menu__item-icon"><IconCopy /></span>}
                    Copiar
                    {withShortcuts && <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>}
                  </ContextMenuItem>
                  <ContextMenuItem onSelect={() => {}} disabled={withDisabled}>
                    {withIcons && <span className="dropdown-menu__item-icon"><IconClipboard /></span>}
                    Pegar
                    {withShortcuts && <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>}
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem variant="destructive" onSelect={() => {}}>
                    {withIcons && <span className="dropdown-menu__item-icon"><IconTrash /></span>}
                    Eliminar
                  </ContextMenuItem>
                </>
              )}

              {scenario === 'browser' && (
                <>
                  <ContextMenuItem onSelect={() => {}}>Atras</ContextMenuItem>
                  <ContextMenuItem onSelect={() => {}}>Adelante</ContextMenuItem>
                  <ContextMenuItem onSelect={() => {}}>
                    Recargar
                    {withShortcuts && <ContextMenuShortcut>Ctrl+R</ContextMenuShortcut>}
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onSelect={() => {}} disabled={withDisabled}>Ver fuente</ContextMenuItem>
                  <ContextMenuItem onSelect={() => {}}>Inspeccionar</ContextMenuItem>
                </>
              )}

              {scenario === 'file' && (
                <>
                  <ContextMenuLabel>Archivo</ContextMenuLabel>
                  <ContextMenuItem onSelect={() => {}}>Abrir</ContextMenuItem>
                  <ContextMenuItem onSelect={() => {}}>Renombrar</ContextMenuItem>
                  <ContextMenuItem onSelect={() => {}} disabled={withDisabled}>Mover</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem variant="destructive" onSelect={() => {}}>
                    {withIcons && <span className="dropdown-menu__item-icon"><IconTrash /></span>}
                    Eliminar
                  </ContextMenuItem>
                </>
              )}

            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
    );
  },
};
