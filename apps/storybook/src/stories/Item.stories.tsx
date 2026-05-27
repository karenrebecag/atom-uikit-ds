import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Item, ItemMedia, ItemContent, ItemTitle, ItemDescription,
  ItemActions, ItemGroup, ItemSeparator,
} from '../../../../packages/components-react/src/atoms/Item';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconSettings } from '../utils/SectionIcons';

const IconShield = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconBell = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const IconMail = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
  </svg>
);

const IconLock = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const meta: Meta<typeof Item> = {
  title: 'Atoms/Layout/Item',
  component: Item,
};

export default meta;
type Story = StoryObj<typeof Item>;

export const Default: Story = {
  render: () => {
    type Variant = 'default' | 'outline' | 'muted';
    type Size = 'default' | 'sm' | 'xs';
    type Media = 'icon' | 'image' | 'none';

    const variantOptions: { value: Variant; label: string }[] = [
      { value: 'default', label: 'Default' },
      { value: 'outline', label: 'Outline' },
      { value: 'muted', label: 'Muted' },
    ];
    const sizeOptions: { value: Size; label: string }[] = [
      { value: 'default', label: 'Default' },
      { value: 'sm', label: 'SM' },
      { value: 'xs', label: 'XS' },
    ];
    const mediaOptions: { value: Media; label: string }[] = [
      { value: 'icon', label: 'Icono' },
      { value: 'image', label: 'Imagen' },
      { value: 'none', label: 'Sin media' },
    ];

    const [variant, setVariant] = useState<Variant>('default');
    const [size, setSize] = useState<Size>('default');
    const [media, setMedia] = useState<Media>('icon');
    const [showActions, setShowActions] = useState(true);
    const [showDescription, setShowDescription] = useState(true);
    const [asGroup, setAsGroup] = useState(false);

    const { animateTransition, transitionStyle } = useTransition();

    const items = [
      { icon: IconShield, title: 'Autenticacion', desc: 'Agrega una capa extra de seguridad.' },
      { icon: IconBell, title: 'Notificaciones', desc: 'Controla como recibes alertas.' },
      { icon: IconMail, title: 'Correo', desc: 'Configura tus preferencias de email.' },
      { icon: IconLock, title: 'Privacidad', desc: 'Controla tus datos y visibilidad.' },
    ];

    const renderItem = (item: typeof items[0], idx: number) => (
      <Item key={idx} variant={asGroup ? undefined : variant} size={size}>
        {media === 'icon' && (
          <ItemMedia variant="icon"><item.icon /></ItemMedia>
        )}
        {media === 'image' && (
          <ItemMedia variant="image">
            <img src={`https://picsum.photos/seed/item${idx}/96/96`} alt="" />
          </ItemMedia>
        )}
        <ItemContent>
          <ItemTitle>{item.title}</ItemTitle>
          {showDescription && <ItemDescription>{item.desc}</ItemDescription>}
        </ItemContent>
        {showActions && (
          <ItemActions>
            <Button variant="secondary" size="s">Editar</Button>
          </ItemActions>
        )}
      </Item>
    );

    const content = asGroup ? (
      <ItemGroup variant={variant === 'outline' ? 'outline' : 'default'}>
        {items.map((item, idx) => (
          <div key={idx}>
            {renderItem(item, idx)}
            {idx < items.length - 1 && <ItemSeparator />}
          </div>
        ))}
      </ItemGroup>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
        {items.slice(0, 3).map((item, idx) => renderItem(item, idx))}
      </div>
    );

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
              <div style={sectionLabelRow}><IconRuler />{`Tama\u00f1o`}</div>
              <Tabs value={size} onValueChange={(v) => animateTransition(() => setSize(v as Size))}>
                <TabsList animated>
                  {sizeOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconLayers />Media</div>
              <Tabs value={media} onValueChange={(v) => animateTransition(() => setMedia(v as Media))}>
                <TabsList animated>
                  {mediaOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Acciones</span>
                  <Toggle animated checked={showActions} onChange={(v) => animateTransition(() => setShowActions(v))} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>{`Descripci\u00f3n`}</span>
                  <Toggle animated checked={showDescription} onChange={(v) => animateTransition(() => setShowDescription(v))} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Como grupo</span>
                  <Toggle animated checked={asGroup} onChange={(v) => animateTransition(() => setAsGroup(v))} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <div style={{ ...transitionStyle, width: '100%', maxWidth: 480 }}>
            {content}
          </div>
        </div>
      </StoryPreviewLayout>
    );
  },
};
