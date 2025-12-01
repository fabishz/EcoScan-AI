/**
 * ML Model Utilities for EcoScan AI - Mobile Mock Implementation
 * 
 * This is a simplified mock implementation for mobile testing that doesn't
 * require TensorFlow.js dependencies. It provides realistic classification
 * results for testing the app functionality.
 */

// Waste classification categories
const WASTE_CATEGORIES = ['Recyclable', 'Compostable', 'Trash', 'Unknown'];

// Mock model state
let mockModelLoaded = false;

/**
 * Mock model initialization
 * 
 * @returns {Promise<boolean>} True if model loaded successfully
 */
export async function initializeModel() {
  console.log('🤖 Initializing mock ML model...');
  
  // Simulate model loading time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  mockModelLoaded = true;
  console.log('✅ Mock model initialized successfully');
  return true;
}

/**
 * Mock image classification with realistic results
 * 
 * @param {string} imageUri - URI of the image to classify
 * @returns {Promise<Object>} Classification result with category and confidence
 */
export async function classifyImage(imageUri) {
  try {
    // Validate input
    if (!imageUri) {
      return {
        category: 'Unknown',
        confidence: 0.0,
        timestamp: Date.now(),
        error: 'No image provided',
        errorCategory: 'input',
        userMessage: '📷 Please capture an image first',
        modelStatus: 'error'
      };
    }
    
    // Handle mock URIs from camera simulation
    if (imageUri.startsWith('mock://')) {
      console.log('🎭 Processing mock camera image:', imageUri);
    }
    
    // Check if model is loaded
    if (!mockModelLoaded) {
      console.log('🤖 Model not loaded, initializing...');
      const initSuccess = await initializeModel();
      
      if (!initSuccess) {
        return {
          category: 'Unknown',
          confidence: 0.0,
          timestamp: Date.now(),
          error: 'Model initialization failed',
          errorCategory: 'model',
          userMessage: '🤖 AI model loading failed - please try again',
          modelStatus: 'failed',
          recoveryAction: 'retry'
        };
      }
    }
    
    // Simulate inference time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Generate realistic mock results based on timestamp for variety
    const now = Date.now();
    const categoryIndex = now % WASTE_CATEGORIES.length;
    const category = WASTE_CATEGORIES[categoryIndex];
    
    // Generate confidence based on category for realistic testing
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
    
    const result = {
      category: category,
      confidence: Math.min(confidence, 1.0),
      timestamp: now,
      processingTime: 500 + Math.random() * 500,
      modelStatus: 'success',
      mockResult: true
    };
    
    console.log('🎯 Mock classification result:', result);
    return result;
    
  } catch (error) {
    console.error('Error in mock classification:', error);
    
    return {
      category: 'Unknown',
      confidence: 0.0,
      timestamp: Date.now(),
      error: error.message,
      errorCategory: 'unknown',
      userMessage: 'Classification failed - please try again',
      modelStatus: 'error'
    };
  }
}

/**
 * Get mock model status and information
 * 
 * @returns {Object} Model status information
 */
export function getModelInfo() {
  return {
    isLoaded: mockModelLoaded,
    inputSize: 224,
    categories: WASTE_CATEGORIES,
    confidenceThreshold: 0.5,
    mockVersion: true
  };
}

/**
 * Mock image preprocessing (no-op for mock)
 * 
 * @param {string} imageUri - URI of the image to preprocess
 * @returns {Promise<Object>} Mock preprocessed data
 */
export async function preprocessImage(imageUri) {
  console.log('Mock preprocessing for:', imageUri);
  return { mockPreprocessed: true, imageUri };
}

/**
 * Mock inference (no-op for mock)
 * 
 * @param {Object} preprocessedImage - Mock preprocessed data
 * @returns {Promise<Object>} Mock predictions
 */
export async function runInference(preprocessedImage) {
  console.log('Mock inference running...');
  await new Promise(resolve => setTimeout(resolve, 200));
  return { mockPredictions: [0.7, 0.2, 0.05, 0.05] };
}

/**
 * Mock postprocessing (no-op for mock)
 * 
 * @param {Object} predictions - Mock predictions
 * @returns {Promise<Object>} Mock result
 */
export async function postprocessResults(predictions) {
  console.log('Mock postprocessing...');
  return {
    category: 'Recyclable',
    confidence: 0.85,
    timestamp: Date.now()
  };
}

/**
 * Mock image quality analysis
 * 
 * @param {string} imageUri - URI of the image to analyze
 * @returns {Promise<Object>} Mock quality analysis
 */
export async function analyzeImageQuality(imageUri) {
  console.log('Mock image quality analysis for:', imageUri);
  
  return {
    brightness: 0.6,
    contrast: 0.7,
    isLowLight: false,
    isOverexposed: false,
    isLowContrast: false,
    isBlurry: false,
    quality: 'good',
    mockResult: true
  };
}

/**
 * Mock model disposal
 */
export function disposeModel() {
  console.log('Mock model disposal');
  mockModelLoaded = false;
}