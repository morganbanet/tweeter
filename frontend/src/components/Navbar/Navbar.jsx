import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import Dropdown from '../Dropdown/Dropdown';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { userInfo } = useAuthContext();

  const handleClick = (e) => {
    if (e.target.classList.contains('nav-dropdown')) return;
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="site-logo">
          <img src="/images/tweeter-logo.png" alt="tweeter logo" />
          <span>Tweeter</span>
        </Link>

        {userInfo && (
          <div className="nav-tabs">
            <NavLink to="/">
              Home <div />
            </NavLink>

            <NavLink to="/explore">
              Explore <div />
            </NavLink>

            <NavLink to="/bookmarks">
              Bookmarks <div />
            </NavLink>
          </div>
        )}

        {userInfo && (
          <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <div className="current-user" onClick={(e) => handleClick(e)}>
              <img src={userInfo.avatar.url} alt="profile avatar" />
              <span>{userInfo.name}</span>
              <i className="fa-solid fa-caret-down" data-testid="caret-down" />
              {isOpen && <Dropdown />}
            </div>
          </ClickAwayListener>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
