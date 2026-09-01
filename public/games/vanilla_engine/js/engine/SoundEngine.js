/* =====================================================
   SoundEngine.js — Web Audio API warm tones for SmritiPlay
   No harsh sounds; piano/marimba style chimes
   ===================================================== */

const SoundEngine = (() => {
  let ctx = null;
  let enabled = true;
  let masterGain = null;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(ctx.destination);
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function setEnabled(val) { enabled = val; }
  function isEnabled() { return enabled; }

  // Play a single note (sine / triangle for warmth)
  function playNote(frequency, duration = 0.3, type = 'sine', volume = 0.5) {
    if (!enabled || !ctx) return;
    resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.05);
  }

  // Play a chord
  function playChord(frequencies, duration = 0.4) {
    frequencies.forEach(f => playNote(f, duration, 'sine', 0.25));
  }

  // --- Named sound events ---

  // Warm success chime (ascending 3 notes)
  function playSuccess() {
    init();
    playNote(523.25, 0.25); // C5
    setTimeout(() => playNote(659.25, 0.25), 130); // E5
    setTimeout(() => playNote(783.99, 0.45), 260); // G5
  }

  // Big celebration (full chord)
  function playCelebration() {
    init();
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      setTimeout(() => playNote(f, 0.6, 'sine', 0.3), i * 80);
    });
    setTimeout(() => playChord([523.25, 659.25, 783.99], 1.0), 400);
  }

  // Gentle "flip" tap sound
  function playFlip() {
    init();
    playNote(440, 0.08, 'triangle', 0.3);
  }

  // Match sound
  function playMatch() {
    init();
    playNote(659.25, 0.2, 'sine', 0.4);
    setTimeout(() => playNote(880, 0.3, 'sine', 0.4), 120);
  }

  // Wrong / gentle miss (descending, soft)
  function playMiss() {
    init();
    playNote(311.13, 0.2, 'sine', 0.2);
    setTimeout(() => playNote(261.63, 0.3, 'sine', 0.15), 120);
  }

  // Simon pad tones (4 distinct warm tones)
  const SIMON_TONES = {
    red:    392.00, // G4
    blue:   523.25, // C5
    green:  659.25, // E5
    yellow: 783.99, // G5
  };
  function playSimonTone(color, duration = 0.5) {
    init();
    const freq = SIMON_TONES[color] || 440;
    playNote(freq, duration, 'sine', 0.5);
  }

  // Button click (subtle)
  function playClick() {
    init();
    playNote(880, 0.06, 'triangle', 0.2);
  }

  // Word correct
  function playWordCorrect() {
    init();
    playNote(587.33, 0.18, 'sine', 0.4); // D5
    setTimeout(() => playNote(783.99, 0.3, 'sine', 0.4), 100); // G5
  }

  // Snap (puzzle piece lands)
  function playSnap() {
    init();
    // Short percussive thump
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
    }
    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.35;
    source.buffer = buf;
    source.connect(gainNode);
    gainNode.connect(masterGain);
    source.start();
  }

  // Basket drop
  function playDrop() {
    init();
    playNote(261.63, 0.12, 'triangle', 0.4);
    setTimeout(() => playNote(329.63, 0.15, 'triangle', 0.3), 80);
  }

  return {
    init,
    setEnabled,
    isEnabled,
    playSuccess,
    playCelebration,
    playFlip,
    playMatch,
    playMiss,
    playSimonTone,
    playClick,
    playWordCorrect,
    playSnap,
    playDrop,
  };
})();
