import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import NavbarMobile from '../../components/NavbarMobile/NavbarMobile';

function RootLayout() {
  return (
    <div className="root-layout">
      <Navbar />

      <div className="screens">
        <Outlet />
      </div>

      <NavbarMobile />
    </div>
  );
}

export default RootLayout;
