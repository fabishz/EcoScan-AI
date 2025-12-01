/**
 * ErrorBoundary.js - React Error Boundary Component
 * 
 * Catches and handles runtime errors throughout the app with user-friendly
 * error messages and recovery options. Prevents app crashes and provides
 * graceful error handling.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  /**
   * Catch errors during rendering and update state
   */
  static getDerivedStateFromError(error) {
    // Update state to show error UI
    return {
      hasError: true,
      errorId: Date.now().toString()
    };
  }

  /**
   * Log error details and update state with error information
   */
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // In production, you might want to log this to a crash reporting service
    // Example: Crashlytics.recordError(error);
  }

  /**
   * Reset error state and retry rendering
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  /**
   * Navigate to home screen and reset error state
   */
  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
    
    // If navigation prop is available, navigate to home
    if (this.props.navigation) {
      this.props.navigation.navigate('Home');
    }
  };

  /**
   * Get user-friendly error message based on error type
   */
  getUserFriendlyMessage(error) {
    if (!error) {
      return 'An unexpected error occurred. Please try again.';
    }

    const errorMessage = error.message || error.toString();
    
    // Camera-related errors
    if (errorMessage.includes('camera') || errorMessage.includes('Camera')) {
      return 'Camera error occurred. Please check camera permissions and try again.';
    }
    
    // Model/ML-related errors
    if (errorMessage.includes('model') || errorMessage.includes('tensor') || errorMessage.includes('inference')) {
      return 'AI model error occurred. The app may still work, but waste classification might not be available.';
    }
    
    // Network-related errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('load')) {
      return 'Network error occurred. Please check your internet connection and try again.';
    }
    
    // Permission-related errors
    if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
      return 'Permission error occurred. Please check app permissions in your device settings.';
    }
    
    // Memory-related errors
    if (errorMessage.includes('memory') || errorMessage.includes('OutOfMemory')) {
      return 'Memory error occurred. Please close other apps and try again.';
    }
    
    // Generic fallback
    return 'An unexpected error occurred. Please try restarting the app.';
  }

  /**
   * Get recovery suggestions based on error type
   */
  getRecoverySuggestions(error) {
    if (!error) {
      return ['Try again', 'Restart the app'];
    }

    const errorMessage = error.message || error.toString();
    
    if (errorMessage.includes('camera') || errorMessage.includes('Camera')) {
      return [
        'Check camera permissions in Settings',
        'Close other camera apps',
        'Restart the app'
      ];
    }
    
    if (errorMessage.includes('model') || errorMessage.includes('tensor')) {
      return [
        'Check internet connection',
        'Free up device storage',
        'Restart the app'
      ];
    }
    
    if (errorMessage.includes('permission')) {
      return [
        'Go to Settings > Apps > EcoScan AI > Permissions',
        'Enable required permissions',
        'Restart the app'
      ];
    }
    
    return [
      'Close other apps to free memory',
      'Check internet connection',
      'Restart the app'
    ];
  }

  render() {
    if (this.state.hasError) {
      const userMessage = this.getUserFriendlyMessage(this.state.error);
      const suggestions = this.getRecoverySuggestions(this.state.error);
      
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Error Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
            </View>
            
            {/* Error Title */}
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            
            {/* User-friendly error message */}
            <Text style={styles.errorMessage}>{userMessage}</Text>
            
            {/* Recovery suggestions */}
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Try these steps:</Text>
              {suggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <Text style={styles.suggestionBullet}>•</Text>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
            
            {/* Action buttons */}
            <View style={styles.buttonContainer}>
              
              {/* Retry button */}
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={this.handleRetry}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
              
              {/* Go Home button */}
              <TouchableOpacity
                style={[styles.button, styles.homeButton]}
                onPress={this.handleGoHome}
              >
                <Text style={styles.homeButtonText}>Go to Home</Text>
              </TouchableOpacity>
              
            </View>
            
            {/* Technical details (collapsible in production) */}
            {__DEV__ && this.state.error && (
              <View style={styles.technicalContainer}>
                <Text style={styles.technicalTitle}>Technical Details (Dev Mode)</Text>
                <Text style={styles.technicalText}>
                  Error: {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.technicalText}>
                    Stack: {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
            
          </ScrollView>
        </SafeAreaView>
      );
    }

    // Render children normally when no error
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: '100%'
  },
  
  iconContainer: {
    marginBottom: 20
  },
  
  errorIcon: {
    fontSize: 64,
    textAlign: 'center'
  },
  
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 16
  },
  
  errorMessage: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20
  },
  
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12
  },
  
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  
  suggestionBullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 8,
    marginTop: 2
  },
  
  suggestionText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    lineHeight: 20
  },
  
  buttonContainer: {
    width: '100%',
    gap: 12
  },
  
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  
  retryButton: {
    backgroundColor: '#4CAF50'
  },
  
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  
  homeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4CAF50'
  },
  
  homeButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold'
  },
  
  technicalContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336'
  },
  
  technicalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 8
  },
  
  technicalText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
    marginBottom: 4
  }
});

export default ErrorBoundary;