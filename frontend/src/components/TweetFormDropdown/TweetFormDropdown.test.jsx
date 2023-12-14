import { render, screen } from '../../../tests/testUtils';
import { describe, it, expect } from 'vitest';
import TweetFormDropdown from './TweetFormDropdown';

describe('TweetFormDropdown', () => {
  it('renders all properties correctly', () => {
    render(<TweetFormDropdown />);

    const heading = screen.getByText('Who can reply?');
    expect(heading).toBeInTheDocument();

    const subheading = screen.getByText('Choose who can reply to this Tweet.');
    expect(subheading).toBeInTheDocument();

    const everyoneBtn = screen.getByText('Everyone');
    expect(everyoneBtn).toBeInTheDocument();

    const followingBtn = screen.getByText('People you follow');
    expect(followingBtn).toBeInTheDocument();
  });
});
