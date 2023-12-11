import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { AuthProvider } from '../../context/auth/AuthContext';
import LoginScreen from './LoginScreen';

describe('LoginScreen', () => {
  it('renders all properties correctly', () => {
    render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    const emailField = screen.getByLabelText(/email/i);
    expect(emailField).toBeInTheDocument();

    const passwordField = screen.getByLabelText(/password/i);
    expect(passwordField).toBeInTheDocument();
  });
});
