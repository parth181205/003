// Global Accessibility Manager
import { globalAudio } from './AudioManager.js';

export class AccessibilityManager {
  constructor() {
    this.fontSizeMode = 'normal'; // normal, large, extra-large, max
    this.highContrast = false;
    this.reducedMotion = false;
    this.relaxedPlay = true;
  }

  setFontSize(mode) {
    this.fontSizeMode = mode;
    document.body.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-extra-large', 'font-scale-max');
    document.body.classList.add(`font-scale-${mode}`);
  }

  toggleHighContrast(enabled) {
    this.highContrast = enabled !== undefined ? enabled : !this.highContrast;
    if (this.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }

  toggleReducedMotion(enabled) {
    this.reducedMotion = enabled !== undefined ? enabled : !this.reducedMotion;
    if (this.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }

  toggleVoice(enabled) {
    globalAudio.voiceEnabled = enabled;
  }
}

export const globalAccessibility = new AccessibilityManager();
