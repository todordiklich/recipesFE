import { AuthContext } from './AuthContext';

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const user = localStorage.getItem('token') ? { id: 1 } : null;

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
