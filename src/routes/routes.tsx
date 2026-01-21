import type { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';
import Landing from '../screens/Landing/Landing';
import Root from './Root';

const getRoutes = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [{ index: true, element: <Landing /> }],
    },
  ]);

export default getRoutes;
