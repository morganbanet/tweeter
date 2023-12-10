import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renders all properties', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
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

    const currentUser = screen.getByTestId('current-user');
    expect(currentUser).toBeInTheDocument();
  });
});
