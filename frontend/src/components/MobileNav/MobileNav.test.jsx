import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import MobileNav from './MobileNav';

describe('MobileNav', () => {
  it('buttons do not render when a the user is logged out', () => {
    const homeButton = screen.queryByTestId('fa-house');
    expect(homeButton).toBeNull();

    const exploreButton = screen.queryByTestId('fa-compass');
    expect(exploreButton).toBeNull();

    const bookmarksButton = screen.queryByTestId('fa-bookmark');
    expect(bookmarksButton).toBeNull();
  });

  it('renders all components correctly when logged in', () => {
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
      <BrowserRouter>
        <MobileNav />
      </BrowserRouter>
    );

    const homeButton = screen.getByTestId('fa-house');
    expect(homeButton).toBeInTheDocument();

    const exploreButton = screen.getByTestId('fa-compass');
    expect(exploreButton).toBeInTheDocument();

    const bookmarksButton = screen.getByTestId('fa-bookmark');
    expect(bookmarksButton);
  });
});
