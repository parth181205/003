// Picture Bingo Game Scene
import Phaser from 'phaser';
import { OBJECT_ITEMS } from '../content/contentDb.js';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { FeedbackManager } from '../engine/FeedbackManager.js';
import { globalAudio } from '../engine/AudioManager.js';

export class BingoScene extends Phaser.Scene {
  constructor() {
    super('BingoScene');
  }

  initData(data) {
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.markedCount = 0;
    this.shuffledItems = Phaser.Utils.Array.Shuffle([...OBJECT_ITEMS]).slice(0, 9);
    this.callerIndex = 0;

    // Caller Display Card
    this.add.text(220, 100, "CURRENT BINGO CALL", {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '20px',
      fontWeight: '800',
      color: '#EAB308'
    }).setOrigin(0.5);

    this.callerCard = ObjectFactory.create(this, {
      type: 'card',
      x: 220,
      y: 260,
      width: 180,
      height: 220,
      content: this.shuffledItems[0],
      draggable: false
    });

    // 3x3 Board
    this.boardCards = [];
    const boardStartX = 620;
    const boardStartY = 180;
    const spacing = 140;

    const boardItems = Phaser.Utils.Array.Shuffle([...this.shuffledItems]);

    boardItems.forEach((item, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);

      const card = ObjectFactory.create(this, {
        type: 'card',
        x: boardStartX + col * spacing,
        y: boardStartY + row * spacing,
        width: 120,
        height: 120,
        content: item,
        draggable: false,
        selectable: true
      });

      card.on('pointerdown', () => this.handleSquareTap(card));
      this.boardCards.push(card);
    });

    // Speak initial call
    globalAudio.speakText(`Bingo call: ${this.shuffledItems[0].name}`);
  }

  handleSquareTap(card) {
    const currentCalled = this.shuffledItems[this.callerIndex];

    if (card.content.id === currentCalled.id && card.state !== 'matched') {
      FeedbackManager.showMatchSuccess(this, card, "Bingo Mark!");
      this.markedCount++;

      // Next Call
      this.callerIndex++;
      if (this.callerIndex < this.shuffledItems.length) {
        const nextItem = this.shuffledItems[this.callerIndex];
        this.callerCard.content = nextItem;
        this.callerCard.label = nextItem.name;
        this.callerCard.buildGraphics();
        globalAudio.speakText(`Bingo call: ${nextItem.name}`);
      }

      if (this.markedCount >= 5) {
        this.time.delayedCall(800, () => {
          if (this.onCompleteCb) this.onCompleteCb();
        });
      }
    } else {
      globalAudio.speakText(`Tap the called picture: ${currentCalled.name}`);
    }
  }
}
