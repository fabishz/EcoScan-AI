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
 * Enhanced AI classification logic that simulates intelligent object recognition
 * 
 * @param {string} imageUri - URI of the image to analyze
 * @param {number} timestamp - Current timestamp for variation
 * @returns {Object} Classification result with reasoning
 */
function analyzeImageForClassification(imageUri, timestamp) {
  // Simulate different object types based on various factors
  const factors = {
    timeOfDay: new Date(timestamp).getHours(),
    dayOfWeek: new Date(timestamp).getDay(),
    imageId: imageUri.split('-').pop() || '0',
    randomSeed: timestamp % 1000
  };
  
  // Enhanced classification logic based on realistic scenarios
  let category, confidence, reasoning;
  
  // Time-based object likelihood (people throw different things at different times)
  if (factors.timeOfDay >= 6 && factors.timeOfDay <= 10) {
    // Morning: Coffee cups, breakfast items
    if (factors.randomSeed % 3 === 0) {
      category = 'Compostable';
      confidence = 0.82 + Math.random() * 0.15;
      reasoning = 'Morning organic waste detected (coffee grounds, fruit peels)';
    } else {
      category = 'Recyclable';
      confidence = 0.78 + Math.random() * 0.18;
      reasoning = 'Morning recyclables detected (coffee cups, cereal boxes)';
    }
  } else if (factors.timeOfDay >= 11 && factors.timeOfDay <= 14) {
    // Lunch: Food containers, bottles
    if (factors.randomSeed % 4 === 0) {
      category = 'Compostable';
      confidence = 0.85 + Math.random() * 0.12;
      reasoning = 'Lunch food waste detected (organic leftovers)';
    } else if (factors.randomSeed % 4 === 1) {
      category = 'Recyclable';
      confidence = 0.88 + Math.random() * 0.10;
      reasoning = 'Lunch packaging detected (plastic containers, bottles)';
    } else {
      category = 'Trash';
      confidence = 0.72 + Math.random() * 0.20;
      reasoning = 'Mixed lunch waste detected (napkins, wrappers)';
    }
  } else if (factors.timeOfDay >= 17 && factors.timeOfDay <= 21) {
    // Evening: Dinner waste, packaging
    if (factors.randomSeed % 3 === 0) {
      category = 'Compostable';
      confidence = 0.89 + Math.random() * 0.08;
      reasoning = 'Dinner organic waste detected (vegetable scraps, food remains)';
    } else {
      category = 'Recyclable';
      confidence = 0.84 + Math.random() * 0.14;
      reasoning = 'Dinner packaging detected (cans, bottles, cardboard)';
    }
  } else {
    // Other times: More varied waste
    const categoryIndex = factors.randomSeed % WASTE_CATEGORIES.length;
    category = WASTE_CATEGORIES[categoryIndex];
    
    switch (category) {
      case 'Recyclable':
        confidence = 0.76 + Math.random() * 0.20;
        reasoning = 'General recyclable material detected (plastic, metal, paper)';
        break;
      case 'Compostable':
        confidence = 0.71 + Math.random() * 0.25;
        reasoning = 'Organic material detected (food scraps, biodegradable items)';
        break;
      case 'Trash':
        confidence = 0.68 + Math.random() * 0.25;
        reasoning = 'Non-recyclable waste detected (mixed materials, contaminated items)';
        break;
      case 'Unknown':
        confidence = 0.15 + Math.random() * 0.35;
        reasoning = 'Unclear object - needs better lighting or different angle';
        break;
    }
  }
  
  // Weekend adjustment (people clean more, different waste patterns)
  if (factors.dayOfWeek === 0 || factors.dayOfWeek === 6) {
    if (category === 'Recyclable') {
      confidence += 0.05; // More recyclables during weekend cleaning
      reasoning += ' (weekend cleaning pattern)';
    }
  }
  
  // Image quality simulation based on URI
  const imageQuality = (parseInt(factors.imageId) % 100) / 100;
  if (imageQuality < 0.3) {
    confidence *= 0.7; // Lower confidence for "poor quality" images
    reasoning += ' - image quality affects confidence';
  } else if (imageQuality > 0.8) {
    confidence = Math.min(confidence * 1.1, 0.98); // Higher confidence for "good quality"
    reasoning += ' - clear image enhances detection';
  }
  
  // Ensure confidence stays within realistic bounds
  confidence = Math.max(0.05, Math.min(confidence, 0.98));
  
  return { category, confidence, reasoning };
}

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
    
    // Enhanced AI logic based on image URI patterns and timing
    const now = Date.now();
    
    // Analyze mock image URI for intelligent classification
    const { category, confidence, reasoning } = analyzeImageForClassification(imageUri, now);
    
    console.log(`🧠 AI Analysis: ${category} (${Math.round(confidence * 100)}%) - ${reasoning}`);
    
    const result = {
      category: category,
      confidence: Math.min(confidence, 1.0),
      timestamp: now,
      processingTime: 500 + Math.random() * 500,
      modelStatus: 'success',
      reasoning: reasoning,
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