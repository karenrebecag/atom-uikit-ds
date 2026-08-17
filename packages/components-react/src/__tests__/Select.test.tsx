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

  it('a disabled item cannot be selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger placeholder="Pick" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b" disabled>Beta</SelectItem>
        </SelectContent>
      </Select>
    );
    await user.click(screen.getByRole('listbox'));
    const beta = screen.getByRole('option', { name: 'Beta' });
    expect(beta).toHaveAttribute('aria-disabled', 'true');
    await user.click(beta);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('marks the selected option with aria-selected', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger placeholder="Pick" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
        </SelectContent>
      </Select>
    );
    await user.click(screen.getByRole('listbox'));
    await user.click(screen.getByRole('option', { name: 'Beta' }));
    await user.click(screen.getByRole('listbox'));
    expect(screen.getByRole('option', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'false');
  });
});

describe('Select — teclado', () => {
  const options = (
    <SelectContent>
      <SelectItem value="a">Alpha</SelectItem>
      <SelectItem value="b">Beta</SelectItem>
      <SelectItem value="c">Gamma</SelectItem>
    </SelectContent>
  );

  it('reports its expanded state to assistive tech', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger placeholder="Pick" />
        {options}
      </Select>
    );
    const trigger = screen.getByRole('listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens with ArrowDown from the focused trigger', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger placeholder="Pick" />
        {options}
      </Select>
    );
    await user.tab();
    expect(screen.getByRole('listbox')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('walks the options with ArrowDown and wraps at the end', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger placeholder="Pick" />
        {options}
      </Select>
    );
    await user.tab();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Alpha' })).toHaveClass('select__item--highlighted');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Gamma' })).toHaveClass('select__item--highlighted');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Alpha' })).toHaveClass('select__item--highlighted');
  });

  it('walks backwards with ArrowUp and wraps to the last option', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger placeholder="Pick" />
        {options}
      </Select>
    );
    await user.tab();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('option', { name: 'Gamma' })).toHaveClass('select__item--highlighted');
  });

  it('commits the highlighted option with Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger placeholder="Pick" />
        {options}
      </Select>
    );
    await user.tab();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('closes on Escape without selecting', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger placeholder="Pick" />
        {options}
      </Select>
    );
    await user.tab();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">fuera</button>
        <Select>
          <SelectTrigger placeholder="Pick" />
          {options}
        </Select>
      </div>
    );
    await user.click(screen.getByRole('listbox'));
    expect(screen.getAllByRole('option')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: 'fuera' }));
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });
});
