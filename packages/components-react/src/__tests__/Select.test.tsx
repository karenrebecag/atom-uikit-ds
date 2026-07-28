import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../atoms/Select';

describe('Select', () => {
  it('renders root .select and trigger', () => {
    const { container } = render(
      <Select>
        <SelectTrigger placeholder="Pick" />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(container.querySelector('.select')).toBeTruthy();
    expect(screen.getByRole('listbox')).toHaveClass('select__trigger');
  });

  it('opens and selects an item', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger placeholder="Pick" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
        </SelectContent>
      </Select>
    );
    await user.click(screen.getByRole('listbox'));
    await user.click(screen.getByRole('option', { name: 'Beta' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('disabled trigger does not open', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger placeholder="Pick" disabled />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = screen.getByRole('listbox');
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });
});
