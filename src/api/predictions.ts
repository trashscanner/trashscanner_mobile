import { client } from './client';
import { PredictionResponse } from '../types/api';
import { Platform } from 'react-native';

export const predictionsApi = {
  createPrediction: async (imageUri: string): Promise<PredictionResponse> => {
    const formData = new FormData();

    const filename = imageUri.split('/').pop() || 'scan.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('scan', {
      uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
      name: filename,
      type,
    } as any);

    const response = await client.post<PredictionResponse>('/predictions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPrediction: async (id: string): Promise<PredictionResponse> => {
    const response = await client.get<PredictionResponse>(`/predictions/${id}`);
    return response.data;
  },

  getPredictions: async (limit = 10, offset = 0): Promise<PredictionResponse[]> => {
    const response = await client.get<PredictionResponse[]>('/predictions', {
      params: { limit, offset },
    });
    return response.data;
  },
};
