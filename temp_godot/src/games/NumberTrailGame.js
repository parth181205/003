// Number Trail — Visual-Spatial Working Memory Game
// Inspired by: "6 Memory Games for Stroke & TBI Recovery" (RNbDfVsY4zU) & Brain Shorts (oyD_HjJ_Q38)
// Cognitive domain: Visual-spatial working memory, attention, sequencing
import Phaser from 'phaser';
import { globalAudio } from '../engine/AudioManager.js';

export class NumberTrailScene extends Phaser.Scene {
  constructor() { super('NumberTrailScene'); }

  initData(data) {
    this.diffMode     = data.difficultyMode || 'gentle';
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    this.seqLen      = this.diffMode === 'gentle' ? 3 : this.diffMode === 'moderate' ? 4 : 5;
    this.maxSeqLen   = this.diffMode === 'gentle' ? 6 : this.diffMode === 'moderate' ? 8 : 10;
    this.roundsWon   = 0;
    this.roundsToWin = this.diffMode === 'gentle' ? 3 : 4;
    this.phase       = 'memorize'; // memorize | recall
    this.nextExpected = 1;
    this.nodeMap     = new Map(); // number -> {x,y,circle,label}

    // Sky gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0D47A1, 0x0D47A1, 0x1A237E, 0x311B92, 1);
    bg.fillRect(0, 0, W, H);
    // Stars
    for (let i = 0; i < 40; i++) {
      const sx = Math.random() * W, sy = Math.random() * H * 0.7;
      bg.fillStyle(0xFFFFFF, 0.4 + Math.random() * 0.5);
      bg.fillCircle(sx, sy, 1.5 + Math.random() * 2);
    }

    // Title
    this.titleText = this.add.text(W / 2, 18, '🔢 Number Trail', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '22px', fontWeight: '800', color: '#E8EAF6'
    }).setOrigin(0.5, 0);

    this.phaseText = this.add.text(W / 2, 52, 'MEMORIZE the positions...', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '16px', color: '#9FA8DA'
    }).setOrigin(0.5, 0);

    this.hintText = this.add.text(W / 2, H - 30, '', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '18px', color: '#FFD700', fontStyle: 'bold'
    }).setOrigin(0.5, 1);

    this.seqLenText = this.add.text(30, 18, `Sequence: ${this.seqLen}`, {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '14px', color: '#B0BEC5'
    });
    this.progressText = this.add.text(W - 30, 18, `Level 1/${this.roundsToWin}`, {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '14px', color: '#B0BEC5'
    }).setOrigin(1, 0);

    this._startRound();
  }

  _startRound() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    this.phase = 'memorize';
    this.nextExpected = 1;
    this.nodeMap.clear();
    this.children.getAll()
      .filter(c => c.getData && c.getData('isNode'))
      .forEach(c => c.destroy());

    this.phaseText.setText('MEMORIZE the positions...');
    this.seqLenText.setText(`Sequence: ${this.seqLen}`);
    this.progressText.setText(`Level ${this.roundsWon + 1}/${this.roundsToWin}`);
    this.hintText.setText('');

    // Generate random non-overlapping positions
    const margin = 90;
    const positions = this._genPositions(this.seqLen, margin, W - margin, 80, H - 80);

    // Draw numbered nodes
    positions.forEach((pos, idx) => {
      const num = idx + 1;
      const container = this.add.container(pos.x, pos.y).setData('isNode', true);

      const circle = this.add.graphics();
      this._drawNode(circle, 0, 0, 36, 0x5C6BC0, num, true);

      const numLabel = this.add.text(0, 0, `${num}`, {
        fontFamily: 'Segoe UI, sans-serif', fontSize: '24px', fontWeight: '900', color: '#FFFFFF'
      }).setOrigin(0.5);

      container.add([circle, numLabel]);

      // Pop-in
      container.setScale(0);
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, delay: idx * 150, duration: 250, ease: 'Back.Out' });

      this.nodeMap.set(num, { container, circle, numLabel, x: pos.x, y: pos.y, hit: false });
    });

    globalAudio.speakText(`Memorize ${this.seqLen} numbers. Then tap them in order from 1 to ${this.seqLen}.`);

    // Hide numbers after memorize time
    const showTime = this.diffMode === 'gentle' ? 3500 : this.diffMode === 'moderate' ? 2600 : 2000;
    this.time.delayedCall(showTime, () => this._beginRecall());
  }

  _beginRecall() {
    this.phase = 'recall';
    this.phaseText.setText('Now TAP them in order: 1 → 2 → 3...');
    this.hintText.setText(`Tap number 1 first!`);

    // Hide the number labels, keep the circles
    this.nodeMap.forEach(({ numLabel, circle, x, y, container }) => {
      // Hide number
      this.tweens.add({ targets: numLabel, alpha: 0, duration: 300 });
      // Redraw circle without number (mystery mode)
      circle.clear();
      this._drawNode(circle, 0, 0, 36, 0x3949AB, null, false);
      // Make interactive
      container.setInteractive(new Phaser.Geom.Circle(0, 0, 44), Phaser.Geom.Circle.Contains);
      container.input.cursor = 'pointer';
      container.on('pointerdown', () => this._onNodeTap(container));
      container.on('pointerover', () => { circle.clear(); this._drawNode(circle, 0, 0, 36, 0x7986CB, null, false); });
      container.on('pointerout',  () => { circle.clear(); this._drawNode(circle, 0, 0, 36, 0x3949AB, null, false); });
    });

    globalAudio.speakText('Numbers are hidden. Tap them in order from 1!');
  }

  _onNodeTap(container) {
    if (this.phase !== 'recall') return;

    // Find which number this container belongs to
    let tappedNum = null;
    this.nodeMap.forEach((data, num) => {
      if (data.container === container && !data.hit) tappedNum = num;
    });
    if (tappedNum === null) return;

    const data = this.nodeMap.get(tappedNum);

    if (tappedNum === this.nextExpected) {
      // Correct!
      data.hit = true;
      data.circle.clear();
      this._drawNode(data.circle, 0, 0, 36, 0x43A047, tappedNum, true);
      data.numLabel.setAlpha(1).setText(`${tappedNum}`).setColor('#FFFFFF');

      globalAudio.playTone(400 + tappedNum * 60, 0.12, 'sine', 0.22);
      this.tweens.add({ targets: container, scaleX: 1.25, scaleY: 1.25, yoyo: true, duration: 200 });

      // Trail line to next node
      if (this.nextExpected > 1) {
        const prev = this.nodeMap.get(this.nextExpected - 1);
        if (prev) {
          const line = this.add.graphics().setData('isNode', true);
          line.lineStyle(3, 0x76FF03, 0.7);
          line.lineBetween(prev.x, prev.y, data.x, data.y);
        }
      }

      this.nextExpected++;
      this.hintText.setText(this.nextExpected <= this.seqLen ? `Now tap ${this.nextExpected}` : '');

      if (this.nextExpected > this.seqLen) {
        // Round won!
        this.roundsWon++;
        this.seqLen = Math.min(this.maxSeqLen, this.seqLen + 1);

        if (this.roundsWon >= this.roundsToWin) {
          globalAudio.speakText('Outstanding! You completed Number Trail!');
          this.time.delayedCall(1000, () => { if (this.onCompleteCb) this.onCompleteCb(); });
        } else {
          globalAudio.speakText(`Well done! Next round — ${this.seqLen} numbers!`);
          this.time.delayedCall(1200, () => this._startRound());
        }
      }
    } else {
      // Wrong tap — gentle wobble
      globalAudio.playTone(160, 0.08, 'sawtooth', 0.18);
      this.tweens.add({ targets: container, x: data.x + 8, yoyo: true, repeat: 3, duration: 60,
        onComplete: () => container.setPosition(data.x, data.y) });
      this.hintText.setText(`Try again — tap number ${this.nextExpected}`);
    }
  }

  _drawNode(g, x, y, r, color, num, showNum) {
    g.fillStyle(color, 1);
    g.fillCircle(x, y, r);
    g.lineStyle(3, 0xFFFFFF, 0.6);
    g.strokeCircle(x, y, r);
    // Shine
    g.fillStyle(0xFFFFFF, 0.18);
    g.fillEllipse(x - r * 0.25, y - r * 0.3, r * 0.6, r * 0.35);
  }

  _genPositions(count, minX, maxX, minY, maxY) {
    const positions = [];
    const minDist = 110;
    let attempts = 0;
    while (positions.length < count && attempts < 2000) {
      attempts++;
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);
      const ok = positions.every(p => Math.hypot(p.x - x, p.y - y) > minDist);
      if (ok) positions.push({ x, y });
    }
    return positions;
  }

  triggerHint() {
    if (this.phase !== 'recall') return;
    // Briefly flash the next expected node
    const nextData = this.nodeMap.get(this.nextExpected);
    if (nextData) {
      this.tweens.add({
        targets: nextData.container,
        alpha: 0.3, yoyo: true, repeat: 4, duration: 250,
        onComplete: () => { nextData.numLabel.setAlpha(1).setText(`${this.nextExpected}`); }
      });
      globalAudio.speakText(`Look for number ${this.nextExpected}!`);
    }
  }
}
