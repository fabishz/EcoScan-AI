/**
 * Error Handler Utility for EcoScan AI
 * 
 * Centralizes error handling, categorization, and user-friendly messaging
 * for various error scenarios throughout the app.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

/**
 * Error categories for consistent handling
 */
export const ERROR_CATEGORIES = {
  CAMERA: 'camera',
  PERMISSION: 'permission',
  MODEL: 'model',
  NETWORK: 'network',
  MEMORY: 'memory',
  TIMEOUT: 'timeout',
  IMAGE: 'image',
  UNKNOWN: 'unknown'
};

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',        // User can continue, minor issue
  MEDIUM: 'medium',  // Feature may not work, but app is usable
  HIGH: 'high',      // Major functionality broken
  CRITICAL: 'critical' // App may crash or be unusable
};

/**
 * Categorize error based on error message and context
 * 
 * @param {Error|string} error - The error object or message
 * @param {string} context - Context where error occurred (e.g., 'camera', 'inference')
 * @returns {Object} Error analysis with category, severity, and user message
 */
export function categorizeError(error, context = '') {
  const errorMessage = typeof error === 'string' ? error : (error?.message || error?.toString() || 'Unknown error');
  const lowerMessage = errorMessage.toLowerCase();
  const lowerContext = context.toLowerCase();
  
  // Camera-related errors
  if (lowerMessage.includes('camera') || lowerMessage.includes('permission') || lowerContext.includes('camera')) {
    if (lowerMessage.includes('denied') || lowerMessage.includes('permission')) {
      return {
        category: ERROR_CATEGORIES.PERMISSION,
        severity: ERROR_SEVERITY.HIGH,
        userMessage: 'Camera permission is required to scan waste items',
        technicalMessage: errorMessage,
        recoverable: true,
        suggestions: [
          'Grant camera permission in device settings',
          'Restart the app after granting permission',
          'Check if other apps are using the camera'
        ]
      };
    }
    
    return {
      category: ERROR_CATEGORIES.CAMERA,
      severity: ERROR_SEVERITY.MEDIUM,
      userMessage: 'Camera error occurred - please try again',
      technicalMessage: errorMessage,
      recoverable: true,
      suggestions: [
        'Close other camera apps',
        'Restart the app',
        'Check camera permissions'
      ]
    };
  }
  
  // Model/AI-related errors
  if (lowerMessage.includes('model') || lowerMessage.includes('tensor') || lowerMessage.includes('inference') || lowerContext.includes('model')) {
    const severity = lowerMessage.includes('not initialized') || lowerMessage.includes('failed to load') 
      ? ERROR_SEVERITY.CRITICAL 
      : ERROR_SEVERITY.MEDIUM;
      
    return {
      category: ERROR_CATEGORIES.MODEL,
      severity: severity,
      userMessage: 'AI model error - waste classification may not work properly',
      technicalMessage: errorMessage,
      recoverable: severity !== ERROR_SEVERITY.CRITICAL,
      suggestions: [
        'Check internet connection',
        'Restart the app',
        'Free up device storage space',
        'Close other apps to free memory'
      ]
    };
  }
  
  // Network-related errors
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('load') || lowerMessage.includes('connection')) {
    return {
      category: ERROR_CATEGORIES.NETWORK,
      severity: ERROR_SEVERITY.MEDIUM,
      userMessage: 'Network error - check your internet connection',
      technicalMessage: errorMessage,
      recoverable: true,
      suggestions: [
        'Check internet connection',
        'Try again in a few moments',
        'Switch between WiFi and mobile data'
      ]
    };
  }
  
  // Memory-related errors
  if (lowerMessage.includes('memory') || lowerMessage.includes('outofmemory') || lowerMessage.includes('allocation')) {
    return {
      category: ERROR_CATEGORIES.MEMORY,
      severity: ERROR_SEVERITY.HIGH,
      userMessage: 'Low memory error - close other apps and try again',
      technicalMessage: errorMessage,
      recoverable: true,
      suggestions: [
        'Close other apps to free memory',
        'Restart your device',
        'Clear app cache in device settings'
      ]
    };
  }
  
  // Timeout errors
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return {
      category: ERROR_CATEGORIES.TIMEOUT,
      severity: ERROR_SEVERITY.LOW,
      userMessage: 'Operation taking too long - please try again',
      technicalMessage: errorMessage,
      recoverable: true,
      suggestions: [
        'Try again with better lighting',
        'Ensure stable internet connection',
        'Close other apps to improve performance'
      ]
    };
  }
  
  // Image processing errors
  if (lowerMessage.includes('image') || lowerMessage.includes('preprocess') || lowerContext.includes('image')) {
    return {
      category: ERROR_CATEGORIES.IMAGE,
      severity: ERROR_SEVERITY.LOW,
      userMessage: 'Image processing error - try scanning again',
      technicalMessage: errorMessage,
      recoverable: true,
      suggestions: [
        'Ensure good lighting conditions',
        'Hold camera steady',
        'Clean camera lens'
      ]
    };
  }
  
  // Unknown/generic errors
  return {
    category: ERROR_CATEGORIES.UNKNOWN,
    severity: ERROR_SEVERITY.MEDIUM,
    userMessage: 'An unexpected error occurred',
    technicalMessage: errorMessage,
    recoverable: true,
    suggestions: [
      'Try the action again',
      'Restart the app if problem persists',
      'Check device storage and memory'
    ]
  };
}

/**
 * Get user-friendly error message with recovery suggestions
 * 
 * @param {Error|string} error - The error object or message
 * @param {string} context - Context where error occurred
 * @returns {Object} User-friendly error information
 */
export function getErrorInfo(error, context = '') {
  const analysis = categorizeError(error, context);
  
  return {
    title: getErrorTitle(analysis.category),
    message: analysis.userMessage,
    suggestions: analysis.suggestions,
    severity: analysis.severity,
    recoverable: analysis.recoverable,
    category: analysis.category
  };
}

/**
 * Get appropriate error title based on category
 * 
 * @param {string} category - Error category
 * @returns {string} User-friendly error title
 */
function getErrorTitle(category) {
  switch (category) {
    case ERROR_CATEGORIES.CAMERA:
      return 'Camera Error';
    case ERROR_CATEGORIES.PERMISSION:
      return 'Permission Required';
    case ERROR_CATEGORIES.MODEL:
      return 'AI Model Error';
    case ERROR_CATEGORIES.NETWORK:
      return 'Connection Error';
    case ERROR_CATEGORIES.MEMORY:
      return 'Memory Error';
    case ERROR_CATEGORIES.TIMEOUT:
      return 'Timeout Error';
    case ERROR_CATEGORIES.IMAGE:
      return 'Image Error';
    default:
      return 'Error Occurred';
  }
}

/**
 * Check if error is recoverable and app can continue
 * 
 * @param {Error|string} error - The error object or message
 * @param {string} context - Context where error occurred
 * @returns {boolean} True if error is recoverable
 */
export function isRecoverableError(error, context = '') {
  const analysis = categorizeError(error, context);
  return analysis.recoverable && analysis.severity !== ERROR_SEVERITY.CRITICAL;
}

/**
 * Log error with appropriate level based on severity
 * 
 * @param {Error|string} error - The error object or message
 * @param {string} context - Context where error occurred
 */
export function logError(error, context = '') {
  const analysis = categorizeError(error, context);
  const logMessage = `[${analysis.category.toUpperCase()}] ${context}: ${analysis.technicalMessage}`;
  
  switch (analysis.severity) {
    case ERROR_SEVERITY.CRITICAL:
      console.error('CRITICAL ERROR:', logMessage);
      break;
    case ERROR_SEVERITY.HIGH:
      console.error('HIGH SEVERITY:', logMessage);
      break;
    case ERROR_SEVERITY.MEDIUM:
      console.warn('MEDIUM SEVERITY:', logMessage);
      break;
    case ERROR_SEVERITY.LOW:
    default:
      console.log('LOW SEVERITY:', logMessage);
      break;
  }
}

/**
 * Create standardized error object for consistent handling
 * 
 * @param {string} message - Error message
 * @param {string} category - Error category
 * @param {string} context - Context where error occurred
 * @returns {Object} Standardized error object
 */
export function createError(message, category = ERROR_CATEGORIES.UNKNOWN, context = '') {
  return {
    message: message,
    category: category,
    context: context,
    timestamp: Date.now(),
    userInfo: getErrorInfo(message, context)
  };
}

export default {
  categorizeError,
  getErrorInfo,
  isRecoverableError,
  logError,
  createError,
  ERROR_CATEGORIES,
  ERROR_SEVERITY
};