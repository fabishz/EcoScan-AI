/**
 * Root Layout - EcoScan AI App Navigation
 * 
 * Configures the main navigation stack with Expo Router
 * Includes tabs (home), camera, and results screens
 * 
 * Requirements: 1.2, 2.5, 4.3, 4.4
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="camera" 
          options={{ 
            headerShown: false, // Full-screen camera experience
            presentation: 'modal' // Modal presentation for camera
          }} 
        />
        <Stack.Screen 
          name="results" 
          options={{ 
            title: 'Scan Results',
            headerStyle: { backgroundColor: '#4CAF50' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackVisible: false // Force use of app buttons for navigation
          }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
