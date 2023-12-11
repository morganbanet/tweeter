import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { AuthProvider } from '../../context/auth/AuthContext';

import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renders only the logo when logged out', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AuthProvider>
    );

    const logoImage = screen.getByAltText('tweeter logo');
    expect(logoImage).toBeInTheDocument();

    const logoText = screen.getByText(/tweeter/i);
    expect(logoText).toBeInTheDocument();
  });

  it('renders all properties when logged in', () => {
    vi.mock('../../hooks/auth/useAuthContext', () => ({
      useAuthContext: vi.fn().mockReturnValue({
        userInfo: {
          id: 1,
          name: 'John Doe',
          email: 'johndoe@email.com',
          avatar: {
            url: 'https://exampleurl.com',
          },
        },
      }),
    }));

    render(
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AuthProvider>
    );

    const logoImage = screen.getByAltText('tweeter logo');
    expect(logoImage).toBeInTheDocument();

    const logoText = screen.getByText(/tweeter/i);
    expect(logoText).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();

    const exploreLink = screen.getByRole('link', { name: /explore/i });
    expect(exploreLink).toBeInTheDocument();

    const bookmarksLink = screen.getByRole('link', { name: /bookmarks/i });
    expect(bookmarksLink).toBeInTheDocument();

    const profileImage = screen.getByAltText('profile avatar');
    expect(profileImage).toBeInTheDocument();

    const username = screen.getByText(/john doe/i);
    expect(username).toBeInTheDocument();

    const dropdown = screen.getByTestId('caret-down');
    expect(dropdown).toBeInTheDocument();
  });
});
