# Implementation Plan: EcoScan AI

## Overview

This implementation plan breaks down the EcoScan AI MVP into discrete, manageable coding tasks. Each task builds incrementally on previous tasks, starting with project setup, then ML infrastructure, followed by UI screens, and finally integration and testing. All tasks focus on code implementation that can be executed within the development environment.

---

## Tasks

- [x] 1. Set up Expo project structure and install dependencies
  - Initialize new Expo project with `npx create-expo-app EcoScanAI`
  - Install required dependencies: `expo-camera`, `@tensorflow/tfjs`, `@tensorflow/tfjs-react-native`, `@react-navigation/native`, `@react-navigation/stack`, `react-native-screens`, `react-native-safe-area-context`
  - Create directory structure: `src/screens/`, `src/utils/`, `src/components/`
  - Create `app.json` with appropriate permissions for camera access
  - _Requirements: 2.1, 6.1_

- [x] 2. Implement ML model utilities and inference pipeline
  - Create `src/utils/models.js` with functions to initialize TensorFlow Lite model
  - Implement `initializeModel()` function to load a quantized MobileNet model from a URL (use a sample model URL or placeholder)
  - Implement `preprocessImage()` function to resize and normalize image data for model input (224x224, normalize to [-1, 1])
  - Implement `runInference()` function to execute model inference on preprocessed image data
  - Implement `postprocessResults()` function to map model output to waste categories (Recyclable, Compostable, Trash, Unknown) with confidence thresholds
  - Add comments explaining Arm optimization (quantization, inference throttling)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.1, 6.2_

- [x] 3. Implement eco-tip generation utility
  - Create `src/utils/tipGenerator.js` with category-specific tip templates
  - Implement `generateTip(category)` function that returns a randomized tip based on waste category
  - Add tip templates for: Recyclable (5+ tips), Compostable (5+ tips), Trash (5+ tips), Unknown (3+ generic tips)
  - Ensure tips are actionable and personalized (e.g., "Recycle this plastic bottle to save energy—repurpose it as a vase!")
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 4. Create Home Screen component
  - Create `src/screens/HomeScreen.js` as a functional React component
  - Display app title "EcoScan AI" and brief description
  - Implement "Scan Waste" button that navigates to CameraScreen
  - Style with basic React Native components (View, Text, Button, StyleSheet)
  - Add app logo or icon placeholder
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 5. Create Camera Screen component with real-time inference
  - Create `src/screens/CameraScreen.js` as a functional React component with hooks
  - Implement camera permission request using `expo-camera` and`expo-permissions`
  - Display live camera feed using `Camera` component from `expo-camera`
  - Implement inference scheduling: run inference every 1-2 seconds (not every frame) using `setInterval` or `useEffect` with throttling
  - Display current detection result (category and confidence) as overlay on camera feed
  - Implement "Capture" button to freeze frame and navigate to ResultsScreen with captured image and classification
  - Handle edge cases: no permission, low confidence, no detection (display appropriate messages)
  - Add comments explaining Arm optimization (inference throttling, quantized model)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4_

- [ ] 6. Create Results Screen component
  - Create `src/screens/ResultsScreen.js` as a functional React component
  - Display captured image preview
  - Display classification category with visual badge (color-coded: green for Recyclable, brown for Compostable, gray for Trash, yellow for Unknown)
  - Display confidence score as percentage
  - Call `generateTip()` from tipGenerator.js and display personalized eco-tip
  - Implement "Scan Again" button to navigate back to CameraScreen
  - Implement "Home" button to navigate back to HomeScreen
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7. Set up React Navigation and integrate all screens
  - Create `src/navigation/RootNavigator.js` with stack navigation
  - Configure navigation stack: HomeScreen → CameraScreen → ResultsScreen
  - Pass navigation props to all screens
  - Implement navigation parameters to pass captured image and classification results from CameraScreen to ResultsScreen
  - Test navigation flow: Home → Camera → Results → Home
  - _Requirements: 1.2, 2.5, 4.3, 4.4_

- [ ] 8. Create App.js entry point with model initialization
  - Create `App.js` as root component
  - Initialize TensorFlow Lite model on app startup using `useEffect`
  - Wrap app with NavigationContainer from React Navigation
  - Handle model loading errors with user-friendly error message
  - Display loading spinner while model is being loaded
  - _Requirements: 3.1, 3.4, 6.1_

- [ ] 9. Implement error handling and edge case management
  - Add error boundary component to catch and display runtime errors
  - Implement fallback UI for: camera permission denied, model loading failure, inference timeout, no detection
  - Add user-friendly error messages and recovery options (retry, go to settings, etc.)
  - Test edge cases: low-light conditions, no object in frame, very low confidence scores
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]* 10. Write unit tests for ML utilities
  - Create `src/utils/__tests__/models.test.js` to test model preprocessing and postprocessing
  - Write tests for `preprocessImage()`: verify image resizing and normalization
  - Write tests for `postprocessResults()`: verify category mapping and confidence thresholds
  - _Requirements: 3.1, 3.2, 3.3_

- [ ]* 11. Write unit tests for tip generation
  - Create `src/utils/__tests__/tipGenerator.test.js` to test tip generation logic
  - Write tests for `generateTip()`: verify tips are generated for each category
  - Verify tips are randomized and not always the same
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 12. Build and test on device
  - Run `expo start` to start development server
  - Test on physical Arm-based Android device using Expo Go app or built APK
  - Verify camera feed displays correctly and inference runs smoothly
  - Test all navigation flows: Home → Camera → Results → Home
  - Verify eco-tips are generated and displayed correctly
  - Test edge cases: permission denial, low light, no detection
  - Verify app performance on Arm device (no lag, responsive UI)
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 7.1, 7.2, 7.3, 7.4_

- [ ] 13. Create README.md with project documentation
  - Write project description and feature overview
  - Document how the app uses on-device ML and Arm optimization
  - Include installation instructions: `npx create-expo-app`, dependency installation, model setup
  - Include build instructions: `expo build:android` for APK
  - Add demo instructions: how to use the app, expected behavior
  - Include notes on model quantization and inference throttling for Arm efficiency
  - Add troubleshooting section for common issues
  - _Requirements: All_

---

## Notes

- **Model Source**: For MVP, use a placeholder or sample quantized MobileNet model. A real waste classification model can be sourced from TensorFlow Hub or fine-tuned on a custom waste dataset.
- **Inference Throttling**: Implemented via `setInterval` or `useEffect` with timestamp tracking to ensure inference runs every 1-2 seconds, not every frame.
- **Arm Optimization**: Model quantization (int8) and inference throttling are the primary optimizations for Arm architecture. These are documented in code comments.
- **Testing**: Unit tests (tasks 10-11) are marked as optional to focus on core MVP functionality. Integration testing (task 12) is required to verify the app works end-to-end.
- **Build Time**: Expected total development time: 4-6 hours for experienced React Native developer, 6-8 hours for intermediate developer.
