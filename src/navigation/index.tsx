import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Dashboard } from '~/routes/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
]);

export const AppNavigation = () => {
  return <RouterProvider router={router} />;
};
