import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

function RootLayout() {
  return (
    <div className="root-layout">
      <Navbar />

      <div className="screens">
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
