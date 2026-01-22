import type { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../../pages/ErrorPage/ErrorPage';
import HomePage from '../../pages/HomePage/HomePage';
import { homePageLoader } from '../../pages/HomePage/HomePage.loader';
import LoginPage from '../../pages/LoginPage/LoginPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import Root from './Root';

const getRoutes = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        { 
          index: true, 
          element: <HomePage />,
          loader: homePageLoader(queryClient),
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

