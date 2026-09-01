// Target Touch Game Scene
import Phaser from 'phaser';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { FeedbackManager } from '../engine/FeedbackManager.js';
import { globalAudio } from '../engine/AudioManager.js';

export class TargetTouchScene extends Phaser.Scene {
  constructor() {
    super('TargetTouchScene');
  }

  initData(data) {
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.targetsTouched = 0;

    this.add.text(this.cameras.main.width / 2, 90, "🎯 Touch the Pulsing Star Target", {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '26px',
      fontWeight: '800',
      color: '#EAB308'
    }).setOrigin(0.5);

    const target = ObjectFactory.create(this, {
      type: 'card',
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      width: 180,
      height: 180,
      content: { icon: '⭐' },
      label: 'Touch Me',
      draggable: false
    });

    // Pulse animation
    this.tweens.add({
      targets: target,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    target.on('pointerdown', () => {
      FeedbackManager.showMatchSuccess(this, target, "Great Touch!");
      this.targetsTouched++;

      // Move to new smooth position
      target.x = 240 + Math.random() * (this.cameras.main.width - 480);
      target.y = 200 + Math.random() * (this.cameras.main.height - 360);

      if (this.targetsTouched >= 4) {
        this.time.delayedCall(800, () => {
          if (this.onCompleteCb) this.onCompleteCb();
        });
      }
    });

    globalAudio.speakText("Touch the pulsing star target.");
  }
}
