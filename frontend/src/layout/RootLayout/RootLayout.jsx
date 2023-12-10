import { Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div className="RootLayout">
      {/* @Todo: Create an render NavBar */}

      <div className="screens">
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
