import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
} from '../molecules/Drawer';

type Direction = 'top' | 'right' | 'bottom' | 'left';

function OpenableDrawer({ direction }: { direction?: Direction }) {
  return (
    <Drawer>
      <DrawerTrigger>Abrir</DrawerTrigger>
      <DrawerContent direction={direction}>
        <DrawerTitle>Filtros</DrawerTitle>
      </DrawerContent>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('renders nothing until it is opened', () => {
    render(<OpenableDrawer />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens from the trigger as a modal dialog', async () => {
    const user = userEvent.setup();
    render(<OpenableDrawer />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    const drawer = screen.getByRole('dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(drawer).toHaveClass('drawer');
  });

  it('defaults to the bottom direction', async () => {
    const user = userEvent.setup();
    render(<OpenableDrawer />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByRole('dialog')).toHaveClass('drawer--bottom');
  });

  it.each(['top', 'right', 'left'] as const)('honours the %s direction', async (direction) => {
    const user = userEvent.setup();
    render(<OpenableDrawer direction={direction} />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByRole('dialog')).toHaveClass(`drawer--${direction}`);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<OpenableDrawer />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes when the overlay is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<OpenableDrawer />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await user.click(container.querySelector('.dialog__overlay') as Element);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('locks body scroll while open and restores it after closing', async () => {
    const user = userEvent.setup();
    render(<OpenableDrawer />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(document.body.style.overflow).not.toBe('hidden'));
  });

  it('moves focus into the drawer when it opens', async () => {
    const user = userEvent.setup();
    render(<OpenableDrawer />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());
  });

  it('keeps Tab inside the drawer', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">fondo</button>
        <Drawer>
          <DrawerTrigger>Abrir</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Filtros</DrawerTitle>
            <button type="button">uno</button>
            <button type="button">dos</button>
          </DrawerContent>
        </Drawer>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await user.tab();
    expect(screen.getByRole('button', { name: 'uno' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'dos' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'uno' })).toHaveFocus();
  });

  it('returns focus to the opener when it closes', async () => {
    const user = userEvent.setup();
    render(<OpenableDrawer />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('controlled: reports the close instead of closing itself', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerTitle>Filtros</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    await user.keyboard('{Escape}');
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
