import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { AuthProvider } from '../../context/auth/AuthContext';

import RootLayout from '../../layout/RootLayout/RootLayout';
import UnauthedLayout from '../../layout/UnauthedLayout/UnauthedLayout';
import AuthedLayout from '../../layout/AuthedLayout/AuthedLayout';

import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import LoginScreen from '../../screens/LoginScreen/LoginScreen';

// prettier-ignore
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>

      {/* unauthed users */}
      <Route path="" element={<UnauthedLayout />}>
        <Route path="/login" element={<LoginScreen />} />
      </Route>

      {/* authed users */}
      <Route path="" element={<AuthedLayout />} >
        <Route path="/" index element={<HomeScreen />} />
      </Route>

      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
