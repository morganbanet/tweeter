import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';

function MobileNav() {
  const { userInfo } = useAuthContext();

  return (
    <>
      {userInfo && (
        <div className="mobile-nav-container">
          <div className="mobile-nav-inner">
            <NavLink to="/">
              <i className="fa-solid fa-house" data-testid="fa-house" />
              <div />
            </NavLink>

            <NavLink to="/explore">
              <i className="fa-solid fa-compass" data-testid="fa-compass" />
              <div />
            </NavLink>

            <NavLink to="/bookmarks">
              <i className="fa-solid fa-bookmark" data-testid="fa-bookmark" />
              <div />
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileNav;
