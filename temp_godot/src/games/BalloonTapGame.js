// Gentle Balloon Tap Game Scene
import Phaser from 'phaser';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { globalAudio } from '../engine/AudioManager.js';

export class BalloonTapScene extends Phaser.Scene {
  constructor() {
    super('BalloonTapScene');
  }

  initData(data) {
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.poppedCount = 0;
    this.balloons = [];

    const colors = [0xEC4899, 0x3B82F6, 0x10B981, 0xEAB308, 0x8B5CF6];

    for (let i = 0; i < 8; i++) {
      const b = ObjectFactory.create(this, {
        type: 'ball',
        x: 180 + Math.random() * (this.cameras.main.width - 360),
        y: 600 + Math.random() * 200,
        balloonColor: colors[i % colors.length],
        draggable: false
      });

      b.speed = 1.0 + Math.random() * 0.8;
      b.on('pointerdown', () => this.popBalloon(b));
      this.balloons.push(b);
    }
  }

  update() {
    this.balloons.forEach(b => {
      if (b.active) {
        b.y -= b.speed;
        if (b.y < -50) {
          b.y = 750;
          b.x = 180 + Math.random() * (this.cameras.main.width - 360);
        }
      }
    });
  }

  popBalloon(b) {
    if (!b.active) return;
    
    globalAudio.playTone(600 + Math.random() * 200, 0.15, 'sine', 0.3);

    // Pop scale effect
    this.tweens.add({
      targets: b,
      scaleX: 1.4,
      scaleY: 1.4,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        b.destroy();
        this.poppedCount++;
        if (this.poppedCount >= 6) {
          if (this.onCompleteCb) this.onCompleteCb();
        }
      }
    });
  }
}
