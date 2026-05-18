import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { Divider } from '../../../../packages/components-react/src/atoms/Divider';

/* ---- Component icons ---- */

const IconSearch = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="7" cy="7" r="4" /><path d="M10 10l3.5 3.5" />
  </svg>
);

const IconMail = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="M2 5l6 4 6-4" />
  </svg>
);

const IconEye = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8z" /><circle cx="8" cy="8" r="2" />
  </svg>
);

const IconLock = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
  </svg>
);

const IconHash = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 2.5L4.5 13.5M11.5 2.5L10 13.5M2.5 5.5h11M2.5 10.5h11" />
  </svg>
);

const IconPhone = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 1.5h3l1.5 3.5-2 1.5a8 8 0 003.5 3.5l1.5-2 3.5 1.5v3c0 .5-.5 1.5-2 1.5C5.5 14.5 1.5 9 1.5 5c0-1.5 1-2 2-3.5z" />
  </svg>
);

const IconLink = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 9.5a3 3 0 004-4" /><path d="M9.5 6.5a3 3 0 00-4 4" /><path d="M5 11L3.5 12.5M11 5l1.5-1.5" />
  </svg>
);

/* ---- Section icons (14px) ---- */

const sIconSize = { width: 14, height: 14 };
const sIconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const SIconType = () => (
  <svg {...sIconSize} viewBox="0 0 24 24" {...sIconProps}>
    <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);
const SIconActivity = () => (
  <svg {...sIconSize} viewBox="0 0 24 24" {...sIconProps}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const SIconSettings = () => (
  <svg {...sIconSize} viewBox="0 0 24 24" {...sIconProps}>
    <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const SIconEye = () => (
  <svg {...sIconSize} viewBox="0 0 24 24" {...sIconProps}>
    <path d="M2.062 12.348a1 1 0 010-.696 10.75 10.75 0 0119.876 0 1 1 0 010 .696 10.75 10.75 0 01-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/* ---- Type config ---- */

const typeConfig: Record<string, { placeholder: string; left?: React.ReactNode; right?: React.ReactNode }> = {
  text: { placeholder: 'Escribe aqui...' },
  email: { placeholder: 'tu@ejemplo.com', left: <IconMail /> },
  password: { placeholder: 'Contrasena', left: <IconLock />, right: <IconEye /> },
  number: { placeholder: '0', left: <IconHash /> },
  search: { placeholder: 'Buscar...', left: <IconSearch /> },
  tel: { placeholder: '+52 555 000 0000', left: <IconPhone /> },
  url: { placeholder: 'https://', left: <IconLink /> },
};

const meta: Meta<typeof Input> = {
  title: 'Atoms/Forms/Input',
  component: Input,
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    placeholder: { control: 'text' },
    iconLeft: { control: 'boolean' },
    iconRight: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    className: { table: { disable: true } },
  },
  args: {
    type: 'email',
    placeholder: 'tu@ejemplo.com',
    iconLeft: true as any,
    iconRight: false as any,
    disabled: false,
    error: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => {
    type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
    type InputState = 'default' | 'disabled' | 'error';
    const typeOpts: { value: InputType; label: string }[] = [
      { value: 'text', label: 'Texto' },
      { value: 'email', label: 'Email' },
      { value: 'password', label: 'Password' },
      { value: 'number', label: 'Numero' },
      { value: 'search', label: 'Buscar' },
      { value: 'tel', label: 'Tel' },
      { value: 'url', label: 'URL' },
    ];
    const stateOpts: { value: InputState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'disabled', label: 'Deshab.' },
      { value: 'error', label: 'Error' },
    ];

    const [inputType, setInputType] = useState<InputType>('email');
    const [inputState, setInputState] = useState<InputState>('default');
    const [iconLeft, setIconLeft] = useState(true);
    const [iconRight, setIconRight] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    const config = typeConfig[inputType];

    const animateTransition = (fn: () => void) => {
      setTransitioning(true);
      setTimeout(() => { fn(); setTransitioning(false); }, 200);
    };

    const sectionLabelRow: React.CSSProperties = {
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.08em', color: 'var(--muted-foreground, #a1a1aa)', marginBottom: '8px',
    };
    const switchRow: React.CSSProperties = {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0',
    };
    const switchLabel: React.CSSProperties = {
      fontSize: '13px', color: 'var(--foreground, #fafafa)',
    };
    const glass: React.CSSProperties = {
      position: 'relative', borderRadius: '20px', overflow: 'hidden', isolation: 'isolate',
      backdropFilter: 'saturate(120%) blur(16px)', WebkitBackdropFilter: 'saturate(120%) blur(16px)',
      background: 'color-mix(in srgb, var(--card, #27272a) 55%, transparent)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
      border: '1px solid color-mix(in srgb, var(--border, #3f3f46) 40%, transparent)',
    };
    const glassLayer = (
      <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', opacity: 0.04, backgroundColor: '#d4d4d4' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'overlay' as const, boxShadow: 'inset 0.28em 0.28em 0.09em -0.33em rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'plus-lighter' as const, boxShadow: 'inset 0.19em 0.28em 0.09em -0.19em rgba(179,179,179,0.35)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'overlay' as const, boxShadow: 'inset -0.19em -0.28em 0.09em -0.19em rgba(179,179,179,0.2)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'darken' as const, boxShadow: 'inset 0 0 1.75em rgba(242,242,242,0.05)' }} />
      </div>
    );

    return (
      <div style={{ ...glass, display: 'flex', flexDirection: 'row', height: '100%', minHeight: '360px', margin: '12px' }}>
        {glassLayer}

        {/* Controls */}
        <div style={{ position: 'relative', zIndex: 1, width: '300px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>

          <div>
            <div style={sectionLabelRow}><SIconType />Tipo</div>
            <Tabs value={inputType} onValueChange={(v) => animateTransition(() => setInputType(v as InputType))}>
              <TabsList animated>
                {typeOpts.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div>
            <div style={sectionLabelRow}><SIconActivity />Estado</div>
            <Tabs value={inputState} onValueChange={(v) => animateTransition(() => setInputState(v as InputState))}>
              <TabsList animated>
                {stateOpts.map((s) => (
                  <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div>
            <div style={sectionLabelRow}><SIconSettings />Propiedades</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={switchRow}>
                <span style={switchLabel}>Icono izquierda</span>
                <Toggle animated checked={iconLeft} onChange={setIconLeft} />
              </div>
              <div style={switchRow}>
                <span style={switchLabel}>Icono derecha</span>
                <Toggle animated checked={iconRight} onChange={setIconRight} />
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'stretch', padding: '16px 0' }}>
          <Divider orientation="vertical" />
        </div>

        {/* Preview */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: '1', padding: '24px' }}>
          <div style={{ ...sectionLabelRow, marginBottom: '0' }}><SIconEye />Preview</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1' }}>
            <div
              style={{
                width: '100%', maxWidth: '280px',
                transition: 'opacity 0.2s cubic-bezier(0.625, 0.05, 0, 1), transform 0.2s cubic-bezier(0.625, 0.05, 0, 1)',
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? 'scale(0.92)' : 'scale(1)',
              }}
            >
              <Input
                type={inputType}
                placeholder={config.placeholder}
                disabled={inputState === 'disabled'}
                error={inputState === 'error'}
                iconLeft={iconLeft ? config.left : undefined}
                iconRight={iconRight ? config.right : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const AllStates: Story = {
  argTypes: {
    type: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    iconLeft: { table: { disable: true } },
    iconRight: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
      <Field label="Habilitado" htmlFor="s-enabled">
        <Input id="s-enabled" placeholder="Habilitado" iconLeft={<IconSearch />} iconRight={<IconEye />} />
      </Field>
      <Field label="Con valor" htmlFor="s-filled">
        <Input id="s-filled" defaultValue="Hola mundo" iconLeft={<IconSearch />} iconRight={<IconEye />} />
      </Field>
      <Field label="Deshabilitado" disabled htmlFor="s-disabled">
        <Input id="s-disabled" disabled placeholder="Deshabilitado" iconLeft={<IconSearch />} iconRight={<IconEye />} />
      </Field>
      <Field label="Error" error="Texto de soporte negativo" htmlFor="s-error">
        <Input id="s-error" error placeholder="Error" iconLeft={<IconSearch />} iconRight={<IconEye />} />
      </Field>
      <Field label="Error con valor" error="Texto de soporte negativo" htmlFor="s-error-filled">
        <Input id="s-error-filled" error defaultValue="invalido@" iconLeft={<IconSearch />} iconRight={<IconEye />} />
      </Field>
    </div>
  ),
};
