import { Link, NavLink } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';

function Navbar() {
  const { userInfo } = useAuthContext();

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
          <div className="current-user">
            <img src={userInfo.avatar.url} alt="profile avatar" />
            <span>{userInfo.name}</span>
            <i className="fa-solid fa-caret-down" data-testid="caret-down" />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
