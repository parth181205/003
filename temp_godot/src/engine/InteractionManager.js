// Unified Interaction Manager (Drag & Drop + Accessible Tap-to-Select / Tap-to-Destination)
import Phaser from 'phaser';

export class InteractionManager {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.onDropCallback = options.onDrop || null;
    this.onSelectCallback = options.onSelect || null;
    this.selectedObject = null;

    this.setupListeners();
  }

  setupListeners() {
    // Pointer Drag Start
    this.scene.input.on('dragstart', (pointer, gameObject) => {
      if (gameObject.draggable && gameObject.state !== 'disabled' && gameObject.state !== 'matched') {
        gameObject.setState('dragging');
        this.scene.children.bringToTop(gameObject);
      }
    });

    // Pointer Dragging
    this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      if (gameObject.state === 'dragging') {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
    });

    // Pointer Drag End
    this.scene.input.on('dragend', (pointer, gameObject) => {
      if (gameObject.state === 'dragging') {
        if (this.onDropCallback) {
          const handled = this.onDropCallback(gameObject, pointer);
          if (!handled) {
            gameObject.returnToOriginal();
          }
        } else {
          gameObject.returnToOriginal();
        }
      }
    });

    // Accessible Tap Pointer Select Listener
    this.scene.input.on('gameobjectdown', (pointer, gameObject) => {
      if (gameObject.state === 'disabled' || gameObject.state === 'matched') return;

      if (!this.selectedObject) {
        // Step 1: Select source object
        if (gameObject.selectable) {
          this.selectedObject = gameObject;
          gameObject.setState('selected');
          if (this.onSelectCallback) this.onSelectCallback(gameObject);
        }
      } else {
        // Step 2: Select destination target
        if (this.selectedObject === gameObject) {
          // Deselect
          this.selectedObject.setState('idle');
          this.selectedObject = null;
        } else {
          // Attempt Tap-to-Destination drop
          if (this.onDropCallback) {
            const handled = this.onDropCallback(this.selectedObject, pointer, gameObject);
            if (!handled) {
              this.selectedObject.returnToOriginal();
            }
          }
          this.selectedObject.setState('idle');
          this.selectedObject = null;
        }
      }
    });
  }

  clearSelection() {
    if (this.selectedObject) {
      this.selectedObject.setState('idle');
      this.selectedObject = null;
    }
  }
}
