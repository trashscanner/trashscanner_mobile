import React from 'react';
import { render } from '@testing-library/react-native';
import { CameraScreen } from '../CameraScreen';

// Mock expo-camera
jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
}));

// Mock usePredictions hook
jest.mock('../../hooks/usePredictions', () => ({
  usePredictions: () => ({
    analyzeImage: jest.fn(),
    isAnalyzing: false,
    error: null,
    clearError: jest.fn(),
  }),
}));

describe('CameraScreen', () => {
  it('renders camera view when permissions are granted', () => {
    const { getByText } = render(<CameraScreen />);
    expect(getByText('Сканирование мусора')).toBeTruthy();
  });
});
