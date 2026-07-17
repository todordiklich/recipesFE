import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
