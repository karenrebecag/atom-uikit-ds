import { cloneElement, isValidElement, useId, type ReactNode } from 'react';

export type FieldProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Field({
  label,
  description,
  error,
  required = false,
  disabled = false,
  htmlFor,
  children,
  className,
}: FieldProps) {
  const id = useId();
  // El error sustituye a la descripcion en el render, asi que solo se referencia
  // el texto que de verdad esta en el DOM: apuntar a un id ausente deja al lector
  // de pantalla sin anunciar nada.
  const descriptionId = description && !error ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  // Solo se anota el control cuando Field recibe un unico elemento: con varios
  // hijos no hay forma de saber cual es el campo, y describir el equivocado es
  // peor que no describir nada.
  const describedChildren =
    describedBy && isValidElement<{ 'aria-describedby'?: string }>(children)
      ? cloneElement(children, {
          'aria-describedby': [children.props['aria-describedby'], describedBy]
            .filter(Boolean)
            .join(' '),
        })
      : children;

  return (
    <div
      className={cn('field', disabled && 'field--disabled', className)}
      role="group"
      {...(error ? { 'data-invalid': '' } : {})}
    >
      {label && (
        <label
          className={cn('field__label', required && 'field__label--required')}
          htmlFor={htmlFor}
        >
          {label}
        </label>
      )}
      {describedChildren}
      {description && !error && (
        <p className="field__description" id={descriptionId}>{description}</p>
      )}
      {error && (
        <p className="field__error" id={errorId} role="alert">{error}</p>
      )}
    </div>
  );
}
