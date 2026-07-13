import type { CreateUser, LoginResponse, LoginUser } from '../types/auth.types';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function loginUser(loginData: LoginUser): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}

export async function createUser(userData: CreateUser): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
