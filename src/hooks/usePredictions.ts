import { useState, useCallback, useRef } from 'react';
import { predictionsApi } from '../api/predictions';
import { PredictionResponse, PredictionStatus } from '../types/api';
import { AxiosError } from 'axios';

interface UsePredictionsResult {
  analyzeImage: (imageUri: string) => Promise<PredictionResponse>;
  isAnalyzing: boolean;
  error: string | null;
  clearError: () => void;
}

const POLLING_INTERVAL = 3000; // 3 seconds - safe interval
const MAX_POLLING_ATTEMPTS = 40; // 2 minutes max

export const usePredictions = (): UsePredictionsResult => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const pollPrediction = useCallback(async (predictionId: string): Promise<PredictionResponse> => {
    let attempts = 0;

    console.log('[Polling] Starting to poll prediction:', predictionId);

    while (attempts < MAX_POLLING_ATTEMPTS) {
      // Check if polling was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('[Polling] 🛑 Polling aborted');
        throw new Error('Polling aborted');
      }

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

        // Completed - success, return result
        if (prediction.status === PredictionStatus.Completed) {
          console.log('[Polling] ✅ Analysis completed successfully');
          return prediction;
        }

        // Failed - final status, throw error and stop polling
        if (prediction.status === PredictionStatus.Failed) {
          console.error('[Polling] ❌ Analysis failed (final status):', prediction.error);
          throw new Error(prediction.error || 'Анализ не удался');
        }

        // Processing - continue polling
        if (prediction.status === PredictionStatus.Processing) {
          console.log('[Polling] ⏳ Still processing, waiting...');
          await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
          continue;
        }

        // Unknown status - log and continue
        console.warn('[Polling] ⚠️ Unknown status:', prediction.status);
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
      } catch (error) {
        // If polling was aborted, stop immediately
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Polling aborted');
        }

        // If it's our Failed status error, re-throw to stop polling
        if (error instanceof Error && error.message === 'Анализ не удался') {
          throw error;
        }

        // Network error - log and continue polling
        console.error('[Polling] ⚠️ Network error (attempt ' + attempts + '):', error);
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
      }
    }

    console.error('[Polling] ⏱️ Timeout: exceeded max polling attempts');
    throw new Error('Превышено время ожидания анализа');
  }, []);

  const analyzeImage = useCallback(
    async (imageUri: string): Promise<PredictionResponse> => {
      // Abort any existing polling
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this analysis
      abortControllerRef.current = new AbortController();

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
        if (err instanceof Error && err.message === 'Polling aborted') {
          console.log('[Analysis] Analysis was aborted');
          throw err;
        }

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
        abortControllerRef.current = null;
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
