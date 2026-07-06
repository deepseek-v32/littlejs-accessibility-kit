/**
 * LittleJS Accessibility Module - Prototype
 * Adds accessibility features to LittleJS game engine
 * @namespace Accessibility
 */

// Accessibility Manager Class
class AccessibilityManager {
    constructor() {
        this.enabled = false;
        this.features = {
            screenReader: false,
            keyboardNavigation: false,
            highContrast: false,
            reducedMotion: false,
            colorBlindness: false
        };
        
        this.screenReaderLiveRegions = [];
        this.keyboardFocusStack = [];
        this.currentFocusIndex = 0;
        
        this.detectPreferences();
    }
    
    /**
     * Detect user accessibility preferences
     */
    detectPreferences() {
        // Check for prefers-reduced-motion
        this.features.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Check for prefers-contrast
        const contrastQuery = window.matchMedia('(prefers-contrast: more)');
        this.features.highContrast = contrastQuery.matches;
        
        // Initialize based on detected preferences
        if (this.features.reducedMotion) {
            this.enableReducedMotion();
        }
        
        if (this.features.highContrast) {
            this.enableHighContrast();
        }
    }
    
    /**
     * Enable accessibility module
     */
    enable() {
        this.enabled = true;
        this.initScreenReaderSupport();
        this.initKeyboardNavigation();
        this.applyVisualAccessibility();
        console.log('Accessibility module enabled');
    }
    
    /**
     * Initialize screen reader support
     */
    initScreenReaderSupport() {
        this.features.screenReader = true;
        
        // Create live regions for announcements
        this.createLiveRegion('status', 'polite');
        this.createLiveRegion('alert', 'assertive');
        
        // Add ARIA attributes to canvas
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.setAttribute('role', 'application');
            canvas.setAttribute('aria-label', 'Game canvas');
            canvas.setAttribute('tabindex', '-1'); // Make canvas focusable but not in tab order
        }
    }
    
    /**
     * Create a live region for screen reader announcements
     */
    createLiveRegion(id, politeness = 'polite') {
        const region = document.createElement('div');
        region.id = `accessibility-live-${id}`;
        region.setAttribute('aria-live', politeness);
        region.setAttribute('aria-atomic', 'true');
        region.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
        document.body.appendChild(region);
        this.screenReaderLiveRegions.push(region);
        return region;
    }
    
    /**
     * Announce message to screen reader
     */
    announce(message, type = 'status') {
        if (!this.features.screenReader) return;
        
        const region = document.getElementById(`accessibility-live-${type}`);
        if (region) {
            region.textContent = message;
            // Clear after announcement is read
            setTimeout(() => {
                region.textContent = '';
            }, 100);
        }
    }
    
    /**
     * Initialize keyboard navigation system
     */
    initKeyboardNavigation() {
        this.features.keyboardNavigation = true;
        
        // Enhance existing keyboard handling
        document.addEventListener('keydown', (e) => {
            this.handleAccessibilityKeys(e);
        });
        
        console.log('Keyboard navigation enhanced');
    }
    
    /**
     * Handle accessibility-specific keyboard shortcuts
     */
    handleAccessibilityKeys(event) {
        // Skip if accessibility not enabled
        if (!this.enabled) return;
        
        // Toggle high contrast mode
        if (event.ctrlKey && event.altKey && event.key === 'h') {
            event.preventDefault();
            this.toggleHighContrast();
            this.announce(`High contrast mode ${this.features.highContrast ? 'enabled' : 'disabled'}`);
        }
        
        // Toggle reduced motion
        if (event.ctrlKey && event.altKey && event.key === 'm') {
            event.preventDefault();
            this.toggleReducedMotion();
            this.announce(`Reduced motion ${this.features.reducedMotion ? 'enabled' : 'disabled'}`);
        }
        
        // Accessibility menu
        if (event.ctrlKey && event.altKey && event.key === 'a') {
            event.preventDefault();
            this.showAccessibilityMenu();
        }
    }
    
    /**
     * Enable high contrast mode
     */
    enableHighContrast() {
        this.features.highContrast = true;
        document.documentElement.style.setProperty('--accessibility-high-contrast', 'true');
        
        // Add high contrast styles
        const style = document.createElement('style');
        style.id = 'accessibility-high-contrast-styles';
        style.textContent = `
            [data-high-contrast="true"] {
                filter: contrast(200%) brightness(110%);
            }
            canvas {
                filter: contrast(150%);
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Disable high contrast mode
     */
    disableHighContrast() {
        this.features.highContrast = false;
        document.documentElement.style.removeProperty('--accessibility-high-contrast');
        
        const style = document.getElementById('accessibility-high-contrast-styles');
        if (style) {
            style.remove();
        }
    }
    
    /**
     * Toggle high contrast mode
     */
    toggleHighContrast() {
        if (this.features.highContrast) {
            this.disableHighContrast();
        } else {
            this.enableHighContrast();
        }
    }
    
    /**
     * Enable reduced motion
     */
    enableReducedMotion() {
        this.features.reducedMotion = true;
        document.documentElement.style.setProperty('--accessibility-reduced-motion', 'true');
        
        // Add reduced motion styles
        const style = document.createElement('style');
        style.id = 'accessibility-reduced-motion-styles';
        style.textContent = `
            * {
                animation-duration: 0.001ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.001ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Disable reduced motion
     */
    disableReducedMotion() {
        this.features.reducedMotion = false;
        document.documentElement.style.removeProperty('--accessibility-reduced-motion');
        
        const style = document.getElementById('accessibility-reduced-motion-styles');
        if (style) {
            style.remove();
        }
    }
    
    /**
     * Toggle reduced motion
     */
    toggleReducedMotion() {
        if (this.features.reducedMotion) {
            this.disableReducedMotion();
        } else {
            this.enableReducedMotion();
        }
    }
    
    /**
     * Apply visual accessibility features
     */
    applyVisualAccessibility() {
        // Add focus indicators for keyboard navigation
        const style = document.createElement('style');
        style.id = 'accessibility-focus-styles';
        style.textContent = `
            *:focus {
                outline: 3px solid #0066cc !important;
                outline-offset: 2px !important;
            }
            
            button:focus, 
            a:focus, 
            input:focus, 
            select:focus {
                outline: 3px solid #0066cc !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Show accessibility menu
     */
    showAccessibilityMenu() {
        const menu = document.createElement('div');
        menu.id = 'accessibility-menu';
        menu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #333;
            padding: 20px;
            z-index: 10000;
            min-width: 300px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        menu.innerHTML = `
            <h2 style="margin-top: 0;">Accessibility Settings</h2>
            <div>
                <label>
                    <input type="checkbox" ${this.features.highContrast ? 'checked' : ''} 
                           onchange="window.accessibilityManager.toggleHighContrast()">
                    High Contrast Mode
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" ${this.features.reducedMotion ? 'checked' : ''}
                           onchange="window.accessibilityManager.toggleReducedMotion()">
                    Reduced Motion
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" ${this.features.screenReader ? 'checked' : ''}
                           onchange="window.accessibilityManager.features.screenReader = this.checked">
                    Screen Reader Support
                </label>
            </div>
            <button onclick="this.parentElement.remove()" style="margin-top: 20px; padding: 8px 16px;">
                Close
            </button>
        `;
        
        document.body.appendChild(menu);
        this.announce('Accessibility menu opened');
    }
    
    /**
     * Add accessibility attributes to game object
     */
    addAccessibilityToGameObject(object, label, description = '') {
        if (!object.element) return;
        
        object.element.setAttribute('role', 'region');
        object.element.setAttribute('aria-label', label);
        
        if (description) {
            object.element.setAttribute('aria-describedby', `desc-${object.id || Date.now()}`);
        }
        
        object.accessible = true;
    }
}

// Export Accessibility Manager
window.AccessibilityManager = AccessibilityManager;

// Initialize global instance
window.accessibilityManager = new AccessibilityManager();

// Auto-enable if preferences detected
if (window.accessibilityManager.features.reducedMotion || 
    window.accessibilityManager.features.highContrast) {
    window.accessibilityManager.enable();
}

console.log('LittleJS Accessibility Module loaded');
