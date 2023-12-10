import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  // @todo: create authcontext and replace placeholder
  const userInfo = undefined;

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="site-logo">
          <div>
            <img src="/images/tweeter-logo.png" alt="tweeter logo" />

            {/* todo: add tweeter to appear when reached tablet size */}
            <span>Tweeter</span>
          </div>
        </Link>

        <div className="nav-tabs">
          <NavLink to="/" className="nav-home">
            Home
          </NavLink>
          <NavLink to="/explore" className="nav-explore">
            Explore
          </NavLink>
          <NavLink to="/bookmarks" className="nav-bookmarks">
            Bookmarks
          </NavLink>
        </div>

        {userInfo && (
          // @todo: test with a logged in user and add styles
          <div className="user-info">
            <div className="avatar"></div>
            <div className="username"></div>
            <div className="dropdown"></div>
          </div>
        )}

        {!userInfo && (
          <Link to="/login" className="nav-login">
            <div>Login</div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
