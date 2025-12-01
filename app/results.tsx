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
          {capturedImage ? (
            <Image source={{ uri: capturedImage as string }} style={styles.capturedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
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
          
          {/* Confidence Score - only show if we have valid confidence */}
          {confidenceValue !== undefined && confidenceValue > 0 && (
            <View style={styles.confidenceSection}>
              <Text style={styles.confidenceLabel}>Confidence:</Text>
              <Text style={styles.confidenceValue}>{confidencePercentage}%</Text>
            </View>
          )}
          
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
  capturedImage: {
    width: width - 40,
    height: (width - 40) * 0.75, // 4:3 aspect ratio
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: width - 40,
    height: (width - 40) * 0.75,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
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