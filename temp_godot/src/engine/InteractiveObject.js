// Interactive Object System Base Class for Phaser 3
import Phaser from 'phaser';

export class InteractiveObject extends Phaser.GameObjects.Container {
  constructor(scene, config) {
    super(scene, config.x || 0, config.y || 0);

    this.id = config.id || `obj_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    this.type = config.type || 'generic';
    this.pairId = config.pairId || null;
    this.category = config.category || null;
    this.content = config.content || {};
    this.label = config.label || (typeof config.content === 'string' ? config.content : config.content?.name || '');
    
    this.objWidth = config.width || 120;
    this.objHeight = config.height || 140;

    this.state = 'idle'; // idle, hover, focused, selected, dragging, matched, correct, incorrect, disabled
    this.draggable = config.draggable ?? true;
    this.clickable = config.clickable ?? true;
    this.selectable = config.selectable ?? true;
    
    this.originalX = config.x || 0;
    this.originalY = config.y || 0;
    this.targetSnap = null;
    this.isFlipped = config.isFlipped ?? true; // true = front visible

    this.scene.add.existing(this);
    this.setSize(this.objWidth, this.objHeight);
    
    this.buildGraphics();
    this.setupInteractions();
  }

  buildGraphics() {
    this.removeAll(true);

    const isHighContrast = document.body.classList.contains('high-contrast');
    
    // Background card rect
    this.bgGraphics = this.scene.add.graphics();
    this.updateCardStyle(isHighContrast);
    this.add(this.bgGraphics);

    // Icon / Image Text
    if (this.isFlipped) {
      if (this.content.icon) {
        const iconText = this.scene.add.text(0, -14, this.content.icon, {
          fontSize: `${Math.min(this.objWidth, this.objHeight) * 0.4}px`,
          align: 'center'
        }).setOrigin(0.5);
        this.add(iconText);
      }

      if (this.label) {
        const labelText = this.scene.add.text(0, this.objHeight * 0.3, this.label, {
          fontFamily: 'Segoe UI, sans-serif',
          fontSize: '16px',
          fontWeight: '700',
          color: isHighContrast ? '#FFFFFF' : '#FBF8F3',
          align: 'center',
          wordWrap: { width: this.objWidth - 16 }
        }).setOrigin(0.5);
        this.add(labelText);
      }
    } else {
      // Card Back Pattern
      const backText = this.scene.add.text(0, 0, '✨', {
        fontSize: '36px',
        align: 'center'
      }).setOrigin(0.5);
      this.add(backText);
    }
  }

  updateCardStyle(isHighContrast = false) {
    this.bgGraphics.clear();

    let bgColor = isHighContrast ? 0x000000 : 0x2F2A25;
    let borderColor = isHighContrast ? 0xFFFFFF : 0x4A433B;
    let borderWidth = 3;

    if (this.state === 'hover' || this.state === 'focused') {
      borderColor = isHighContrast ? 0xFFFF00 : 0xEAB308;
      borderWidth = 4;
    } else if (this.state === 'selected') {
      bgColor = isHighContrast ? 0x222200 : 0x3E3832;
      borderColor = isHighContrast ? 0xFFFF00 : 0xEAB308;
      borderWidth = 5;
    } else if (this.state === 'matched' || this.state === 'correct') {
      bgColor = isHighContrast ? 0x003300 : 0x064E3B;
      borderColor = isHighContrast ? 0x00FF00 : 0x10B981;
      borderWidth = 4;
    } else if (!this.isFlipped) {
      bgColor = isHighContrast ? 0x111111 : 0x24201D;
      borderColor = isHighContrast ? 0x888888 : 0x3E3832;
    }

    const radius = 12;
    const halfW = this.objWidth / 2;
    const halfH = this.objHeight / 2;

    // Fill
    this.bgGraphics.fillStyle(bgColor, 1.0);
    this.bgGraphics.fillRoundedRect(-halfW, -halfH, this.objWidth, this.objHeight, radius);

    // Stroke Border
    this.bgGraphics.lineStyle(borderWidth, borderColor, 1.0);
    this.bgGraphics.strokeRoundedRect(-halfW, -halfH, this.objWidth, this.objHeight, radius);
  }

  setupInteractions() {
    this.setInteractive({ useHandCursor: true });

    if (this.draggable) {
      this.scene.input.setDraggable(this);
    }

    this.on('pointerover', () => {
      if (this.state === 'idle') {
        this.setState('hover');
      }
    });

    this.on('pointerout', () => {
      if (this.state === 'hover') {
        this.setState('idle');
      }
    });
  }

  setState(newState) {
    this.state = newState;
    const isHighContrast = document.body.classList.contains('high-contrast');
    this.updateCardStyle(isHighContrast);

    if (newState === 'selected') {
      this.setScale(1.06);
    } else if (newState === 'idle') {
      this.setScale(1.0);
    }
  }

  flip(onComplete) {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      duration: 150,
      onComplete: () => {
        this.isFlipped = !this.isFlipped;
        this.buildGraphics();
        this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          duration: 150,
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      }
    });
  }

  returnToOriginal(duration = 300) {
    this.scene.tweens.add({
      targets: this,
      x: this.originalX,
      y: this.originalY,
      duration: duration,
      ease: 'Power2',
      onComplete: () => {
        this.setState('idle');
      }
    });
  }
}
