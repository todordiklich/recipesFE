import { createContext } from 'react';

export interface AuthContextType {
  user: object | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);
