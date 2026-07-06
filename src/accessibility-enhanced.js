/**
 * LittleJS Accessibility Kit - Enhanced Version
 * Comprehensive accessibility library for LittleJS game engine
 * Created by DeepSeek-V3.2 following suggestion from LittleJS maintainer
 */

class LittleJSAccessibilityKit {
    constructor(options = {}) {
        this.options = {
            screenReader: options.screenReader ?? true,
            keyboardNavigation: options.keyboardNavigation ?? true,
            visualPreferences: options.visualPreferences ?? true,
            audioAccessibility: options.audioAccessibility ?? true,
            debug: options.debug ?? false
        };

        this.elements = new Map();
        this.currentFocusIndex = 0;
        this.focusableElements = [];
        this.preferences = this.loadPreferences();
        
        this.init();
    }

    init() {
        console.log('LittleJS Accessibility Kit initialized');
        
        if (this.options.screenReader) {
            this.setupScreenReader();
        }
        
        if (this.options.keyboardNavigation) {
            this.setupKeyboardNavigation();
        }
        
        if (this.options.visualPreferences) {
            this.applyVisualPreferences();
        }
        
        if (this.options.audioAccessibility) {
            this.setupAudioAccessibility();
        }

        this.observeDOM();
    }

    setupScreenReader() {
        // Create live region for screen reader announcements
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        document.body.appendChild(this.liveRegion);

        // Add ARIA attributes to game canvas
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.setAttribute('role', 'application');
            canvas.setAttribute('aria-label', 'Game canvas');
        }
    }

    announce(message, priority = 'polite') {
        if (!this.options.screenReader) return;
        
        this.liveRegion.setAttribute('aria-live', priority);
        this.liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            this.liveRegion.textContent = '';
        }, 1000);
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.handleTabNavigation(e.shiftKey);
            } else if (e.key === 'Enter' || e.key === ' ') {
                this.handleActivation();
            } else if (e.key === 'Escape') {
                this.announce('Closing menu or dialog');
            }
        });

        // Find all focusable elements
        this.updateFocusableElements();
    }

    handleTabNavigation(shiftKey) {
        if (shiftKey) {
            this.currentFocusIndex = this.currentFocusIndex > 0 
                ? this.currentFocusIndex - 1 
                : this.focusableElements.length - 1;
        } else {
            this.currentFocusIndex = this.currentFocusIndex < this.focusableElements.length - 1
                ? this.currentFocusIndex + 1
                : 0;
        }

        this.focusCurrentElement();
    }

    focusCurrentElement() {
        if (this.focusableElements[this.currentFocusIndex]) {
            this.focusableElements[this.currentFocusIndex].focus();
            this.announce(`Focused on ${this.focusableElements[this.currentFocusIndex].textContent || 'element'}`);
        }
    }

    applyVisualPreferences() {
        // Detect system preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
        const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (prefersReducedMotion) {
            this.reduceMotion();
        }

        if (prefersHighContrast) {
            this.enableHighContrast();
        }

        // Apply saved preferences
        if (this.preferences.highContrast) {
            this.enableHighContrast();
        }
        
        if (this.preferences.largeText) {
            this.enlargeText();
        }
    }

    reduceMotion() {
        document.body.style.setProperty('--animation-duration', '0.01s');
        document.body.style.setProperty('--transition-duration', '0.01s');
        this.announce('Reduced motion enabled');
    }

    enableHighContrast() {
        document.body.classList.add('high-contrast');
        this.announce('High contrast mode enabled');
    }

    enlargeText() {
        document.body.style.fontSize = '1.2em';
        this.announce('Large text mode enabled');
    }

    setupAudioAccessibility() {
        // Volume controls
        this.volume = 1.0;
        this.captionsEnabled = false;
        
        // Create audio controls UI
        this.createAudioControls();
    }

    createAudioControls() {
        const controls = document.createElement('div');
        controls.className = 'accessibility-audio-controls';
        controls.innerHTML = `
            <button class="volume-down" aria-label="Decrease volume">-</button>
            <span class="volume-display">Volume: 100%</span>
            <button class="volume-up" aria-label="Increase volume">+</button>
            <button class="toggle-captions" aria-label="Toggle captions">CC</button>
        `;
        document.body.appendChild(controls);

        // Add event listeners
        controls.querySelector('.volume-down').addEventListener('click', () => this.adjustVolume(-0.1));
        controls.querySelector('.volume-up').addEventListener('click', () => this.adjustVolume(0.1));
        controls.querySelector('.toggle-captions').addEventListener('click', () => this.toggleCaptions());
    }

    adjustVolume(delta) {
        this.volume = Math.max(0, Math.min(1, this.volume + delta));
        
        // Update game audio if LittleJS is available
        if (window.engine && window.engine.setMasterVolume) {
            window.engine.setMasterVolume(this.volume);
        }
        
        this.announce(`Volume set to ${Math.round(this.volume * 100)}%`);
        this.updateVolumeDisplay();
    }

    toggleCaptions() {
        this.captionsEnabled = !this.captionsEnabled;
        this.announce(`Captions ${this.captionsEnabled ? 'enabled' : 'disabled'}`);
    }

    observeDOM() {
        // Watch for new elements being added
        const observer = new MutationObserver(() => {
            this.updateFocusableElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    updateFocusableElements() {
        this.focusableElements = Array.from(document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.disabled && el.offsetParent !== null);
    }

    loadPreferences() {
        const saved = localStorage.getItem('littlejs-accessibility-preferences');
        return saved ? JSON.parse(saved) : {
            highContrast: false,
            largeText: false,
            reducedMotion: false
        };
    }

    savePreferences() {
        localStorage.setItem('littlejs-accessibility-preferences', JSON.stringify(this.preferences));
    }

    // Integration with LittleJS engine
    setupGame(engine) {
        if (!engine) return;
        
        console.log('Setting up accessibility for LittleJS game');
        
        // Store reference to engine
        this.engine = engine;
        
        // Add accessibility hooks to engine
        this.addEngineHooks();
        
        this.announce('Accessibility features enabled for game');
    }

    addEngineHooks() {
        // Override input handling for accessibility
        const originalInputUpdate = this.engine.inputUpdate;
        this.engine.inputUpdate = () => {
            originalInputUpdate.call(this.engine);
            this.handleAccessibilityInput();
        };
    }

    handleAccessibilityInput() {
        // Process accessibility-specific input
        if (this.engine.keyWasPressed('F6')) {
            this.toggleHighContrast();
        }
        
        if (this.engine.keyWasPressed('F7')) {
            this.toggleCaptions();
        }
    }

    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        this.preferences.highContrast = document.body.classList.contains('high-contrast');
        this.savePreferences();
        this.announce(`High contrast ${this.preferences.highContrast ? 'enabled' : 'disabled'}`);
    }

    updateVolumeDisplay() {
        const display = document.querySelector('.volume-display');
        if (display) {
            display.textContent = `Volume: ${Math.round(this.volume * 100)}%`;
        }
    }
}

// Global instance
window.littleJSAccessibility = new LittleJSAccessibilityKit();

// CSS for accessibility features
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    .high-contrast {
        --background-color: #000 !important;
        --text-color: #fff !important;
        --button-bg: #ff0 !important;
        --button-text: #000 !important;
    }
    
    .high-contrast * {
        background-color: var(--background-color) !important;
        color: var(--text-color) !important;
        border-color: var(--text-color) !important;
    }
    
    .high-contrast button {
        background-color: var(--button-bg) !important;
        color: var(--button-text) !important;
        border: 2px solid var(--text-color) !important;
    }
    
    .accessibility-audio-controls {
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 1000;
    }
    
    .accessibility-audio-controls button {
        margin: 0 5px;
        padding: 5px 10px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    
    button:focus {
        outline: 3px solid #4CAF50;
        outline-offset: 2px;
    }
    
    [role="button"]:focus {
        outline: 3px dashed #4CAF50;
    }
`;

document.head.appendChild(style);

console.log('LittleJS Accessibility Kit loaded successfully');
