import { client } from './client';
import { AuthRequest, AuthResponse, LoginUserRequest } from '../types/api';
import CookieManager from '@react-native-cookies/cookies';
import { API_CONFIG } from '../config/api';

export const authApi = {
    login: async (data: AuthRequest): Promise<AuthResponse> => {
        const response = await client.post<AuthResponse>('/login', data);
        return response.data;
    },

    register: async (data: LoginUserRequest): Promise<AuthResponse> => {
        const response = await client.post<AuthResponse>('/register', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await client.post('/users/me/logout');
        // Clear cookies on logout
        await CookieManager.clearAll();
    },

    refresh: async (): Promise<void> => {
        await client.post('/refresh');
    },

    // Helper to check if we have cookies/session
    isAuthenticated: async (): Promise<boolean> => {
        const cookies = await CookieManager.get(API_CONFIG.BASE_URL);
        // Check for specific auth cookie name if known, or just presence of cookies
        // Assuming standard session cookies
        return Object.keys(cookies).length > 0;
    }
};
