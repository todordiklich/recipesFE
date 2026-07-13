export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface CreateUser {
  email: string;
  password: string;
  name: string;
}

export interface AuthContextType {
  user: LoginResponse | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (logindata: LoginUser) => Promise<void>;
  logout: () => void;
}

export type ApiErrorResponse = {
  success: boolean;
  message: string;
  details?: {
    field: string;
    message: string;
  }[];
};
