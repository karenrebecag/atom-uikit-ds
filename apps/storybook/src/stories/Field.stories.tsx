import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '../../../../packages/components-react/src/atoms/Field';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Textarea } from '../../../../packages/components-react/src/atoms/Textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../../../../packages/components-react/src/atoms/Select';
import { Checkbox } from '../../../../packages/components-react/src/atoms/Checkbox';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconActivity, IconSettings, IconBox } from '../utils/SectionIcons';

const IconMail = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="M2 5l6 4 6-4" />
  </svg>
);

const meta: Meta<typeof Field> = {
  title: 'Atoms/Forms/Field',
  component: Field,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    htmlFor: { table: { disable: true } },
  },
  args: {
    label: 'Email',
    description: '',
    error: '',
    required: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => {
    type FieldState = 'default' | 'disabled' | 'error';
    type ChildType = 'input' | 'textarea' | 'select' | 'checkbox';
    const stateOpts: { value: FieldState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'disabled', label: 'Deshab.' },
      { value: 'error', label: 'Error' },
    ];
    const childOpts: { value: ChildType; label: string }[] = [
      { value: 'input', label: 'Input' },
      { value: 'textarea', label: 'Textarea' },
      { value: 'select', label: 'Select' },
      { value: 'checkbox', label: 'Checkbox' },
    ];

    const [fieldState, setFieldState] = useState<FieldState>('default');
    const [childType, setChildType] = useState<ChildType>('input');
    const [showDescription, setShowDescription] = useState(true);
    const [isRequired, setIsRequired] = useState(false);
    const { animateTransition, transitionStyle } = useTransition();

    const isDisabled = fieldState === 'disabled';
    const isError = fieldState === 'error';

    const labels: Record<ChildType, string> = {
      input: 'Correo',
      textarea: 'Comentarios',
      select: 'Tema',
      checkbox: 'Preferencias',
    };
    const descriptions: Record<ChildType, string> = {
      input: 'Usaremos tu correo para notificaciones',
      textarea: 'Se lo mas descriptivo posible',
      select: 'Elige tu tema preferido',
      checkbox: 'Acepta los terminos para continuar',
    };
    const errors: Record<ChildType, string> = {
      input: 'El correo es obligatorio',
      textarea: 'Este campo es obligatorio',
      select: 'Selecciona una opcion',
      checkbox: 'Debes aceptar los terminos',
    };

    const renderChild = () => {
      switch (childType) {
        case 'input':
          return <Input placeholder="tu@ejemplo.com" iconLeft={<IconMail />} disabled={isDisabled} error={isError} />;
        case 'textarea':
          return <Textarea placeholder="Escribe aqui..." rows={3} disabled={isDisabled} error={isError} />;
        case 'select':
          return (
            <Select>
              <SelectTrigger placeholder="Selecciona..." disabled={isDisabled} invalid={isError} />
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          );
        case 'checkbox':
          return <Checkbox label="Acepto terminos y condiciones" disabled={isDisabled} error={isError} />;
      }
    };

    return (
      <StoryPreviewLayout
        minHeight={380}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconBox />Contenido</div>
              <Tabs value={childType} onValueChange={(v) => animateTransition(() => setChildType(v as ChildType))}>
                <TabsList animated>
                  {childOpts.map((c) => (
                    <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={fieldState} onValueChange={(v) => animateTransition(() => setFieldState(v as FieldState))}>
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
                  <span style={switchLabel}>Texto de ayuda</span>
                  <Toggle animated checked={showDescription} onChange={setShowDescription} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Obligatorio</span>
                  <Toggle animated checked={isRequired} onChange={setIsRequired} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ width: '100%', maxWidth: '300px', ...transitionStyle }}>
          <Field
            label={labels[childType]}
            description={showDescription ? descriptions[childType] : undefined}
            error={isError ? errors[childType] : undefined}
            required={isRequired}
            disabled={isDisabled}
          >
            {renderChild()}
          </Field>
        </div>
      </StoryPreviewLayout>
    );
  },
};
