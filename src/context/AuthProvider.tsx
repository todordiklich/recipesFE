import { type ReactNode, useEffect } from 'react';
import { loginUser } from '../api/auth.api';
import { AuthContext } from './AuthContext';
import type { LoginResponse, LoginUser } from '../types/auth.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const AUTH_USER_QUERY_KEY = ['auth-user'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: (): LoginResponse | null => {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    },
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data));
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, data);
    },
  });

  useEffect(() => {
    const syncAuthState = () => {
      const storedUser = localStorage.getItem('user');
      queryClient.setQueryData(
        AUTH_USER_QUERY_KEY,
        storedUser ? JSON.parse(storedUser) : null,
      );
    };

    window.addEventListener('auth:updated', syncAuthState);
    window.addEventListener('auth:logout', syncAuthState);

    return () => {
      window.removeEventListener('auth:updated', syncAuthState);
      window.removeEventListener('auth:logout', syncAuthState);
    };
  }, [queryClient]);

  const login = async (loginData: LoginUser): Promise<void> => {
    await loginMutation.mutateAsync(loginData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
    window.dispatchEvent(new Event('auth:logout'));
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading || loginMutation.isPending,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
