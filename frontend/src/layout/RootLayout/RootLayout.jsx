import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import MobileNav from '../../components/MobileNav/MobileNav';

function RootLayout() {
  return (
    <div className="root-layout">
      <Navbar />

      <div className="screens">
        <Outlet />
      </div>

      <MobileNav />
    </div>
  );
}

export default RootLayout;
