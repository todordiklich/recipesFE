import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
