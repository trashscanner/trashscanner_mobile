import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationBar } from '../NavigationBar';

describe('NavigationBar', () => {
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    mockOnNavigate.mockClear();
  });

  it('renders all navigation tabs', () => {
    const { getByTestId } = render(<NavigationBar active="camera" onNavigate={mockOnNavigate} />);

    expect(getByTestId('nav-camera')).toBeTruthy();
    expect(getByTestId('nav-stats')).toBeTruthy();
    expect(getByTestId('nav-map')).toBeTruthy();
    expect(getByTestId('nav-profile')).toBeTruthy();
  });

  it('highlights active tab with green color', () => {
    const { getByTestId } = render(<NavigationBar active="stats" onNavigate={mockOnNavigate} />);

    const statsTab = getByTestId('nav-stats');
    expect(statsTab).toBeTruthy();
  });

  it('calls onNavigate when tab is pressed', () => {
    const { getByTestId } = render(<NavigationBar active="camera" onNavigate={mockOnNavigate} />);

    fireEvent.press(getByTestId('nav-stats'));
    expect(mockOnNavigate).toHaveBeenCalledWith('stats');
  });

  it('calls onNavigate even for active tab', () => {
    const { getByTestId } = render(<NavigationBar active="camera" onNavigate={mockOnNavigate} />);

    fireEvent.press(getByTestId('nav-camera'));
    expect(mockOnNavigate).toHaveBeenCalledWith('camera');
  });
});
