import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field } from '../atoms/Field';
import { Input } from '../atoms/Input';

describe('Field', () => {
  it('links the description to the control via aria-describedby', () => {
    render(
      <Field label="Email" description="Usamos tu correo solo para avisos" htmlFor="email">
        <Input id="email" />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    const description = screen.getByText('Usamos tu correo solo para avisos');
    expect(description.id).toBeTruthy();
    expect(input).toHaveAttribute('aria-describedby', description.id);
  });

  it('links the error to the control and keeps it announced', () => {
    render(
      <Field label="Email" error="Correo invalido" htmlFor="email">
        <Input id="email" error />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Correo invalido');
    expect(input).toHaveAttribute('aria-describedby', alert.id);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('describes only the error when both description and error are present', () => {
    render(
      <Field label="Email" description="Ayuda" error="Correo invalido" htmlFor="email">
        <Input id="email" error />
      </Field>,
    );
    // El error sustituye a la descripcion en el DOM, asi que no puede quedar
    // referenciado un id que no existe.
    expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
    const describedBy = screen.getByRole('textbox').getAttribute('aria-describedby');
    expect(describedBy).toBe(screen.getByRole('alert').id);
  });

  it('preserves an aria-describedby already set by the consumer', () => {
    render(
      <>
        <span id="external">Nota externa</span>
        <Field label="Email" description="Ayuda" htmlFor="email">
          <Input id="email" aria-describedby="external" />
        </Field>
      </>,
    );
    const describedBy = screen.getByRole('textbox').getAttribute('aria-describedby');
    expect(describedBy).toContain('external');
    expect(describedBy).toContain(screen.getByText('Ayuda').id);
  });

  it('does not annotate anything when there is no description or error', () => {
    render(
      <Field label="Email" htmlFor="email">
        <Input id="email" />
      </Field>,
    );
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
  });

  it('renders multiple children untouched instead of guessing the control', () => {
    render(
      <Field label="Rango" description="Ayuda">
        <Input aria-label="desde" />
        <Input aria-label="hasta" />
      </Field>,
    );
    // Con varios hijos no se puede saber cual es el campo; describir el
    // equivocado seria peor que no describir.
    expect(screen.getByLabelText('desde')).not.toHaveAttribute('aria-describedby');
    expect(screen.getByLabelText('hasta')).not.toHaveAttribute('aria-describedby');
  });

  it('marks the group invalid and disabled through the wrapper', () => {
    const { container } = render(
      <Field label="Email" error="Roto" disabled>
        <Input disabled />
      </Field>,
    );
    const group = container.querySelector('.field');
    expect(group).toHaveClass('field--disabled');
    expect(group).toHaveAttribute('data-invalid');
  });
});
