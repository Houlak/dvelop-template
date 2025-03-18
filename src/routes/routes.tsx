import { createBrowserRouter } from 'react-router-dom';
import Landing from '../screens/Landing/Landing';
import Root from './Root';

const getRoutes = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [{ index: true, element: <Landing /> }],
    },
  ]);

export default getRoutes;
