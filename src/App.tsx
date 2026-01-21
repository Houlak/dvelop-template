import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import queryClient from './queries/queryClient';
import getRoutes from './routes/routes';


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={getRoutes(queryClient)} />
    </QueryClientProvider>
  );
}

export default App;
