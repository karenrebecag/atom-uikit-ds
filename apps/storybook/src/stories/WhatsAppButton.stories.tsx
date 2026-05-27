import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { initButtonHover } from '../../../../packages/animations/src/button-hover';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconRuler, IconActivity, IconSettings } from '../utils/SectionIcons';

/* ------------------------------------------------------------------ */
/*  WhatsApp icon                                                      */
/* ------------------------------------------------------------------ */

const IconWhatsApp = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  WhatsApp green — overrides DS button tokens                        */
/* ------------------------------------------------------------------ */

const waStyleOverride: React.CSSProperties = {
  '--button-bg-primary': '#25D366',
  '--button-hover-bg-primary': '#1EB854',
  '--button-pressed-bg-primary': '#189E48',
  '--button-fg-primary': '#FFFFFF',
} as React.CSSProperties;

/* ------------------------------------------------------------------ */
/*  Animation scope                                                    */
/* ------------------------------------------------------------------ */

const AnimationScope = ({ children, deps }: { children: React.ReactNode; deps: any[] }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const id = requestAnimationFrame(() => {
      initButtonHover({ scope: ref.current ?? undefined });
    });
    return () => cancelAnimationFrame(id);
  }, deps);

  return <div ref={ref}>{children}</div>;
};

/* ------------------------------------------------------------------ */
/*  Storybook meta                                                     */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Integraciones/WhatsApp Button',
};

export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/*  Default story                                                      */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: () => {
    const sizeOptions: { value: 'xs' | 's' | 'm' | 'l' | 'xl'; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
    ];
    const stateOptions: { value: 'default' | 'disabled'; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'disabled', label: 'Deshab.' },
    ];

    const [size, setSize] = useState<'xs' | 's' | 'm' | 'l' | 'xl'>('m');
    const [buttonState, setButtonState] = useState<'default' | 'disabled'>('default');
    const [animated, setAnimated] = useState(true);
    const [iconLeft, setIconLeft] = useState(true);
    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        minHeight={480}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconRuler />{`Tama\u00f1o`}</div>
              <Tabs value={size} onValueChange={(v) => animateTransition(() => setSize(v as typeof size))}>
                <TabsList animated>
                  {sizeOptions.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={buttonState} onValueChange={(v) => animateTransition(() => setButtonState(v as typeof buttonState))}>
                <TabsList animated>
                  {stateOptions.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
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
                  <span style={switchLabel}>Icono WhatsApp</span>
                  <Toggle animated checked={iconLeft} onChange={setIconLeft} />
                </div>
              </div>
            </div>

          </>
        }
      >
        <AnimationScope deps={[size, buttonState, animated, iconLeft]}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <div style={transitionStyle}>
              <Button
                variant="primary"
                size={size}
                disabled={buttonState === 'disabled'}
                animated={animated}
                iconLeft={iconLeft ? <IconWhatsApp /> : undefined}
                style={waStyleOverride}
              >
                Habla con nosotros
              </Button>
            </div>
          </div>
        </AnimationScope>
      </StoryPreviewLayout>
    );
  },
};
