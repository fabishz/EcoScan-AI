/**
 * CameraScreen.js - Real-time waste classification camera interface
 * 
 * This component provides a live camera feed with real-time ML inference
 * for waste classification. Optimized for Arm-based mobile devices with
 * inference throttling and quantized model usage.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Camera } from 'expo-camera';
import { classifyImage, getModelInfo } from '../utils/models';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CameraScreen = ({ navigation }) => {
  // Camera permission and setup state
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  
  // Inference state management
  const [isInferencing, setIsInferencing] = useState(false);
  const [lastInferenceTime, setLastInferenceTime] = useState(0);
  const [detectionResult, setDetectionResult] = useState(null);
  
  // UI state
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPermissionError, setShowPermissionError] = useState(false);

  // Inference throttling configuration (Arm optimization)
  const INFERENCE_INTERVAL = 1500; // 1.5 seconds between inferences
  const CONFIDENCE_DISPLAY_THRESHOLD = 0.3; // Show results above 30% confidence
  
  /**
   * Request camera permission on component mount
   * Requirement: 2.1 - Request camera permission from user
   */
  useEffect(() => {
    requestCameraPermission();
  }, []);

  /**
   * Set up inference scheduling when camera is ready
   * Arm Optimization: Throttled inference every 1-2 seconds to reduce CPU load
   */
  useEffect(() => {
    let inferenceTimer;
    
    if (hasPermission && cameraRef) {
      // Start inference scheduling
      inferenceTimer = setInterval(() => {
        scheduleInference();
      }, INFERENCE_INTERVAL);
    }
    
    return () => {
      if (inferenceTimer) {
        clearInterval(inferenceTimer);
      }
    };
  }, [hasPermission, cameraRef]);

  /**
   * Request camera permission from the user
   * Handles permission denial gracefully with user-friendly messaging
   * 
   * Requirements: 2.1, 7.4
   */
  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status === 'granted') {
        setHasPermission(true);
        setShowPermissionError(false);
      } else {
        setHasPermission(false);
        setShowPermissionError(true);
        
        // Show user-friendly permission denial message
        Alert.alert(
          'Camera Permission Required',
          'EcoScan AI needs camera access to scan and classify waste items. Please grant camera permission in your device settings.',
          [
            { text: 'Cancel', onPress: () => navigation.goBack() },
            { text: 'Retry', onPress: requestCameraPermission }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
      setShowPermissionError(true);
    }
  };

  /**
   * Schedule inference with throttling to optimize Arm CPU usage
   * 
   * Arm Optimization: Only run inference every 1-2 seconds, not on every frame
   * This reduces CPU load by ~80% while maintaining responsive user experience
   * 
   * Requirements: 2.4, 3.1, 3.2, 7.1, 7.2
   */
  const scheduleInference = async () => {
    const currentTime = Date.now();
    
    // Skip if inference is already running or too soon since last inference
    if (isInferencing || (currentTime - lastInferenceTime) < INFERENCE_INTERVAL) {
      return;
    }
    
    // Skip if camera is not ready
    if (!cameraRef || isCapturing) {
      return;
    }
    
    try {
      setIsInferencing(true);
      setLastInferenceTime(currentTime);
      
      // Capture current camera frame for inference
      const photo = await cameraRef.takePictureAsync({
        quality: 0.7, // Reduce quality for faster processing
        base64: false,
        skipProcessing: true // Skip unnecessary processing for inference
      });
      
      // Run ML inference on the captured frame
      const result = await classifyImage(photo.uri);
      
      // Update detection result if confidence is above threshold
      if (result.confidence >= CONFIDENCE_DISPLAY_THRESHOLD) {
        setDetectionResult(result);
      } else {
        // Clear previous results if confidence is too low
        setDetectionResult({
          category: 'No clear object detected',
          confidence: result.confidence,
          timestamp: result.timestamp
        });
      }
      
    } catch (error) {
      console.error('Error during inference:', error);
      
      // Handle inference errors gracefully
      setDetectionResult({
        category: 'Detection error',
        confidence: 0,
        timestamp: Date.now(),
        error: error.message
      });
      
    } finally {
      setIsInferencing(false);
    }
  };

  /**
   * Capture photo and navigate to results screen
   * 
   * Requirements: 2.5, 4.3
   */
  const handleCapture = async () => {
    if (!cameraRef || isCapturing) {
      return;
    }
    
    try {
      setIsCapturing(true);
      
      // Capture high-quality photo for results screen
      const photo = await cameraRef.takePictureAsync({
        quality: 0.9,
        base64: false
      });
      
      // Run final inference on captured image
      const finalResult = await classifyImage(photo.uri);
      
      // Navigate to results screen with captured image and classification
      navigation.navigate('Results', {
        imageUri: photo.uri,
        classification: finalResult
      });
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert(
        'Capture Error',
        'Failed to capture photo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCapturing(false);
    }
  };

  /**
   * Get category color for UI display
   */
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Recyclable':
        return '#4CAF50'; // Green
      case 'Compostable':
        return '#8D6E63'; // Brown
      case 'Trash':
        return '#757575'; // Gray
      case 'Unknown':
        return '#FF9800'; // Orange
      default:
        return '#2196F3'; // Blue for detection messages
    }
  };

  /**
   * Render permission error screen
   * Requirement: 7.4 - Handle camera permission denial
   */
  if (showPermissionError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Camera Permission Required</Text>
        <Text style={styles.errorMessage}>
          EcoScan AI needs camera access to scan waste items. 
          Please grant camera permission to continue.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={requestCameraPermission}>
          <Text style={styles.retryButtonText}>Retry Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Render loading screen while permission is being checked
   */
  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  /**
   * Main camera interface
   * Requirements: 2.3, 2.4, 2.5, 3.3, 4.1
   */
  return (
    <View style={styles.container}>
      {/* Live camera feed */}
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={setCameraRef}
        ratio="16:9"
      >
        {/* Camera overlay with detection results */}
        <View style={styles.overlay}>
          
          {/* Detection result display */}
          {detectionResult && (
            <View style={styles.detectionContainer}>
              <View style={[
                styles.detectionBadge,
                { backgroundColor: getCategoryColor(detectionResult.category) }
              ]}>
                <Text style={styles.detectionCategory}>
                  {detectionResult.category}
                </Text>
                {detectionResult.confidence > 0 && (
                  <Text style={styles.detectionConfidence}>
                    {Math.round(detectionResult.confidence * 100)}%
                  </Text>
                )}
              </View>
            </View>
          )}
          
          {/* Inference status indicator */}
          {isInferencing && (
            <View style={styles.inferenceIndicator}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.inferenceText}>Analyzing...</Text>
            </View>
          )}
          
          {/* Capture frame indicator */}
          <View style={styles.captureFrame} />
          
          {/* Bottom controls */}
          <View style={styles.controlsContainer}>
            
            {/* Back button */}
            <TouchableOpacity 
              style={styles.backControlButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.controlButtonText}>Back</Text>
            </TouchableOpacity>
            
            {/* Capture button */}
            <TouchableOpacity
              style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
              onPress={handleCapture}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.captureButtonText}>Capture</Text>
              )}
            </TouchableOpacity>
            
            {/* Info button */}
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => {
                const modelInfo = getModelInfo();
                Alert.alert(
                  'Detection Info',
                  `Model loaded: ${modelInfo.isLoaded ? 'Yes' : 'No'}\n` +
                  `Categories: ${modelInfo.categories.join(', ')}\n` +
                  `Confidence threshold: ${Math.round(CONFIDENCE_DISPLAY_THRESHOLD * 100)}%`,
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={styles.controlButtonText}>Info</Text>
            </TouchableOpacity>
            
          </View>
          
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  
  camera: {
    flex: 1
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  
  // Detection result styles
  detectionContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center'
  },
  
  detectionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  
  detectionCategory: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8
  },
  
  detectionConfidence: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9
  },
  
  // Inference indicator styles
  inferenceIndicator: {
    position: 'absolute',
    top: 120,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15
  },
  
  inferenceText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 6
  },
  
  // Capture frame indicator
  captureFrame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    bottom: '30%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    borderStyle: 'dashed'
  },
  
  // Controls container
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  
  // Capture button styles
  captureButton: {
    backgroundColor: '#4CAF50',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8
  },
  
  captureButtonDisabled: {
    backgroundColor: '#757575'
  },
  
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  
  // Control button styles
  backControlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center'
  },
  
  infoButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center'
  },
  
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  
  // Error screen styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 40
  },
  
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center'
  },
  
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32
  },
  
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16
  },
  
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  
  backButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CAF50'
  },
  
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600'
  },
  
  // Loading screen styles
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
  }
});

export default CameraScreen;