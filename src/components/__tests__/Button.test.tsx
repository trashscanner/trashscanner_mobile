import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders button with label', () => {
    const { getByText } = render(<Button label="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button label="Click Me" onPress={mockOnPress} />);

    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button label="Disabled" onPress={mockOnPress} disabled={true} />);

    fireEvent.press(getByText('Disabled'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('renders different variants correctly', () => {
    const { rerender, getByText } = render(<Button label="Primary" variant="primary" />);
    expect(getByText('Primary')).toBeTruthy();

    rerender(<Button label="Outline" variant="outline" />);
    expect(getByText('Outline')).toBeTruthy();

    rerender(<Button label="Ghost" variant="ghost" />);
    expect(getByText('Ghost')).toBeTruthy();
  });

  it('renders with icon when iconName is provided', () => {
    const { getByText } = render(<Button label="With Icon" iconName="camera" />);
    expect(getByText('With Icon')).toBeTruthy();
  });
});
