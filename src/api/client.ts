import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import CookieManager from '../utils/cookies';
import { Platform } from 'react-native';
import { API_CONFIG } from '../config/api';

// Create axios instance
export const client = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Configure retry behavior
axiosRetry(client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
});

// Request interceptor
client.interceptors.request.use(
  async (config) => {
    // On mobile, we might need to manually ensure cookies are synced/sent
    // but usually withCredentials: true handles it if the native networking stack is used.
    // However, explicit cookie management can be safer.
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Ensure cookies are flushed/synced if needed
      await CookieManager.flush();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid infinite loops
      if (originalRequest.url?.includes('/refresh') || originalRequest.url?.includes('/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await client.post('/refresh');

        // Retry original request
        return client(originalRequest);
      } catch (refreshError) {
        // Refresh failed - user needs to login again
        // We can emit an event or let the caller handle the 401
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
