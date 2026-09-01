// Web Audio Sound Synthesizer & Speech Voice Synthesis Manager
export class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.voiceEnabled = true;
    this.currentAudio = null;
    this.currentAudioSrc = null;
    this._initAudioContext();
  }

  _initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  playSongAudio(audioSrc) {
    if (!audioSrc) return;

    if (this.currentAudio && this.currentAudioSrc === audioSrc) {
      if (this.currentAudio.paused) {
        this.currentAudio.play().catch(e => console.warn('Audio play error:', e));
        return true;
      } else {
        this.currentAudio.pause();
        return false;
      }
    }

    this.stopSongAudio();

    try {
      const audio = new Audio(audioSrc);
      this.currentAudio = audio;
      this.currentAudioSrc = audioSrc;
      audio.play().catch(e => console.warn('Audio playback error:', e));
      return true;
    } catch (e) {
      console.warn('Error loading audio:', e);
      return false;
    }
  }

  stopSongAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.currentAudioSrc = null;
    }
  }

  isPlayingSongAudio(audioSrc) {
    return this.currentAudio && this.currentAudioSrc === audioSrc && !this.currentAudio.paused;
  }

  playInstrumentalMelody(freqs) {
    this.stopInstrumentalMelody();
    if (!freqs || !freqs.length) return;

    let index = 0;
    this.instrumentalTimer = setInterval(() => {
      const freq = freqs[index % freqs.length];
      this.playTone(freq, 0.45, 'triangle', 0.28);
      index++;
    }, 450);
  }

  stopInstrumentalMelody() {
    if (this.instrumentalTimer) {
      clearInterval(this.instrumentalTimer);
      this.instrumentalTimer = null;
    }
  }

  playTone(freq, duration = 0.15, type = 'sine', volume = 0.25) {
    if (!this.soundEnabled || !this.audioCtx) return;
    
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  playClick() {
    this.playTone(480, 0.08, 'sine', 0.2);
  }

  playMatchSuccess() {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.3), idx * 120);
    });
  }

  playFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.35), idx * 140);
    });
  }

  speakText(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window) || !text) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Calm, clear tempo for dementia accessibility
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }
}

export const globalAudio = new AudioManager();

