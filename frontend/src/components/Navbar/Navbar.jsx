import { Link } from 'react-router-dom';

function Navbar() {
  // @todo: create authcontext and replace placeholder
  const userInfo = undefined;

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        <Link to="/">
          <div className="site-logo">
            <img src="/images/tweeter-logo.png" alt="tweeter logo" />
            <span>Tweeter</span>
          </div>
        </Link>

        {userInfo && (
          <div className="user-info">
            <div className="avatar"></div>
            <div className="username"></div>
            <div className="dropdown"></div>
          </div>
        )}

        {!userInfo && (
          <Link to="/login" className="nav-login">
            <div className="">Login</div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
