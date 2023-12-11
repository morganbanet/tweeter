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
            <NavLink to="/">Home</NavLink>
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/bookmarks">Bookmarks</NavLink>
          </div>
        )}

        {userInfo && (
          <div className="current-user">
            <img src={userInfo.avatar.url} alt="profile avatar" />
            <span>{userInfo.name}</span>
            <i className="fa-solid fa-caret-down" />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
