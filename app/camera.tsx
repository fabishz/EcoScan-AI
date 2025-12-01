/**
 * Camera Screen - Platform-aware Implementation
 * 
 * Conditionally renders web or mobile camera interface based on platform
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4
 */

import React from 'react';
import { Platform } from 'react-native';

// Platform-aware component import
const CameraScreen = () => {
  if (Platform.OS === 'web') {
    // Use web-compatible version
    const CameraScreenWeb = require('./camera.web').default;
    return <CameraScreenWeb />;
  } else {
    // Use mobile version with expo-camera
    const CameraScreenMobile = require('./camera.mobile').default;
    return <CameraScreenMobile />;
  }
};

export default CameraScreen;





export default CameraScreen;