import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { RouterProvider } from 'react-router';
import { router } from './routes/router';
import { AuthProvider } from './context/AuthProvider';
import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
