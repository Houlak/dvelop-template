import { Route, Routes } from 'react-router-dom';
import Landing from './Landing/Landing';

function Main() {
  return (
    <div className="main">
      <div className="content">
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </div>
  );
}

export default Main;
