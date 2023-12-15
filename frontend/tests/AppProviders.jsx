import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/auth/AuthContext';
import { TweetsProvider } from '../src/context/tweets/TweetsContext';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <TweetsProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </TweetsProvider>
    </AuthProvider>
  );
};

export default AppProviders;
