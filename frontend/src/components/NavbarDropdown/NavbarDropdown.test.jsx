import { render, screen } from '../../../tests/testUtils';
import { describe, it, expect } from 'vitest';
import NavbarDropdown from './NavbarDropdown';

describe('NavbarDropdown', () => {
  it('should render all links correctly', () => {
    render(<NavbarDropdown />);

    const profileLink = screen.getByRole('link', { name: /my profile/i });
    expect(profileLink).toBeInTheDocument();

    const groupChatLink = screen.getByRole('link', { name: /group chat/i });
    expect(groupChatLink).toBeInTheDocument();

    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toBeInTheDocument();
  });
});
