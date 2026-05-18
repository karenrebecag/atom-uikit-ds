import { useState, useRef, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../../../../packages/components-react/src/atoms/Textarea';
import { Field } from '../../../../packages/components-react/src/atoms/Field';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconActivity, IconSettings, IconRuler } from '../utils/SectionIcons';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Forms/Textarea',
  component: Textarea,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    rows: { control: 'number' },
    className: { table: { disable: true } },
  },
  args: {
    placeholder: 'Escribe tu mensaje...',
    disabled: false,
    error: false,
    rows: 3,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

const MAX_CHARS = 200;

export const Default: Story = {
  render: () => {
    type TextareaState = 'default' | 'focus' | 'disabled' | 'error';
    type ResizeMode = 'vertical' | 'both' | 'none';
    const stateOpts: { value: TextareaState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'focus', label: 'Focus' },
      { value: 'disabled', label: 'Deshab.' },
      { value: 'error', label: 'Error' },
    ];
    const rowOpts: { value: string; label: string }[] = [
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '5', label: '5' },
      { value: '8', label: '8' },
    ];
    const resizeOpts: { value: ResizeMode; label: string }[] = [
      { value: 'vertical', label: 'Vertical' },
      { value: 'both', label: 'Ambos' },
      { value: 'none', label: 'Ninguno' },
    ];

    const [textareaState, setTextareaState] = useState<TextareaState>('default');
    const [rows, setRows] = useState('3');
    const [resizeMode, setResizeMode] = useState<ResizeMode>('vertical');
    const [showLabel, setShowLabel] = useState(true);
    const [showHelper, setShowHelper] = useState(false);
    const [showCounter, setShowCounter] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const { animateTransition, transitionStyle } = useTransition();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (textareaState === 'focus' && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [textareaState]);

    const isError = textareaState === 'error' || (showCounter && charCount > MAX_CHARS);
    const errorMsg = showCounter && charCount > MAX_CHARS
      ? `Excede el limite de ${MAX_CHARS} caracteres`
      : textareaState === 'error'
        ? 'Este campo es obligatorio'
        : undefined;

    const textarea = (
      <div style={{ position: 'relative' }}>
        <Textarea
          ref={textareaRef}
          placeholder="Escribe tu mensaje..."
          disabled={textareaState === 'disabled'}
          error={isError}
          rows={Number(rows)}
          style={{ resize: resizeMode }}
          maxLength={showCounter ? undefined : undefined}
          onChange={(e) => setCharCount(e.target.value.length)}
        />
        {showCounter && (
          <span
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontSize: '11px',
              fontFamily: 'var(--font-family-sans), system-ui, sans-serif',
              color: charCount > MAX_CHARS
                ? 'var(--destructive, #ef4444)'
                : 'var(--muted-foreground, #a1a1aa)',
              pointerEvents: 'none',
            }}
          >
            {charCount} / {MAX_CHARS}
          </span>
        )}
      </div>
    );

    const preview = showLabel || showHelper || isError ? (
      <Field
        label={showLabel ? 'Comentarios adicionales' : undefined}
        description={showHelper ? 'Se lo mas descriptivo posible' : undefined}
        error={errorMsg}
        htmlFor="preview-textarea"
      >
        {textarea}
      </Field>
    ) : textarea;

    return (
      <StoryPreviewLayout
        minHeight={420}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={textareaState} onValueChange={(v) => animateTransition(() => setTextareaState(v as TextareaState))}>
                <TabsList animated>
                  {stateOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconRuler />Filas</div>
              <Tabs value={rows} onValueChange={(v) => animateTransition(() => setRows(v))}>
                <TabsList animated>
                  {rowOpts.map((r) => (
                    <TabsTrigger key={r.value} value={r.value}>{r.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconRuler />Redimensionar</div>
              <Tabs value={resizeMode} onValueChange={(v) => animateTransition(() => setResizeMode(v as ResizeMode))}>
                <TabsList animated>
                  {resizeOpts.map((r) => (
                    <TabsTrigger key={r.value} value={r.value}>{r.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Etiqueta</span>
                  <Toggle animated checked={showLabel} onChange={setShowLabel} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Texto de ayuda</span>
                  <Toggle animated checked={showHelper} onChange={setShowHelper} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Contador ({MAX_CHARS})</span>
                  <Toggle animated checked={showCounter} onChange={setShowCounter} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div
          style={{
            width: '100%', maxWidth: '320px',
            ...transitionStyle,
          }}
        >
          {preview}
        </div>
      </StoryPreviewLayout>
    );
  },
};

export const AllStates: Story = {
  argTypes: {
    placeholder: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
    rows: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
      <Field label="Habilitado" htmlFor="ta-enabled">
        <Textarea id="ta-enabled" placeholder="Placeholder" />
      </Field>
      <Field label="Con valor" htmlFor="ta-filled">
        <Textarea id="ta-filled" defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
      </Field>
      <Field label="Deshabilitado" disabled htmlFor="ta-disabled">
        <Textarea id="ta-disabled" disabled placeholder="Deshabilitado" />
      </Field>
      <Field label="Error" error="Texto de soporte negativo" htmlFor="ta-error">
        <Textarea id="ta-error" error placeholder="Error" />
      </Field>
      <Field label="Error con valor" error="Texto de soporte negativo" htmlFor="ta-error-filled">
        <Textarea id="ta-error-filled" error defaultValue="Contenido invalido" />
      </Field>
    </div>
  ),
};
