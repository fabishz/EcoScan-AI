/**
 * Results Screen - Expo Router Implementation
 * 
 * Displays waste classification results with captured image, category badge,
 * confidence score, and personalized eco-tip. Provides navigation back to
 * camera or home screen.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { generateTip } from '../lib/utils/tipGenerator';

const { width } = Dimensions.get('window');

/**
 * Generate a mock image representation for testing
 * Creates a visual placeholder that represents the classified object
 */
const generateMockImage = (category: string, confidence: number) => {
  // For React Native, we'll use a simpler approach
  // Return a special identifier that we'll handle in the render
  return `mock-image://${category}/${Math.round(confidence * 100)}`;
};

/**
 * Get detailed AI analysis description
 */
const getAnalysisDescription = (category: string, confidence: number) => {
  const timeOfDay = new Date().getHours();
  const isHighConfidence = confidence > 0.8;
  
  const baseDescriptions = {
    'Recyclable': isHighConfidence 
      ? 'Clear recyclable material detected with high certainty. The AI identified characteristic features of plastic, metal, or paper materials.'
      : 'Likely recyclable material detected. Some features suggest recyclable content, but lighting or angle may affect accuracy.',
    'Compostable': isHighConfidence
      ? 'Organic material clearly identified. The AI detected biodegradable characteristics typical of food waste or natural materials.'
      : 'Probable organic waste detected. Material appears biodegradable but may need closer inspection.',
    'Trash': isHighConfidence
      ? 'Non-recyclable waste identified with high confidence. Material shows mixed composition or contamination.'
      : 'Appears to be general waste. Mixed materials or unclear composition detected.',
    'Unknown': 'Object unclear - the AI needs better lighting, different angle, or closer view for accurate classification.'
  };
  
  let description = baseDescriptions[category as keyof typeof baseDescriptions] || baseDescriptions['Unknown'];
  
  // Add time-based context
  if (timeOfDay >= 6 && timeOfDay <= 10) {
    description += ' Morning waste patterns suggest breakfast-related items.';
  } else if (timeOfDay >= 11 && timeOfDay <= 14) {
    description += ' Lunch-time classification indicates food packaging or containers.';
  } else if (timeOfDay >= 17 && timeOfDay <= 21) {
    description += ' Evening analysis suggests dinner-related waste materials.';
  }
  
  return description;
};

/**
 * Results Screen Component
 */
const ResultsScreen = () => {
  // Extract data passed from CameraScreen via route params
  const params = useLocalSearchParams();
  const { capturedImage, category, confidence, error } = params;
  
  // Convert confidence back to number
  const confidenceValue = confidence ? parseFloat(confidence as string) : 0;
  
  // Handle missing or invalid data
  const hasValidData = capturedImage && category;
  const isErrorResult = error || category === 'Unknown' || !hasValidData;
  
  // Generate mock image for display if using mock camera
  const displayImage = capturedImage?.startsWith('mock://') 
    ? generateMockImage(category as string, confidenceValue)
    : capturedImage;
  
  // Generate personalized eco-tip based on classification category
  const ecoTip = generateTip((category as string) || 'Unknown');
  
  // Get category badge color based on classification
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Recyclable':
        return '#4CAF50'; // Green
      case 'Compostable':
        return '#8D6E63'; // Brown
      case 'Trash':
        return '#9E9E9E'; // Gray
      case 'Unknown':
        return '#FFC107'; // Yellow
      default:
        return '#9E9E9E'; // Default gray
    }
  };
  
  // Format confidence score as percentage
  const confidencePercentage = confidenceValue ? Math.round(confidenceValue * 100) : 0;
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan Results</Text>
        </View>
        
        {/* Captured Image Preview */}
        <View style={styles.imageContainer}>
          {displayImage ? (
            <View style={styles.imageWrapper}>
              <Image 
                source={{ uri: displayImage as string }} 
                style={styles.capturedImage}
                resizeMode="contain"
              />
              {capturedImage?.startsWith('mock://') && (
                <View style={styles.mockImageBadge}>
                  <Text style={styles.mockImageText}>🎭 Mock Result</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderIcon}>📷</Text>
              <Text style={styles.placeholderText}>No image captured</Text>
            </View>
          )}
        </View>
        
        {/* Classification Results */}
        <View style={styles.resultsContainer}>
          
          {/* Error message if classification failed */}
          {isErrorResult && (
            <View style={styles.errorSection}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorMessage}>
                {error ? 'Classification error occurred' : 
                 !hasValidData ? 'No valid scan data available' :
                 'Unable to classify this item clearly'}
              </Text>
            </View>
          )}
          
          {/* Category Badge */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryLabel}>Category:</Text>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(category as string || 'Unknown') }]}>
              <Text style={styles.categoryText}>{category || 'Unknown'}</Text>
            </View>
          </View>
          
          {/* Confidence Score with enhanced details */}
          {confidenceValue !== undefined && confidenceValue > 0 && (
            <View style={styles.confidenceSection}>
              <Text style={styles.confidenceLabel}>AI Confidence:</Text>
              <View style={styles.confidenceDetails}>
                <Text style={styles.confidenceValue}>{confidencePercentage}%</Text>
                <View style={styles.confidenceBar}>
                  <View 
                    style={[
                      styles.confidenceProgress, 
                      { 
                        width: `${confidencePercentage}%`,
                        backgroundColor: confidenceValue > 0.8 ? '#4CAF50' : 
                                       confidenceValue > 0.6 ? '#FF9800' : '#FFC107'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.confidenceDescription}>
                  {confidenceValue > 0.9 ? 'Very High' :
                   confidenceValue > 0.8 ? 'High' :
                   confidenceValue > 0.6 ? 'Good' :
                   confidenceValue > 0.4 ? 'Moderate' : 'Low'} Accuracy
                </Text>
              </View>
            </View>
          )}
          
          {/* AI Analysis Details */}
          <View style={styles.analysisSection}>
            <Text style={styles.analysisTitle}>🧠 AI Analysis</Text>
            <Text style={styles.analysisText}>
              {getAnalysisDescription(category as string, confidenceValue)}
            </Text>
          </View>
          
          {/* Low confidence warning */}
          {confidenceValue !== undefined && confidenceValue > 0 && confidenceValue < 0.5 && (
            <View style={styles.lowConfidenceWarning}>
              <Text style={styles.warningText}>
                Low confidence result - consider scanning again with better lighting or angle
              </Text>
            </View>
          )}
          
        </View>
        
        {/* Eco-Tip Section */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 Eco-Tip</Text>
          <Text style={styles.tipText}>{ecoTip}</Text>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* Scan Again Button */}
          <TouchableOpacity
            style={[styles.button, styles.scanAgainButton]}
            onPress={() => router.push('/camera')}
          >
            <Text style={styles.scanAgainButtonText}>📷 Scan Again</Text>
          </TouchableOpacity>
          
          {/* Home Button */}
          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => router.push('/')}
          >
            <Text style={styles.homeButtonText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: width - 40,
    height: (width - 40) * 0.75,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  mockImageBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(156, 39, 176, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mockImageText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  imagePlaceholder: {
    width: width - 40,
    height: (width - 40) * 0.75,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderText: {
    color: '#757575',
    fontSize: 16,
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 1,
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confidenceSection: {
    marginBottom: 15,
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  confidenceDetails: {
    alignItems: 'flex-start',
  },
  confidenceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  confidenceBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  confidenceProgress: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  analysisSection: {
    backgroundColor: '#F3E5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4A148C',
  },
  errorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  errorMessage: {
    flex: 1,
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '500',
  },
  lowConfidenceWarning: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  warningText: {
    fontSize: 14,
    color: '#F57C00',
    fontStyle: 'italic',
  },
  tipContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scanAgainButton: {
    backgroundColor: '#2E7D32',
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  homeButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;