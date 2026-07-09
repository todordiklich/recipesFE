import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export function useAuth() {
  const user = useContext(AuthContext);

  if (!user) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return user;
}
