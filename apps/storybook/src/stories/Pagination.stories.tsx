import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Pagination, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext,
  PaginationEllipsis,
} from '../../../../packages/components-react/src/atoms/Pagination';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

const meta: Meta<typeof Pagination> = {
  title: 'Atoms/Navigation/Pagination',
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    type Mode = 'completo' | 'iconos';

    const modeOptions: { value: Mode; label: string }[] = [
      { value: 'completo', label: 'Completo' },
      { value: 'iconos', label: 'Solo iconos' },
    ];

    const [mode, setMode] = useState<Mode>('completo');
    const [withEllipsis, setWithEllipsis] = useState(true);
    const [page, setPage] = useState(5);

    const total = 20;
    const { animateTransition, transitionStyle } = useTransition();

    const getPages = (): (number | 'ellipsis')[] => {
      if (!withEllipsis || total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      const pages: (number | 'ellipsis')[] = [1];
      if (page > 3) pages.push('ellipsis');
      for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) pages.push(i);
      if (page < total - 2) pages.push('ellipsis');
      if (total > 1) pages.push(total);
      return pages;
    };

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Modo</div>
              <Tabs value={mode} onValueChange={(v) => animateTransition(() => setMode(v as Mode))}>
                <TabsList animated>
                  {modeOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Con ellipsis</span>
                  <Toggle
                    animated
                    checked={withEllipsis}
                    onChange={(v) => animateTransition(() => setWithEllipsis(v))}
                  />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-3)', width: '100%', height: '100%' }}>
          {mode === 'iconos' && (
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
              {`P\u00e1gina ${page} de ${total}`}
            </span>
          )}
          <div style={transitionStyle}>
            <Pagination>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text={mode === 'iconos' ? '' : undefined}
                  disabled={page === 1}
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                />
              </PaginationItem>

              {mode === 'completo' && getPages().map((p, i) =>
                p === 'ellipsis' ? (
                  <PaginationItem key={`e${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={page === p}
                      onClick={(e) => { e.preventDefault(); setPage(p); }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text={mode === 'iconos' ? '' : undefined}
                  disabled={page === total}
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(total, p + 1)); }}
                />
              </PaginationItem>
            </Pagination>
          </div>
        </div>
      </StoryPreviewLayout>
    );
  },
};
