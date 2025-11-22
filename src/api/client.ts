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
    // Debug logging in development
    if (__DEV__) {
      const fullUrl = `${config.baseURL}${config.url}`;
      console.log(`🚀 API ${config.method?.toUpperCase()}: ${fullUrl}`);
      if (config.data) {
        console.log('   Request data:', JSON.stringify(config.data).substring(0, 200));
      }
    }

    // On mobile, we might need to manually ensure cookies are synced/sent
    // but usually withCredentials: true handles it if the native networking stack is used.
    // However, explicit cookie management can be safer.
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Ensure cookies are flushed/synced if needed
      await CookieManager.flush();

      // Manually inject cookies for Expo Go compatibility
      if (CookieManager.getCookieString) {
        const cookieString = CookieManager.getCookieString();
        if (cookieString) {
          config.headers.Cookie = cookieString;
          console.log('[API Client] Injecting cookies:', cookieString);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
client.interceptors.response.use(
  (response) => {
    // Extract cookies from response headers for Expo Go compatibility
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      if (CookieManager.extractFromHeaders) {
        CookieManager.extractFromHeaders(response.headers);
        console.log('[API Client] Cookies extracted from response');
      }
    }
    return response;
  },
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
