import { useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from '../../../../packages/components-react/src/atoms/ToggleGroup';
import { initButtonHover } from '../../../../packages/animations/src/button-hover';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconActivity, IconSettings, IconLayout } from '../utils/SectionIcons';

/* ---- Component icons ---- */

const IconBold = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
    <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
  </svg>
);

const IconItalic = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const IconUnderline = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v7a6 6 0 0012 0V3" /><line x1="4" y1="21" x2="20" y2="21" />
  </svg>
);

const IconAlignLeft = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
  </svg>
);

const IconAlignCenter = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" />
  </svg>
);

const IconAlignRight = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" />
  </svg>
);

const meta: Meta<typeof ToggleGroup> = {
  title: 'Atoms/Buttons/ToggleGroup',
  component: ToggleGroup,
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    variant: { control: 'select', options: ['default', 'outline'] },
    size: { control: 'select', options: ['xs', 's', 'm', 'l'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    animated: { control: 'boolean' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: {
    type: 'single',
    variant: 'default',
    size: 'm',
    orientation: 'horizontal',
    animated: false,
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  render: () => {
    type SelectionType = 'single' | 'multiple';
    type Variant = 'default' | 'outline';
    type Size = 'xs' | 's' | 'm' | 'l';
    type Orientation = 'horizontal' | 'vertical';
    type ContentType = 'icons' | 'text';

    const typeOpts: { value: SelectionType; label: string }[] = [
      { value: 'single', label: 'Simple' },
      { value: 'multiple', label: 'Multiple' },
    ];
    const variantOpts: { value: Variant; label: string }[] = [
      { value: 'default', label: 'Default' },
      { value: 'outline', label: 'Outline' },
    ];
    const sizeOpts: { value: Size; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
    ];
    const orientationOpts: { value: Orientation; label: string }[] = [
      { value: 'horizontal', label: 'Horizontal' },
      { value: 'vertical', label: 'Vertical' },
    ];
    const contentOpts: { value: ContentType; label: string }[] = [
      { value: 'icons', label: 'Iconos' },
      { value: 'text', label: 'Texto' },
    ];

    const [selType, setSelType] = useState<SelectionType>('single');
    const [variant, setVariant] = useState<Variant>('default');
    const [size, setSize] = useState<Size>('m');
    const [orientation, setOrientation] = useState<Orientation>('horizontal');
    const [contentType, setContentType] = useState<ContentType>('icons');
    const [animated, setAnimated] = useState(false);
    const [singleValue, setSingleValue] = useState('left');
    const [multiValue, setMultiValue] = useState<string[]>(['bold']);
    const { animateTransition, transitionStyle } = useTransition();

    const previewRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!animated || contentType !== 'text' || !previewRef.current) return;
      const id = requestAnimationFrame(() => {
        initButtonHover({ scope: previewRef.current ?? undefined });
      });
      return () => cancelAnimationFrame(id);
    }, [animated, contentType, selType, variant, size, orientation]);

    const renderContent = () => {
      if (contentType === 'text') {
        return (
          <ToggleGroup
            type={selType}
            variant={variant}
            size={size}
            orientation={orientation}
            animated={animated}
            value={selType === 'single' ? singleValue : multiValue}
            onValueChange={(v) => selType === 'single' ? setSingleValue(v as string) : setMultiValue(v as string[])}
          >
            <ToggleGroupItem value="monthly">Mensual</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Anual</ToggleGroupItem>
          </ToggleGroup>
        );
      }

      if (selType === 'multiple') {
        return (
          <ToggleGroup
            type="multiple"
            variant={variant}
            size={size}
            orientation={orientation}
            animated={animated}
            value={multiValue}
            onValueChange={(v) => setMultiValue(v as string[])}
          >
            <ToggleGroupItem value="bold"><span className="toggle-group__item-icon"><IconBold /></span></ToggleGroupItem>
            <ToggleGroupItem value="italic"><span className="toggle-group__item-icon"><IconItalic /></span></ToggleGroupItem>
            <ToggleGroupItem value="underline"><span className="toggle-group__item-icon"><IconUnderline /></span></ToggleGroupItem>
          </ToggleGroup>
        );
      }

      return (
        <ToggleGroup
          type="single"
          variant={variant}
          size={size}
          orientation={orientation}
          animated={animated}
          value={singleValue}
          onValueChange={(v) => setSingleValue(v as string)}
        >
          <ToggleGroupItem value="left"><span className="toggle-group__item-icon"><IconAlignLeft /></span></ToggleGroupItem>
          <ToggleGroupItem value="center"><span className="toggle-group__item-icon"><IconAlignCenter /></span></ToggleGroupItem>
          <ToggleGroupItem value="right"><span className="toggle-group__item-icon"><IconAlignRight /></span></ToggleGroupItem>
        </ToggleGroup>
      );
    };

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconActivity />{`Selecci\u00f3n`}</div>
              <Tabs value={selType} onValueChange={(v) => animateTransition(() => setSelType(v as SelectionType))}>
                <TabsList animated>
                  {typeOpts.map((t) => (
                    <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

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

            <div>
              <div style={sectionLabelRow}><IconRuler />{`Tama\u00f1o`}</div>
              <Tabs value={size} onValueChange={(v) => animateTransition(() => setSize(v as Size))}>
                <TabsList animated>
                  {sizeOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconLayout />{`Orientaci\u00f3n`}</div>
              <Tabs value={orientation} onValueChange={(v) => animateTransition(() => setOrientation(v as Orientation))}>
                <TabsList animated>
                  {orientationOpts.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Contenido texto</span>
                  <Toggle animated checked={contentType === 'text'} onChange={(v) => animateTransition(() => setContentType(v ? 'text' : 'icons'))} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Animado</span>
                  <Toggle animated checked={animated} onChange={setAnimated} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div ref={previewRef} style={transitionStyle}>
          {renderContent()}
        </div>
      </StoryPreviewLayout>
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}>
      {(['xs', 's', 'm', 'l'] as const).map((size) => (
        <ToggleGroup key={size} type="single" size={size} value="center">
          <ToggleGroupItem value="left"><span className="toggle-group__item-icon"><IconAlignLeft /></span></ToggleGroupItem>
          <ToggleGroupItem value="center"><span className="toggle-group__item-icon"><IconAlignCenter /></span></ToggleGroupItem>
          <ToggleGroupItem value="right"><span className="toggle-group__item-icon"><IconAlignRight /></span></ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
};
