/**
 * Template for component unit tests (W3 hardening).
 *
 * Copy for each component. Cover:
 * 1. Render + BEM classes (base + --variant / --size) — registry contract
 * 2. Interaction (click/keyboard); disabled/loading block actions
 * 3. ARIA: aria-invalid, aria-disabled, aria-busy, roles
 *
 * Source of truth for variants/sizes: atom.discovery in public/r/{slug}.json
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import { Component } from '../atoms/Component';

describe.skip('Component (template)', () => {
  it('renders base class + size modifier', () => {
    // render(<Component size="m">Label</Component>);
    // expect(screen.getByRole('button')).toHaveClass('component', 'component--m');
  });

  it('does not fire onClick when disabled', async () => {
    // const user = userEvent.setup();
    // const onClick = vi.fn();
    // render(<Component disabled onClick={onClick}>X</Component>);
    // await user.click(screen.getByRole('button'));
    // expect(onClick).not.toHaveBeenCalled();
  });
});
