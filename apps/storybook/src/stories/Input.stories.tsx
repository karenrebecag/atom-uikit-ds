import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconType, IconActivity, IconSettings } from '../utils/SectionIcons';

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
    const { animateTransition, transitionStyle } = useTransition();

    const config = typeConfig[inputType];

    return (
      <StoryPreviewLayout
        minHeight={360}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconType />Tipo</div>
              <Tabs value={inputType} onValueChange={(v) => animateTransition(() => setInputType(v as InputType))}>
                <TabsList animated>
                  {typeOpts.map((t) => (
                    <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={inputState} onValueChange={(v) => animateTransition(() => setInputState(v as InputState))}>
                <TabsList animated>
                  {stateOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
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
          </>
        }
      >
        <div
          style={{
            width: '100%', maxWidth: '280px',
            ...transitionStyle,
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
      </StoryPreviewLayout>
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
