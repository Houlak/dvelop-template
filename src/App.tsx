import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './app/providers/AppProviders';
import { queryClient } from './app/providers/QueryProvider';
import getRoutes from './app/router/routes';

function App() {
  return (
    <AppProviders>
      <RouterProvider router={getRoutes(queryClient)} />
    </AppProviders>
  );
}

export default App;
