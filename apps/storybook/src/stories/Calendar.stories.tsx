import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '../../../../packages/components-react/src/atoms/Calendar';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

const meta: Meta<typeof Calendar> = {
  title: 'Atoms/Forms/Calendar',
  component: Calendar,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    type Mode = 'single' | 'range';
    type Disabled = 'none' | 'weekends' | 'past';

    const modeOptions: { value: Mode; label: string }[] = [
      { value: 'single', label: 'Individual' },
      { value: 'range', label: 'Rango' },
    ];
    const disabledOptions: { value: Disabled; label: string }[] = [
      { value: 'none', label: 'Ninguno' },
      { value: 'weekends', label: 'Fines de sem.' },
      { value: 'past', label: 'Pasados' },
    ];

    const [mode, setMode] = useState<Mode>('single');
    const [disabled, setDisabled] = useState<Disabled>('none');
    const [preselected, setPreselected] = useState(false);

    // Single mode state
    const [date, setDate] = useState<Date | null>(null);
    // Range mode state
    const [from, setFrom] = useState<Date | null>(null);
    const [to, setTo] = useState<Date | null>(null);

    const { animateTransition, transitionStyle } = useTransition();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const disabledFn = disabled === 'weekends'
      ? (d: Date) => d.getDay() === 0 || d.getDay() === 6
      : disabled === 'past'
        ? (d: Date) => d.getTime() < today.getTime()
        : undefined;

    const handleModeChange = (v: string) => {
      animateTransition(() => {
        setMode(v as Mode);
        setDate(null);
        setFrom(null);
        setTo(null);
      });
    };

    const selectedLabel = mode === 'single'
      ? (date ? date.toLocaleDateString('es-MX') : 'Ninguna')
      : (from
        ? `${from.toLocaleDateString('es-MX')}${to ? ` - ${to.toLocaleDateString('es-MX')}` : ' - ...'}`
        : 'Ninguno');

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Modo</div>
              <Tabs value={mode} onValueChange={handleModeChange}>
                <TabsList animated>
                  {modeOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconLayers />Deshabilitados</div>
              <Tabs value={disabled} onValueChange={(v) => animateTransition(() => setDisabled(v as Disabled))}>
                <TabsList animated>
                  {disabledOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Preseleccionado (hoy)</span>
                  <Toggle animated checked={preselected} onChange={(v) => {
                    animateTransition(() => {
                      setPreselected(v);
                      if (v) { setDate(new Date()); setFrom(new Date()); setTo(null); }
                      else { setDate(null); setFrom(null); setTo(null); }
                    });
                  }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', fontSize: 'var(--font-size-xs)', color: 'var(--muted-foreground)' }}>
              {mode === 'single' ? 'Fecha' : 'Rango'}: {selectedLabel}
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <div style={transitionStyle}>
            <div style={{ display: 'inline-flex', border: 'var(--stroke-hairline) solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              {mode === 'single' ? (
                <Calendar
                  key={`single-${disabled}-${preselected}`}
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabledDates={disabledFn}
                />
              ) : (
                <Calendar
                  key={`range-${disabled}-${preselected}`}
                  mode="range"
                  rangeFrom={from}
                  rangeTo={to}
                  onRangeSelect={(f, t) => { setFrom(f); setTo(t); }}
                  disabledDates={disabledFn}
                />
              )}
            </div>
          </div>
        </div>
      </StoryPreviewLayout>
    );
  },
};
