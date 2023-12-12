import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dropdown from './Dropdown';

describe('Dropdown', () => {
  it('should render all links correctly', () => {
    render(
      <BrowserRouter>
        <Dropdown />
      </BrowserRouter>
    );

    const profileLink = screen.getByRole('link', { name: /my profile/i });
    expect(profileLink).toBeInTheDocument();

    const groupChatLink = screen.getByRole('link', { name: /group chat/i });
    expect(groupChatLink).toBeInTheDocument();

    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toBeInTheDocument();
  });
});
