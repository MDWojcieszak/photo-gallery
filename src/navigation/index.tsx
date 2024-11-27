import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { About } from '~/routes/About';
import { Dashboard } from '~/routes/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/*',
    element: <Navigate to='/' />,
  },
]);

export const AppNavigation = () => {
  return <RouterProvider router={router} />;
};
