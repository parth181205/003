// Category Sorting Game Scene (Food vs Clothing Drag/Tap Sorting)
import Phaser from 'phaser';
import { OBJECT_ITEMS } from '../content/contentDb.js';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { InteractionManager } from '../engine/InteractionManager.js';
import { FeedbackManager } from '../engine/FeedbackManager.js';
import { HintManager } from '../engine/HintManager.js';

export class SortingScene extends Phaser.Scene {
  constructor() {
    super('SortingScene');
  }

  initData(data) {
    this.gameConfig = data || {};
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.sortedCount = 0;
    this.hintManager = new HintManager(this);

    // Create Target Containers
    this.foodTarget = ObjectFactory.create(this, {
      type: 'container_target',
      x: this.cameras.main.width * 0.3,
      y: 180,
      acceptedCategory: 'food',
      label: 'FOOD CONTAINER',
      content: { icon: '🧺' }
    });

    this.clothingTarget = ObjectFactory.create(this, {
      type: 'container_target',
      x: this.cameras.main.width * 0.7,
      y: 180,
      acceptedCategory: 'clothing',
      label: 'CLOTHING CLOSET',
      content: { icon: '🧳' }
    });

    this.targets = [this.foodTarget, this.clothingTarget];

    // Filter items to sort
    const itemsToSort = OBJECT_ITEMS.filter(it => it.category === 'food' || it.category === 'clothing').slice(0, 6);
    this.itemsCount = itemsToSort.length;

    this.draggableCards = [];
    const startX = 140;
    const spacingX = 160;

    itemsToSort.forEach((item, idx) => {
      const card = ObjectFactory.create(this, {
        type: 'card',
        x: startX + (idx % 6) * spacingX,
        y: 480,
        content: item,
        category: item.category,
        draggable: true,
        selectable: true
      });
      this.draggableCards.push(card);
    });

    // Interaction controller
    this.interactionManager = new InteractionManager(this, {
      onDrop: (source, pointer, target) => this.handleDrop(source, target || pointer)
    });
  }

  handleDrop(sourceCard, targetOrPointer) {
    // Find colliding target container
    let matchedTarget = null;
    if (targetOrPointer instanceof Phaser.GameObjects.Container) {
      matchedTarget = targetOrPointer;
    } else {
      matchedTarget = this.targets.find(tgt => {
        const bounds = tgt.getBounds();
        return bounds.contains(sourceCard.x, sourceCard.y);
      });
    }

    if (matchedTarget && sourceCard.category === matchedTarget.acceptedCategory) {
      // MATCH SUCCESSFUL!
      sourceCard.x = matchedTarget.x + (Math.random() * 40 - 20);
      sourceCard.y = matchedTarget.y + 20;
      sourceCard.draggable = false;
      sourceCard.selectable = false;
      
      FeedbackManager.showMatchSuccess(this, sourceCard, `Correct! ${sourceCard.label} is ${sourceCard.category}!`);
      this.sortedCount++;

      if (this.sortedCount >= this.itemsCount) {
        this.time.delayedCall(800, () => {
          if (this.onCompleteCb) this.onCompleteCb();
        });
      }
      return true;
    } else {
      FeedbackManager.showMismatchGentle(this, sourceCard, "Try placing this item in the other container.");
      return false;
    }
  }

  triggerHint() {
    const unsorted = this.draggableCards.filter(c => c.draggable);
    if (unsorted.length > 0) {
      const src = unsorted[0];
      const target = this.targets.find(t => t.acceptedCategory === src.category);
      this.hintManager.provideHint(src, target, `Place the ${src.label} into the ${target.label}!`);
    }
  }
}
