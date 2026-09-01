// Reminiscence Conversation Topics Scene
import Phaser from 'phaser';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { globalAudio } from '../engine/AudioManager.js';

export class ConversationScene extends Phaser.Scene {
  constructor() {
    super('ConversationScene');
  }

  initData(data) {
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.topics = [
      { category: "Childhood", prompt: "What games or songs did you enjoy when you were young?", icon: "🪁" },
      { category: "Family & Food", prompt: "What special home-cooked meal brought the family together?", icon: "🍲" },
      { category: "Travel & Places", prompt: "Where was your favorite peaceful place to visit?", icon: "🏞️" },
      { category: "Holidays", prompt: "What warm memories do you have of celebrating holidays?", icon: "🕯️" }
    ];

    this.currentIdx = 0;
    this.renderTopic();
  }

  renderTopic() {
    this.children.removeAll();
    const topic = this.topics[this.currentIdx];

    this.add.text(this.cameras.main.width / 2, 90, `🗣️ Reminiscence Topic: ${topic.category}`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '26px',
      fontWeight: '800',
      color: '#EAB308'
    }).setOrigin(0.5);

    // Large Topic Card
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x2F2A25, 1.0);
    cardBg.fillRoundedRect(this.cameras.main.width / 2 - 320, 150, 640, 260, 20);
    cardBg.lineStyle(3, 0x4A433B, 1.0);
    cardBg.strokeRoundedRect(this.cameras.main.width / 2 - 320, 150, 640, 260, 20);

    this.add.text(this.cameras.main.width / 2, 210, topic.icon, { fontSize: '64px' }).setOrigin(0.5);

    this.add.text(this.cameras.main.width / 2, 320, `"${topic.prompt}"`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '22px',
      color: '#FBF8F3',
      align: 'center',
      wordWrap: { width: 580 }
    }).setOrigin(0.5);

    // Controls
    const btnSpeak = ObjectFactory.create(this, {
      type: 'card',
      x: this.cameras.main.width / 2 - 120,
      y: 480,
      width: 180,
      height: 52,
      content: { icon: '🔊' },
      label: 'Speak Prompt',
      draggable: false
    });
    btnSpeak.on('pointerdown', () => globalAudio.speakText(topic.prompt));

    const btnNext = ObjectFactory.create(this, {
      type: 'card',
      x: this.cameras.main.width / 2 + 120,
      y: 480,
      width: 180,
      height: 52,
      content: { icon: '➜' },
      label: 'Next Topic',
      draggable: false
    });

    btnNext.on('pointerdown', () => {
      globalAudio.playClick();
      this.currentIdx = (this.currentIdx + 1) % this.topics.length;
      this.renderTopic();
    });

    globalAudio.speakText(topic.prompt);
  }
}
