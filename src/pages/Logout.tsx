import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function Logout() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
    navigate('/login');
  }, [logout, isAuthenticated, navigate]);

  return <div>Logging out...</div>;
}
