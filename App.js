import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './src/navigation/AppNavigator';
import useAuthStore from './src/store/authStore';

// Enable screens for better performance
enableScreens();

// Initialize auth immediately for seamless navigation
useAuthStore.getState().loadStoredAuth();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
