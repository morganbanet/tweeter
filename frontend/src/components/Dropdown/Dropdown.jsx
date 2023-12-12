import { NavLink } from 'react-router-dom';

function Dropdown() {
  return (
    <div className="nav-dropdown">
      <div className="menu-items">
        <div>
          <div>
            <i className="fa-solid fa-circle-user" />
          </div>
          <NavLink to="/profile">My Profile</NavLink>
        </div>

        <div>
          <div>
            <i className="fa-solid fa-user-group" />
          </div>
          <NavLink to="/groupchat">Group Chat</NavLink>
        </div>

        <div>
          <div>
            <i className="fa-solid fa-gear"></i>
          </div>
          <NavLink to="/settings">Settings</NavLink>
        </div>
      </div>

      <div className="menu-logout">
        <div>
          <div>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </div>
          <NavLink to="/settings">Logout</NavLink>
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
