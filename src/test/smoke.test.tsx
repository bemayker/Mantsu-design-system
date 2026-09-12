import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Button, Badge, EmptyState } from '../components/index';

// A minimal render check per component family. The point is not coverage but
// a tripwire: the published bundle must actually mount in a consumer.
describe('components render', () => {
  it('renders a Button with its token-driven classes', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('bg-midnight');
  });

  it('renders a Badge', () => {
    render(<Badge>3</Badge>);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders an EmptyState', () => {
    render(<EmptyState title="No downtimes" />);
    expect(screen.getByText('No downtimes')).toBeInTheDocument();
  });
});
