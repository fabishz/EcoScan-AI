/**
 * Camera Screen - Web Version
 * 
 * Web-compatible camera interface for testing EcoScan AI functionality
 * in web browsers. Uses mock ML inference and file input for image selection.
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
  Image,
} from 'react-native';
import { router } from 'expo-router';
// Note: No expo-camera import for web compatibility

const CameraScreenWeb = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isInferencing, setIsInferencing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock inference configuration
  const INFERENCE_INTERVAL = 1500;
  const CONFIDENCE_DISPLAY_THRESHOLD = 0.3;

  /**
   * Mock classification function for web testing
   */
  const mockClassifyImage = async (imageUri: string) => {
    // Simulate inference delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock results that vary for testing
    const categories = ['Recyclable', 'Compostable', 'Trash', 'Unknown'];
    const now = Date.now();
    const categoryIndex = now % categories.length;
    const category = categories[categoryIndex];
    
    // Vary confidence based on category for testing
    let confidence;
    switch (category) {
      case 'Recyclable':
        confidence = 0.75 + Math.random() * 0.2; // 75-95%
        break;
      case 'Compostable':
        confidence = 0.65 + Math.random() * 0.25; // 65-90%
        break;
      case 'Trash':
        confidence = 0.55 + Math.random() * 0.3; // 55-85%
        break;
      case 'Unknown':
        confidence = 0.1 + Math.random() * 0.3; // 10-40%
        break;
      default:
        confidence = 0.5;
    }
    
    return {
      category: category,
      confidence: Math.min(confidence, 1.0),
      timestamp: now,
      webMockResult: true
    };
  };

  /**
   * Handle image selection from file input
   */
  const handleImageSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Process selected image file
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUri = e.target?.result as string;
        setSelectedImage(imageUri);
        
        // Auto-run inference on new image
        await runMockInference(imageUri);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Run mock inference on selected image
   */
  const runMockInference = async (imageUri: string) => {
    try {
      setIsInferencing(true);
      
      const result = await mockClassifyImage(imageUri);
      
      // Handle detection results
      if (result.confidence >= CONFIDENCE_DISPLAY_THRESHOLD) {
        setDetectionResult(result);
      } else {
        setDetectionResult({
          category: 'No clear object detected',
          confidence: result.confidence,
          timestamp: result.timestamp,
          isLowConfidence: true
        });
      }
      
    } catch (error) {
      console.error('Mock inference error:', error);
      setDetectionResult({
        category: 'Detection error',
        confidence: 0,
        timestamp: Date.now(),
        error: (error as Error).message,
        isError: true
      });
    } finally {
      setIsInferencing(false);
    }
  };

  /**
   * Capture (use selected image) and navigate to results
   */
  const handleCapture = async () => {
    if (!selectedImage) {
      Alert.alert(
        'No Image Selected',
        'Please select an image first to test the classification.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      setIsCapturing(true);
      
      // Run final inference
      const finalResult = await mockClassifyImage(selectedImage);
      
      // Navigate to results screen
      router.push({
        pathname: '/results',
        params: {
          capturedImage: selectedImage,
          category: finalResult.category,
          confidence: finalResult.confidence.toString()
        }
      });
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert(
        'Capture Error',
        'Failed to process image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCapturing(false);
    }
  };

  /**
   * Get category color for UI display
   */
  const getCategoryColor = (category: string) => {
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

  return (
    <View style={styles.container}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      
      {/* Camera simulation area */}
      <View style={styles.cameraContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderTitle}>Web Camera Simulation</Text>
            <Text style={styles.placeholderText}>
              Select an image to test waste classification
            </Text>
            <TouchableOpacity style={styles.selectButton} onPress={handleImageSelect}>
              <Text style={styles.selectButtonText}>Select Image</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Detection overlay */}
        <View style={styles.overlay}>
          
          {/* Web mode indicator */}
          <View style={styles.webModeIndicator}>
            <Text style={styles.webModeText}>🌐 Web Testing Mode</Text>
          </View>
          
          {/* Detection result display */}
          {detectionResult && (
            <View style={styles.detectionContainer}>
              <View style={[
                styles.detectionBadge,
                { 
                  backgroundColor: detectionResult.isError 
                    ? '#F44336' 
                    : detectionResult.isLowConfidence
                      ? '#FFC107'
                      : getCategoryColor(detectionResult.category)
                }
              ]}>
                {detectionResult.isError && (
                  <Text style={styles.errorIcon}>⚠️</Text>
                )}
                <Text style={styles.detectionCategory}>
                  {detectionResult.category}
                </Text>
                {detectionResult.confidence > 0 && !detectionResult.isError && (
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
          {selectedImage && <View style={styles.captureFrame} />}
          
          {/* Bottom controls */}
          <View style={styles.controlsContainer}>
            
            {/* Back button */}
            <TouchableOpacity 
              style={styles.backControlButton} 
              onPress={() => router.back()}
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
                <Text style={styles.captureButtonText}>
                  {selectedImage ? 'Classify' : 'Select Image'}
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Change image button */}
            <TouchableOpacity 
              style={styles.changeImageButton}
              onPress={handleImageSelect}
            >
              <Text style={styles.controlButtonText}>Change</Text>
            </TouchableOpacity>
            
          </View>
          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  
  cameraContainer: {
    flex: 1,
    position: 'relative'
  },
  
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 20
  },
  
  placeholderTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  
  placeholderText: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24
  },
  
  selectButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25
  },
  
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  },
  
  // Web mode indicator
  webModeIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15
  },
  
  webModeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },

  // Detection result styles
  detectionContainer: {
    position: 'absolute',
    top: 70,
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
  
  errorIcon: {
    fontSize: 16,
    marginRight: 6
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
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
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
  
  changeImageButton: {
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
  }
});

export default CameraScreenWeb;