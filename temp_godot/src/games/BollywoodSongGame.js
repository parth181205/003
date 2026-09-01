// Bollywood Songs & Antakshari - Dementia-Friendly Lyrical & Karaoke Suite
import Phaser from 'phaser';
import { BOLLYWOOD_SONGS_DATA } from '../content/contentDb.js';
import { ObjectFactory } from '../engine/ObjectFactory.js';
import { FeedbackManager } from '../engine/FeedbackManager.js';
import { globalAudio } from '../engine/AudioManager.js';

export class BollywoodSongScene extends Phaser.Scene {
  constructor() {
    super('BollywoodSongScene');
  }

  initData(data) {
    this.onCompleteCb = data.onComplete || null;
  }

  create() {
    this.songs = BOLLYWOOD_SONGS_DATA;
    this.currentIdx = 0;
    this.gameMode = 'lyrics_video'; // 'lyrics_video', 'sing_along', 'instrumental_karaoke', 'trivia'
    this.singAlongStep = 0;
    this.score = 0;
    this.line2Revealed = false;

    this.renderStage();
  }

  renderStage() {
    this.children.removeAll();
    globalAudio.stopSongAudio();

    const song = this.songs[this.currentIdx];
    const width = this.cameras.main.width;

    // --- Header Banner ---
    this.add.text(width / 2, 30, `🎬 BOLLYWOOD MUSIC MAGIC (${this.currentIdx + 1}/${this.songs.length})`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '20px',
      fontWeight: '800',
      color: '#EAB308'
    }).setOrigin(0.5);

    this.add.text(width / 2, 65, `🎶 "${song.title}"`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '28px',
      fontWeight: '800',
      color: '#FBF8F3'
    }).setOrigin(0.5);

    this.add.text(width / 2, 98, `Film: ${song.movie}  |  Singers: ${song.singers}`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '15px',
      color: '#D1C7BD'
    }).setOrigin(0.5);

    // --- Mode Navigation Bar ---
    const modes = [
      { id: 'lyrics_video', label: '🌟 SRT Lyrical Video' },
      { id: 'sing_along', label: '🎤 Recall Sing-Along (Line 2 Hidden)' },
      { id: 'instrumental_karaoke', label: '🎹 Real Instrumental Karaoke' },
      { id: 'trivia', label: '❓ Movie Trivia' }
    ];

    const modeStartX = width / 2 - 390;
    modes.forEach((m, idx) => {
      const active = this.gameMode === m.id;
      const btn = this.add.text(modeStartX + idx * 260, 138, m.label, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '13px',
        fontWeight: '700',
        color: active ? '#181614' : '#EAB308',
        backgroundColor: active ? '#EAB308' : '#2F2A25',
        padding: { x: 10, y: 7 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => {
        globalAudio.playClick();
        this.gameMode = m.id;
        this.singAlongStep = 0;
        this.line2Revealed = false;
        this.renderStage();
      });
    });

    // Render Selected Mode
    if (this.gameMode === 'lyrics_video') {
      this.renderLyricalVideoMode(song, width);
    } else if (this.gameMode === 'sing_along') {
      this.renderSingAlongMode(song, width);
    } else if (this.gameMode === 'instrumental_karaoke') {
      this.renderInstrumentalKaraokeMode(song, width);
    } else {
      this.renderTriviaMode(song, width);
    }
  }

  // --- MODE 1: Custom SRT Timestamped Lyrical Video ---
  renderLyricalVideoMode(song, width) {
    const promptBg = this.add.graphics();
    promptBg.fillStyle(0x24201D, 1.0);
    promptBg.fillRoundedRect(width / 2 - 380, 170, 760, 160, 16);
    promptBg.lineStyle(3, 0xEAB308, 1.0);
    promptBg.strokeRoundedRect(width / 2 - 380, 170, 760, 160, 16);

    const initialText = song.timestampedLyrics[0]?.text || "🌸 Press Play to start Lyrical Video";

    const lyricDisplay = this.add.text(width / 2, 250, initialText, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '25px',
      fontWeight: '700',
      color: '#FFE89C',
      align: 'center',
      wordWrap: { width: 720 }
    }).setOrigin(0.5);

    // Fullscreen Animated Lyrical Video Overlay Launcher
    const btnFullscreen = ObjectFactory.create(this, {
      type: 'card',
      x: width / 2 - 180,
      y: 370,
      width: 320,
      height: 60,
      content: { icon: '📺' },
      label: 'FULLSCREEN SRT VIDEO',
      draggable: false
    });

    btnFullscreen.on('pointerdown', () => {
      globalAudio.playClick();
      this.openFullscreenLyricalOverlay(song);
    });

    // Previous / Next Song Navigation
    const btnPrev = this.add.text(width / 2 - 310, 450, '⬅ Prev Song', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '15px',
      fontWeight: '700',
      color: '#EAB308',
      backgroundColor: '#2F2A25',
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnPrev.on('pointerdown', () => {
      globalAudio.playClick();
      globalAudio.stopSongAudio();
      this.currentIdx = (this.currentIdx - 1 + this.songs.length) % this.songs.length;
      this.renderStage();
    });

    const btnNext = this.add.text(width / 2 + 310, 450, 'Next Song ➡', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '15px',
      fontWeight: '700',
      color: '#EAB308',
      backgroundColor: '#2F2A25',
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnNext.on('pointerdown', () => {
      globalAudio.playClick();
      globalAudio.stopSongAudio();
      this.currentIdx = (this.currentIdx + 1) % this.songs.length;
      this.renderStage();
    });

    // Song selector dots
    this.songs.forEach((s, i) => {
      const dot = this.add.circle(width / 2 - (this.songs.length - 1) * 16 + i * 32, 490, 8,
        i === this.currentIdx ? 0xEAB308 : 0x4A433B
      ).setInteractive({ useHandCursor: true });

      dot.on('pointerdown', () => {
        globalAudio.playClick();
        globalAudio.stopSongAudio();
        this.currentIdx = i;
        this.renderStage();
      });
    });

    globalAudio.speakText(initialText);
  }

  // Custom Fullscreen SRT Animated Lyrical Video Overlay
  openFullscreenLyricalOverlay(song) {
    const existing = document.getElementById('lyric-fullscreen-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'lyric-fullscreen-overlay';
    overlay.className = 'lyric-fullscreen-overlay';

    overlay.innerHTML = `
      <div class="floating-notes-layer">
        <span class="floating-note" style="left: 10%; animation-delay: 0s;">🎵</span>
        <span class="floating-note" style="left: 30%; animation-delay: 2s;">🎶</span>
        <span class="floating-note" style="left: 60%; animation-delay: 1s;">🎼</span>
        <span class="floating-note" style="left: 85%; animation-delay: 3s;">✨</span>
      </div>
      <div>
        <div class="lyric-header-title">🎬 ${song.title}</div>
        <div style="color: #D1C7BD; text-align: center; font-size: 1.1rem;">Film: ${song.movie} | Singers: ${song.singers}</div>
      </div>
      <div class="lyric-stage-container">
        <div class="flowing-lyric-card">
          <div id="flowing-lyric-text" class="flowing-lyric-text">${song.timestampedLyrics[0]?.text || song.title}</div>
          <div id="lyric-progress-time" style="color: #EAB308; margin-top: 16px; font-size: 1.2rem; font-weight: 700;">00:00 / --:--</div>
        </div>
        <div style="display: flex; gap: 20px; margin-top: 10px;">
          <button id="btn-overlay-play" style="background: #EAB308; color: #181614; font-weight: 800; font-size: 1.2rem; padding: 14px 32px; border: none; border-radius: 12px; cursor: pointer;">▶️ Play SRT Lyrical Video</button>
        </div>
      </div>
      <button id="btn-overlay-close" style="background: #EF4444; color: white; font-weight: 700; padding: 12px 24px; border: none; border-radius: 10px; cursor: pointer; font-size: 1rem;">❌ Close Fullscreen</button>
    `;

    document.body.appendChild(overlay);

    const txtElement = document.getElementById('flowing-lyric-text');
    const timeElement = document.getElementById('lyric-progress-time');
    const playBtn = document.getElementById('btn-overlay-play');
    const closeBtn = document.getElementById('btn-overlay-close');

    let isPlaying = false;

    const startSyncLoop = () => {
      if (!globalAudio.currentAudio) return;
      globalAudio.currentAudio.ontimeupdate = () => {
        if (!document.body.contains(overlay)) return;
        const curr = globalAudio.currentAudio.currentTime;
        const dur = globalAudio.currentAudio.duration || 0;

        const mins = Math.floor(curr / 60);
        const secs = Math.floor(curr % 60).toString().padStart(2, '0');
        const durMins = Math.floor(dur / 60);
        const durSecs = Math.floor(dur % 60).toString().padStart(2, '0');
        timeElement.innerText = `${mins}:${secs} / ${durMins}:${durSecs}`;

        const matched = song.timestampedLyrics.find(item => curr >= item.start && curr < item.end);
        if (matched) {
          txtElement.innerText = matched.text;
        }
      };
    };

    playBtn.onclick = () => {
      if (!isPlaying) {
        // First play — create audio and start
        globalAudio.stopSongAudio();
        const audio = new Audio(song.audioFile);
        globalAudio.currentAudio = audio;
        globalAudio.currentAudioSrc = song.audioFile;
        audio.play().then(() => {
          isPlaying = true;
          playBtn.innerText = '⏸️ Pause';
          startSyncLoop();
        }).catch(e => {
          console.warn('Playback failed:', e);
          playBtn.innerText = '⚠️ Tap Again to Play';
        });
      } else if (globalAudio.currentAudio.paused) {
        globalAudio.currentAudio.play();
        isPlaying = true;
        playBtn.innerText = '⏸️ Pause';
      } else {
        globalAudio.currentAudio.pause();
        isPlaying = false;
        playBtn.innerText = '▶️ Resume';
      }
    };

    closeBtn.onclick = () => {
      globalAudio.stopSongAudio();
      isPlaying = false;
      overlay.remove();
    };
  }

  // --- MODE 2: Sing-Along Recall Mode (Line 2 Hidden) ---
  renderSingAlongMode(song, width) {
    const seq = song.singAlongSequence || [
      { lead: song.prompt.split('\n')[0], answerText: song.prompt.split('\n')[1], options: song.options, correct: 0 }
    ];

    const currentPair = seq[this.singAlongStep] || seq[0];

    const promptBg = this.add.graphics();
    promptBg.fillStyle(0x24201D, 1.0);
    promptBg.fillRoundedRect(width / 2 - 380, 170, 760, 170, 16);
    promptBg.lineStyle(2, 0x4A433B, 1.0);
    promptBg.strokeRoundedRect(width / 2 - 380, 170, 760, 170, 16);

    // Line 1: Visible Sung Line
    this.add.text(width / 2, 205, `🎤 Line 1 (Sung): "${currentPair.lead}"`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '20px',
      fontWeight: '600',
      color: '#93C5FD',
      align: 'center',
      wordWrap: { width: 720 }
    }).setOrigin(0.5);

    // Line 2: HIDDEN BY DEFAULT for dementia memory recall!
    const line2Text = this.line2Revealed 
      ? `✨ Line 2: "${currentPair.answerText}"`
      : `❓ Line 2: 🔒 [ Recall line 2 on your own! ]`;

    const line2Display = this.add.text(width / 2, 275, line2Text, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '22px',
      fontWeight: '700',
      color: this.line2Revealed ? '#34D399' : '#FBBF24',
      align: 'center',
      wordWrap: { width: 720 }
    }).setOrigin(0.5);

    // Tap to Reveal Button
    const btnReveal = this.add.text(width / 2, 322, this.line2Revealed ? "✔️ Line 2 Revealed" : "👁️ Tap to Reveal Line 2", {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '14px',
      fontWeight: '700',
      color: '#EAB308',
      backgroundColor: '#2F2A25',
      padding: { x: 14, y: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnReveal.on('pointerdown', () => {
      globalAudio.playClick();
      this.line2Revealed = true;
      line2Display.setText(`✨ Line 2: "${currentPair.answerText}"`);
      line2Display.setColor('#34D399');
      btnReveal.setText("✔️ Line 2 Revealed");
      globalAudio.speakText(`Line 2 is: ${currentPair.answerText}`);
    });

    // Multiple Choice Recall Cards
    const startX = width / 2 - (currentPair.options.length - 1) * 125;
    const cardY = 460;

    currentPair.options.forEach((optText, idx) => {
      const card = ObjectFactory.create(this, {
        type: 'card',
        x: startX + idx * 250,
        y: cardY,
        width: 230,
        height: 95,
        content: { icon: '🧠' },
        label: optText,
        draggable: false
      });

      card.on('pointerdown', () => {
        if (idx === currentPair.correct) {
          this.score += 10;
          this.line2Revealed = true;
          FeedbackManager.showMatchSuccess(this, card, "Shabash! Great Memory Recall!");
          
          this.time.delayedCall(1400, () => {
            this.line2Revealed = false;
            if (this.singAlongStep < seq.length - 1) {
              this.singAlongStep++;
            } else {
              this.currentIdx = (this.currentIdx + 1) % this.songs.length;
              this.singAlongStep = 0;
            }
            this.renderStage();
          });
        } else {
          FeedbackManager.showMismatchGentle(this, card, "Recall line 2 in your mind and try again!");
        }
      });
    });

    globalAudio.speakText(`Line 1: ${currentPair.lead}. Now recall line 2 from memory.`);
  }

  // --- MODE 3: Real Instrumental Karaoke Backing Track (No Vocals) ---
  renderInstrumentalKaraokeMode(song, width) {
    const promptBg = this.add.graphics();
    promptBg.fillStyle(0x24201D, 1.0);
    promptBg.fillRoundedRect(width / 2 - 380, 170, 760, 160, 16);
    promptBg.lineStyle(3, 0x34D399, 1.0);
    promptBg.strokeRoundedRect(width / 2 - 380, 170, 760, 160, 16);

    this.add.text(width / 2, 205, `🎹 REAL INSTRUMENTAL BACKING TRACK (NO VOCALS)`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '18px',
      fontWeight: '800',
      color: '#34D399'
    }).setOrigin(0.5);

    this.add.text(width / 2, 265, `🎤 Sing along with the real backing track!\n"${song.prompt.replace('___', '...')}"`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '21px',
      fontWeight: '600',
      color: '#FBF8F3',
      align: 'center',
      wordWrap: { width: 720 }
    }).setOrigin(0.5);

    // Play REAL instrumental backing track MP3/M4A (No vocals!)
    const btnPlayInst = ObjectFactory.create(this, {
      type: 'card',
      x: width / 2 - 140,
      y: 370,
      width: 260,
      height: 58,
      content: { icon: '🎷' },
      label: 'PLAY INSTRUMENTAL',
      draggable: false
    });

    btnPlayInst.on('pointerdown', () => {
      globalAudio.playClick();
      const playing = globalAudio.playSongAudio(song.instAudioFile || song.audioFile);
      if (playing) {
        FeedbackManager.showMatchSuccess(this, btnPlayInst, "▶️ Playing Real Instrumental...");
      } else {
        FeedbackManager.showMismatchGentle(this, btnPlayInst, "⏸️ Instrumental Paused");
      }
    });

    const btnNextSong = ObjectFactory.create(this, {
      type: 'card',
      x: width / 2 + 140,
      y: 370,
      width: 230,
      height: 58,
      content: { icon: '⭐' },
      label: 'Next Song Memory',
      draggable: false
    });

    btnNextSong.on('pointerdown', () => {
      globalAudio.playClick();
      globalAudio.stopSongAudio();
      this.currentIdx = (this.currentIdx + 1) % this.songs.length;
      this.renderStage();
    });
  }

  // --- MODE 4: Movie & Singer Trivia ---
  renderTriviaMode(song, width) {
    const promptBg = this.add.graphics();
    promptBg.fillStyle(0x24201D, 1.0);
    promptBg.fillRoundedRect(width / 2 - 380, 170, 760, 145, 16);
    promptBg.lineStyle(2, 0x4A433B, 1.0);
    promptBg.strokeRoundedRect(width / 2 - 380, 170, 760, 145, 16);

    this.add.text(width / 2, 240, song.triviaQuestion, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '22px',
      fontWeight: '600',
      color: '#FBF8F3',
      align: 'center',
      wordWrap: { width: 720 }
    }).setOrigin(0.5);

    const startX = width / 2 - (song.triviaOptions.length - 1) * 115;
    const cardY = 435;

    song.triviaOptions.forEach((optText, idx) => {
      const card = ObjectFactory.create(this, {
        type: 'card',
        x: startX + idx * 230,
        y: cardY,
        width: 210,
        height: 90,
        content: { icon: '🎬' },
        label: optText,
        draggable: false
      });

      card.on('pointerdown', () => {
        if (idx === song.triviaCorrect) {
          this.score += 10;
          FeedbackManager.showMatchSuccess(this, card, "Correct Movie Trivia!");
          
          this.time.delayedCall(1200, () => {
            this.currentIdx = (this.currentIdx + 1) % this.songs.length;
            this.renderStage();
          });
        } else {
          FeedbackManager.showMismatchGentle(this, card, `Film: ${song.movie} by ${song.singers}`);
        }
      });
    });

    globalAudio.speakText(song.triviaQuestion);
  }

  triggerHint() {
    const song = this.songs[this.currentIdx];
    FeedbackManager.showModalMessage(
      this, 
      `💡 Bollywood Hint for "${song.title}"`, 
      song.hint || `Film: ${song.movie} by composer ${song.music}. Singers: ${song.singers}`
    );
  }
}
