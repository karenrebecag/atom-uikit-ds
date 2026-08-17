import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '../molecules/Sheet';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
} from '../molecules/AlertDialog';

describe('Sheet', () => {
  it('opens from the trigger and closes on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetTitle>Ajustes</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps Tab inside and returns focus to the opener', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">fondo</button>
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent showCloseButton={false}>
            <SheetTitle>Ajustes</SheetTitle>
            <button type="button">uno</button>
            <button type="button">dos</button>
          </SheetContent>
        </Sheet>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    await user.click(trigger);
    await user.tab();
    expect(screen.getByRole('button', { name: 'uno' })).toHaveFocus();
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'uno' })).toHaveFocus();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('controlled: reports the close instead of closing itself', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetTitle>Ajustes</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    await user.keyboard('{Escape}');
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

describe('AlertDialog', () => {
  it('opens from the trigger with the alertdialog role', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Borrar</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Seguro?</AlertDialogTitle>
          <AlertDialogCancel />
        </AlertDialogContent>
      </AlertDialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Borrar' }));
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('closes from Cancel', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Borrar</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Seguro?</AlertDialogTitle>
          <AlertDialogCancel />
        </AlertDialogContent>
      </AlertDialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Borrar' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('keeps Tab inside the decision', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">fondo</button>
        <AlertDialog>
          <AlertDialogTrigger>Borrar</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Seguro?</AlertDialogTitle>
            <AlertDialogCancel />
          </AlertDialogContent>
        </AlertDialog>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Borrar' }));
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    // Unico foco dentro: el Tab tiene que quedarse ahi, no salir al fondo.
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('controlled: reports the close instead of closing itself', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <AlertDialog open onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogTitle>Seguro?</AlertDialogTitle>
          <AlertDialogCancel />
        </AlertDialogContent>
      </AlertDialog>,
    );
    await user.keyboard('{Escape}');
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    // Un alertdialog que se cierra solo se lleva por delante la confirmacion
    // que estaba pidiendo.
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
});
