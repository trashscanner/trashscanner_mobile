import { useState, useCallback } from 'react';
import { predictionsApi } from '../api/predictions';
import { PredictionResponse, PredictionStatus } from '../types/api';
import { AxiosError } from 'axios';

interface UsePredictionsResult {
  analyzeImage: (imageUri: string) => Promise<PredictionResponse>;
  isAnalyzing: boolean;
  error: string | null;
  clearError: () => void;
}

const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_POLLING_ATTEMPTS = 60; // 2 minutes max

export const usePredictions = (): UsePredictionsResult => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const pollPrediction = useCallback(async (predictionId: string): Promise<PredictionResponse> => {
    let attempts = 0;

    while (attempts < MAX_POLLING_ATTEMPTS) {
      const prediction = await predictionsApi.getPrediction(predictionId);

      if (prediction.status === PredictionStatus.Completed) {
        return prediction;
      }

      if (prediction.status === PredictionStatus.Failed) {
        throw new Error(prediction.error || 'Анализ не удался');
      }

      // Status is still Processing, wait and retry
      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
      attempts++;
    }

    throw new Error('Превышено время ожидания анализа');
  }, []);

  const analyzeImage = useCallback(
    async (imageUri: string): Promise<PredictionResponse> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        // Step 1: Upload image and create prediction
        const prediction = await predictionsApi.createPrediction(imageUri);

        // Step 2: Poll for result
        const result = await pollPrediction(prediction.id);

        return result;
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          'Ошибка при анализе изображения';
        setError(errorMessage);
        throw err;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [pollPrediction]
  );

  return {
    analyzeImage,
    isAnalyzing,
    error,
    clearError,
  };
};
