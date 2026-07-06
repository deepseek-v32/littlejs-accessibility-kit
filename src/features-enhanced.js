/**
 * LittleJS Accessibility Kit - Enhanced Features
 * Additional accessibility utilities for YouTube showcase
 */

class AccessibilityEnhancedFeatures {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.features = {
            highContrastMode: false,
            reducedMotion: false,
            colorBlindMode: 'none', // 'protanopia', 'deuteranopia', 'tritanopia'
            fontSizeMultiplier: 1.0,
            audioDescription: false,
            captions: true
        };
        
        this.initEnhancedFeatures();
    }
    
    initEnhancedFeatures() {
        console.log('Accessibility Enhanced Features initialized');
        this.loadUserPreferences();
        this.applyFeatureOverrides();
        this.setupFeatureToggles();
    }
    
    loadUserPreferences() {
        // Load from localStorage or system preferences
        const saved = localStorage.getItem('littlejs_accessibility_prefs');
        if (saved) {
            try {
                this.features = { ...this.features, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('Failed to parse saved preferences');
            }
        }
        
        // Check system preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.features.reducedMotion = true;
        }
        
        if (window.matchMedia('(prefers-contrast: more)').matches) {
            this.features.highContrastMode = true;
        }
    }
    
    applyFeatureOverrides() {
        // Apply visual overrides based on features
        if (this.features.highContrastMode) {
            this.applyHighContrast();
        }
        
        if (this.features.reducedMotion) {
            this.reduceMotion();
        }
        
        if (this.features.colorBlindMode !== 'none') {
            this.applyColorBlindFilter(this.features.colorBlindMode);
        }
        
        if (this.features.fontSizeMultiplier !== 1.0) {
            this.adjustFontSize(this.features.fontSizeMultiplier);
        }
    }
    
    applyHighContrast() {
        // Add high contrast CSS
        const style = document.createElement('style');
        style.id = 'high-contrast-override';
        style.textContent = `
            * { color: white !important; background: black !important; }
            a, button, input { border: 2px solid yellow !important; }
            .focus-highlight { outline: 3px solid cyan !important; }
        `;
        document.head.appendChild(style);
    }
    
    reduceMotion() {
        // Override game animations
        if (this.game && this.game.engine) {
            this.game.engine.timeScale = 0.5; // Slow down animations
        }
        
        // Add CSS to reduce motion
        const style = document.createElement('style');
        style.id = 'reduced-motion-override';
        style.textContent = `
            *, *::before, *::after { animation-duration: 0.01ms !important; }
            .game-object { transition: none !important; }
        `;
        document.head.appendChild(style);
    }
    
    applyColorBlindFilter(mode) {
        // Apply color blindness simulation filters
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
        
        const filters = {
            protanopia: 'url(#protanopia)',
            deuteranopia: 'url(#deuteranopia)',
            tritanopia: 'url(#tritanopia)'
        };
        
        if (filters[mode]) {
            canvas.style.filter = filters[mode];
        }
    }
    
    adjustFontSize(multiplier) {
        // Scale UI text
        document.documentElement.style.setProperty('--font-size-multiplier', multiplier);
        
        const uiElements = document.querySelectorAll('[data-accessibility-font-scale]');
        uiElements.forEach(el => {
            const baseSize = parseFloat(getComputedStyle(el).fontSize);
            el.style.fontSize = `${baseSize * multiplier}px`;
        });
    }
    
    setupFeatureToggles() {
        // Create accessibility menu
        this.createAccessibilityMenu();
        
        // Add keyboard shortcuts
        this.addKeyboardShortcuts();
    }
    
    createAccessibilityMenu() {
        const menuHTML = `
            <div id="accessibility-menu" style="position: fixed; top: 10px; right: 10px; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 1000;">
                <h3 style="margin: 0 0 10px 0;">Accessibility Settings</h3>
                <div>
                    <label><input type="checkbox" ${this.features.highContrastMode ? 'checked' : ''}> High Contrast</label><br>
                    <label><input type="checkbox" ${this.features.reducedMotion ? 'checked' : ''}> Reduced Motion</label><br>
                    <label><input type="checkbox" ${this.features.audioDescription ? 'checked' : ''}> Audio Descriptions</label><br>
                    <label><input type="checkbox" ${this.features.captions ? 'checked' : ''}> Captions</label><br>
                    <label>Font Size: <input type="range" min="0.8" max="2.0" step="0.1" value="${this.features.fontSizeMultiplier}"></label>
                </div>
                <button onclick="this.parentElement.style.display='none'">Close</button>
            </div>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = menuHTML;
        document.body.appendChild(container.firstElementChild);
        
        // Add event listeners
        this.bindMenuEvents();
    }
    
    bindMenuEvents() {
        // Bind checkbox changes
        document.querySelectorAll('#accessibility-menu input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const feature = e.target.parentElement.textContent.trim().toLowerCase().replace(' ', '');
                this.features[feature] = e.target.checked;
                this.savePreferences();
                this.applyFeatureOverrides();
            });
        });
        
        // Bind font size slider
        const slider = document.querySelector('#accessibility-menu input[type="range"]');
        slider.addEventListener('input', (e) => {
            this.features.fontSizeMultiplier = parseFloat(e.target.value);
            this.adjustFontSize(this.features.fontSizeMultiplier);
            this.savePreferences();
        });
    }
    
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt+A to open accessibility menu
            if (e.altKey && e.key === 'a') {
                const menu = document.getElementById('accessibility-menu');
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            }
            
            // Alt+C to toggle captions
            if (e.altKey && e.key === 'c') {
                this.features.captions = !this.features.captions;
                this.toggleCaptions();
                this.savePreferences();
            }
            
            // Alt+H to toggle high contrast
            if (e.altKey && e.key === 'h') {
                this.features.highContrastMode = !this.features.highContrastMode;
                this.applyFeatureOverrides();
                this.savePreferences();
            }
        });
    }
    
    toggleCaptions() {
        // Implementation for toggling game captions
        console.log('Captions:', this.features.captions ? 'ON' : 'OFF');
        // This would integrate with game's audio/visual system
    }
    
    savePreferences() {
        localStorage.setItem('littlejs_accessibility_prefs', JSON.stringify(this.features));
    }
    
    // Integration with LittleJS
    integrateWithLittleJS() {
        if (!this.game) return;
        
        // Hook into LittleJS rendering
        const originalRender = this.game.render;
        this.game.render = (...args) => {
            // Apply accessibility overlays before rendering
            this.preRenderAccessibility();
            originalRender.apply(this.game, args);
            this.postRenderAccessibility();
        };
        
        // Hook into input handling
        const originalUpdate = this.game.update;
        this.game.update = (...args) => {
            // Check for accessibility inputs
            this.checkAccessibilityInputs();
            originalUpdate.apply(this.game, args);
        };
    }
    
    preRenderAccessibility() {
        // Apply visual filters before rendering
        if (this.features.colorBlindMode !== 'none') {
            // Set up WebGL filters for color blindness
        }
    }
    
    postRenderAccessibility() {
        // Add overlays like captions, focus indicators
        if (this.features.captions) {
            this.renderCaptions();
        }
    }
    
    renderCaptions() {
        // Render speech/text captions
        // Implementation depends on game's audio system
    }
    
    checkAccessibilityInputs() {
        // Check for specialized input devices
        // Could integrate with eye tracking, switch controls, etc.
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityEnhancedFeatures;
}
