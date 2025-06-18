// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Home from './pages/Home';
import Layanan from './pages/Layanan';
import PreviewOwner from './pages/Preview';
import RegistrationPage from './pages/Registration';
import RiwayatTransaksi from './pages/RiwayatTransaksi';

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
  {
    path: "/authentication",
    element: <RegistrationPage />,
  },
  {
    path: "/riwayat-transaksi",
    element: <RiwayatTransaksi />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
