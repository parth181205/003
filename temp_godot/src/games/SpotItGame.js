// Spot It! — Find the Differences Game Scene
// Inspired by: GREAT DETECTIVE COOKIE YouTube (kICPeEVFZCU) & Spot-the-Difference Shorts (oyD_HjJ_Q38)
// Cognitive domain: Visual attention, perception, executive function
import Phaser from 'phaser';
import { globalAudio } from '../engine/AudioManager.js';

// ─── Scene Definitions ───────────────────────────────────────────────────────
const SCENES = [
  {
    name: 'Morning Garden', bg: 0x87CEEB,
    items: [
      { id: 'sun',     x: 0.15, y: 0.12, draw: 'sun',    baseColor: 0xFFD700, altColor: 0xFF8C00, baseSize: 38, altSize: 38 },
      { id: 'flower1', x: 0.30, y: 0.65, draw: 'flower', baseColor: 0xFF69B4, altColor: 0x9B59B6, baseSize: 26, altSize: 26 },
      { id: 'flower2', x: 0.55, y: 0.68, draw: 'flower', baseColor: 0xFF6347, altColor: 0xFF6347, baseSize: 26, altSize: 18 },
      { id: 'tree',    x: 0.72, y: 0.45, draw: 'tree',   baseColor: 0x228B22, altColor: 0x00CC44, baseSize: 50, altSize: 50 },
      { id: 'bird',    x: 0.45, y: 0.22, draw: 'bird',   baseColor: 0x1565C0, altColor: 0x1565C0, baseSize: 16, altSize: 16, baseMissing: false, altMissing: true },
      { id: 'cloud',   x: 0.65, y: 0.10, draw: 'cloud',  baseColor: 0xFFFFFF, altColor: 0xB0BEC5, baseSize: 38, altSize: 38 },
      { id: 'fence',   x: 0.50, y: 0.82, draw: 'fence',  baseColor: 0xA0522D, altColor: 0xA0522D, baseSize: 28, altSize: 28, baseMissing: false, altMissing: true },
    ]
  },
  {
    name: 'Cozy Kitchen', bg: 0xFFF8E7,
    items: [
      { id: 'teapot',  x: 0.22, y: 0.50, draw: 'teapot', baseColor: 0xE53935, altColor: 0x1E88E5, baseSize: 38, altSize: 38 },
      { id: 'apple',   x: 0.42, y: 0.62, draw: 'apple',  baseColor: 0xC62828, altColor: 0xC62828, baseSize: 22, altSize: 34 },
      { id: 'window',  x: 0.72, y: 0.32, draw: 'window', baseColor: 0x90CAF9, altColor: 0xA5D6A7, baseSize: 42, altSize: 42 },
      { id: 'cup',     x: 0.60, y: 0.58, draw: 'cup',    baseColor: 0xFFA726, altColor: 0x8D6E63, baseSize: 20, altSize: 20 },
      { id: 'star',    x: 0.80, y: 0.62, draw: 'star',   baseColor: 0xFFC107, altColor: 0xFFC107, baseSize: 18, altSize: 18, baseMissing: false, altMissing: true },
      { id: 'curtain', x: 0.10, y: 0.42, draw: 'curtain',baseColor: 0xF48FB1, altColor: 0x80CBC4, baseSize: 32, altSize: 32 },
      { id: 'flower3', x: 0.33, y: 0.35, draw: 'flower', baseColor: 0xFFEB3B, altColor: 0xFFEB3B, baseSize: 20, altSize: 20, baseMissing: true, altMissing: false },
    ]
  },
  {
    name: 'Village Street', bg: 0xE3F2FD,
    items: [
      { id: 'house',   x: 0.20, y: 0.48, draw: 'house',  baseColor: 0xEF9A9A, altColor: 0xFFCC80, baseSize: 52, altSize: 52 },
      { id: 'cloud2',  x: 0.50, y: 0.10, draw: 'cloud',  baseColor: 0xFFFFFF, altColor: 0xFFFFFF, baseSize: 46, altSize: 30 },
      { id: 'tree2',   x: 0.75, y: 0.48, draw: 'tree',   baseColor: 0x388E3C, altColor: 0x388E3C, baseSize: 44, altSize: 58 },
      { id: 'dog',     x: 0.40, y: 0.73, draw: 'dog',    baseColor: 0xA1887F, altColor: 0xFFB74D, baseSize: 26, altSize: 26 },
      { id: 'lamp',    x: 0.62, y: 0.55, draw: 'lamp',   baseColor: 0xFFD54F, altColor: 0xFFD54F, baseSize: 26, altSize: 26, baseMissing: false, altMissing: true },
      { id: 'flower4', x: 0.85, y: 0.70, draw: 'flower', baseColor: 0xE91E63, altColor: 0x9C27B0, baseSize: 24, altSize: 24 },
      { id: 'bird2',   x: 0.30, y: 0.20, draw: 'bird',   baseColor: 0xFF5722, altColor: 0xFF5722, baseSize: 18, altSize: 18, baseMissing: true, altMissing: false },
    ]
  }
];

export class SpotItScene extends Phaser.Scene {
  constructor() { super('SpotItScene'); }

  initData(data) {
    this.gameConfig  = data || {};
    this.diffMode    = data.difficultyMode || 'gentle';
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    this.found = 0;
    this.totalDiffs = this.diffMode === 'gentle' ? 4 : this.diffMode === 'moderate' ? 5 : 7;
    this.sceneData = SCENES[Math.floor(Math.random() * SCENES.length)];

    // Header
    this.add.text(W / 2, 18, `🔍 ${this.sceneData.name} — Find ${this.totalDiffs} Differences`, {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '17px', fontWeight: '700', color: '#FFFBEB'
    }).setOrigin(0.5, 0);

    this.counterText = this.add.text(W / 2, 46, `Found: 0 / ${this.totalDiffs}`, {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '14px', color: '#EAB308'
    }).setOrigin(0.5, 0);

    // Two panels
    const gap = 40;
    const panelW = (W - gap - 20) / 2;
    const panelH = H - 100;
    const panelY = 68;
    this.altPanelX = 10 + panelW + gap;

    this._drawPanel(10, panelY, panelW, panelH, 'base');
    this._drawPanel(this.altPanelX, panelY, panelW, panelH, 'alt');

    this.add.text(10 + panelW / 2, panelY + panelH - 12, 'ORIGINAL', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '12px', color: '#94A3B8'
    }).setOrigin(0.5, 1);
    this.add.text(this.altPanelX + panelW / 2, panelY + panelH - 12, 'FIND THE DIFFERENCES →', {
      fontFamily: 'Segoe UI, sans-serif', fontSize: '12px', color: '#EAB308'
    }).setOrigin(0.5, 1);

    globalAudio.speakText(`Find ${this.totalDiffs} differences. Tap on the right picture.`);
  }

  _drawPanel(px, py, pw, ph, side) {
    const scene = this.sceneData;
    const maxItems = this.diffMode === 'gentle' ? 5 : this.diffMode === 'moderate' ? 6 : 7;
    const items = scene.items.slice(0, maxItems);

    // BG
    const bg = this.add.graphics();
    bg.fillStyle(scene.bg, 1);
    bg.fillRoundedRect(px, py, pw, ph - 16, 12);
    bg.lineStyle(2, 0x4A5568, 0.35);
    bg.strokeRoundedRect(px, py, pw, ph - 16, 12);
    // Ground strip
    bg.fillStyle(0x7CB342, 1);
    bg.fillRoundedRect(px, py + (ph - 16) * 0.78, pw, (ph - 16) * 0.22, { tl: 0, tr: 0, bl: 12, br: 12 });

    items.forEach(item => {
      const isAlt = (side === 'alt');
      const missing = isAlt ? item.altMissing : item.baseMissing;
      if (missing) return;

      const color = isAlt ? item.altColor : item.baseColor;
      const size  = isAlt ? item.altSize  : item.baseSize;
      const ix = px + item.x * pw;
      const iy = py + item.y * (ph - 16);
      const g = this.add.graphics();
      this._drawShape(g, item.draw, ix, iy, size, color);

      if (isAlt) {
        const isDiff = (item.altColor !== item.baseColor)
          || (item.altSize !== item.baseSize)
          || (!!item.altMissing !== !!item.baseMissing)
          || (!!item.baseMissing);
        this._makeHitZone(ix, iy, size, item.id, isDiff);
      }
    });

    // Items missing from alt → invisible hit zones
    if (side === 'alt') {
      items.forEach(item => {
        if (!item.baseMissing && item.altMissing) {
          const ix = px + item.x * pw;
          const iy = py + item.y * (ph - 16);
          this._makeHitZone(ix, iy, item.baseSize, item.id + '_gone', true);
        }
      });
    }
  }

  _makeHitZone(cx, cy, size, id, isDiff) {
    const zone = this.add.rectangle(cx, cy, size * 2.8, size * 2.8, 0xffffff, 0)
      .setInteractive({ useHandCursor: true })
      .setData({ itemId: id, isDiff, cx, cy, found: false });
    zone.on('pointerdown', () => this._onTap(zone));
    zone.on('pointerover', () => { if (!zone.getData('found')) zone.setFillStyle(0xffffff, 0.08); });
    zone.on('pointerout',  () => { zone.setFillStyle(0xffffff, 0); });
  }

  _drawShape(g, type, x, y, size, color) {
    g.fillStyle(color, 1);
    switch (type) {
      case 'sun':
        g.fillCircle(x, y, size * 0.6);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          g.fillTriangle(
            x + Math.cos(a) * size * 0.65, y + Math.sin(a) * size * 0.65,
            x + Math.cos(a + 0.2) * size * 0.5, y + Math.sin(a + 0.2) * size * 0.5,
            x + Math.cos(a) * size * 1.1,  y + Math.sin(a) * size * 1.1
          );
        }
        break;
      case 'flower':
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          g.fillCircle(x + Math.cos(a) * size * 0.7, y + Math.sin(a) * size * 0.7, size * 0.42);
        }
        g.fillStyle(0xFFFF88, 1); g.fillCircle(x, y, size * 0.38);
        break;
      case 'tree':
        g.fillStyle(0x795548, 1);
        g.fillRect(x - size * 0.14, y, size * 0.28, size * 0.55);
        g.fillStyle(color, 1);
        g.fillTriangle(x, y - size, x - size * 0.72, y + size * 0.08, x + size * 0.72, y + size * 0.08);
        g.fillTriangle(x, y - size * 1.25, x - size * 0.55, y - size * 0.42, x + size * 0.55, y - size * 0.42);
        break;
      case 'bird':
        g.fillEllipse(x, y, size * 1.4, size * 0.65);
        g.fillTriangle(x + size * 0.65, y, x + size * 1.15, y - size * 0.28, x + size * 0.65, y - size * 0.28);
        break;
      case 'cloud':
        g.fillCircle(x, y, size * 0.43);
        g.fillCircle(x + size * 0.48, y + size * 0.1, size * 0.36);
        g.fillCircle(x - size * 0.42, y + size * 0.12, size * 0.34);
        g.fillRect(x - size * 0.72, y + size * 0.18, size * 1.5, size * 0.32);
        break;
      case 'fence':
        for (let i = -2; i <= 2; i++) {
          g.fillRect(x + i * size * 0.52 - size * 0.11, y - size * 0.48, size * 0.2, size * 0.96);
        }
        g.fillRect(x - size * 1.15, y - size * 0.14, size * 2.3, size * 0.13);
        g.fillRect(x - size * 1.15, y + size * 0.14, size * 2.3, size * 0.13);
        break;
      case 'teapot':
        g.fillEllipse(x, y, size * 1.35, size * 1.15);
        g.fillStyle(0x333333, 1); g.fillCircle(x, y - size * 0.62, size * 0.14);
        g.fillStyle(color, 1);
        g.fillRect(x + size * 0.58, y - size * 0.18, size * 0.48, size * 0.13);
        g.fillRect(x - size * 0.95, y - size * 0.13, size * 0.42, size * 0.11);
        break;
      case 'apple':
        g.fillCircle(x, y + size * 0.1, size * 0.82);
        g.fillStyle(0x2E7D32, 1);
        g.fillRect(x - size * 0.06, y - size * 0.8, size * 0.11, size * 0.42);
        g.fillTriangle(x, y - size * 0.88, x + size * 0.32, y - size * 0.54, x - size * 0.07, y - size * 0.54);
        break;
      case 'window':
        g.fillRect(x - size * 0.58, y - size * 0.52, size * 1.16, size * 1.05);
        g.lineStyle(3, 0x6D4C41, 1);
        g.strokeRect(x - size * 0.58, y - size * 0.52, size * 1.16, size * 1.05);
        g.lineBetween(x, y - size * 0.52, x, y + size * 0.53);
        g.lineBetween(x - size * 0.58, y, x + size * 0.58, y);
        break;
      case 'cup':
        g.fillRect(x - size * 0.52, y - size * 0.58, size * 1.05, size * 1.16);
        g.lineStyle(3, 0x555555, 1);
        g.strokeRect(x - size * 0.52, y - size * 0.58, size * 1.05, size * 1.16);
        g.strokeCircle(x + size * 0.72, y - size * 0.09, size * 0.36);
        break;
      case 'star': {
        const pts = [];
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? size : size * 0.4;
          const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
          pts.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
        }
        g.fillPoints(pts, true);
        break;
      }
      case 'curtain':
        g.fillRect(x - size * 0.48, y - size * 0.78, size * 0.96, size * 1.75);
        g.fillStyle(Phaser.Display.Color.IntegerToColor(color).darken(25).color, 0.45);
        for (let i = 0; i < 3; i++) {
          g.fillRect(x - size * 0.38 + i * size * 0.3, y - size * 0.78, size * 0.1, size * 1.75);
        }
        break;
      case 'house':
        g.fillRect(x - size * 0.62, y - size * 0.18, size * 1.24, size * 0.78);
        g.fillStyle(0xBF360C, 1);
        g.fillTriangle(x, y - size * 0.78, x - size * 0.78, y - size * 0.18, x + size * 0.78, y - size * 0.18);
        g.fillStyle(0x90CAF9, 1);
        g.fillRect(x - size * 0.19, y - size * 0.04, size * 0.38, size * 0.38);
        break;
      case 'dog':
        g.fillCircle(x, y, size * 0.68);
        g.fillEllipse(x + size * 0.86, y - size * 0.18, size * 0.76, size * 0.52);
        g.fillCircle(x + size * 1.2, y - size * 0.2, size * 0.4);
        g.fillEllipse(x + size * 1.28, y + size * 0.06, size * 0.13, size * 0.42);
        break;
      case 'lamp':
        g.fillCircle(x, y - size * 0.44, size * 0.52);
        g.fillStyle(0x555555, 1);
        g.fillRect(x - size * 0.07, y - size * 0.04, size * 0.14, size * 0.78);
        g.fillRect(x - size * 0.28, y + size * 0.68, size * 0.56, size * 0.1);
        break;
      default:
        g.fillCircle(x, y, size * 0.58);
    }
  }

  _onTap(zone) {
    if (zone.getData('found')) return;
    const isDiff = zone.getData('isDiff');
    const cx = zone.getData('cx');
    const cy = zone.getData('cy');

    if (isDiff) {
      zone.setData('found', true);
      this.found++;
      globalAudio.playTone(880, 0.15, 'sine', 0.28);

      // Burst ring
      const ring = this.add.graphics();
      ring.lineStyle(4, 0xFFD700, 1);
      ring.strokeCircle(cx, cy, 30);
      this.tweens.add({ targets: ring, scaleX: 1.8, scaleY: 1.8, alpha: 0, duration: 500, onComplete: () => ring.destroy() });

      // Persistent marker
      const m = this.add.graphics();
      m.lineStyle(3, 0x10B981, 1);
      m.strokeCircle(cx, cy, 26);
      this.add.text(cx, cy - 34, '✓', { fontSize: '14px', color: '#10B981', fontStyle: 'bold' }).setOrigin(0.5);

      this.counterText.setText(`Found: ${this.found} / ${this.totalDiffs}`);
      if (this.found >= this.totalDiffs) {
        globalAudio.speakText('Excellent! All differences found!');
        this.time.delayedCall(700, () => { if (this.onCompleteCb) this.onCompleteCb(); });
      } else {
        globalAudio.speakText(`Found one! ${this.totalDiffs - this.found} more to go.`);
      }
    } else {
      globalAudio.playTone(200, 0.08, 'sawtooth', 0.18);
      const r = this.add.graphics();
      r.lineStyle(2, 0xEF4444, 0.7);
      r.strokeCircle(cx, cy, 22);
      this.tweens.add({ targets: r, alpha: 0, duration: 350, onComplete: () => r.destroy() });
    }
  }

  triggerHint() {
    const rightX = this.altPanelX || 0;
    this.children.getAll().forEach(child => {
      if (child.getData && child.getData('isDiff') && !child.getData('found')) {
        const cx = child.getData('cx');
        if (cx !== undefined && cx > rightX) {
          const h = this.add.graphics();
          h.lineStyle(3, 0xEF4444, 0.65);
          h.strokeCircle(cx, child.getData('cy'), 34);
          this.tweens.add({ targets: h, alpha: 0, duration: 1800, onComplete: () => h.destroy() });
        }
      }
    });
    globalAudio.speakText('Look at the highlighted areas!');
  }
}
