import { render, screen } from '../../../tests/testUtils';
import { describe, it, expect } from 'vitest';
import TweetForm from './TweetForm';

describe('TweetForm', () => {
  it('renders all properties correctly', () => {
    render(<TweetForm />);

    const heading = screen.getByText(/tweet something/i);
    expect(heading).toBeInTheDocument();

    const profileImage = screen.getByAltText(/profile avatar/i);
    expect(profileImage).toBeInTheDocument();

    const inputField = screen.getByLabelText(/body/i);
    expect(inputField).toBeInTheDocument();

    const uploadImageBtn = screen.getByLabelText(/upload image/i);
    expect(uploadImageBtn).toBeInTheDocument();

    const privacyBtn = screen.getByLabelText(/toggle privary/i);
    expect(privacyBtn).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /tweet/i });
    expect(submitBtn).toBeInTheDocument();
  });
});
