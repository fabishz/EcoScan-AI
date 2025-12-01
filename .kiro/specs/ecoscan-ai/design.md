# Design Document: EcoScan AI

## Overview

EcoScan AI is a React Native application built with Expo that provides real-time waste classification using on-device machine learning. The architecture prioritizes performance on Arm-based mobile devices by using quantized TensorFlow Lite models and efficient inference scheduling. The app follows a three-screen navigation pattern: Home → Camera → Results, with all ML operations executed locally for privacy and low latency.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Native App                      │
│                   (Expo Framework)                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Home Screen │  │ Camera Screen│  │Results Screen│  │
│  │  Navigation  │  │ Real-time ML │  │  Display &   │  │
│  │              │  │  Inference   │  │  Eco-Tips    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                   ML Inference Layer                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │  TensorFlow Lite (via @tensorflow/tfjs-react-native)│ │
│  │  - MobileNet Model (Quantized for Arm)             │ │
│  │  - Inference Scheduler (1-2 sec intervals)         │ │
│  │  - Image Preprocessing & Normalization             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                  Eco-Tip Generation Layer                │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Rule-Based Tip Generator                          │ │
│  │  - Category-specific tip templates                 │ │
│  │  - Randomized selection for variety                │ │
│  │  - Fallback tips for Unknown classifications       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                   Device APIs Layer                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │  expo-camera: Real-time camera feed                │ │
│  │  expo-permissions: Camera permission handling      │ │
│  │  React Native Image: Image capture & display       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **On-Device ML Only**: All inference runs locally using TensorFlow Lite to ensure privacy, low latency, and offline functionality. No cloud APIs are used.

2. **Quantized MobileNet Model**: Uses a pre-trained, quantized MobileNet model optimized for Arm architecture. Quantization reduces model size and inference latency while maintaining acceptable accuracy for waste classification.

3. **Inference Scheduling**: Inference runs every 1-2 seconds (not on every frame) to balance responsiveness with battery efficiency and Arm CPU load.

4. **Rule-Based Tip Generation**: For MVP speed, eco-tips are generated using a rule-based system with randomized templates rather than a full generative LLM. This avoids the overhead of running a language model on-device.

5. **Expo Framework**: Chosen for rapid development and cross-platform support (iOS/Android) with minimal native code.

6. **Navigation Pattern**: Simple stack-based navigation (Home → Camera → Results) for clarity and ease of implementation.

## Components and Interfaces

### 1. App.js (Entry Point)

**Responsibility**: Root component managing navigation and app initialization.

**Interface**:
- Initializes TensorFlow Lite model on app startup
- Sets up React Navigation stack
- Manages global state for captured image and classification results

**Key Functions**:
- `initializeModel()`: Loads the quantized MobileNet model from a URL or local asset
- `NavigationContainer`: Wraps the app with navigation context

---

### 2. HomeScreen.js

**Responsibility**: Displays the home screen with app title and "Scan Waste" button.

**Interface**:
- Props: `navigation` (React Navigation prop)
- State: None (stateless component)

**Key Functions**:
- `handleScanPress()`: Navigates to CameraScreen

**UI Elements**:
- Title: "EcoScan AI"
- Description: Brief explanation of app functionality
- Button: "Scan Waste" (navigates to camera)

---

### 3. CameraScreen.js

**Responsibility**: Manages real-time camera feed and inference scheduling.

**Interface**:
- Props: `navigation` (React Navigation prop)
- State:
  - `hasPermission`: Boolean indicating camera permission status
  - `cameraRef`: Reference to camera component
  - `isInferencing`: Boolean to prevent concurrent inference calls
  - `lastInferenceTime`: Timestamp of last inference (for 1-2 sec throttling)
  - `detectionResult`: Current classification result

**Key Functions**:
- `requestCameraPermission()`: Requests camera access from user
- `handleCameraFrame()`: Called on camera frame update; throttles inference to 1-2 sec intervals
- `runInference(frameData)`: Executes TensorFlow Lite model on frame data
- `handleCapture()`: Freezes current frame and navigates to ResultsScreen

**Arm Optimization Notes**:
- Inference throttling (1-2 sec) reduces CPU load on Arm processors
- Frame preprocessing (resizing, normalization) is optimized for mobile
- Model is quantized (int8) to reduce memory footprint

---

### 4. ResultsScreen.js

**Responsibility**: Displays classification results and generated eco-tip.

**Interface**:
- Props: `navigation` (React Navigation prop), `route` (contains captured image and classification)
- State: None (receives data via route params)

**Key Functions**:
- `generateEcoTip(category)`: Generates a personalized tip based on classification category
- `handleScanAgain()`: Navigates back to CameraScreen
- `handleHome()`: Navigates back to HomeScreen

**UI Elements**:
- Captured image preview
- Classification category badge
- Confidence score display
- Eco-tip text box
- "Scan Again" and "Home" buttons

---

### 5. models.js (ML Utilities)

**Responsibility**: Encapsulates TensorFlow Lite model loading, inference, and preprocessing.

**Interface**:
- Exports:
  - `initializeModel()`: Async function to load the quantized MobileNet model
  - `runInference(frameData)`: Async function to execute inference on image data
  - `preprocessImage(frameData)`: Normalizes and resizes image for model input
  - `postprocessResults(predictions)`: Converts model output to classification category

**Key Functions**:
- `initializeModel()`: 
  - Loads model from URL (e.g., a hosted TFLite model or a sample model)
  - Returns a promise resolving to the loaded model
  
- `runInference(frameData)`:
  - Preprocesses frame data
  - Runs model inference
  - Returns classification category and confidence score
  
- `preprocessImage(frameData)`:
  - Resizes image to model input size (e.g., 224x224 for MobileNet)
  - Normalizes pixel values to [0, 1] or [-1, 1] range
  - Returns tensor ready for inference
  
- `postprocessResults(predictions)`:
  - Maps model output logits to waste categories
  - Applies confidence threshold (e.g., 0.5)
  - Returns category and confidence score

**Arm Optimization Notes**:
- Model is quantized (int8) to reduce inference latency on Arm CPUs
- Preprocessing is optimized to minimize tensor operations
- Model is cached in memory after first load

---

### 6. tipGenerator.js (Eco-Tip Generation)

**Responsibility**: Generates personalized eco-tips based on waste classification.

**Interface**:
- Exports:
  - `generateTip(category)`: Returns a personalized eco-tip string

**Key Functions**:
- `generateTip(category)`:
  - Takes classification category as input
  - Selects a random tip template from category-specific pool
  - Returns formatted tip string

**Tip Templates by Category**:
- **Recyclable**: Tips about recycling benefits, reuse ideas, energy savings
- **Compostable**: Tips about composting, organic waste handling, soil enrichment
- **Trash**: Tips about waste minimization, proper disposal, landfill impact
- **Unknown**: Generic tips suggesting manual inspection or research

---

## Data Models

### Classification Result

```javascript
{
  category: "Recyclable" | "Compostable" | "Trash" | "Unknown",
  confidence: number (0-1),
  timestamp: number (milliseconds),
  imageUri: string (local file path or base64)
}
```

### Eco-Tip

```javascript
{
  category: string,
  tip: string,
  actionItems: string[] (optional, for future enhancement)
}
```

### Camera Frame Data

```javascript
{
  uri: string,
  width: number,
  height: number,
  base64: string (optional, for inference)
}
```

---

## Error Handling

### Camera Permission Denied
- **Scenario**: User denies camera permission
- **Handling**: Display error message with option to retry or navigate to settings
- **UI**: Modal or alert with "Retry" and "Go to Settings" buttons

### No Object Detected
- **Scenario**: Inference returns low confidence for all categories
- **Handling**: Display "No clear object detected" message and prompt user to adjust camera
- **UI**: Toast notification or overlay message on camera screen

### Low-Light Conditions
- **Scenario**: Camera frame is too dark for reliable inference
- **Handling**: Display warning and provide generic eco-tip
- **UI**: Overlay warning on camera screen

### Model Loading Failure
- **Scenario**: TensorFlow Lite model fails to load
- **Handling**: Display error message and prevent app from proceeding
- **UI**: Splash screen with error message and retry button

### Inference Timeout
- **Scenario**: Inference takes longer than expected (e.g., >2 seconds)
- **Handling**: Skip inference cycle and retry on next scheduled interval
- **UI**: No visible change; handled silently in background

---

## Testing Strategy

### Unit Tests
- **Model Preprocessing**: Verify image normalization and resizing
- **Tip Generation**: Verify tips are generated correctly for each category
- **Postprocessing**: Verify classification results are correctly mapped from model output

### Integration Tests
- **Camera Permission Flow**: Verify permission request and handling
- **Inference Pipeline**: Verify end-to-end inference from frame capture to classification
- **Navigation**: Verify screen transitions and data passing between screens

### Manual Testing
- **Real Device Testing**: Test on actual Arm-based Android device for performance
- **Low-Light Scenarios**: Test app behavior in poor lighting conditions
- **No Detection Scenarios**: Test app behavior when no object is in frame
- **Permission Denial**: Test app behavior when camera permission is denied

---

## Performance Considerations

### Arm Architecture Optimization
1. **Model Quantization**: MobileNet is quantized to int8, reducing model size from ~100MB to ~25MB and inference latency by 3-4x
2. **Inference Throttling**: Running inference every 1-2 seconds instead of every frame reduces CPU load by ~80%
3. **Memory Management**: Frame data is processed and discarded immediately after inference to minimize memory footprint
4. **Async Operations**: All ML operations are async to prevent blocking the UI thread

### Expected Performance Metrics
- **Model Load Time**: ~1-2 seconds on first app launch
- **Inference Latency**: ~200-500ms per frame on Arm CPU (quantized MobileNet)
- **Memory Usage**: ~50-100MB total app memory
- **Battery Impact**: Minimal due to inference throttling and quantization

---

## Deployment and Build

### Expo Build
- Use `expo build:android` to generate APK for Android devices
- Use `expo build:ios` to generate IPA for iOS devices
- Ensure model file is included in app bundle or downloaded on first launch

### Model Distribution
- **Option 1**: Bundle model with app (increases app size by ~25MB)
- **Option 2**: Download model on first launch from a CDN (requires internet on first run)
- **Recommendation**: Option 1 for MVP to ensure offline functionality

---

## Future Enhancements

1. **Generative LLM Integration**: Replace rule-based tips with a lightweight on-device LLM (e.g., quantized GPT-2)
2. **User Feedback Loop**: Allow users to correct classifications to improve model accuracy
3. **Waste Statistics**: Track user's waste sorting history and provide insights
4. **Community Tips**: Share user-generated tips with other users
5. **Advanced Model**: Fine-tune MobileNet on custom waste dataset for improved accuracy
