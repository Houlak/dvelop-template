import { RouterProvider } from 'react-router-dom';
import getRoutes from './routes/routes';
import './styles/app.scss';

function App() {
  return (
    <>
      <RouterProvider router={getRoutes()} />
    </>
  );
}

export default App;
