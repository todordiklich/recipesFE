import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { RouterProvider } from 'react-router';
import { router } from './routes/router';
import { AuthProvider } from './context/AuthProvider';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
