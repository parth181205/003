// Object Factory Module for Creating Reusable Phaser Entities
import { InteractiveObject } from './InteractiveObject.js';

export class ObjectFactory {
  static create(scene, config) {
    const type = config.type || 'card';

    switch (type) {
      case 'card':
        return new InteractiveObject(scene, {
          ...config,
          width: config.width || 120,
          height: config.height || 140
        });

      case 'container_target':
        return new ContainerTargetObject(scene, config);

      case 'domino':
        return new DominoObject(scene, config);

      case 'puzzle_piece':
        return new PuzzlePieceObject(scene, config);

      case 'token':
        return new TokenObject(scene, config);

      case 'ball':
        return new BallObject(scene, config);

      default:
        return new InteractiveObject(scene, config);
    }
  }
}

class ContainerTargetObject extends InteractiveObject {
  constructor(scene, config) {
    super(scene, {
      ...config,
      draggable: false,
      width: config.width || 240,
      height: config.height || 180
    });
    this.acceptedCategory = config.acceptedCategory;
  }

  buildGraphics() {
    this.removeAll(true);

    const isHighContrast = document.body.classList.contains('high-contrast');
    this.bgGraphics = this.scene.add.graphics();

    let bgColor = isHighContrast ? 0x111111 : 0x24201D;
    let borderColor = isHighContrast ? 0xFFFFFF : 0xEAB308;
    if (this.state === 'hover') {
      borderColor = 0x10B981;
    }

    this.bgGraphics.fillStyle(bgColor, 0.9);
    this.bgGraphics.fillRoundedRect(-this.objWidth/2, -this.objHeight/2, this.objWidth, this.objHeight, 16);
    this.bgGraphics.lineStyle(3, borderColor, 1.0);
    this.bgGraphics.strokeRoundedRect(-this.objWidth/2, -this.objHeight/2, this.objWidth, this.objHeight, 16);

    const iconText = this.scene.add.text(0, -24, this.content.icon || '📥', {
      fontSize: '48px'
    }).setOrigin(0.5);

    const labelText = this.scene.add.text(0, 32, this.label.toUpperCase(), {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '20px',
      fontWeight: '800',
      color: isHighContrast ? '#FFFF00' : '#EAB308'
    }).setOrigin(0.5);

    this.add([iconText, labelText]);
  }
}

class DominoObject extends InteractiveObject {
  constructor(scene, config) {
    super(scene, {
      ...config,
      width: config.width || 80,
      height: config.height || 150
    });
    this.leftVal = config.leftVal || 0;
    this.rightVal = config.rightVal || 0;
  }

  buildGraphics() {
    this.removeAll(true);
    const isHighContrast = document.body.classList.contains('high-contrast');
    
    this.bgGraphics = this.scene.add.graphics();
    this.bgGraphics.fillStyle(isHighContrast ? 0x000000 : 0xFFFBEB, 1.0);
    this.bgGraphics.fillRoundedRect(-40, -75, 80, 150, 10);
    this.bgGraphics.lineStyle(3, isHighContrast ? 0xFFFFFF : 0x4A433B, 1.0);
    this.bgGraphics.strokeRoundedRect(-40, -75, 80, 150, 10);
    this.bgGraphics.lineBetween(-32, 0, 32, 0);

    const txtL = this.scene.add.text(0, -36, '●'.repeat(this.leftVal), { fontSize: '18px', color: '#000000', align: 'center', wordWrap: { width: 60 } }).setOrigin(0.5);
    const txtR = this.scene.add.text(0, 36, '●'.repeat(this.rightVal), { fontSize: '18px', color: '#000000', align: 'center', wordWrap: { width: 60 } }).setOrigin(0.5);

    this.add([txtL, txtR]);
  }
}

class PuzzlePieceObject extends InteractiveObject {
  constructor(scene, config) {
    super(scene, config);
    this.correctX = config.correctX;
    this.correctY = config.correctY;
  }
}

class TokenObject extends InteractiveObject {
  constructor(scene, config) {
    super(scene, {
      ...config,
      width: config.width || 60,
      height: config.height || 60
    });
    this.playerColor = config.playerColor || 0xEF4444;
  }

  buildGraphics() {
    this.removeAll(true);
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(this.playerColor, 1.0);
    graphics.fillCircle(0, 0, 26);
    graphics.lineStyle(3, 0xFFFFFF, 1.0);
    graphics.strokeCircle(0, 0, 26);
    this.add(graphics);
  }
}

class BallObject extends InteractiveObject {
  constructor(scene, config) {
    super(scene, {
      ...config,
      width: config.width || 70,
      height: config.height || 70
    });
    this.balloonColor = config.balloonColor || 0xEC4899;
  }

  buildGraphics() {
    this.removeAll(true);
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(this.balloonColor, 0.9);
    graphics.fillCircle(0, -6, 32);
    graphics.lineStyle(2, 0xFFFFFF, 0.8);
    graphics.strokeCircle(0, -6, 32);
    this.add(graphics);
  }
}
