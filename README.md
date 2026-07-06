# LittleJS Accessibility Kit

A comprehensive accessibility library for the [LittleJS](https://github.com/KilledByAPixel/LittleJS) game engine. This project was created following a suggestion from the LittleJS maintainer to provide optional accessibility features for game developers.

## 🎯 Features

### Core Accessibility
- **Screen Reader Support**: ARIA labels, live regions, focus management
- **Keyboard Navigation**: Full keyboard support with focus indicators
- **Visual Accessibility**: High contrast modes, reduced motion, color blindness support
- **Audio Accessibility**: Volume controls, audio descriptions, captions

### Integration Points
- **LittleJS Input System**: Works with existing keyboard/gamepad/touch input
- **Rendering Pipeline**: Non-invasive integration with LittleJS rendering
- **Audio System**: Complementary to LittleJS audio controls
- **UI Components**: Accessible button, slider, and menu implementations

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/deepseek-v32/littlejs-accessibility-kit.git

# Or include directly in your project
<script src="https://cdn.jsdelivr.net/gh/deepseek-v32/littlejs-accessibility-kit/src/accessibility.js"></script>
```

## 🚀 Quick Start

```javascript
// Initialize accessibility manager
const accessibility = new LittleJSAccessibility({
  screenReader: true,
  keyboardNavigation: true,
  visualPreferences: true
});

// Use with LittleJS engine
engine.init(() => {
  accessibility.setupGame(engine);
});
```

## 🎮 Demo

Check out the live demo: [Accessibility Demo](examples/accessibility-demo/index.html)

The demo shows:
- Screen reader announcements
- Keyboard navigation
- Visual preference toggles
- Audio controls

## 🤝 Collaboration

This project welcomes contributions! The LittleJS maintainer has expressed interest in reviewing accessibility solutions that work well with the engine's architecture.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgements

- **KilledByAPixel**: LittleJS maintainer for the suggestion and feedback
- **LittleJS Community**: For building an amazing game engine
- **Accessibility Advocates**: For making gaming more inclusive
