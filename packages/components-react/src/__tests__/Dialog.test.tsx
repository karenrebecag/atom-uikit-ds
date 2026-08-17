import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '../molecules/Dialog';

function OpenableDialog({ showCloseButton = true }: { showCloseButton?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger>Abrir</DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogTitle>Confirmar</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('renders nothing until it is opened', () => {
    render(<OpenableDialog />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens from the trigger as a modal dialog', async () => {
    const user = userEvent.setup();
    render(<OpenableDialog />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveClass('dialog__content');
  });

  it('opens from the trigger with the keyboard', async () => {
    const user = userEvent.setup();
    render(<OpenableDialog />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('moves focus into the dialog when it opens', async () => {
    const user = userEvent.setup();
    render(<OpenableDialog />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<OpenableDialog />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes when the overlay is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<OpenableDialog />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    const overlay = container.querySelector('.dialog__overlay');
    expect(overlay).toBeTruthy();
    await user.click(overlay as Element);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes from the close button', async () => {
    const user = userEvent.setup();
    render(<OpenableDialog />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('omits the close button when asked to', async () => {
    const user = userEvent.setup();
    render(<OpenableDialog showCloseButton={false} />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('locks body scroll while open and restores it after closing', async () => {
    const user = userEvent.setup();
    render(<OpenableDialog />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(document.body.style.overflow).not.toBe('hidden'));
  });

  it('keeps Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">fondo</button>
        <Dialog>
          <DialogTrigger>Abrir</DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Confirmar</DialogTitle>
            <button type="button">uno</button>
            <button type="button">dos</button>
          </DialogContent>
        </Dialog>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Abrir' }));

    await user.tab();
    expect(screen.getByRole('button', { name: 'uno' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'dos' })).toHaveFocus();
    // El fondo queda fuera del recorrido: sin trampa, aqui saltaria a "fondo".
    await user.tab();
    expect(screen.getByRole('button', { name: 'uno' })).toHaveFocus();
  });

  it('wraps backwards with Shift+Tab', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Confirmar</DialogTitle>
          <button type="button">uno</button>
          <button type="button">dos</button>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await user.tab();
    expect(screen.getByRole('button', { name: 'uno' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'dos' })).toHaveFocus();
  });

  it('returns focus to the opener when it closes', async () => {
    const user = userEvent.setup();
    render(<OpenableDialog />);
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
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Confirmar</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    await user.keyboard('{Escape}');
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    // El padre sigue mandando open, asi que el dialogo no puede cerrarse solo.
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
