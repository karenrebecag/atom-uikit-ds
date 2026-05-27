import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell, TableCaption,
} from '../../../../packages/components-react/src/atoms/Table';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

const invoices = [
  { id: 'INV-001', status: 'Pagado', method: 'Tarjeta', amount: '$250.00' },
  { id: 'INV-002', status: 'Pendiente', method: 'PayPal', amount: '$150.00' },
  { id: 'INV-003', status: 'Vencido', method: 'Transferencia', amount: '$350.00' },
  { id: 'INV-004', status: 'Pagado', method: 'Tarjeta', amount: '$450.00' },
  { id: 'INV-005', status: 'Pagado', method: 'PayPal', amount: '$550.00' },
  { id: 'INV-006', status: 'Pendiente', method: 'Transferencia', amount: '$200.00' },
];

const statusColor = (s: string): string =>
  s === 'Pagado' ? 'var(--success)' : s === 'Pendiente' ? 'var(--warning)' : 'var(--destructive)';

const meta: Meta<typeof Table> = {
  title: 'Atoms/Layout/Table',
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => {
    type Content = 'basico' | 'footer' | 'caption';

    const contentOptions: { value: Content; label: string }[] = [
      { value: 'basico', label: 'Basico' },
      { value: 'footer', label: 'Con footer' },
      { value: 'caption', label: 'Con caption' },
    ];

    const [content, setContent] = useState<Content>('basico');
    const [showStatus, setShowStatus] = useState(true);
    const [striped, setStriped] = useState(false);

    const { animateTransition, transitionStyle } = useTransition();

    const total = '$1,950.00';

    return (
      <StoryPreviewLayout
        minHeight={480}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Contenido</div>
              <Tabs value={content} onValueChange={(v) => animateTransition(() => setContent(v as Content))}>
                <TabsList animated>
                  {contentOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Indicador de status</span>
                  <Toggle animated checked={showStatus} onChange={(v) => animateTransition(() => setShowStatus(v))} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Filas alternadas</span>
                  <Toggle animated checked={striped} onChange={setStriped} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', paddingTop: 'var(--spacing-4)' }}>
          <div style={{ ...transitionStyle, width: '100%' }}>
            <Table>
              {content === 'caption' && (
                <TableCaption>Lista de facturas recientes.</TableCaption>
              )}
              <TableHeader>
                <TableRow>
                  <TableHead>Factura</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>{`M\u00e9todo`}</TableHead>
                  <TableHead className="table__head--right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv, i) => (
                  <TableRow
                    key={inv.id}
                    style={striped && i % 2 === 1 ? { backgroundColor: 'var(--muted)' } : undefined}
                  >
                    <TableCell style={{ fontWeight: 'var(--font-weight-medium)' }}>{inv.id}</TableCell>
                    <TableCell>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        {showStatus && (
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            backgroundColor: statusColor(inv.status),
                            flexShrink: 0,
                          }} />
                        )}
                        {inv.status}
                      </span>
                    </TableCell>
                    <TableCell>{inv.method}</TableCell>
                    <TableCell className="table__cell--right">{inv.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {content === 'footer' && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="table__cell--right">{total}</TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </div>
      </StoryPreviewLayout>
    );
  },
};
