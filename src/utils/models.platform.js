/**
 * Platform-aware ML Model Utilities
 * 
 * This module conditionally imports the appropriate ML utilities
 * based on the platform (web vs mobile) to ensure compatibility.
 */

import { Platform } from 'react-native';

// Dynamic import functions to avoid bundling issues
export const initializeModel = async () => {
  if (Platform.OS === 'web') {
    const webModels = await import('./models.web.js');
    return webModels.initializeModel();
  } else {
    const mobileModels = await import('./models.js');
    return mobileModels.initializeModel();
  }
};

export const preprocessImage = async (imageUri) => {
  if (Platform.OS === 'web') {
    const webModels = await import('./models.web.js');
    return webModels.preprocessImage(imageUri);
  } else {
    const mobileModels = await import('./models.js');
    return mobileModels.preprocessImage(imageUri);
  }
};

export const runInference = async (preprocessedImage) => {
  if (Platform.OS === 'web') {
    const webModels = await import('./models.web.js');
    return webModels.runInference(preprocessedImage);
  } else {
    const mobileModels = await import('./models.js');
    return mobileModels.runInference(preprocessedImage);
  }
};

export const postprocessResults = async (predictions) => {
  if (Platform.OS === 'web') {
    const webModels = await import('./models.web.js');
    return webModels.postprocessResults(predictions);
  } else {
    const mobileModels = await import('./models.js');
    return mobileModels.postprocessResults(predictions);
  }
};

export const classifyImage = async (imageUri) => {
  if (Platform.OS === 'web') {
    const webModels = await import('./models.web.js');
    return webModels.classifyImage(imageUri);
  } else {
    const mobileModels = await import('./models.js');
    return mobileModels.classifyImage(imageUri);
  }
};

export const getModelInfo = () => {
  if (Platform.OS === 'web') {
    // For web, return synchronous mock info
    return {
      isLoaded: true,
      inputSize: 224,
      categories: ['Recyclable', 'Compostable', 'Trash', 'Unknown'],
      confidenceThreshold: 0.5,
      webMockVersion: true
    };
  } else {
    // For mobile, this will be handled by the actual models.js
    // We'll need to make this async in the camera component
    return {
      isLoaded: false,
      inputSize: 224,
      categories: ['Recyclable', 'Compostable', 'Trash', 'Unknown'],
      confidenceThreshold: 0.5,
      mobileVersion: true
    };
  }
};

export const analyzeImageQuality = async (imageUri) => {
  if (Platform.OS === 'web') {
    const webModels = await import('./models.web.js');
    return webModels.analyzeImageQuality(imageUri);
  } else {
    const mobileModels = await import('./models.js');
    return mobileModels.analyzeImageQuality(imageUri);
  }
};

export const disposeModel = () => {
  if (Platform.OS === 'web') {
    console.log('Web version: Mock model disposal');
  } else {
    // For mobile, this will need to be handled differently
    console.log('Mobile version: Model disposal requested');
  }
};