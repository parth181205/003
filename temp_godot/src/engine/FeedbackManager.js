// Non-Intrusive Positive Feedback Manager
import { globalAudio } from './AudioManager.js';

export class FeedbackManager {
  static showMatchSuccess(scene, gameObject, customMsg = 'Nice!') {
    gameObject.setState('matched');
    globalAudio.playMatchSuccess();

    // Scale pulse
    scene.tweens.add({
      targets: gameObject,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 180,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });

    // Floating text praise
    const txt = scene.add.text(gameObject.x, gameObject.y - 40, customMsg, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '22px',
      fontWeight: '800',
      color: '#10B981'
    }).setOrigin(0.5);

    scene.tweens.add({
      targets: txt,
      y: txt.y - 40,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => txt.destroy()
    });
  }

  static showMismatchGentle(scene, gameObject, hintMsg = "Let's try another one.") {
    globalAudio.playClick();
    globalAudio.speakText(hintMsg);
    gameObject.returnToOriginal(350);
  }
}
