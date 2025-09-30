import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Мокаем expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

describe('App', () => {
  it('renders without crashing', () => {
    const component = render(<App />);
    expect(component).toBeTruthy();
  });

  it('renders auth screen by default', () => {
    const { getByText } = render(<App />);
    expect(getByText('Войти в аккаунт')).toBeTruthy();
  });
});
