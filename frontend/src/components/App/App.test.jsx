import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Test', () => {
  it('renders all properties', () => {
    render(<App />);
    const textElement = screen.getByText('Tweeter');
    expect(textElement).toBeInTheDocument();
  });
});
