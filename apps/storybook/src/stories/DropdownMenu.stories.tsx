import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuGroup,
  DropdownMenuShortcut, DropdownMenuSeparator,
} from '../../../../packages/components-react/src/molecules/DropdownMenu';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

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

const IconLogOut = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconTrash = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

type Scenario = 'account' | 'actions' | 'manage';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Molecules/DropdownMenu',
  component: DropdownMenu,
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => {
    const scenarioOptions: { value: Scenario; label: string }[] = [
      { value: 'account', label: 'Cuenta' },
      { value: 'actions', label: 'Acciones' },
      { value: 'manage', label: 'Gestionar' },
    ];

    const [scenario, setScenario] = useState<Scenario>('account');
    const [withIcons, setWithIcons] = useState(true);
    const [withShortcuts, setWithShortcuts] = useState(false);
    const [withDisabled, setWithDisabled] = useState(false);

    const { animateTransition } = useTransition();

    return (
      <div style={{ display: 'flex', gap: 'var(--spacing-6)', padding: 24, minHeight: 480 }}>
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="secondary" size="m">
                {scenario === 'account' ? 'Mi cuenta' : scenario === 'actions' ? 'Acciones' : 'Gestionar'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>

              {scenario === 'account' && (
                <>
                  <DropdownMenuLabel>john@example.com</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => {}}>
                      {withIcons && <span className="dropdown-menu__item-icon"><IconUser /></span>}
                      Perfil
                      {withShortcuts && <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {}}>
                      {withIcons && <span className="dropdown-menu__item-icon"><IconGear /></span>}
                      Ajustes
                      {withShortcuts && <DropdownMenuShortcut>Ctrl+,</DropdownMenuShortcut>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {}} disabled={withDisabled}>
                      {withIcons && <span className="dropdown-menu__item-icon"><IconBell /></span>}
                      Notificaciones
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => {}}>
                    {withIcons && <span className="dropdown-menu__item-icon"><IconLogOut /></span>}
                    Cerrar sesion
                  </DropdownMenuItem>
                </>
              )}

              {scenario === 'actions' && (
                <>
                  <DropdownMenuItem onSelect={() => {}}>
                    Nuevo archivo
                    {withShortcuts && <DropdownMenuShortcut>Ctrl+N</DropdownMenuShortcut>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => {}}>
                    Abrir
                    {withShortcuts && <DropdownMenuShortcut>Ctrl+O</DropdownMenuShortcut>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => {}} disabled={withDisabled}>
                    Guardar
                    {withShortcuts && <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => {}}>
                    Exportar
                    {withShortcuts && <DropdownMenuShortcut>Ctrl+E</DropdownMenuShortcut>}
                  </DropdownMenuItem>
                </>
              )}

              {scenario === 'manage' && (
                <>
                  <DropdownMenuItem onSelect={() => {}}>Editar</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => {}} disabled={withDisabled}>Duplicar</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => {}}>Archivar</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => {}}>
                    {withIcons && <span className="dropdown-menu__item-icon"><IconTrash /></span>}
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  },
};
