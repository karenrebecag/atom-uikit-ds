import { useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TypographyH1, TypographyH2, TypographyH3, TypographyH4,
  TypographyP, TypographyLead, TypographyLarge, TypographySmall,
  TypographyMuted, TypographyBlockquote, TypographyInlineCode, TypographyList,
} from '../../../../packages/components-react/src/atoms/Typography';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { initTextReveal } from '../../../../packages/animations/src/text-reveal';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconActivity, IconSettings } from '../utils/SectionIcons';

const meta: Meta = {
  title: 'Atoms/Typography',
  argTypes: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'lead' | 'large' | 'small' | 'muted' | 'blockquote' | 'code' | 'list';
    type SplitType = 'lines' | 'words' | 'chars';

    const variantOpts: { value: Variant; label: string }[] = [
      { value: 'h1', label: 'H1' },
      { value: 'h2', label: 'H2' },
      { value: 'h3', label: 'H3' },
      { value: 'h4', label: 'H4' },
      { value: 'body', label: 'Body' },
      { value: 'lead', label: 'Lead' },
      { value: 'large', label: 'Large' },
      { value: 'small', label: 'Small' },
      { value: 'muted', label: 'Muted' },
      { value: 'blockquote', label: 'Quote' },
      { value: 'code', label: 'Code' },
      { value: 'list', label: 'Lista' },
    ];
    const splitOpts: { value: SplitType; label: string }[] = [
      { value: 'lines', label: 'Lineas' },
      { value: 'words', label: 'Palabras' },
      { value: 'chars', label: 'Caracteres' },
    ];

    const [variant, setVariant] = useState<Variant>('h1');
    const [animated, setAnimated] = useState(false);
    const [splitType, setSplitType] = useState<SplitType>('lines');
    const [key, setKey] = useState(0);
    const { animateTransition, transitionStyle } = useTransition();
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!animated || !previewRef.current) return;
      const cleanup = initTextReveal({ scope: previewRef.current });
      return cleanup;
    }, [animated, splitType, variant, key]);

    const handleAnimatedChange = (v: boolean) => {
      setAnimated(v);
      setKey((k) => k + 1);
    };

    const handleSplitChange = (v: string) => {
      animateTransition(() => setSplitType(v as SplitType));
      setKey((k) => k + 1);
    };

    const sampleText = 'El zorro veloz salta sobre el perro perezoso';
    const sampleParagraph = 'El rey, al ver lo felices que eran sus subditos, se dio cuenta del error de sus actos y derogo el impuesto a las bromas. La gente se regocijo y el reino se lleno de risas una vez mas.';

    const splitProps = animated ? { 'data-split': 'heading', 'data-split-reveal': splitType } as any : {};

    const renderVariant = () => {
      switch (variant) {
        case 'h1': return <TypographyH1 {...splitProps}>{sampleText}</TypographyH1>;
        case 'h2': return <TypographyH2 {...splitProps}>{sampleText}</TypographyH2>;
        case 'h3': return <TypographyH3 {...splitProps}>{sampleText}</TypographyH3>;
        case 'h4': return <TypographyH4 {...splitProps}>{sampleText}</TypographyH4>;
        case 'body': return <TypographyP {...splitProps}>{sampleParagraph}</TypographyP>;
        case 'lead': return <TypographyLead {...splitProps}>{sampleParagraph}</TypographyLead>;
        case 'large': return <TypographyLarge {...splitProps}>{sampleText}</TypographyLarge>;
        case 'small': return <TypographySmall {...splitProps}>{sampleText}</TypographySmall>;
        case 'muted': return <TypographyMuted {...splitProps}>{sampleText}</TypographyMuted>;
        case 'blockquote': return <TypographyBlockquote {...splitProps}>{sampleParagraph}</TypographyBlockquote>;
        case 'code': return <TypographyP>Usa <TypographyInlineCode>@atom-uikit/css</TypographyInlineCode> para instalar el paquete CSS.</TypographyP>;
        case 'list': return (
          <TypographyList>
            <li>Primer elemento de la lista</li>
            <li>Segundo elemento con mas detalle</li>
            <li>Tercer elemento para completar</li>
          </TypographyList>
        );
      }
    };

    return (
      <StoryPreviewLayout
        minHeight={320}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Variante</div>
              <Tabs value={variant} onValueChange={(v) => { animateTransition(() => setVariant(v as Variant)); setKey((k) => k + 1); }}>
                <TabsList animated>
                  {variantOpts.map((v) => (
                    <TabsTrigger key={v.value} value={v.value}>{v.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {animated && (
              <div>
                <div style={sectionLabelRow}><IconActivity />Animacion</div>
                <Tabs value={splitType} onValueChange={handleSplitChange}>
                  <TabsList animated>
                    {splitOpts.map((s) => (
                      <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Animado</span>
                  <Toggle animated checked={animated} onChange={handleAnimatedChange} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div ref={previewRef} key={key} style={{ maxWidth: '480px', ...transitionStyle }}>
          {renderVariant()}
        </div>
      </StoryPreviewLayout>
    );
  },
};

export const AllPrimitives: Story = Default;

export const TypeScale: Story = {
  name: 'Escala Major Third',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        { cls: 'display-xl', label: '6xl — 76px', text: 'Display XL' },
        { cls: 'display-lg', label: '5xl — 61px', text: 'Display Large' },
        { cls: 'h1', label: '4xl — 49px', text: 'Heading 1' },
        { cls: 'h2', label: '3xl — 39px', text: 'Heading 2' },
        { cls: 'h3', label: '2xl — 31px', text: 'Heading 3' },
        { cls: 'h4', label: 'xl — 25px', text: 'Heading 4' },
        { cls: 'h5', label: 'lg — 20px', text: 'Heading 5' },
        { cls: 'body', label: 'base — 16px', text: 'Body' },
        { cls: 'body-sm', label: 'sm — 13px', text: 'Body Small' },
        { cls: 'caption', label: 'sm — 13px', text: 'Caption' },
        { cls: 'label', label: 'xs — 10px', text: 'LABEL' },
      ].map((step) => (
        <div key={step.cls} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontSize: 10, color: 'var(--muted-foreground)', width: 100, flexShrink: 0, textAlign: 'right' }}>
            {step.label}
          </span>
          <span className={step.cls}>{step.text}</span>
        </div>
      ))}
    </div>
  ),
};
