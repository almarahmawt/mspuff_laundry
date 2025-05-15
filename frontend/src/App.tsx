// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Layanan from './pages/Layanan';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/layanan",
    element: <Layanan />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
