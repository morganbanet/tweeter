import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { AuthProvider } from '../../context/auth/AuthContext';
import { TweetsProvider } from '../../context/tweets/TweetsContext';
import { InteractionsProvider } from '../../context/interactions/InteractionsContext';
import { HashtagsProvider } from '../../context/hashtags/HashtagsContext';
import { SuggestionsProvider } from '../../context/suggestions/SuggestionsContext';

import RootLayout from '../../layout/RootLayout/RootLayout';
import UnauthedLayout from '../../layout/UnauthedLayout/UnauthedLayout';
import AuthedLayout from '../../layout/AuthedLayout/AuthedLayout';

import LoginScreen from '../../screens/LoginScreen/LoginScreen';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ExploreScreen from '../../screens/ExploreScreen/ExploreScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';

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
        <Route path="/explore" element={<ExploreScreen />} />
        <Route path="/users/:slug/:id" element={<ProfileScreen />} />
      </Route>

      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <TweetsProvider>
        <InteractionsProvider>
          <HashtagsProvider>
            <SuggestionsProvider>
              <RouterProvider router={router} />
            </SuggestionsProvider>
          </HashtagsProvider>
        </InteractionsProvider>
      </TweetsProvider>
    </AuthProvider>
  );
}

export default App;
