// Picture Jigsaw Puzzle Game Scene
import Phaser from 'phaser';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { InteractionManager } from '../engine/InteractionManager.js';
import { FeedbackManager } from '../engine/FeedbackManager.js';
import { HintManager } from '../engine/HintManager.js';

export class JigsawScene extends Phaser.Scene {
  constructor() {
    super('JigsawScene');
  }

  initData(data) {
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.snappedCount = 0;
    this.hintManager = new HintManager(this);

    // Target Grid Positions (2x2 Jigsaw for Gentle Mode)
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const pieceW = 160;
    const pieceH = 160;

    const gridPositions = [
      { row: 0, col: 0, x: centerX - pieceW/2 - 10, y: centerY - pieceH/2 - 10, icon: '🌸', color: 0xF43F5E },
      { row: 0, col: 1, x: centerX + pieceW/2 + 10, y: centerY - pieceH/2 - 10, icon: '🌳', color: 0x10B981 },
      { row: 1, col: 0, x: centerX - pieceW/2 - 10, y: centerY + pieceH/2 + 10, icon: '🦋', color: 0x3B82F6 },
      { row: 1, col: 1, x: centerX + pieceW/2 + 10, y: centerY + pieceH/2 + 10, icon: '☀️', color: 0xEAB308 }
    ];

    // Background Target Outlines
    gridPositions.forEach(pos => {
      const outline = this.add.graphics();
      outline.lineStyle(3, 0x4A433B, 1.0);
      outline.strokeRoundedRect(pos.x - pieceW/2, pos.y - pieceH/2, pieceW, pieceH, 16);
      outline.fillStyle(0x24201D, 0.4);
      outline.fillRoundedRect(pos.x - pieceW/2, pos.y - pieceH/2, pieceW, pieceH, 16);
    });

    // Scrambled Puzzle Pieces
    this.pieces = [];
    const scatterPositions = [
      { x: 140, y: 180 }, { x: 140, y: 480 },
      { x: this.cameras.main.width - 140, y: 180 }, { x: this.cameras.main.width - 140, y: 480 }
    ];

    gridPositions.forEach((pos, idx) => {
      const scat = scatterPositions[idx];
      const piece = ObjectFactory.create(this, {
        type: 'puzzle_piece',
        x: scat.x,
        y: scat.y,
        width: pieceW,
        height: pieceH,
        content: { icon: pos.icon },
        correctX: pos.x,
        correctY: pos.y,
        draggable: true,
        selectable: true
      });
      this.pieces.push(piece);
    });

    this.interactionManager = new InteractionManager(this, {
      onDrop: (piece) => this.handleDrop(piece)
    });
  }

  handleDrop(piece) {
    const dist = Phaser.Math.Distance.Between(piece.x, piece.y, piece.correctX, piece.correctY);
    if (dist < 80) {
      piece.x = piece.correctX;
      piece.y = piece.correctY;
      piece.draggable = false;
      piece.selectable = false;

      FeedbackManager.showMatchSuccess(this, piece, "Piece Snapped!");
      this.snappedCount++;

      if (this.snappedCount >= this.pieces.length) {
        this.time.delayedCall(800, () => {
          if (this.onCompleteCb) this.onCompleteCb();
        });
      }
      return true;
    } else {
      FeedbackManager.showMismatchGentle(this, piece, "Move piece closer to its matching frame spot.");
      return false;
    }
  }

  triggerHint() {
    const unsnapped = this.pieces.filter(p => p.draggable);
    if (unsnapped.length > 0) {
      const p = unsnapped[0];
      this.hintManager.provideHint(p, { x: p.correctX, y: p.correctY, label: 'frame position' }, "Snap this piece into the highlighted frame!");
    }
  }
}
