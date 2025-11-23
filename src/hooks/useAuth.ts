import { useState } from 'react';
import { authApi } from '../api/auth';
import { AuthRequest, LoginUserRequest, AuthResponse } from '../types/api';
import { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';

interface UseAuthResult {
  login: (data: AuthRequest) => Promise<AuthResponse>;
  register: (data: LoginUserRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useAuth = (): UseAuthResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleRequest = async <T>(request: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await request();
      return result;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const baseMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Произошла ошибка при авторизации';

      const errorMessage = `${baseMessage}\nTarget: ${API_CONFIG.BASE_URL}`;

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = (data: AuthRequest) => handleRequest(() => authApi.login(data));

  const register = (data: LoginUserRequest) => handleRequest(() => authApi.register(data));

  const logout = () => handleRequest(() => authApi.logout());

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    clearError,
  };
};
