import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Pagination, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext,
  PaginationEllipsis,
} from '../../../../packages/components-react/src/atoms/Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Atoms/Navigation/Pagination',
  component: Pagination,
  argTypes: {
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

/* ---- Default ---- */

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    const total = 5;
    return (
      <Pagination>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={page === 1}
            onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
          />
        </PaginationItem>
        {Array.from({ length: total }, (_, i) => (
          <PaginationItem key={i + 1}>
            <PaginationLink
              href="#"
              isActive={page === i + 1}
              onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={page === total}
            onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(total, p + 1)); }}
          />
        </PaginationItem>
      </Pagination>
    );
  },
};

/* ---- With Ellipsis ---- */

export const WithEllipsis: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    const total = 20;

    const getPages = () => {
      const pages: (number | 'ellipsis')[] = [1];
      if (page > 3) pages.push('ellipsis');
      for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) pages.push(i);
      if (page < total - 2) pages.push('ellipsis');
      if (total > 1) pages.push(total);
      return pages;
    };

    return (
      <Pagination>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={page === 1}
            onClick={(e) => { e.preventDefault(); setPage((p) => p - 1); }}
          />
        </PaginationItem>
        {getPages().map((p, i) =>
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
            disabled={page === total}
            onClick={(e) => { e.preventDefault(); setPage((p) => p + 1); }}
          />
        </PaginationItem>
      </Pagination>
    );
  },
};

/* ---- Icons Only (for tables) ---- */

export const IconsOnly: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const total = 10;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
          Page {page} of {total}
        </span>
        <Pagination>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text=""
              disabled={page === 1}
              onClick={(e) => { e.preventDefault(); setPage((p) => p - 1); }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              text=""
              disabled={page === total}
              onClick={(e) => { e.preventDefault(); setPage((p) => p + 1); }}
            />
          </PaginationItem>
        </Pagination>
      </div>
    );
  },
};
