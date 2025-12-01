/**
 * Camera Screen - Platform-aware Implementation
 * 
 * Conditionally renders web or mobile camera interface based on platform
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4
 */

import React, { useState, useEffect } from 'react';
import { Platform, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Platform-aware component import
const CameraScreen = () => {
  const [PlatformComponent, setPlatformComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlatformComponent = async () => {
      try {
        if (Platform.OS === 'web') {
          // Use web-compatible version
          const { default: CameraScreenWeb } = await import('./platforms/camera.web');
          setPlatformComponent(() => CameraScreenWeb);
        } else {
          // Use mobile version with expo-camera
          const { default: CameraScreenMobile } = await import('./platforms/camera.mobile');
          setPlatformComponent(() => CameraScreenMobile);
        }
      } catch (error) {
        console.error('Error loading platform component:', error);
        // Fallback to a simple error component
        setPlatformComponent(() => () => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Camera not available on this platform</Text>
          </View>
        ));
      } finally {
        setLoading(false);
      }
    };

    loadPlatformComponent();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!PlatformComponent) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Camera component not available</Text>
      </View>
    );
  }

  return <PlatformComponent />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 40
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center'
  }
});

export default CameraScreen;