import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <></>,
  },
]);

export const AppNavigation = () => {
  return <RouterProvider router={router} />;
};
