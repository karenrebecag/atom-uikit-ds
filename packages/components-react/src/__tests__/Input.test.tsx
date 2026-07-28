import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../atoms/Input';

describe('Input', () => {
  it('renders .input class', () => {
    render(<Input aria-label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveClass('input');
  });

  it('sets aria-invalid when error', () => {
    render(<Input aria-label="Email" error />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('wraps with input-group when icons present', () => {
    const { container } = render(
      <Input aria-label="Search" iconLeft={<span data-testid="ico">i</span>} />
    );
    expect(container.querySelector('.input-group')).toBeTruthy();
    expect(container.querySelector('.input-group__input')).toBeTruthy();
  });

  it('input-group gets error modifier', () => {
    const { container } = render(
      <Input aria-label="Search" error iconLeft={<span>i</span>} />
    );
    expect(container.querySelector('.input-group--error')).toBeTruthy();
  });
});
