import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import HomeScreen from './HomeScreen';

describe('HomeScreen', () => {
  it('renders all properties correctly', () => {
    render(<HomeScreen />);
    const textElement = screen.getByText(/homescreen/i);
    expect(textElement).toBeInTheDocument();
  });
});
