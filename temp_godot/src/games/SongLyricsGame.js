// Nostalgic Song Lyrics Game Scene
import Phaser from 'phaser';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { FeedbackManager } from '../engine/FeedbackManager.js';
import { globalAudio } from '../engine/AudioManager.js';

export class SongLyricsScene extends Phaser.Scene {
  constructor() {
    super('SongLyricsScene');
  }

  initData(data) {
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.songs = [
      {
        title: "You Are My Sunshine",
        prompt: "You are my sunshine, my only sunshine,\nYou make me happy when skies are ___",
        options: ["Blue", "Gray", "Clear"],
        correct: 0,
        freqs: [392.00, 440.00, 493.88, 523.25]
      },
      {
        title: "Over the Rainbow",
        prompt: "Somewhere over the rainbow, way up ___,\nThere's a land that I heard of once in a lullaby.",
        options: ["High", "Far", "Bright"],
        correct: 0,
        freqs: [261.63, 523.25, 493.88, 392.00]
      }
    ];

    this.currentIdx = 0;
    this.renderSong();
  }

  renderSong() {
    this.children.removeAll();

    const song = this.songs[this.currentIdx];

    // Song Title Header
    this.add.text(this.cameras.main.width / 2, 100, `🎶 "${song.title}"`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '28px',
      fontWeight: '800',
      color: '#EAB308'
    }).setOrigin(0.5);

    // Lyric Box Prompt
    const promptBg = this.add.graphics();
    promptBg.fillStyle(0x2F2A25, 1.0);
    promptBg.fillRoundedRect(this.cameras.main.width / 2 - 320, 150, 640, 140, 16);
    promptBg.lineStyle(2, 0x4A433B, 1.0);
    promptBg.strokeRoundedRect(this.cameras.main.width / 2 - 320, 150, 640, 140, 16);

    this.add.text(this.cameras.main.width / 2, 220, song.prompt, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '22px',
      color: '#FBF8F3',
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);

    // Play Tune Button
    const btnTune = ObjectFactory.create(this, {
      type: 'card',
      x: this.cameras.main.width / 2,
      y: 340,
      width: 220,
      height: 54,
      content: { icon: '🎵' },
      label: 'Play Song Tune',
      draggable: false
    });
    btnTune.on('pointerdown', () => {
      song.freqs.forEach((f, i) => {
        setTimeout(() => globalAudio.playTone(f, 0.3, 'sine', 0.3), i * 300);
      });
    });

    // Multiple Choice Option Cards
    song.options.forEach((optText, idx) => {
      const optCard = ObjectFactory.create(this, {
        type: 'card',
        x: this.cameras.main.width / 2 - 200 + idx * 200,
        y: 460,
        width: 170,
        height: 100,
        content: { icon: '✨' },
        label: optText,
        draggable: false
      });

      optCard.on('pointerdown', () => {
        if (idx === song.correct) {
          FeedbackManager.showMatchSuccess(this, optCard, "Wonderful!");
          this.currentIdx++;
          if (this.currentIdx < this.songs.length) {
            this.time.delayedCall(1000, () => this.renderSong());
          } else {
            this.time.delayedCall(1000, () => {
              if (this.onCompleteCb) this.onCompleteCb();
            });
          }
        } else {
          FeedbackManager.showMismatchGentle(this, optCard, "Listen to the song tune and try again!");
        }
      });
    });

    globalAudio.speakText(song.prompt.replace("___", "blank"));
  }
}
