import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { initWhatsAppButton } from '../../../../packages/whatsapp/src/button';
import type { ButtonVariant, ButtonSize, CTA } from '../../../../packages/whatsapp/src/config';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconSettings, IconBox, IconType } from '../utils/SectionIcons';

const meta: Meta = {
  title: 'Integraciones/WhatsApp Button',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const variantOptions: { value: ButtonVariant; label: string }[] = [
      { value: 'inline', label: 'Inline' },
      { value: 'pill', label: 'Pill' },
      { value: 'icon', label: 'Icon' },
    ];
    const sizeOptions: { value: ButtonSize; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
    ];
    const ctaOptions: { value: CTA; label: string }[] = [
      { value: 'default', label: 'Default' },
      { value: 'agendar_demo', label: 'Demo' },
      { value: 'hablar_asesor', label: 'Asesor' },
      { value: 'consultar_precio', label: 'Precio' },
      { value: 'demo_5min', label: '5 Min' },
    ];
    const langOptions: { value: 'es' | 'en' | 'pt'; label: string }[] = [
      { value: 'es', label: 'ES' },
      { value: 'en', label: 'EN' },
      { value: 'pt', label: 'PT' },
    ];

    const [variant, setVariant] = useState<ButtonVariant>('inline');
    const [size, setSize] = useState<ButtonSize>('m');
    const [cta, setCta] = useState<CTA>('default');
    const [lang, setLang] = useState<'es' | 'en' | 'pt'>('es');
    const [animated, setAnimated] = useState(true);
    const { animateTransition, transitionStyle } = useTransition();

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      // Clear previous render
      containerRef.current.querySelectorAll('.atom-wa-btn').forEach((el) => el.remove());
      document.querySelectorAll('body > .atom-wa-btn').forEach((el) => el.remove());
      document.getElementById('atom-wa-styles')?.remove();

      const anchor = containerRef.current.querySelector('[data-wa-anchor]') as HTMLElement;

      const cleanup = initWhatsAppButton({
        companyToken: 'story-preview',
        phone: '5215535150142',
        variant,
        size,
        cta,
        lang,
        animated,
        mode: 'float',
        openInNewTab: true,
      }, anchor || undefined);

      // For pill/icon, move the floating button into the preview container
      if (variant === 'pill' || variant === 'icon') {
        const floatingBtn = document.querySelector('body > .atom-wa-btn') as HTMLElement;
        if (floatingBtn && containerRef.current) {
          floatingBtn.style.position = 'static';
          containerRef.current.appendChild(floatingBtn);
        }
      }

      return cleanup;
    }, [variant, size, cta, lang, animated]);

    return (
      <StoryPreviewLayout
        minHeight={420}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Variante</div>
              <Tabs value={variant} onValueChange={(v) => animateTransition(() => setVariant(v as ButtonVariant))}>
                <TabsList animated>
                  {variantOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value} style={{ flex: 1 }}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconRuler />{`Tama\u00f1o`}</div>
              <Tabs value={size} onValueChange={(v) => animateTransition(() => setSize(v as ButtonSize))}>
                <TabsList animated>
                  {sizeOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value} style={{ flex: 1 }}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconBox />CTA</div>
              <Tabs value={cta} onValueChange={(v) => animateTransition(() => setCta(v as CTA))}>
                <TabsList animated>
                  {ctaOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value} style={{ flex: 1 }}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconType />Idioma</div>
              <Tabs value={lang} onValueChange={(v) => animateTransition(() => setLang(v as typeof lang))}>
                <TabsList animated>
                  {langOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value} style={{ flex: 1 }}>{o.label}</TabsTrigger>
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
              </div>
            </div>
          </>
        }
      >
        <div
          ref={containerRef}
          style={{
            ...transitionStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <span data-wa-anchor style={{ display: 'none' }} />
        </div>
      </StoryPreviewLayout>
    );
  },
};
