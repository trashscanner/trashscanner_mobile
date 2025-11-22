import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../api/user';
import { UserResponse, ChangePasswordRequest } from '../types/api';
import { AxiosError } from 'axios';

interface UseUserResult {
    user: UserResponse | null;
    isLoading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    uploadAvatar: (uri: string) => Promise<void>;
    deleteAvatar: () => Promise<void>;
    changePassword: (data: ChangePasswordRequest) => Promise<void>;
    deleteAccount: () => Promise<void>;
}

export const useUser = (autoFetch = true): UseUserResult => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await userApi.getMe();
            setUser(data);
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            // Don't set error for 401 as it's handled by interceptor/auth flow
            if (axiosError.response?.status !== 401) {
                setError(axiosError.response?.data?.message || 'Ошибка при загрузке профиля');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchUser();
        }
    }, [autoFetch, fetchUser]);

    const handleRequest = async (
        request: () => Promise<void>,
        shouldRefetch = true
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            await request();
            if (shouldRefetch) {
                await fetchUser();
            }
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            const errorMessage =
                axiosError.response?.data?.message ||
                axiosError.message ||
                'Произошла ошибка';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const uploadAvatar = (uri: string) =>
        handleRequest(async () => { await userApi.uploadAvatar(uri); });

    const deleteAvatar = () =>
        handleRequest(() => userApi.deleteAvatar());

    const changePassword = (data: ChangePasswordRequest) =>
        handleRequest(() => userApi.changePassword(data), false);

    const deleteAccount = () =>
        handleRequest(() => userApi.deleteAccount(), false);

    return {
        user,
        isLoading,
        error,
        fetchUser,
        uploadAvatar,
        deleteAvatar,
        changePassword,
        deleteAccount,
    };
};
