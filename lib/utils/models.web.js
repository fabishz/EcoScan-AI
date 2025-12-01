/**
 * ML Model Utilities for EcoScan AI - Web Version
 * 
 * This is a web-compatible version that provides mock functionality
 * for testing the app interface on web browsers. The actual ML
 * functionality is only available on mobile devices.
 */

// Mock model status
let mockModelLoaded = true;

// Waste classification categories
const WASTE_CATEGORIES = {
  0: 'Recyclable',
  1: 'Compostable', 
  2: 'Trash',
  3: 'Unknown'
};

// Confidence threshold for classification
const CONFIDENCE_THRESHOLD = 0.5;

// Model input dimensions (MobileNet standard)
const MODEL_INPUT_SIZE = 224;

/**
 * Mock model initialization for web testing
 * 
 * @returns {Promise<boolean>} Always returns true for web testing
 */
export async function initializeModel() {
  console.log('Web version: Mock model initialization');
  mockModelLoaded = true;
  return true;
}

/**
 * Mock image preprocessing for web testing
 * 
 * @param {string} imageUri - URI of the image to preprocess
 * @returns {Promise<Object>} Mock tensor object
 */
export async function preprocessImage(imageUri) {
  console.log('Web version: Mock image preprocessing for', imageUri);
  return { mockTensor: true, imageUri };
}

/**
 * Mock inference for web testing
 * 
 * @param {Object} preprocessedImage - Mock preprocessed image
 * @returns {Promise<Object>} Mock predictions
 */
export async function runInference(preprocessedImage) {
  console.log('Web version: Mock inference running...');
  
  // Simulate inference delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { mockPredictions: [0.7, 0.2, 0.05, 0.05] };
}

/**
 * Mock postprocessing for web testing
 * 
 * @param {Object} predictions - Mock predictions
 * @returns {Promise<Object>} Mock classification result
 */
export async function postprocessResults(predictions) {
  console.log('Web version: Mock postprocessing');
  
  // Generate random but realistic results for testing
  const categories = Object.values(WASTE_CATEGORIES);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomConfidence = 0.3 + Math.random() * 0.6; // 30-90% confidence
  
  return {
    category: randomCategory,
    confidence: randomConfidence,
    timestamp: Date.now(),
    mockResult: true
  };
}

/**
 * Mock complete inference pipeline for web testing
 * 
 * @param {string} imageUri - URI of the image to classify
 * @returns {Promise<Object>} Mock classification result
 */
export async function classifyImage(imageUri) {
  console.log('Web version: Mock classification for', imageUri);
  
  try {
    // Simulate the full pipeline with realistic timing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock results that vary based on timestamp for testing
    const now = Date.now();
    const categories = Object.values(WASTE_CATEGORIES);
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
    
    const result = {
      category: category,
      confidence: Math.min(confidence, 1.0),
      timestamp: now,
      processingTime: 800,
      modelStatus: 'success',
      webMockResult: true
    };
    
    console.log('Web version: Mock classification result:', result);
    return result;
    
  } catch (error) {
    console.error('Web version: Mock error in classification:', error);
    
    return {
      category: 'Unknown',
      confidence: 0.0,
      timestamp: Date.now(),
      error: 'Web version mock error',
      errorCategory: 'mock',
      userMessage: 'Web testing mode - mock error',
      modelStatus: 'error',
      webMockResult: true
    };
  }
}

/**
 * Mock model status for web testing
 * 
 * @returns {Object} Mock model status information
 */
export function getModelInfo() {
  return {
    isLoaded: mockModelLoaded,
    inputSize: MODEL_INPUT_SIZE,
    categories: Object.values(WASTE_CATEGORIES),
    confidenceThreshold: CONFIDENCE_THRESHOLD,
    webMockVersion: true
  };
}

/**
 * Mock image quality analysis for web testing
 * 
 * @param {string} imageUri - URI of the image to analyze
 * @returns {Promise<Object>} Mock image quality analysis
 */
export async function analyzeImageQuality(imageUri) {
  console.log('Web version: Mock image quality analysis for', imageUri);
  
  // Generate random but realistic quality metrics
  const brightness = 0.3 + Math.random() * 0.4; // 30-70%
  const contrast = 0.2 + Math.random() * 0.6; // 20-80%
  
  return {
    brightness: brightness,
    contrast: contrast,
    isLowLight: brightness < 0.4,
    isOverexposed: brightness > 0.8,
    isLowContrast: contrast < 0.3,
    isBlurry: contrast < 0.25,
    quality: brightness > 0.4 && contrast > 0.3 ? 'good' : 'fair',
    webMockResult: true
  };
}

/**
 * Mock model disposal for web testing
 */
export function disposeModel() {
  console.log('Web version: Mock model disposal');
  mockModelLoaded = false;
}