import type { Meta, StoryObj } from '@storybook/react';
import {
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell, TableCaption,
} from '../../../../packages/components-react/src/atoms/Table';
import { Tag } from '../../../../packages/components-react/src/atoms/Tag';
import { Avatar } from '../../../../packages/components-react/src/atoms/Avatar';
import { Checkbox } from '../../../../packages/components-react/src/atoms/Checkbox';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '../../../../packages/components-react/src/molecules/DropdownMenu';

const IconMoreH = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
  </svg>
);

const meta: Meta<typeof Table> = {
  title: 'Atoms/Layout/Table',
  component: Table,
  argTypes: {},
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Table>;

/* ---- Data ---- */

const invoices = [
  { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { id: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { id: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { id: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
  { id: 'INV006', status: 'Pending', method: 'Bank Transfer', amount: '$200.00' },
  { id: 'INV007', status: 'Unpaid', method: 'Credit Card', amount: '$300.00' },
];

const statusIntent = (s: string) =>
  s === 'Paid' ? 'success' as const : s === 'Pending' ? 'warning' as const : 'danger' as const;

/* ---- Default ---- */

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="table__head--right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell>{inv.id}</TableCell>
            <TableCell>{inv.status}</TableCell>
            <TableCell>{inv.method}</TableCell>
            <TableCell className="table__cell--right">{inv.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/* ---- With Footer ---- */

export const WithFooter: Story = {
  render: () => {
    const total = '$2,250.00';
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="table__head--right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>{inv.id}</TableCell>
              <TableCell>{inv.status}</TableCell>
              <TableCell>{inv.method}</TableCell>
              <TableCell className="table__cell--right">{inv.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="table__cell--right">{total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  },
};

/* ---- With Tags ---- */

export const WithTags: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="table__head--right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell>{inv.id}</TableCell>
            <TableCell>
              <Tag variant="filled" intent={statusIntent(inv.status)} size="s">
                {inv.status}
              </Tag>
            </TableCell>
            <TableCell>{inv.method}</TableCell>
            <TableCell className="table__cell--right">{inv.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/* ---- With Actions (DropdownMenu) ---- */

export const WithActions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="table__head--right">Amount</TableHead>
          <TableHead className="table__head--right" style={{ width: 48 }} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell>{inv.id}</TableCell>
            <TableCell>
              <Tag variant="filled" intent={statusIntent(inv.status)} size="s">
                {inv.status}
              </Tag>
            </TableCell>
            <TableCell>{inv.method}</TableCell>
            <TableCell className="table__cell--right">{inv.amount}</TableCell>
            <TableCell className="table__cell--right">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span style={{ display: 'inline-flex', width: 20, height: 20, color: 'var(--muted-foreground)', cursor: 'pointer' }}>
                    <IconMoreH />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => {}}>View details</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => {}}>Copy ID</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => {}}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/* ---- With Avatars ---- */

export const WithAvatars: Story = {
  render: () => {
    const users = [
      { name: 'John Doe', email: 'john@example.com', role: 'Admin', img: 'https://i.pravatar.cc/64?u=t1' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', img: 'https://i.pravatar.cc/64?u=t2' },
      { name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', img: 'https://i.pravatar.cc/64?u=t3' },
      { name: 'Alice Brown', email: 'alice@example.com', role: 'Admin', img: 'https://i.pravatar.cc/64?u=t4' },
    ];
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.email}>
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar type="image" shape="circle" size="s" src={u.img} alt={u.name} />
                  <div>
                    <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{u.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--muted-foreground)' }}>{u.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Tag variant="ghost" intent="neutral" size="s">{u.role}</Tag>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

/* ---- With Checkbox Selection ---- */

export const WithSelection: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={{ width: 40 }}>
            <Checkbox checked={false} onChange={() => {}} />
          </TableHead>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="table__head--right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice(0, 5).map((inv, i) => (
          <TableRow key={inv.id} selected={i === 1}>
            <TableCell>
              <Checkbox checked={i === 1} onChange={() => {}} />
            </TableCell>
            <TableCell>{inv.id}</TableCell>
            <TableCell>{inv.status}</TableCell>
            <TableCell className="table__cell--right">{inv.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
