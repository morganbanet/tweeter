import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import MobileNav from '../../components/MobileNav/MobileNav';
import { useAuthContext } from '../../hooks/auth/useAuthContext';

function RootLayout() {
  const { userInfo } = useAuthContext();

  return (
    <div className="root-layout">
      <Navbar />

      <div className="screens">
        <Outlet />
      </div>

      {userInfo && <MobileNav />}
    </div>
  );
}

export default RootLayout;
