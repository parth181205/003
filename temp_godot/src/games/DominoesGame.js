// Gentle Dominoes Game Scene
import Phaser from 'phaser';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { InteractionManager } from '../engine/InteractionManager.js';
import { FeedbackManager } from '../engine/FeedbackManager.js';

export class DominoesScene extends Phaser.Scene {
  constructor() {
    super('DominoesScene');
  }

  initData(data) {
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.placedCount = 0;

    // Chain Center Anchor
    const centerX = this.cameras.main.width / 2;
    const centerY = 280;

    // Starter Center Domino
    this.starter = ObjectFactory.create(this, {
      type: 'domino',
      x: centerX,
      y: centerY,
      leftVal: 3,
      rightVal: 3,
      draggable: false
    });

    // Valid placement targets (Left & Right of chain)
    this.targetLeft = { x: centerX - 100, y: centerY, val: 3 };
    this.targetRight = { x: centerX + 100, y: centerY, val: 3 };

    // Player Domino hand
    const handValues = [
      { left: 3, right: 2 },
      { left: 3, right: 5 },
      { left: 3, right: 4 }
    ];

    this.playerHand = [];
    handValues.forEach((val, idx) => {
      const dom = ObjectFactory.create(this, {
        type: 'domino',
        x: 280 + idx * 140,
        y: 540,
        leftVal: val.left,
        rightVal: val.right,
        draggable: true,
        selectable: true
      });
      this.playerHand.push(dom);
    });

    this.interactionManager = new InteractionManager(this, {
      onDrop: (dom) => this.handleDrop(dom)
    });
  }

  handleDrop(domino) {
    // Check match with Left or Right target
    const distLeft = Phaser.Math.Distance.Between(domino.x, domino.y, this.targetLeft.x, this.targetLeft.y);
    const distRight = Phaser.Math.Distance.Between(domino.x, domino.y, this.targetRight.x, this.targetRight.y);

    if (distLeft < 90 && (domino.leftVal === this.targetLeft.val || domino.rightVal === this.targetLeft.val)) {
      domino.x = this.targetLeft.x;
      domino.y = this.targetLeft.y;
      domino.draggable = false;
      this.targetLeft.x -= 100;
      FeedbackManager.showMatchSuccess(this, domino, "Domino Connected!");
      this.placedCount++;
    } else if (distRight < 90 && (domino.leftVal === this.targetRight.val || domino.rightVal === this.targetRight.val)) {
      domino.x = this.targetRight.x;
      domino.y = this.targetRight.y;
      domino.draggable = false;
      this.targetRight.x += 100;
      FeedbackManager.showMatchSuccess(this, domino, "Domino Connected!");
      this.placedCount++;
    } else {
      FeedbackManager.showMismatchGentle(this, domino, "Connect matching dot values.");
      return false;
    }

    if (this.placedCount >= this.playerHand.length) {
      this.time.delayedCall(800, () => {
        if (this.onCompleteCb) this.onCompleteCb();
      });
    }
    return true;
  }
}
