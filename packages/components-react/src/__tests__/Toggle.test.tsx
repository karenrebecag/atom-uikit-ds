import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from '../atoms/Toggle';

describe('Toggle', () => {
  it('uses role=switch', () => {
    render(<Toggle aria-label="Notifications" />);
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('has toggle BEM root on label', () => {
    const { container } = render(<Toggle aria-label="Notifications" />);
    expect(container.querySelector('.toggle')).toBeTruthy();
  });

  it('onChange fires on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle aria-label="Notifications" checked={false} onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('disabled blocks change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle aria-label="Notifications" disabled checked={false} onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
