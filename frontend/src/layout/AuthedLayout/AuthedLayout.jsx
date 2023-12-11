import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';

// protect site pages from unauthed users
function AuthedLayout() {
  const { userInfo } = useAuthContext();
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AuthedLayout;
