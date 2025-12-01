# EcoScan AI - Project Structure

## 📁 Professional Folder Organization

This document outlines the clean, professional folder structure of the EcoScan AI project.

```
impl/
├── 📱 app/                          # Expo Router app directory
│   ├── (tabs)/                      # Tab-based navigation
│   │   ├── index.tsx               # Home screen
│   │   └── explore.tsx             # Explore tab (default Expo)
│   ├── platforms/                   # Platform-specific implementations
│   │   ├── camera.mobile.tsx       # Mobile camera with expo-camera
│   │   └── camera.web.tsx          # Web camera with file upload
│   ├── _layout.tsx                 # Root navigation layout
│   ├── camera.tsx                  # Platform-aware camera router
│   ├── modal.tsx                   # Modal screen (default Expo)
│   └── results.tsx                 # Classification results screen
│
├── 🛠️ lib/                          # Shared library code
│   ├── components/                  # Reusable UI components
│   │   ├── ErrorBoundary.js        # React error boundary
│   │   └── WebCamera.tsx           # Web-compatible camera component
│   └── utils/                       # Utility functions
│       ├── errorHandler.js         # Error handling utilities
│       ├── models.js               # ML model utilities (mobile)
│       ├── models.web.js           # ML model utilities (web mock)
│       ├── models.platform.js      # Platform-aware model loader
│       └── tipGenerator.js         # Eco-tip generation
│
├── 📚 docs/                         # Documentation
│   ├── COMPREHENSIVE_TESTING_REPORT.md
│   ├── PROJECT_STRUCTURE.md        # This file
│   ├── TESTING_RESULTS.md
│   └── WEB_TESTING_RESULTS.md
│
├── 🧪 tests/                        # Testing utilities
│   ├── test-app.js                 # App functionality tests
│   └── test-web.js                 # Web version tests
│
├── 🎨 assets/                       # Static assets
├── 🔧 components/                   # Expo default components
├── 📐 constants/                    # App constants
├── 🪝 hooks/                        # Custom React hooks
├── 📋 scripts/                      # Build and utility scripts
│
├── ⚙️ Configuration Files
├── .gitignore
├── app.json                        # Expo configuration
├── eslint.config.js               # ESLint configuration
├── expo-env.d.ts                  # Expo TypeScript definitions
├── package.json                   # Dependencies and scripts
├── README.md                      # Project documentation
└── tsconfig.json                  # TypeScript configuration
```

## 🏗️ Architecture Overview

### Platform-Aware Design
The project uses a clean platform-aware architecture:

- **`app/camera.tsx`**: Platform router that loads appropriate implementation
- **`app/platforms/camera.mobile.tsx`**: Full mobile implementation with expo-camera
- **`app/platforms/camera.web.tsx`**: Web-compatible implementation with file upload

### Shared Library (`lib/`)
All reusable code is organized in the `lib/` directory:

- **`lib/utils/`**: Business logic and utility functions
- **`lib/components/`**: Reusable UI components

### Documentation (`docs/`)
Comprehensive documentation including:

- Testing reports and results
- Architecture documentation
- Project structure (this file)

### Testing (`tests/`)
Dedicated testing utilities:

- App functionality verification
- Web version testing
- Cross-platform compatibility checks

## 🔄 Migration Summary

### Files Moved:
- **Documentation**: `*.md` files → `docs/`
- **Testing**: `test-*.js` files → `tests/`
- **Utilities**: `src/utils/*` → `lib/utils/`
- **Components**: `src/components/*` → `lib/components/`
- **Platform Files**: `camera.*.tsx` → `app/platforms/`

### Files Removed:
- **Duplicate Screens**: `src/screens/*` (replaced by Expo Router)
- **Old Navigation**: `src/navigation/*` (replaced by Expo Router)
- **Empty Directories**: `src/` (consolidated into `lib/`)

### Import Paths Updated:
- All import statements updated to reflect new structure
- Platform-aware imports maintained
- Test files updated to use new paths

## 🎯 Benefits of New Structure

### Professional Organization
- **Clear Separation**: Platform-specific vs shared code
- **Logical Grouping**: Related files grouped together
- **Scalable**: Easy to add new features and platforms

### Developer Experience
- **Easy Navigation**: Intuitive folder structure
- **Clear Dependencies**: Import paths reflect architecture
- **Maintainable**: Clean separation of concerns

### Documentation
- **Centralized Docs**: All documentation in one place
- **Testing Utilities**: Dedicated testing folder
- **Clear Structure**: Easy to understand project layout

## 🚀 Usage

### Adding New Features
1. **Screens**: Add to `app/` directory
2. **Components**: Add to `lib/components/`
3. **Utilities**: Add to `lib/utils/`
4. **Platform-Specific**: Add to `app/platforms/`

### Running Tests
```bash
# Test app functionality
node tests/test-app.js

# Test web version
node tests/test-web.js
```

### Development
```bash
# Start development server
npm start

# Start web version
npm run web

# Start Android
npm run android
```

This clean, professional structure ensures maintainability, scalability, and ease of development while following modern React Native and Expo best practices.