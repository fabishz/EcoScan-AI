/**
 * Web Camera Component - Mock Implementation
 * 
 * This component provides a web-compatible camera interface for testing
 * the EcoScan AI app in web browsers. It simulates camera functionality
 * with mock image capture and file input.
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';

interface WebCameraProps {
  style?: any;
  children?: React.ReactNode;
  ref?: any;
}

interface WebCameraRef {
  takePictureAsync: (options?: any) => Promise<{ uri: string }>;
}

const WebCamera = React.forwardRef<WebCameraRef, WebCameraProps>(({ style, children }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Mock camera methods
  React.useImperativeHandle(ref, () => ({
    takePictureAsync: async (options = {}) => {
      return new Promise((resolve, reject) => {
        if (previewImage) {
          // Return the selected image
          resolve({ uri: previewImage });
        } else {
          // Trigger file input for image selection
          if (fileInputRef.current) {
            fileInputRef.current.click();
            
            // Set up a one-time listener for file selection
            const handleFileSelect = (event: Event) => {
              const target = event.target as HTMLInputElement;
              const file = target.files?.[0];
              
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const imageUri = e.target?.result as string;
                  setPreviewImage(imageUri);
                  resolve({ uri: imageUri });
                };
                reader.readAsDataURL(file);
              } else {
                reject(new Error('No image selected'));
              }
              
              // Remove the listener
              fileInputRef.current?.removeEventListener('change', handleFileSelect);
            };
            
            fileInputRef.current.addEventListener('change', handleFileSelect);
          } else {
            reject(new Error('File input not available'));
          }
        }
      });
    }
  }));

  const handleImageSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUri = e.target?.result as string;
        setPreviewImage(imageUri);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      
      {/* Camera preview area */}
      <View style={styles.previewContainer}>
        {previewImage ? (
          <Image source={{ uri: previewImage }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>Web Camera Simulation</Text>
            <Text style={styles.instructionText}>
              Click "Select Image" to choose a photo for testing
            </Text>
            <TouchableOpacity style={styles.selectButton} onPress={handleImageSelect}>
              <Text style={styles.selectButtonText}>Select Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Overlay children (detection results, controls, etc.) */}
      {children}
      
      {/* Web-specific controls */}
      <View style={styles.webControls}>
        <TouchableOpacity style={styles.changeImageButton} onPress={handleImageSelect}>
          <Text style={styles.changeImageButtonText}>Change Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// Mock Camera constants for compatibility
const CameraConstants = {
  Type: {
    back: 'back',
    front: 'front'
  },
  Constants: {
    Type: {
      back: 'back',
      front: 'front'
    }
  }
};

// Mock permission request function
const requestCameraPermissionsAsync = async () => {
  // Always grant permission on web for testing
  return { status: 'granted' };
};

// Export with the same interface as expo-camera
export const Camera = Object.assign(WebCamera, {
  Constants: CameraConstants,
  requestCameraPermissionsAsync
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 20
  },
  
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  
  instructionText: {
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
  
  webControls: {
    position: 'absolute',
    top: 20,
    right: 20
  },
  
  changeImageButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15
  },
  
  changeImageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default Camera;