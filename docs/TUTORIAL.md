# LittleJS Accessibility Kit - Tutorial

## Introduction

This tutorial will guide you through integrating the LittleJS Accessibility Kit into your game project. We'll cover basic setup, configuration, and advanced usage.

## Prerequisites

- Basic knowledge of JavaScript and LittleJS
- A LittleJS game project
- Understanding of web accessibility concepts (helpful but not required)

## Step 1: Installation

### Option A: Direct Download
Download the latest release from GitHub and include it in your project:

```html
<script src="path/to/accessibility-kit.js"></script>
```

### Option B: Module Import
If using ES6 modules:

```javascript
import { AccessibilityKit } from './accessibility-kit.js';
```

## Step 2: Basic Integration

```javascript
// Initialize the accessibility kit
const accessibility = new AccessibilityKit({
  // Configuration options
  autoEnable: false, // Don't enable automatically
  debug: true,      // Show debug messages in console
});

// Enable all features (or enable specific ones)
accessibility.enableAll();

// Or enable specific extensions
const extensions = accessibility.getExtensions();
extensions.screenReader.enable();
extensions.keyboardNav.enable();
```

## Step 3: Configuring Features

### Screen Reader Support

```javascript
const screenReader = accessibility.getExtension('screenReader');
screenReader.configure({
  announcementPriority: 'polite', // 'assertive' or 'polite'
  liveRegions: true,             // Enable ARIA live regions
  roleDescriptions: true,        // Add role descriptions
});
```

### Keyboard Navigation

```javascript
const keyboardNav = accessibility.getExtension('keyboardNav');
keyboardNav.configure({
  focusTrapping: true,           // Trap focus within game area
  tabOrder: 'logical',          // Logical tab order
  shortcutOverrides: {          // Custom keyboard shortcuts
    'Enter': 'activate',
    'Space': 'interact',
  },
});
```

## Step 4: User Preferences

The kit includes a preferences system that remembers user settings:

```javascript
// Save user preferences
accessibility.savePreferences({
  fontSize: '150%',
  colorFilter: 'protanopia',
  reducedMotion: true,
});

// Load saved preferences
const prefs = accessibility.loadPreferences();
if (prefs) {
  accessibility.applyPreferences(prefs);
}
```

## Step 5: Testing

### Manual Testing
1. Test with screen readers (NVDA, VoiceOver, JAWS)
2. Test keyboard-only navigation
3. Test with color blindness simulators
4. Test with different font sizes

### Automated Testing
The kit includes test utilities:

```javascript
// Run accessibility tests
const testResults = accessibility.runTests();
console.log('Accessibility test results:', testResults);

// Check specific WCAG compliance
const wcagCompliance = accessibility.checkWCAGCompliance();
console.log('WCAG compliance:', wcagCompliance);
```

## Step 6: Advanced Features

### Custom Extensions
Create your own accessibility extensions:

```javascript
class MyCustomExtension {
  constructor() {
    this.name = 'myCustomExtension';
    this.enabled = false;
  }
  
  enable() {
    this.enabled = true;
    // Your custom accessibility logic here
  }
  
  disable() {
    this.enabled = false;
    // Cleanup logic here
  }
}

// Register custom extension
accessibility.registerExtension(new MyCustomExtension());
```

### Integration with Game Engine
For LittleJS engine integration:

```javascript
// Get game integration helpers
const gameIntegration = accessibility.getGameIntegration();

// Hook into LittleJS event system
gameIntegration.hookIntoEngine(littleJSInstance);

// Add accessibility controls to game UI
gameIntegration.addControlsToUI(gameUIElement);
```

## Common Issues & Solutions

### Issue: Performance Impact
**Solution**: The kit has zero overhead when disabled. Only enable features users actually need.

### Issue: Screen Reader Compatibility
**Solution**: Test with multiple screen readers. The kit uses standard ARIA attributes that work with most modern screen readers.

### Issue: Custom Game Controls
**Solution**: Use the extension system to add accessibility support for custom game controls.

## Best Practices

1. **Progressive Enhancement**: Add accessibility features as enhancements, not requirements
2. **User Control**: Let users enable/disable features as needed
3. **Performance First**: Only load features when requested
4. **Standards Compliance**: Follow WCAG and ARIA guidelines
5. **Testing**: Test with real users with disabilities when possible

## Next Steps

1. Explore the demo examples in the `examples/` directory
2. Check the API reference for detailed method documentation
3. Join the accessibility gaming community for feedback
4. Consider contributing new features or improvements

## Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Reach out to the maintainer community

---

*This tutorial is part of the LittleJS Accessibility Kit project, created to make games accessible for everyone.*
