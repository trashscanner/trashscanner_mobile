import { client } from './client';
import {
  UserResponse,
  ChangePasswordRequest,
  UploadAvatarResponse,
  UpdateUserRequest,
} from '../types/api';
import { Platform } from 'react-native';

export const userApi = {
  getMe: async (): Promise<UserResponse> => {
    const response = await client.get<UserResponse>('/users/me');
    return response.data;
  },

  updateUser: async (data: UpdateUserRequest): Promise<UserResponse> => {
    const response = await client.patch<UserResponse>('/users/me', data);
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await client.delete('/users/me');
  },

  uploadAvatar: async (uri: string): Promise<UploadAvatarResponse> => {
    const formData = new FormData();

    const filename = uri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('avatar', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: filename,
      type,
    } as any);

    const response = await client.put<UploadAvatarResponse>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAvatar: async (): Promise<void> => {
    await client.delete('/users/me/avatar');
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await client.put('/users/me/change-password', { changePasswordRequest: data });
  },
};
