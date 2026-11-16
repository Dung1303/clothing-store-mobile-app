/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { initDatabase } from '../src/database/initDatabase';
import App from '../App';

jest.mock('../src/database/initDatabase', () => ({
  initDatabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/navigation/RootNavigator', () => () => null);

jest.mock('../src/services/sessionService', () => ({
  getUserSession: jest.fn().mockResolvedValue(null),
  saveUserSession: jest.fn().mockResolvedValue(undefined),
  removeUserSession: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({
    children,
  }: {
    children: import('react').ReactNode;
  }) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({
    children,
  }: {
    children: import('react').ReactNode;
  }) => children,
}));

test('initializes the database when the app mounts', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });

  expect(initDatabase).toHaveBeenCalledTimes(1);
});
