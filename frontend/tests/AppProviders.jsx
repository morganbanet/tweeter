import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/auth/AuthContext';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </AuthProvider>
  );
};

export default AppProviders;
