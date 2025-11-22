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

    console.log('[Polling] Starting to poll prediction:', predictionId);

    while (attempts < MAX_POLLING_ATTEMPTS) {
      attempts++;
      console.log(`[Polling] Attempt ${attempts}/${MAX_POLLING_ATTEMPTS}`);

      try {
        const prediction = await predictionsApi.getPrediction(predictionId);
        console.log('[Polling] Response:', {
          id: prediction.id,
          status: prediction.status,
          hasResult: !!prediction.result,
          error: prediction.error,
        });

        if (prediction.status === PredictionStatus.Completed) {
          console.log('[Polling] ✅ Analysis completed successfully');
          return prediction;
        }

        if (prediction.status === PredictionStatus.Failed) {
          console.error('[Polling] ❌ Analysis failed:', prediction.error);
          throw new Error(prediction.error || 'Анализ не удался');
        }

        console.log('[Polling] ⏳ Still processing, waiting 2s...');
      } catch (error) {
        // If it's a network error, log but continue polling
        console.error('[Polling] ⚠️ Error fetching prediction (attempt ' + attempts + '):', error);

        // Only throw if it's a Failed status error, not a network error
        if (error instanceof Error && error.message.includes('Анализ не удался')) {
          throw error;
        }
        // For network errors, we'll continue to retry
      }

      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
    }

    console.error('[Polling] ⏱️ Timeout: exceeded max polling attempts');
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
