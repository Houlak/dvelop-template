import { BrowserRouter, RouterProvider } from 'react-router-dom';
import getRoutes from './routes/routes';
import './styles/app.scss';

function App() {
  return (
    <BrowserRouter>
      <RouterProvider router={getRoutes()} />
    </BrowserRouter>
  );
}

export default App;
