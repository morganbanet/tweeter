import { render, screen } from '../../../tests/testUtils';
import { describe, it, expect, vi } from 'vitest';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import user from '@testing-library/user-event';
import Navbar from './Navbar';

let userInfo = {
  id: 1,
  name: 'John Doe',
  email: 'johndoe@email.com',
  avatar: { url: 'https://exampleurl.com' },
};

vi.mock('../../hooks/auth/useAuthContext', () => {
  return { useAuthContext: vi.fn() };
});

describe('Navbar', async () => {
  it('renders all properties when logged in', () => {
    useAuthContext.mockReturnValue({ userInfo });

    render(<Navbar />);

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

  it('renders only the logo when logged out', () => {
    useAuthContext.mockReturnValue({ userInfo });

    render(<Navbar />);

    const logoImage = screen.getByAltText('tweeter logo');
    expect(logoImage).toBeInTheDocument();

    const logoText = screen.getByText(/tweeter/i);
    expect(logoText).toBeInTheDocument();
  });

  it('toggles dropdown menu when user avatar clicked', async () => {
    useAuthContext.mockReturnValue({ userInfo });

    user.setup();

    render(<Navbar />);

    let menuItem = screen.queryByRole('link', { name: /my profile/i });
    expect(menuItem).toBeNull();

    const profileImage = screen.getByAltText('profile avatar');
    await user.click(profileImage);

    menuItem = screen.queryByRole('link', { name: /my profile/i });
    expect(menuItem).toBeInTheDocument();
  });

  it('closes the dropdown menu when clicked outside', async () => {
    useAuthContext.mockReturnValue({ userInfo });

    user.setup();

    render(<Navbar />);

    let menuItem = screen.queryByRole('link', { name: /my profile/i });
    expect(menuItem).toBeNull();

    const profileImage = screen.getByAltText('profile avatar');
    await user.click(profileImage);

    menuItem = screen.getByRole('link', { name: /my profile/i });
    expect(menuItem).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /home/i });
    await user.click(homeLink);

    menuItem = screen.queryByRole('link', { name: /my profile/i });
    expect(menuItem).toBeNull();
  });
});
