import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell,
} from '../../../../packages/components-react/src/atoms/Table';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Checkbox } from '../../../../packages/components-react/src/atoms/Checkbox';
import { Tag } from '../../../../packages/components-react/src/atoms/Tag';
import {
  Select, SelectTrigger, SelectContent, SelectItem,
} from '../../../../packages/components-react/src/atoms/Select';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '../../../../packages/components-react/src/molecules/DropdownMenu';

/* ---- Icons ---- */

const IconSortAsc = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12l7-7 7 7" />
  </svg>
);

const IconSortDesc = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

const IconSort = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
  </svg>
);

const IconMoreH = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
  </svg>
);

/* ---- Data ---- */

type Payment = {
  id: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
};

const data: Payment[] = [
  { id: 'pay_001', email: 'alice@example.com', amount: 316, status: 'success' },
  { id: 'pay_002', email: 'bob@example.com', amount: 242, status: 'success' },
  { id: 'pay_003', email: 'charlie@example.com', amount: 837, status: 'processing' },
  { id: 'pay_004', email: 'diana@example.com', amount: 874, status: 'success' },
  { id: 'pay_005', email: 'eve@example.com', amount: 721, status: 'failed' },
  { id: 'pay_006', email: 'frank@example.com', amount: 150, status: 'pending' },
  { id: 'pay_007', email: 'grace@example.com', amount: 493, status: 'success' },
  { id: 'pay_008', email: 'hank@example.com', amount: 129, status: 'processing' },
  { id: 'pay_009', email: 'iris@example.com', amount: 984, status: 'success' },
  { id: 'pay_010', email: 'jack@example.com', amount: 555, status: 'failed' },
  { id: 'pay_011', email: 'karen@example.com', amount: 412, status: 'pending' },
  { id: 'pay_012', email: 'leo@example.com', amount: 678, status: 'success' },
  { id: 'pay_013', email: 'mia@example.com', amount: 203, status: 'processing' },
  { id: 'pay_014', email: 'nick@example.com', amount: 799, status: 'success' },
  { id: 'pay_015', email: 'olivia@example.com', amount: 345, status: 'failed' },
];

const statusIntent = (s: Payment['status']) => {
  const map = { success: 'success', processing: 'info', pending: 'warning', failed: 'danger' } as const;
  return map[s];
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

/* ---- Hooks ---- */

type SortKey = 'email' | 'amount' | 'status';
type SortDir = 'asc' | 'desc';

function useDataTable(items: Payment[]) {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => items.filter((r) => r.email.toLowerCase().includes(filter.toLowerCase())),
    [items, filter],
  );

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((r) => r.id)));
    }
  };

  return {
    filter, setFilter,
    sortKey, sortDir, toggleSort,
    page, setPage, pageSize, setPageSize, totalPages,
    paged, total: sorted.length,
    selected, toggleRow, toggleAll,
  };
}

/* ---- Sort Header ---- */

function SortableHead({
  label, sortKey: key, active, dir, onSort,
}: {
  label: string; sortKey: SortKey; active: boolean; dir: SortDir; onSort: (k: SortKey) => void;
}) {
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(key)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-1)',
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          font: 'inherit', color: 'inherit', fontWeight: 'inherit',
        }}
      >
        {label}
        <span style={{ width: 14, height: 14, display: 'inline-flex' }}>
          {active ? (dir === 'asc' ? <IconSortAsc /> : <IconSortDesc />) : <IconSort />}
        </span>
      </button>
    </TableHead>
  );
}

/* ---- Meta ---- */

const meta: Meta = {
  title: 'Patterns/DataTable',
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

/* ---- Full DataTable ---- */

export const Default: Story = {
  render: () => {
    const dt = useDataTable(data);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <div style={{ flex: 1, maxWidth: 280 }}>
            <Input
              placeholder="Filter emails..."
              value={dt.filter}
              onChange={(e) => { dt.setFilter(e.target.value); dt.setPage(0); }}
            />
          </div>
          {dt.selected.size > 0 && (
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
              {dt.selected.size} row(s) selected
            </span>
          )}
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 40 }}>
                <Checkbox
                  checked={dt.paged.length > 0 && dt.selected.size === dt.paged.length}
                  onChange={dt.toggleAll}
                />
              </TableHead>
              <SortableHead label="Email" sortKey="email" active={dt.sortKey === 'email'} dir={dt.sortDir} onSort={dt.toggleSort} />
              <SortableHead label="Status" sortKey="status" active={dt.sortKey === 'status'} dir={dt.sortDir} onSort={dt.toggleSort} />
              <SortableHead label="Amount" sortKey="amount" active={dt.sortKey === 'amount'} dir={dt.sortDir} onSort={dt.toggleSort} />
              <TableHead style={{ width: 48 }} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {dt.paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 'var(--spacing-10)' }}>
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              dt.paged.map((row) => (
                <TableRow key={row.id} selected={dt.selected.has(row.id)}>
                  <TableCell>
                    <Checkbox
                      checked={dt.selected.has(row.id)}
                      onChange={() => dt.toggleRow(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Tag variant="filled" intent={statusIntent(row.status)} size="s">
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </Tag>
                  </TableCell>
                  <TableCell className="table__cell--right">{formatCurrency(row.amount)}</TableCell>
                  <TableCell className="table__cell--right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span style={{ display: 'inline-flex', width: 20, height: 20, color: 'var(--muted-foreground)', cursor: 'pointer' }}>
                          <IconMoreH />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => {}}>View details</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => {}}>Copy payment ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => {}}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="table__cell--right">
                {formatCurrency(dt.paged.reduce((sum, r) => sum + r.amount, 0))}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
            {dt.page * dt.pageSize + 1}-{Math.min((dt.page + 1) * dt.pageSize, dt.total)} of {dt.total}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>Rows</span>
            <div style={{ width: 72 }}>
              <Select value={String(dt.pageSize)} onValueChange={(v) => { dt.setPageSize(Number(v)); dt.setPage(0); }}>
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary" size="s" disabled={dt.page === 0} onClick={() => dt.setPage(dt.page - 1)}>
              Prev
            </Button>
            <Button variant="secondary" size="s" disabled={dt.page >= dt.totalPages - 1} onClick={() => dt.setPage(dt.page + 1)}>
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  },
};
