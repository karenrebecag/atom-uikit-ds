import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
} from '../../../../packages/components-react/src/atoms/Select';
import { Field } from '../../../../packages/components-react/src/atoms/Field';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconActivity, IconSettings, IconBox } from '../utils/SectionIcons';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Forms/Select',
  component: Select,
  argTypes: {
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => {
    type SelectState = 'default' | 'disabled' | 'error';
    type ContentType = 'simple' | 'groups' | 'scrollable';
    const stateOpts: { value: SelectState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'disabled', label: 'Deshab.' },
      { value: 'error', label: 'Error' },
    ];
    const contentOpts: { value: ContentType; label: string }[] = [
      { value: 'simple', label: 'Simple' },
      { value: 'groups', label: 'Grupos' },
      { value: 'scrollable', label: 'Largo' },
    ];

    const [selectState, setSelectState] = useState<SelectState>('default');
    const [contentType, setContentType] = useState<ContentType>('simple');
    const [showLabel, setShowLabel] = useState(true);
    const [showHelper, setShowHelper] = useState(false);
    const [hasDisabledItems, setHasDisabledItems] = useState(false);
    const [value, setValue] = useState('');
    const { animateTransition, transitionStyle } = useTransition();

    const isError = selectState === 'error';
    const isDisabled = selectState === 'disabled';

    const renderContent = () => {
      switch (contentType) {
        case 'simple':
          return (
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Oscuro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
              {hasDisabledItems && <SelectItem value="custom" disabled>Personalizado (pronto)</SelectItem>}
            </SelectContent>
          );
        case 'groups':
          return (
            <SelectContent>
              <SelectGroup label="Norteamerica">
                <SelectItem value="est">Este (EST)</SelectItem>
                <SelectItem value="cst">Centro (CST)</SelectItem>
                <SelectItem value="pst">Pacifico (PST)</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup label="Europa">
                <SelectItem value="gmt">GMT</SelectItem>
                <SelectItem value="cet">Central (CET)</SelectItem>
                {hasDisabledItems && <SelectItem value="eet" disabled>Este (EET) — no disponible</SelectItem>}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup label="Asia">
                <SelectItem value="ist">India (IST)</SelectItem>
                <SelectItem value="jst">{`Jap\u00f3n (JST)`}</SelectItem>
              </SelectGroup>
            </SelectContent>
          );
        case 'scrollable':
          return (
            <SelectContent>
              {Array.from({ length: 15 }, (_, i) => (
                <SelectItem
                  key={`opt-${i + 1}`}
                  value={`opt-${i + 1}`}
                  disabled={hasDisabledItems && (i === 4 || i === 9)}
                >
                  {`Opci\u00f3n ${i + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          );
      }
    };

    const placeholders: Record<ContentType, string> = {
      simple: 'Selecciona tema...',
      groups: 'Zona horaria...',
      scrollable: 'Selecciona opcion...',
    };

    const select = (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger
          placeholder={placeholders[contentType]}
          disabled={isDisabled}
          invalid={isError}
        />
        {renderContent()}
      </Select>
    );

    const preview = showLabel || showHelper || isError ? (
      <Field
        label={showLabel ? (contentType === 'groups' ? 'Zona horaria' : 'Tema') : undefined}
        description={showHelper ? 'Elige la opcion que prefieras' : undefined}
        error={isError ? 'Este campo es obligatorio' : undefined}
        disabled={isDisabled}
      >
        {select}
      </Field>
    ) : select;

    return (
      <StoryPreviewLayout
        minHeight={420}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconBox />Contenido</div>
              <Tabs value={contentType} onValueChange={(v) => { setValue(''); animateTransition(() => setContentType(v as ContentType)); }}>
                <TabsList animated>
                  {contentOpts.map((c) => (
                    <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={selectState} onValueChange={(v) => animateTransition(() => setSelectState(v as SelectState))}>
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
                  <span style={switchLabel}>Etiqueta</span>
                  <Toggle animated checked={showLabel} onChange={setShowLabel} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Texto de ayuda</span>
                  <Toggle animated checked={showHelper} onChange={setShowHelper} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Items deshabilitados</span>
                  <Toggle animated checked={hasDisabledItems} onChange={setHasDisabledItems} />
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
          {preview}
        </div>
      </StoryPreviewLayout>
    );
  },
};

/* ---- Form validation ---- */

export const Form: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const isInvalid = submitted && !value;

    return (
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 280 }}
      >
        <Field
          label="Tema"
          description="Elige tu tema preferido."
          error={isInvalid ? 'Selecciona un tema.' : undefined}
        >
          <Select value={value} onValueChange={(v) => { setValue(v); setSubmitted(false); }}>
            <SelectTrigger placeholder="Selecciona tema..." invalid={isInvalid} />
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Oscuro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Button variant="primary" size="m" type="submit" style={{ alignSelf: 'flex-start' }}>
          Enviar
        </Button>
      </form>
    );
  },
};
