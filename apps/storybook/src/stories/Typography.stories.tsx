import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TypographyH1, TypographyH2, TypographyH3, TypographyH4,
  TypographyP, TypographyLead, TypographyLarge, TypographySmall,
  TypographyMuted, TypographyBlockquote, TypographyInlineCode, TypographyList,
} from '../../../../packages/components-react/src/atoms/Typography';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { StoryPreviewLayout, sectionLabelRow, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers } from '../utils/SectionIcons';

const meta: Meta = {
  title: 'Atoms/Typography',
  argTypes: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'lead' | 'large' | 'small' | 'muted' | 'blockquote' | 'code' | 'list';

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

    const [variant, setVariant] = useState<Variant>('h1');
    const { animateTransition, transitionStyle } = useTransition();

    const sampleText = 'El zorro veloz salta sobre el perro perezoso';
    const sampleParagraph = 'El rey, al ver lo felices que eran sus subditos, se dio cuenta del error de sus actos y derogo el impuesto a las bromas. La gente se regocijo y el reino se lleno de risas una vez mas.';

    const renderVariant = () => {
      switch (variant) {
        case 'h1': return <TypographyH1>{sampleText}</TypographyH1>;
        case 'h2': return <TypographyH2>{sampleText}</TypographyH2>;
        case 'h3': return <TypographyH3>{sampleText}</TypographyH3>;
        case 'h4': return <TypographyH4>{sampleText}</TypographyH4>;
        case 'body': return <TypographyP>{sampleParagraph}</TypographyP>;
        case 'lead': return <TypographyLead>{sampleParagraph}</TypographyLead>;
        case 'large': return <TypographyLarge>{sampleText}</TypographyLarge>;
        case 'small': return <TypographySmall>{sampleText}</TypographySmall>;
        case 'muted': return <TypographyMuted>{sampleText}</TypographyMuted>;
        case 'blockquote': return <TypographyBlockquote>{sampleParagraph}</TypographyBlockquote>;
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
          <div>
            <div style={sectionLabelRow}><IconLayers />Variante</div>
            <Tabs value={variant} onValueChange={(v) => animateTransition(() => setVariant(v as Variant))}>
              <TabsList animated>
                {variantOpts.map((v) => (
                  <TabsTrigger key={v.value} value={v.value}>{v.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        }
      >
        <div style={{ maxWidth: '480px', ...transitionStyle }}>
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
