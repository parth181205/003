// "Finish the Saying" Proverbs Game Scene
import Phaser from 'phaser';
import { SAYINGS_DATA } from '../content/contentDb.js';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { FeedbackManager } from '../engine/FeedbackManager.js';
import { globalAudio } from '../engine/AudioManager.js';

export class SayingsScene extends Phaser.Scene {
  constructor() {
    super('SayingsScene');
  }

  initData(data) {
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.currentIdx = 0;
    this.renderSaying();
  }

  renderSaying() {
    this.children.removeAll();
    const saying = SAYINGS_DATA[this.currentIdx];

    // Header Title
    this.add.text(this.cameras.main.width / 2, 100, "💬 Finish the Familiar Saying", {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '26px',
      fontWeight: '800',
      color: '#EAB308'
    }).setOrigin(0.5);

    // Prompt Rect
    const promptBg = this.add.graphics();
    promptBg.fillStyle(0x2F2A25, 1.0);
    promptBg.fillRoundedRect(this.cameras.main.width / 2 - 320, 160, 640, 140, 16);
    promptBg.lineStyle(2, 0x4A433B, 1.0);
    promptBg.strokeRoundedRect(this.cameras.main.width / 2 - 320, 160, 640, 140, 16);

    this.add.text(this.cameras.main.width / 2, 230, `"${saying.prompt}"`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '24px',
      fontWeight: '700',
      color: '#FBF8F3',
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);

    // Option Cards
    saying.options.forEach((optText, idx) => {
      const optCard = ObjectFactory.create(this, {
        type: 'card',
        x: this.cameras.main.width / 2 - 200 + idx * 200,
        y: 420,
        width: 170,
        height: 110,
        content: { icon: '💡' },
        label: optText,
        draggable: false
      });

      optCard.on('pointerdown', () => {
        if (idx === saying.correct) {
          FeedbackManager.showMatchSuccess(this, optCard, "Well Done!");
          this.currentIdx++;
          if (this.currentIdx < SAYINGS_DATA.length) {
            this.time.delayedCall(1000, () => this.renderSaying());
          } else {
            this.time.delayedCall(1000, () => {
              if (this.onCompleteCb) this.onCompleteCb();
            });
          }
        } else {
          FeedbackManager.showMismatchGentle(this, optCard, saying.hint);
        }
      });
    });

    globalAudio.speakText(saying.prompt);
  }
}
