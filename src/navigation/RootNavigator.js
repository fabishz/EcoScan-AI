/**
 * RootNavigator.js - Main navigation stack for EcoScan AI
 * 
 * Configures the navigation flow: HomeScreen → CameraScreen → ResultsScreen
 * Handles navigation parameters for passing captured images and classification results
 * 
 * Requirements: 1.2, 2.5, 4.3, 4.4
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screen components
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ResultsScreen from '../screens/ResultsScreen';

// Create native stack navigator
const Stack = createNativeStackNavigator();

/**
 * Root Navigator Component
 * 
 * Defines the main navigation stack with three screens:
 * 1. HomeScreen - Entry point with app description and scan button
 * 2. CameraScreen - Live camera feed with real-time ML inference
 * 3. ResultsScreen - Display classification results and eco-tips
 * 
 * Navigation Flow:
 * Home → Camera → Results → (Home | Camera)
 */
const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
        }}
      >
        {/* Home Screen - App entry point */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'EcoScan AI',
            headerLeft: null, // Disable back button on home screen
          }}
        />
        
        {/* Camera Screen - Live scanning interface */}
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            title: 'Scan Waste',
            headerShown: false, // Hide header for full-screen camera experience
          }}
        />
        
        {/* Results Screen - Classification results and eco-tips */}
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            title: 'Scan Results',
            headerLeft: null, // Disable back button, force use of app buttons
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;