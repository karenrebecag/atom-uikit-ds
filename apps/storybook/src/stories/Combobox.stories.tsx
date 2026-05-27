import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Combobox, ComboboxTrigger, ComboboxContent,
  ComboboxInput, ComboboxList, ComboboxEmpty,
  ComboboxGroup, ComboboxItem, ComboboxSeparator,
} from '../../../../packages/components-react/src/molecules/Combobox';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

type Scenario = 'simple' | 'groups' | 'disabled';

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'svelte', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

const frontend = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
];

const backend = [
  { value: 'node', label: 'Node.js' },
  { value: 'deno', label: 'Deno' },
  { value: 'bun', label: 'Bun' },
];

const withDisabledItems = [
  { value: 'next', label: 'Next.js', disabled: false },
  { value: 'gatsby', label: 'Gatsby (deprecated)', disabled: true },
  { value: 'remix', label: 'Remix', disabled: false },
  { value: 'cra', label: 'Create React App (deprecated)', disabled: true },
  { value: 'astro', label: 'Astro', disabled: false },
];

const meta: Meta<typeof Combobox> = {
  title: 'Molecules/Combobox',
  component: Combobox,
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: () => {
    const scenarioOptions: { value: Scenario; label: string }[] = [
      { value: 'simple', label: 'Simple' },
      { value: 'groups', label: 'Grupos' },
      { value: 'disabled', label: 'Disabled' },
    ];

    const [scenario, setScenario] = useState<Scenario>('simple');
    const [autoHighlight, setAutoHighlight] = useState(false);
    const [value, setValue] = useState('');

    const { animateTransition } = useTransition();

    const handleScenarioChange = (v: string) => {
      animateTransition(() => { setScenario(v as Scenario); setValue(''); });
    };

    const allItems = scenario === 'groups'
      ? [...frontend, ...backend]
      : scenario === 'disabled'
        ? withDisabledItems
        : frameworks;
    const selected = allItems.find((f) => f.value === value);

    return (
      <div style={{ display: 'flex', gap: 'var(--spacing-6)', padding: 24, minHeight: 420 }}>
        {/* Controls */}
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
          <div>
            <div style={sectionLabelRow}><IconLayers />Escenario</div>
            <Tabs value={scenario} onValueChange={handleScenarioChange}>
              <TabsList animated>
                {scenarioOptions.map((o) => (
                  <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div>
            <div style={sectionLabelRow}><IconSettings />Propiedades</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={switchRow}>
                <span style={switchLabel}>Auto highlight</span>
                <Toggle animated checked={autoHighlight} onChange={setAutoHighlight} />
              </div>
            </div>
          </div>

          {selected && (
            <div style={{ marginTop: 'auto', fontSize: 'var(--font-size-xs)', color: 'var(--muted-foreground)' }}>
              Seleccionado: {selected.label}
            </div>
          )}
        </div>

        {/* Preview */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 'var(--spacing-10)' }}>
          <div style={{ width: 280 }}>
            <Combobox value={value} onValueChange={setValue} autoHighlight={autoHighlight}>
              <ComboboxTrigger placeholder="Seleccionar...">
                {selected?.label}
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxInput placeholder="Buscar..." />
                <ComboboxList>
                  <ComboboxEmpty />

                  {scenario === 'simple' && frameworks.map((f) => (
                    <ComboboxItem key={f.value} value={f.value}>{f.label}</ComboboxItem>
                  ))}

                  {scenario === 'groups' && (
                    <>
                      <ComboboxGroup label="Frontend">
                        {frontend.map((f) => (
                          <ComboboxItem key={f.value} value={f.value}>{f.label}</ComboboxItem>
                        ))}
                      </ComboboxGroup>
                      <ComboboxSeparator />
                      <ComboboxGroup label="Backend">
                        {backend.map((f) => (
                          <ComboboxItem key={f.value} value={f.value}>{f.label}</ComboboxItem>
                        ))}
                      </ComboboxGroup>
                    </>
                  )}

                  {scenario === 'disabled' && withDisabledItems.map((f) => (
                    <ComboboxItem key={f.value} value={f.value} disabled={f.disabled}>{f.label}</ComboboxItem>
                  ))}

                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>
      </div>
    );
  },
};
