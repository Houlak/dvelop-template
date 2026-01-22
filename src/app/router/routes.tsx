import type { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../../pages/ErrorPage/ErrorPage';
import ExamplePage from '../../pages/ExamplePage/ExamplePage';
import { examplePageLoader } from '../../pages/ExamplePage/ExamplePage.loader';
import LoginPage from '../../pages/LoginPage/LoginPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import { requireAuthLoader } from './auth.loader';
import { ProtectedLayout } from './ProtectedLayout';
import Root from './Root';

const getRoutes = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          // Protected route group - auth check happens here
          element: <ProtectedLayout />,
          loader: requireAuthLoader,
          children: [
            {
              index: true,
              element: <ExamplePage />,
              loader: examplePageLoader(queryClient),
            },
            // Add more protected routes here as children
            // Example:
            // {
            //   path: 'dashboard',
            //   element: <DashboardPage />,
            //   loader: dashboardLoader(queryClient),
            // },
          ],
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);

export default getRoutes;

