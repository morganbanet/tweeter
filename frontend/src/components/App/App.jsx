import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import RootLayout from '../../layout/RootLayout/RootLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* @Todo: Home screen route (index = true) */}

      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
