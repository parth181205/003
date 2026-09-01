// Progressive 4-Level Hint Engine
import { globalAudio } from './AudioManager.js';

export class HintManager {
  constructor(scene) {
    this.scene = scene;
    this.hintLevel = 0;
    this.activeTween = null;
  }

  reset() {
    this.hintLevel = 0;
    if (this.activeTween) {
      this.activeTween.stop();
      this.activeTween = null;
    }
  }

  provideHint(sourceObj, targetObj, textExplanation = '') {
    this.hintLevel = (this.hintLevel % 4) + 1;

    switch (this.hintLevel) {
      case 1:
        // Level 1: Subtle highlight pulse on source object
        if (sourceObj) {
          this.activeTween = this.scene.tweens.add({
            targets: sourceObj,
            scaleX: 1.12,
            scaleY: 1.12,
            duration: 400,
            yoyo: true,
            repeat: 2
          });
        }
        break;

      case 2:
        // Level 2: Visual pulse on target destination
        if (targetObj) {
          this.activeTween = this.scene.tweens.add({
            targets: targetObj,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 400,
            yoyo: true,
            repeat: 2
          });
        }
        break;

      case 3:
        // Level 3: Spoken & text explanation
        if (textExplanation) {
          globalAudio.speakText(textExplanation);
        } else if (sourceObj && targetObj) {
          globalAudio.speakText(`Match ${sourceObj.label} with ${targetObj.label || 'destination'}.`);
        }
        break;

      case 4:
        // Level 4: Automated gentle demonstration movement
        if (sourceObj && targetObj) {
          this.scene.tweens.add({
            targets: sourceObj,
            x: targetObj.x,
            y: targetObj.y,
            duration: 800,
            yoyo: true,
            ease: 'Power2'
          });
        }
        break;
    }
  }
}
