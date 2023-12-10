import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<h1>App</h1>}>
      {/* @Todo: Home screen route (index = true) */}

      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
