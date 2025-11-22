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

    // Wait a bit before first poll to give backend time to start processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    while (attempts < MAX_POLLING_ATTEMPTS) {
      try {
        const prediction = await predictionsApi.getPrediction(predictionId);

        console.log(`[Polling] Attempt ${attempts + 1}: Status = ${prediction.status}`);

        if (prediction.status === PredictionStatus.Completed) {
          console.log('[Polling] Analysis completed successfully');
          return prediction;
        }

        if (prediction.status === PredictionStatus.Failed) {
          console.error('[Polling] Analysis failed:', prediction.error);
          throw new Error(prediction.error || 'Анализ не удался');
        }

        // Status is still Processing, wait and retry
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
        attempts++;
      } catch (error) {
        console.error('[Polling] Error fetching prediction:', error);
        throw error;
      }
    }

    throw new Error('Превышено время ожидания анализа');
  }, []);

  const analyzeImage = useCallback(
    async (imageUri: string): Promise<PredictionResponse> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        console.log('[Analysis] Starting image analysis...', imageUri);

        // Step 1: Upload image and create prediction
        const prediction = await predictionsApi.createPrediction(imageUri);
        console.log('[Analysis] Prediction created with ID:', prediction.id);

        // Step 2: Poll for result
        const result = await pollPrediction(prediction.id);
        console.log('[Analysis] Analysis complete:', result);

        return result;
      } catch (err) {
        console.error('[Analysis] Error during analysis:', err);
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
