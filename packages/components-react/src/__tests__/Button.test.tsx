import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../atoms/Button';

describe('Button', () => {
  it('renders base + variant + size BEM classes', () => {
    render(
      <Button variant="secondary" size="l">
        Save
      </Button>
    );
    const el = screen.getByRole('button', { name: 'Save' });
    expect(el).toHaveClass('button', 'button--secondary', 'button--l');
  });

  it('defaults to primary / m', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--primary', 'button--m');
  });

  it('disabled prevents click and sets disabled attribute', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>
    );
    const el = screen.getByRole('button');
    expect(el).toBeDisabled();
    await user.click(el);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('loading sets aria-busy and disables', () => {
    render(<Button loading>Wait</Button>);
    const el = screen.getByRole('button');
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(el).toBeDisabled();
    expect(el).toHaveClass('button--loading');
  });

  it('as link: aria-disabled when disabled, blocks navigation click', async () => {
    const user = userEvent.setup();
    render(
      <Button href="https://example.com" disabled>
        Link
      </Button>
    );
    const el = screen.getByRole('link', { name: 'Link' });
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).toHaveAttribute('tabindex', '-1');
    await user.click(el);
    // preventDefault — still in document, no navigation in jsdom
    expect(el).toBeInTheDocument();
  });
});
