/* =====================================================
   app.js — SmritiPlay Application Router & State Manager
   Handles screen transitions, profile, sound toggle, navigation
   ===================================================== */

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────
  let state = {
    screen: 'profile',   // profile | hub | game | caregiver
    playerName: '',
    difficulty: 'gentle',
    currentGame: null,   // 'memory' | 'simon' | 'word' | 'puzzle' | 'sort'
    soundEnabled: true,
  };

  // ── DOM refs ─────────────────────────────────────────────────
  const profileModal      = document.getElementById('profile-modal');
  const appShell          = document.getElementById('app-shell');
  const gameHub           = document.getElementById('game-hub');
  const gameScreen        = document.getElementById('game-screen');
  const caregiverDash     = document.getElementById('caregiver-dashboard');
  const bgCanvas          = document.getElementById('bg-canvas');

  const playerNameInput   = document.getElementById('player-name-input');
  const startBtn          = document.getElementById('start-journey-btn');
  const diffBtns          = document.querySelectorAll('.diff-btn');

  const navGreeting       = document.getElementById('nav-greeting');
  const navName           = document.getElementById('nav-name');

  const soundToggleBtn    = document.getElementById('sound-toggle-btn');
  const homeBtn           = document.getElementById('home-btn');
  const caregiverBtn      = document.getElementById('caregiver-btn');

  const gameTiles         = document.querySelectorAll('.game-tile');
  const backToHubBtn      = document.getElementById('back-to-hub-btn');
  const gameScreenTitle   = document.getElementById('game-screen-title');
  const gameScoreDisplay  = document.getElementById('game-score-display');
  const mainGameCanvas    = document.getElementById('main-game-canvas');
  const gameCanvasWrapper = document.getElementById('game-canvas-wrapper');

  const gameOverlay       = document.getElementById('game-overlay');
  const overlayEmoji      = document.getElementById('overlay-emoji');
  const overlayTitle      = document.getElementById('overlay-title');
  const overlayMsg        = document.getElementById('overlay-message');
  const overlayStars      = document.getElementById('overlay-stars');
  const overlayPlayAgain  = document.getElementById('overlay-play-again');
  const overlayHome       = document.getElementById('overlay-home');

  const closeCaregiverBtn = document.getElementById('close-caregiver-btn');

  // Game instances map
  const GAMES = {
    memory:   { module: MemoryMatch,   name: '🃏 Memory Match',      emoji: '🌸' },
    simon:    { module: SimonSay,      name: '🌈 Rainbow Drumbeat',  emoji: '🎵' },
    word:     { module: WordBloom,     name: '🌸 Word Bloom',        emoji: '🌺' },
    puzzle:   { module: PicturePuzz,   name: '🧩 Picture Puzzle',    emoji: '🌄' },
    sort:     { module: SortGarden,    name: '🌿 Sort Garden',       emoji: '🦋' },
    spot:     { module: SpotIt,        name: '🔍 Spot It!',          emoji: '🔎' },
    garden:   { module: GardenTap,     name: '🌼 Garden Tap',        emoji: '🌻' },
    numtrail: { module: NumberTrail,   name: '🔢 Number Trail',      emoji: '⭐' },
  };

  const WIN_MESSAGES = [
    { emoji:'🌟', title:'Wonderful!',     msg:'You are a memory champion!' },
    { emoji:'🎉', title:'Brilliant!',     msg:'What an amazing effort today!' },
    { emoji:'🏆', title:'Excellent!',     msg:'Your brain is blooming!' },
    { emoji:'🌸', title:'Well Done!',     msg:'Every game makes you stronger!' },
    { emoji:'⭐', title:'Superstar!',     msg:'You should be very proud!' },
  ];

  // ── Boot ─────────────────────────────────────────────────────
  function boot() {
    SoundEngine.init();
    const saved = ScoreTracker.get();

    if (saved.playerName) {
      // Returning player — skip profile
      state.playerName = saved.playerName;
      state.difficulty = saved.difficulty || 'gentle';
      startApp();
    } else {
      showProfile();
    }

    bindAllEvents();
    setGreeting();
  }

  // ── Profile Modal ─────────────────────────────────────────────
  function showProfile() {
    profileModal.classList.remove('hidden');
    appShell.classList.add('hidden');
    playerNameInput.focus();
  }

  function hideProfile() {
    profileModal.classList.add('hidden');
    appShell.classList.remove('hidden');
  }

  // Difficulty selection
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diffBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-checked','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-checked','true');
      state.difficulty = btn.dataset.diff;
      SoundEngine.playClick();
    });
  });

  startBtn.addEventListener('click', () => {
    SoundEngine.playClick();
    const name = playerNameInput.value.trim() || 'Friend';
    state.playerName = name;
    ScoreTracker.setProfile(name, state.difficulty);
    startApp();
  });

  playerNameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') startBtn.click();
  });

  // ── Start App ────────────────────────────────────────────────
  function startApp() {
    hideProfile();
    setNavName();
    CanvasEngine.initBackground(bgCanvas);
    Hub.init();
    showHub();
  }

  // ── Greeting ─────────────────────────────────────────────────
  function setGreeting() {
    const h = new Date().getHours();
    let greeting = 'Good Day,';
    if (h < 12)     greeting = '🌅 Good Morning,';
    else if (h < 17) greeting = '☀️ Good Afternoon,';
    else             greeting = '🌙 Good Evening,';
    if (navGreeting) navGreeting.textContent = greeting;
  }

  function setNavName() {
    if (navName) navName.textContent = state.playerName + '!';
  }

  // ── Screen routing ────────────────────────────────────────────
  function showHub() {
    stopCurrentGame();
    CanvasEngine.stopBackground(); // stop if was stopped
    CanvasEngine.initBackground(bgCanvas);
    gameHub.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    caregiverDash.classList.add('hidden');
    state.screen = 'hub';
    Hub.updateHealthRing();
    Hub.updateStarDisplays();
    Hub.updateStats();
    gameOverlay.classList.add('hidden');
  }

  function showGame(gameKey) {
    CanvasEngine.stopBackground();
    gameHub.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    caregiverDash.classList.add('hidden');
    gameOverlay.classList.add('hidden');
    state.screen     = 'game';
    state.currentGame = gameKey;
    const meta = GAMES[gameKey];
    if (gameScreenTitle) gameScreenTitle.textContent = meta.name;
    if (gameScoreDisplay) gameScoreDisplay.textContent = '⭐ 0';
    launchGame(gameKey);
  }

  function showCaregiver() {
    stopCurrentGame();
    CanvasEngine.stopBackground();
    gameHub.classList.add('hidden');
    gameScreen.classList.add('hidden');
    caregiverDash.classList.remove('hidden');
    state.screen = 'caregiver';
    Hub.renderCaregiverDashboard();
  }

  // ── Game Launch ───────────────────────────────────────────────
  function launchGame(gameKey) {
    const meta = GAMES[gameKey];
    meta.module.init(mainGameCanvas, state.difficulty, (stars) => {
      onGameWin(gameKey, stars);
    });
  }

  function stopCurrentGame() {
    if (state.currentGame) {
      const meta = GAMES[state.currentGame];
      if (meta && meta.module.destroy) meta.module.destroy();
      state.currentGame = null;
    }
  }

  function onGameWin(gameKey, stars) {
    const data  = ScoreTracker.recordGameResult(gameKey, stars);
    const winMsg= WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];

    overlayEmoji.textContent = winMsg.emoji;
    overlayTitle.textContent  = winMsg.title;
    overlayMsg.textContent    = winMsg.msg;
    overlayStars.textContent  = '★'.repeat(stars) + '☆'.repeat(3-stars);
    overlayStars.style.color  = '#F0A500';

    gameOverlay.classList.remove('hidden');
    if (gameScoreDisplay) gameScoreDisplay.textContent = `⭐ ${data.totalStars}`;
  }

  // ── Event Bindings ────────────────────────────────────────────
  function bindAllEvents() {
    // Game tiles
    gameTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        SoundEngine.playClick();
        const gameKey = tile.dataset.game;
        showGame(gameKey);
      });
    });

    // Back to hub
    backToHubBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      showHub();
    });

    // Home button
    homeBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      showHub();
    });

    // Caregiver button
    caregiverBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      showCaregiver();
    });

    // Close caregiver
    closeCaregiverBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      showHub();
    });

    // Sound toggle
    soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      SoundEngine.setEnabled(state.soundEnabled);
      soundToggleBtn.textContent = state.soundEnabled ? '🔊' : '🔇';
    });

    // Overlay buttons
    overlayPlayAgain.addEventListener('click', () => {
      SoundEngine.playClick();
      gameOverlay.classList.add('hidden');
      const gk = state.currentGame;
      if (!gk) return;
      // Destroy current instance and re-launch fresh
      const meta = GAMES[gk];
      if (meta.module.destroy) meta.module.destroy();
      meta.module.init(mainGameCanvas, state.difficulty, (stars) => {
        onGameWin(gk, stars);
      });
    });

    overlayHome.addEventListener('click', () => {
      SoundEngine.playClick();
      gameOverlay.classList.add('hidden');
      showHub();
    });

    // Keyboard: ESC = back to hub
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && state.screen !== 'hub') showHub();
    });

    // First interaction unlocks AudioContext
    document.addEventListener('click', () => SoundEngine.init(), { once: true });
    document.addEventListener('touchend', () => SoundEngine.init(), { once: true });
  }

  // ── Init ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', boot);

})();
