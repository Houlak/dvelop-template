import type { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage/HomePage';
import Root from './Root';

const getRoutes = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [{ index: true, element: <HomePage /> }],
    },
  ]);

export default getRoutes;

