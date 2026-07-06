/**
 * Additional Accessibility Extensions for LittleJS Accessibility Kit
 * Enhanced features for YouTube showcase demonstration
 */

class AccessibilityExtensions {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.extensions = new Map();
        this.init();
    }

    init() {
        // Screen Reader Announcements
        this.extensions.set('screenReader', {
            enabled: false,
            announce: (message, priority = 'polite') => {
                if (this.extensions.get('screenReader').enabled) {
                    const liveRegion = document.getElementById('a11y-live-region');
                    if (!liveRegion) {
                        this.createLiveRegion();
                    }
                    const region = document.getElementById('a11y-live-region');
                    region.setAttribute('aria-live', priority);
                    region.textContent = message;
                    
                    // Clear after announcement
                    setTimeout(() => {
                        region.textContent = '';
                    }, 1000);
                }
            },
            createLiveRegion: () => {
                const region = document.createElement('div');
                region.id = 'a11y-live-region';
                region.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
                region.setAttribute('aria-live', 'polite');
                region.setAttribute('aria-atomic', 'true');
                document.body.appendChild(region);
            }
        });

        // Extended Keyboard Navigation
        this.extensions.set('keyboardNav', {
            enabled: true,
            focusableElements: [],
            currentFocusIndex: 0,
            trapFocus: false,
            
            registerElement: (element, label) => {
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }
                if (label && !element.hasAttribute('aria-label')) {
                    element.setAttribute('aria-label', label);
                }
                this.extensions.get('keyboardNav').focusableElements.push(element);
            },
            
            navigate: (direction) => {
                const nav = this.extensions.get('keyboardNav');
                if (nav.focusableElements.length === 0) return;
                
                nav.currentFocusIndex += direction;
                if (nav.currentFocusIndex < 0) {
                    nav.currentFocusIndex = nav.focusableElements.length - 1;
                } else if (nav.currentFocusIndex >= nav.focusableElements.length) {
                    nav.currentFocusIndex = 0;
                }
                
                nav.focusableElements[nav.currentFocusIndex].focus();
            }
        });

        // Visual Focus Indicators
        this.extensions.set('focusIndicators', {
            enabled: true,
            indicatorStyle: `
                outline: 3px solid #0066cc;
                outline-offset: 2px;
                border-radius: 2px;
                box-shadow: 0 0 0 1px white;
            `,
            applyIndicators: () => {
                const style = document.createElement('style');
                style.id = 'a11y-focus-indicators';
                style.textContent = `
                    *:focus-visible {
                        ${this.extensions.get('focusIndicators').indicatorStyle}
                    }
                    .a11y-highlight-focus {
                        ${this.extensions.get('focusIndicators').indicatorStyle}
                        transition: outline 0.2s ease;
                    }
                `;
                document.head.appendChild(style);
            }
        });

        // Cognitive Load Reduction
        this.extensions.set('cognitiveLoad', {
            enabled: false,
            simplifyUI: () => {
                // Reduce visual complexity
                document.querySelectorAll('*').forEach(el => {
                    const computed = window.getComputedStyle(el);
                    if (parseFloat(computed.opacity) < 0.3) {
                        el.style.opacity = '0.7';
                    }
                });
                
                // Increase text spacing
                document.body.style.letterSpacing = '0.05em';
                document.body.style.wordSpacing = '0.1em';
                document.body.style.lineHeight = '1.6';
            },
            
            progressiveDisclosure: (elements, delay = 1000) => {
                // Show elements progressively to reduce cognitive load
                elements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '0';
                        el.style.transition = 'opacity 0.5s ease';
                        requestAnimationFrame(() => {
                            el.style.opacity = '1';
                        });
                    }, index * delay);
                });
            }
        });

        // Text-to-Speech Integration
        this.extensions.set('textToSpeech', {
            enabled: false,
            speechSynthesis: window.speechSynthesis,
            voices: [],
            selectedVoice: null,
            
            initVoices: () => {
                return new Promise((resolve) => {
                    const loadVoices = () => {
                        this.extensions.get('textToSpeech').voices = this.extensions.get('textToSpeech').speechSynthesis.getVoices();
                        if (this.extensions.get('textToSpeech').voices.length > 0) {
                            // Prefer natural-sounding voices
                            const preferred = this.extensions.get('textToSpeech').voices.find(v => 
                                v.lang.includes('en') && v.name.includes('Natural')
                            ) || this.extensions.get('textToSpeech').voices[0];
                            this.extensions.get('textToSpeech').selectedVoice = preferred;
                            resolve();
                        }
                    };
                    
                    if (speechSynthesis.getVoices().length > 0) {
                        loadVoices();
                    } else {
                        speechSynthesis.addEventListener('voiceschanged', loadVoices);
                    }
                });
            },
            
            speak: (text, rate = 1, pitch = 1) => {
                if (!this.extensions.get('textToSpeech').enabled) return;
                
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = this.extensions.get('textToSpeech').selectedVoice;
                utterance.rate = rate;
                utterance.pitch = pitch;
                this.extensions.get('textToSpeech').speechSynthesis.speak(utterance);
            }
        });
    }

    // Enable all extensions
    enableAll() {
        this.extensions.forEach((extension, key) => {
            extension.enabled = true;
            if (key === 'focusIndicators') {
                extension.applyIndicators();
            }
            if (key === 'textToSpeech') {
                extension.initVoices();
            }
        });
        console.log('All accessibility extensions enabled');
    }

    // Get extension by name
    getExtension(name) {
        return this.extensions.get(name);
    }

    // Export for use in games
    getGameIntegration() {
        return {
            announce: (message) => this.getExtension('screenReader').announce(message),
            speak: (text) => this.getExtension('textToSpeech').speak(text),
            registerUIElement: (element, label) => this.getExtension('keyboardNav').registerElement(element, label),
            simplifyInterface: () => this.getExtension('cognitiveLoad').simplifyUI()
        };
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityExtensions;
}
