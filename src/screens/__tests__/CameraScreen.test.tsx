import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CameraScreen } from '../CameraScreen';

describe('CameraScreen', () => {
  const mockOnCapture = jest.fn();

  it('renders camera screen with title', () => {
    const { getByText } = render(<CameraScreen onCapture={mockOnCapture} />);
    expect(getByText('Анализатор мусора')).toBeTruthy();
  });

  it('calls onCapture when capture button is pressed', () => {
    const { getByTestId } = render(<CameraScreen onCapture={mockOnCapture} />);

    const captureButton = getByTestId('capture-button');
    fireEvent.press(captureButton);

    expect(mockOnCapture).toHaveBeenCalled();
  });
});
