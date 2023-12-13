import { render, screen } from '../../../tests/testUtils';
import { describe, it, expect, vi } from 'vitest';
import user from '@testing-library/user-event';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import TweetForm from './TweetForm';

let userInfo = {
  id: 1,
  name: 'John Doe',
  email: 'johndoe@email.com',
  avatar: { url: 'https://exampleurl.com' },
};

vi.mock('../../hooks/auth/useAuthContext', () => {
  return { useAuthContext: vi.fn() };
});

describe('TweetForm', () => {
  it('renders all properties correctly', () => {
    useAuthContext.mockReturnValue({ userInfo });

    render(<TweetForm />);

    const heading = screen.getByText(/tweet something/i);
    expect(heading).toBeInTheDocument();

    const profileImage = screen.getByAltText(/profile avatar/i);
    expect(profileImage).toBeInTheDocument();

    const inputField = screen.getByPlaceholderText(/what's happening/i);
    expect(inputField).toBeInTheDocument();

    const uploadBtnIcon = screen.getByText(/image/i);
    expect(uploadBtnIcon).toBeInTheDocument();

    const privacyBtnIcon = screen.getByText(/public/i);
    expect(privacyBtnIcon).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /tweet/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('toggles tweet form dropdown when privacy button clicked', async () => {
    useAuthContext.mockReturnValue({ userInfo });

    user.setup();

    render(<TweetForm />);

    let dropdownItem = screen.queryByText('People you follow');
    expect(dropdownItem).toBeNull();

    const privacyBtnIcon = screen.getByText(/public/i);
    await user.click(privacyBtnIcon);

    dropdownItem = screen.getByText('People you follow');
    expect(dropdownItem).toBeInTheDocument();
  });

  it('selecting items in the dropdown menu changes privacy text', () => {});

  it('displays an image when selecting a file for upload', () => {});

  it('removes the image from preview when clicking x on the image', () => {});
});
