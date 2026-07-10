import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { LoginResponse } from '../types/auth.types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(() => {
    const localStorageData = localStorage.getItem('user');
    return localStorageData ? JSON.parse(localStorageData) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ email, password }),
        },
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data: LoginResponse = await response.json();
      setUser(data);

      localStorage.setItem('user', JSON.stringify(data));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
