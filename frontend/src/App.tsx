// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Layanan from './pages/Layanan';
import PreviewOwner from './pages/Preview';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/layanan",
    element: <Layanan />,
  },
  {
    path: "/preview",
    element: <PreviewOwner />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
