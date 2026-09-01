// Reference Implementation: Interactive Card Matching Game Scene
import Phaser from 'phaser';
import { OBJECT_ITEMS } from '../content/contentDb.js';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { InteractionManager } from '../engine/InteractionManager.js';
import { FeedbackManager } from '../engine/FeedbackManager.js';
import { HintManager } from '../engine/HintManager.js';
import { DifficultyManager } from '../engine/DifficultyManager.js';

export class MatchingScene extends Phaser.Scene {
  constructor() {
    super('MatchingScene');
  }

  initData(data) {
    this.gameConfig = data || {};
    this.difficultyMode = data.difficultyMode || 'gentle';
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    const diffSettings = DifficultyManager.getSettings(this.difficultyMode);
    this.pairCount = diffSettings.pairCount;

    this.cards = [];
    this.selectedCards = [];
    this.matchedPairsCount = 0;

    this.hintManager = new HintManager(this);

    // Pick random subset of items
    const shuffledItems = Phaser.Utils.Array.Shuffle([...OBJECT_ITEMS]).slice(0, this.pairCount);
    
    // Duplicate for pairs
    let cardConfigs = [];
    shuffledItems.forEach(item => {
      cardConfigs.push({ item, pairId: item.id });
      cardConfigs.push({ item, pairId: item.id });
    });
    cardConfigs = Phaser.Utils.Array.Shuffle(cardConfigs);

    // Layout Grid Calculations
    const cols = Math.min(4, cardConfigs.length);
    const rows = Math.ceil(cardConfigs.length / cols);
    const cardWidth = 120 * diffSettings.cardScale;
    const cardHeight = 140 * diffSettings.cardScale;
    const spacingX = cardWidth + 24;
    const spacingY = cardHeight + 24;

    const startX = (this.cameras.main.width - (cols - 1) * spacingX) / 2;
    const startY = (this.cameras.main.height - (rows - 1) * spacingY) / 2 + 10;

    // Build Cards
    cardConfigs.forEach((cfg, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const card = ObjectFactory.create(this, {
        type: 'card',
        x: startX + col * spacingX,
        y: startY + row * spacingY,
        width: cardWidth,
        height: cardHeight,
        pairId: cfg.pairId,
        content: cfg.item,
        isFlipped: false,
        draggable: false,
        selectable: true
      });

      this.cards.push(card);
    });

    // Setup accessible Interaction Controller
    this.interactionManager = new InteractionManager(this, {
      onSelect: (card) => this.handleCardSelect(card)
    });
  }

  handleCardSelect(card) {
    if (card.isFlipped || this.selectedCards.length >= 2 || card.state === 'matched') return;

    card.flip(() => {
      this.selectedCards.push(card);

      if (this.selectedCards.length === 2) {
        const [c1, c2] = this.selectedCards;

        if (c1.pairId === c2.pairId) {
          // MATCH SUCCESS!
          FeedbackManager.showMatchSuccess(this, c1);
          FeedbackManager.showMatchSuccess(this, c2);
          this.matchedPairsCount++;
          this.selectedCards = [];
          this.interactionManager.clearSelection();

          if (this.matchedPairsCount >= this.pairCount) {
            this.time.delayedCall(800, () => {
              if (this.onCompleteCb) this.onCompleteCb();
            });
          }
        } else {
          // GENTLE MISMATCH RETURN
          this.time.delayedCall(900, () => {
            c1.flip();
            c2.flip();
            FeedbackManager.showMismatchGentle(this, c1);
            FeedbackManager.showMismatchGentle(this, c2);
            this.selectedCards = [];
            this.interactionManager.clearSelection();
          });
        }
      }
    });
  }

  triggerHint() {
    // Find an unmatched unflipped pair
    const unflipped = this.cards.filter(c => c.state !== 'matched' && !c.isFlipped);
    if (unflipped.length >= 2) {
      const pairId = unflipped[0].pairId;
      const matches = unflipped.filter(c => c.pairId === pairId);
      if (matches.length >= 2) {
        this.hintManager.provideHint(matches[0], matches[1], `Look for the matching ${matches[0].label}!`);
      }
    }
  }
}
