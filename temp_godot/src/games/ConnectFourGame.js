// Connect Four Board Game Scene
import Phaser from 'phaser';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { FeedbackManager } from '../engine/FeedbackManager.js';
import { globalAudio } from '../engine/AudioManager.js';

export class ConnectFourScene extends Phaser.Scene {
  constructor() {
    super('ConnectFourScene');
  }

  initData(data) {
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.rows = 6;
    this.cols = 7;
    this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
    this.tokens = [];

    const startX = this.cameras.main.width / 2 - (this.cols * 64) / 2 + 32;
    const startY = 180;

    // Board Graphics Background
    const boardBg = this.add.graphics();
    boardBg.fillStyle(0x24201D, 1.0);
    boardBg.fillRoundedRect(startX - 48, startY - 48, this.cols * 64 + 32, this.rows * 64 + 32, 16);
    boardBg.lineStyle(4, 0x4A433B, 1.0);
    boardBg.strokeRoundedRect(startX - 48, startY - 48, this.cols * 64 + 32, this.rows * 64 + 32, 16);

    // Column Buttons & Slots
    for (let c = 0; c < this.cols; c++) {
      const colBtn = this.add.text(startX + c * 64, startY - 32, '⬇️', { fontSize: '28px' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      colBtn.on('pointerdown', () => this.dropToken(c, 1));

      for (let r = 0; r < this.rows; r++) {
        const slot = this.add.graphics();
        slot.fillStyle(0x12100E, 1.0);
        slot.fillCircle(startX + c * 64, startY + r * 64, 24);
      }
    }
  }

  dropToken(col, player) {
    for (let r = this.rows - 1; r >= 0; r--) {
      if (this.board[r][col] === 0) {
        this.board[r][col] = player;

        const startX = this.cameras.main.width / 2 - (this.cols * 64) / 2 + 32;
        const startY = 180;

        const token = ObjectFactory.create(this, {
          type: 'token',
          x: startX + col * 64,
          y: startY - 40,
          playerColor: player === 1 ? 0xEF4444 : 0xEAB308,
          draggable: false
        });

        // Drop animation
        this.tweens.add({
          targets: token,
          y: startY + r * 64,
          duration: 350,
          ease: 'Bounce.easeOut',
          onComplete: () => {
            globalAudio.playTone(300, 0.1, 'sine', 0.3);
            if (player === 1) {
              // Friendly CPU turn
              this.time.delayedCall(600, () => this.cpuTurn());
            }
          }
        });
        return;
      }
    }
  }

  cpuTurn() {
    const validCols = [];
    for (let c = 0; c < this.cols; c++) {
      if (this.board[0][c] === 0) validCols.push(c);
    }
    if (validCols.length > 0) {
      const pick = Phaser.Utils.Array.GetRandom(validCols);
      this.dropToken(pick, 2);
    }
  }
}
