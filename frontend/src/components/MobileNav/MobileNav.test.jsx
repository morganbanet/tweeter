import { render, screen } from '../../../tests/testUtils';
import { describe, it, expect, vi } from 'vitest';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import MobileNav from './MobileNav';

let userInfo = {
  id: 1,
  name: 'John Doe',
  email: 'johndoe@email.com',
  avatar: { url: 'https://exampleurl.com' },
};

vi.mock('../../hooks/auth/useAuthContext', () => {
  return { useAuthContext: vi.fn() };
});

describe('MobileNav', () => {
  it('renders all buttons when user logged in', () => {
    useAuthContext.mockReturnValue({ userInfo });

    render(<MobileNav />);

    const homeButton = screen.getByTestId('fa-house');
    expect(homeButton).toBeInTheDocument();

    const exploreButton = screen.getByTestId('fa-compass');
    expect(exploreButton).toBeInTheDocument();

    const bookmarksButton = screen.getByTestId('fa-bookmark');
    expect(bookmarksButton);
  });

  it('buttons do not render when user logged out', () => {
    useAuthContext.mockReturnValue({ userInfo: null });

    render(<MobileNav />);

    const homeButton = screen.queryByTestId('fa-house');
    expect(homeButton).toBeNull();

    const exploreButton = screen.queryByTestId('fa-compass');
    expect(exploreButton).toBeNull();

    const bookmarksButton = screen.queryByTestId('fa-bookmark');
    expect(bookmarksButton).toBeNull();
  });
});
