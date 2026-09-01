// Garden Tap — Speed of Processing / Reaction Game
// Inspired by: "BOOST YOUR MIND!" (bgXJWotViOY) & "MEMORY TEST BRAIN Alzheimer's practice" (-5IdyD2wZUA)
// Cognitive domain: Speed of processing, inhibitory control (Go/No-Go)
import Phaser from 'phaser';
import { globalAudio } from '../engine/AudioManager.js';

const GRID_COLS = 4;
const GRID_ROWS = 3;
const CELL_W = 220;
const CELL_H = 180;

const FLOWER_TYPES = [
  { name: 'Sunflower', emoji: '🌻', color: 0xFDD835, isTarget: true,  label: 'TAP!' },
  { name: 'Rose',      emoji: '🌹', color: 0xE53935, isTarget: false, label: 'No!' },
  { name: 'Tulip',     emoji: '🌷', color: 0xEC407A, isTarget: false, label: 'No!' },
];

export class GardenTapScene extends Phaser.Scene {
  constructor() { super('GardenTapScene'); }

  initData(data) {
    this.diffMode     = data.difficultyMode || 'gentle';
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    this.score       = 0;
    this.misses      = 0;
    this.combo       = 0;
    this.round       = 1;
    this.totalRounds = this.diffMode === 'gentle' ? 8 : this.diffMode === 'moderate' ? 12 : 16;
    this.maxMisses   = 3;
    this.baseDelay   = this.diffMode === 'gentle' ? 2200 : this.diffMode === 'moderate' ? 1700 : 1300;
    this.activeFlower = null;

    // Garden Background
    const bgG = this.add.graphics();
    bgG.fillStyle(0x81C784, 1);
    bgG.fillRect(0, 0, W, H);
    bgG.fillStyle(0xA5D6A7, 1);
    bgG.fillRect(0, H * 0.6, W, H * 0.4);
    // Grass tufts
    for (let i = 0; i < 12; i++) {
      bgG.fillStyle(0x66BB6A, 1);
      bgG.fillTriangle(
        80 + i * 110, H - 10,
        70 + i * 110, H - 40,
        90 + i * 110, H - 40
      );
    }

    // HUD
    this.add.text(W / 2, 18, '🌻 TAP THE SUNFLOWERS!', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '20px', fontWeight: '800', color: '#FFF9C4'
    }).setOrigin(0.5, 0);

    this.scoreText = this.add.text(30, 18, 'Score: 0', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '16px', color: '#FFFDE7', fontStyle: 'bold'
    });
    this.missText = this.add.text(W - 30, 18, '❤️❤️❤️', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '18px'
    }).setOrigin(1, 0);
    this.roundText = this.add.text(W / 2, 46, `Round 1 / ${this.totalRounds}`, {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '13px', color: '#C8E6C9'
    }).setOrigin(0.5, 0);
    this.comboText = this.add.text(W / 2, H - 30, '', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#FFD700'
    }).setOrigin(0.5, 1);

    // Instruction banner
    this.instructBox = this.add.text(W / 2, H / 2, '🌻 Tap the YELLOW Sunflowers\n🌹 Avoid the Roses & Tulips!', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '22px', color: '#1A237E',
      backgroundColor: '#FFFDE7', padding: { x: 20, y: 14 }, align: 'center'
    }).setOrigin(0.5, 0.5);

    globalAudio.speakText('Tap only the yellow sunflowers. Avoid the roses and tulips!');

    this.time.delayedCall(2400, () => {
      this.instructBox.destroy();
      this._spawnNext();
    });
  }

  _buildFlowerGrid() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const startX = (W - GRID_COLS * CELL_W) / 2 + CELL_W / 2;
    const startY = 80 + (H - 80 - GRID_ROWS * CELL_H) / 2 + CELL_H / 2;
    const positions = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        positions.push({
          x: startX + c * CELL_W,
          y: startY + r * CELL_H
        });
      }
    }
    return positions;
  }

  _spawnNext() {
    if (this.round > this.totalRounds) {
      this._endGame(true);
      return;
    }
    this.roundText.setText(`Round ${this.round} / ${this.totalRounds}`);

    // Pick random grid position
    const positions = this._buildFlowerGrid();
    const pos = Phaser.Utils.Array.GetRandom(positions);

    // Decide type: ~60% target on gentle, 45% on harder
    const targetChance = this.diffMode === 'gentle' ? 0.62 : 0.50;
    const isTarget = Math.random() < targetChance;
    const type = isTarget
      ? FLOWER_TYPES[0]
      : Phaser.Utils.Array.GetRandom([FLOWER_TYPES[1], FLOWER_TYPES[2]]);

    // Dynamic display speed
    const speed = Math.max(900, this.baseDelay - (this.round - 1) * 60);

    // Draw flower
    const container = this.add.container(pos.x, pos.y);
    container.setScale(0);

    const g = this.add.graphics();
    // Stem
    g.fillStyle(0x388E3C, 1);
    g.fillRect(-5, 20, 10, 55);
    // Leaf
    g.fillStyle(0x4CAF50, 1);
    g.fillEllipse(10, 45, 30, 14);
    // Petals
    g.fillStyle(type.color, 1);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.fillEllipse(
        Math.cos(a) * 30, Math.sin(a) * 30 - 10,
        22, 36
      );
    }
    // Center disc
    g.fillStyle(isTarget ? 0xF57F17 : 0x6D4C41, 1);
    g.fillCircle(0, -10, 18);
    // Emoji face center
    const face = this.add.text(0, -10, isTarget ? '😊' : '😠', { fontSize: '16px' }).setOrigin(0.5);

    container.add([g, face]);
    this.activeFlower = { container, isTarget, timer: null };

    // Pop-in tween
    this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 200, ease: 'Back.Out' });

    // Click handler
    container.setInteractive(new Phaser.Geom.Circle(0, -10, 55), Phaser.Geom.Circle.Contains);
    container.on('pointerdown', () => this._onFlowerTap(true, type.isTarget, container, pos));
    container.input.cursor = 'pointer';

    // Auto-miss timer
    this.activeFlower.timer = this.time.delayedCall(speed, () => {
      if (this.activeFlower?.container === container) {
        this._onFlowerTap(false, type.isTarget, container, pos);
      }
    });
  }

  _onFlowerTap(wasTapped, isTarget, container, pos) {
    if (!this.activeFlower || this.activeFlower.container !== container) return;
    const prev = this.activeFlower;
    this.activeFlower = null;
    prev.timer?.remove?.();

    if (wasTapped && isTarget) {
      // Correct tap!
      this.score += 10 + this.combo * 2;
      this.combo++;
      globalAudio.playTone(660, 0.14, 'sine', 0.22);

      const burst = this.add.text(pos.x, pos.y - 40, `+${10 + (this.combo - 1) * 2}`, {
        fontFamily: 'Segoe UI, sans-serif', fontSize: '20px', color: '#FFD700', fontStyle: 'bold'
      }).setOrigin(0.5);
      this.tweens.add({ targets: burst, y: pos.y - 100, alpha: 0, duration: 600, onComplete: () => burst.destroy() });

      if (this.combo >= 3) {
        this.comboText.setText(`🔥 ${this.combo}x COMBO!`);
        this.tweens.add({ targets: this.comboText, scaleX: 1.3, scaleY: 1.3, yoyo: true, duration: 200 });
      }
    } else if (!wasTapped && isTarget) {
      // Missed a sunflower
      this.combo = 0; this.comboText.setText('');
      this.misses++;
      globalAudio.playTone(180, 0.1, 'sawtooth', 0.2);
      const miss = this.add.text(pos.x, pos.y, 'Missed!', {
        fontFamily: 'Segoe UI, sans-serif', fontSize: '18px', color: '#EF9A9A'
      }).setOrigin(0.5);
      this.tweens.add({ targets: miss, alpha: 0, y: pos.y - 60, duration: 700, onComplete: () => miss.destroy() });
    } else if (wasTapped && !isTarget) {
      // Tapped a wrong flower
      this.combo = 0; this.comboText.setText('');
      this.misses++;
      globalAudio.playTone(180, 0.1, 'sawtooth', 0.2);
      const wrong = this.add.text(pos.x, pos.y - 30, '✗ Wrong!', {
        fontFamily: 'Segoe UI, sans-serif', fontSize: '18px', color: '#EF4444', fontStyle: 'bold'
      }).setOrigin(0.5);
      this.tweens.add({ targets: wrong, alpha: 0, y: pos.y - 90, duration: 700, onComplete: () => wrong.destroy() });
    } else {
      // Correctly ignored non-target
      this.combo++;
    }

    // Shrink & remove flower
    this.tweens.add({
      targets: container, scaleX: 0, scaleY: 0, duration: 180,
      onComplete: () => container.destroy()
    });

    this.scoreText.setText(`Score: ${this.score}`);
    this.missText.setText('❤️'.repeat(Math.max(0, this.maxMisses - this.misses)));

    if (this.misses >= this.maxMisses) {
      this._endGame(false);
      return;
    }

    this.round++;
    const nextDelay = Math.max(400, 600 - (this.round - 1) * 15);
    this.time.delayedCall(nextDelay, () => this._spawnNext());
  }

  _endGame(won) {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const msg = won
      ? `🌻 Brilliant! Score: ${this.score}`
      : `🌷 Good effort! Score: ${this.score}`;
    globalAudio.speakText(won ? `Brilliant effort! Your score is ${this.score}` : `Good try! Your score is ${this.score}`);

    const panel = this.add.graphics();
    panel.fillStyle(0x1B2E1A, 0.88);
    panel.fillRoundedRect(W / 2 - 200, H / 2 - 80, 400, 160, 18);

    this.add.text(W / 2, H / 2 - 30, msg, {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '22px', fontWeight: '800', color: '#FFFDE7', align: 'center'
    }).setOrigin(0.5);

    this.time.delayedCall(1200, () => { if (this.onCompleteCb) this.onCompleteCb(); });
  }

  triggerHint() {
    globalAudio.speakText('Tap only the yellow sunflowers! Avoid roses and tulips.');
    this.add.text(this.cameras.main.width / 2, 75, '🌻 = TAP    🌹🌷 = AVOID', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '16px', color: '#FFFDE7',
      backgroundColor: '#1B5E20CC', padding: { x: 12, y: 8 }
    }).setOrigin(0.5)
      .setDepth(100);
    this.time.delayedCall(2000, () => {
      this.children.getAll().filter(c => c.text === '🌻 = TAP    🌹🌷 = AVOID').forEach(c => c.destroy());
    });
  }
}
