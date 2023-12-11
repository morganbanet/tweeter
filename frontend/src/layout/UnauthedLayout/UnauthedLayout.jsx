import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';

// protect login and register pages from authed users
function UnauthedLayout() {
  const { userInfo } = useAuthContext();
  return userInfo ? <Navigate to="/" replace /> : <Outlet />;
}

export default UnauthedLayout;
