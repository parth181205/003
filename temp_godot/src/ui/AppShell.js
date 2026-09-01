// Application Shell Manager (Navigation, Activity Library, Caregiver Mode, Memory Box, Accessibility)
import { GAMES_LIBRARY } from '../content/contentDb.js';
import { GameManager } from '../engine/GameManager.js';
import { globalAccessibility } from '../engine/AccessibilityManager.js';
import { globalAudio } from '../engine/AudioManager.js';

export class AppShell {
  constructor() {
    this.activeCategory = 'All';
    this.currentGameId = null;
    this.gameManager = new GameManager('game-canvas-container');
    this.memoryBoxItems = this._loadMemoryBoxStorage();

    this.initDOM();
    this.setupEvents();
  }

  _loadMemoryBoxStorage() {
    try {
      const stored = localStorage.getItem('gentle_play_memory_box');
      return stored ? JSON.parse(stored) : [
        {
          id: 'mem_1',
          title: 'Family Summer Picnic (1968)',
          story: 'Gathering under the giant river willow tree with homemade lemon cake and tea.',
          icon: '🧺'
        }
      ];
    } catch (e) {
      return [];
    }
  }

  _saveMemoryBoxStorage() {
    try {
      localStorage.setItem('gentle_play_memory_box', JSON.stringify(this.memoryBoxItems));
    } catch (e) {}
  }

  initDOM() {
    const appElem = document.getElementById('app-container');
    appElem.innerHTML = `
      <!-- Header Navigation Bar -->
      <header class="app-header">
        <div class="brand-container" id="brand-home">
          <div class="brand-logo">✨</div>
          <div class="brand-title">Gentle Play</div>
        </div>

        <nav class="nav-links">
          <button class="nav-btn active" id="nav-library">🎮 Activities</button>
          <button class="nav-btn" id="nav-memorybox">🖼️ Memory Box</button>
          <button class="nav-btn" id="nav-caregiver">⚙️ Caregiver Mode</button>
        </nav>
      </header>

      <!-- Main Dynamic Content Shell -->
      <main class="main-content" id="main-viewport">
        <!-- View content dynamically rendered here -->
      </main>

      <!-- Medical Disclaimer Footer -->
      <footer class="disclaimer-banner">
        Gentle Play provides recreational and engagement activities. It is not a medical device, diagnostic tool, or treatment.
      </footer>

      <!-- Global Modal Container -->
      <div id="modal-host" style="display:none;"></div>
    `;

    this.renderLibraryView();
  }

  setupEvents() {
    document.getElementById('brand-home').addEventListener('click', () => this.renderLibraryView());
    document.getElementById('nav-library').addEventListener('click', () => this.renderLibraryView());
    document.getElementById('nav-memorybox').addEventListener('click', () => this.renderMemoryBoxView());
    document.getElementById('nav-caregiver').addEventListener('click', () => this.openCaregiverModal());

    window.addEventListener('open-youtube-modal', (e) => {
      if (e.detail) {
        this.openYouTubeModal(e.detail);
      }
    });
  }

  openYouTubeModal({ youtubeUrl, youtubeId, title }) {
    const directUrl = youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`;
    const modalHost = document.getElementById('modal-host');
    modalHost.style.display = 'flex';
    modalHost.className = 'modal-overlay';
    modalHost.innerHTML = `
      <div class="modal-card youtube-modal-card">
        <h2 class="modal-title">🎬 YouTube Music Player</h2>
        <p style="font-size: 1.1rem; color: var(--accent-gold); margin-bottom: 12px; font-weight: 700;">${title}</p>
        
        <div class="youtube-player-container">
          <iframe 
            width="100%" 
            height="315" 
            src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1" 
            title="${title}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>

        <div style="margin-top: 16px; margin-bottom: 16px;">
          <a href="${directUrl}" target="_blank" rel="noopener noreferrer" class="nav-btn btn-primary" style="display: inline-flex; align-items: center; text-decoration: none;">
            🌐 Open Direct Video on YouTube
          </a>
        </div>

        <div class="modal-actions">
          <button class="nav-btn" id="btn-close-yt-modal">Close & Return to Game</button>
        </div>
      </div>
    `;

    document.getElementById('btn-close-yt-modal').addEventListener('click', () => {
      modalHost.style.display = 'none';
      modalHost.innerHTML = '';
    });
  }

  renderLibraryView() {
    this.gameManager.destroyGame();
    this.updateActiveNav('nav-library');

    const viewport = document.getElementById('main-viewport');
    
    const categories = ['All', 'Memory & Reminiscence', 'Simple Games', 'Words', 'Pictures', 'Movement', 'Play Together'];

    viewport.innerHTML = `
      <div class="library-view">
        <div class="hero-banner">
          <h1 class="hero-title">Welcome to Gentle Play</h1>
          <p class="hero-subtitle">Interactive, tactile memory activities designed for warmth, peaceful focus, and joy.</p>
        </div>

        <div class="category-filter">
          ${categories.map(cat => `
            <button class="filter-chip ${cat === this.activeCategory ? 'active' : ''}" data-category="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>

        <div class="games-grid">
          ${this.getFilteredGames().map(game => `
            <div class="game-card" data-game-id="${game.id}">
              <div>
                <div class="game-card-icon">${game.icon}</div>
                <div class="game-card-title">${game.title}</div>
                <div class="game-card-desc">${game.description}</div>
              </div>
              <span class="game-card-badge">${game.badge}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Filter Listeners
    viewport.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        globalAudio.playClick();
        this.activeCategory = e.target.getAttribute('data-category');
        this.renderLibraryView();
      });
    });

    // Game Card Launchers
    viewport.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', (e) => {
        globalAudio.playClick();
        const gameId = card.getAttribute('data-game-id');
        this.launchGame(gameId);
      });
    });
  }

  getFilteredGames() {
    if (this.activeCategory === 'All') return GAMES_LIBRARY;
    return GAMES_LIBRARY.filter(g => g.category === this.activeCategory);
  }

  launchGame(gameId) {
    this.currentGameId = gameId;
    const gameMeta = GAMES_LIBRARY.find(g => g.id === gameId) || { title: 'Activity', icon: '🎮' };

    const viewport = document.getElementById('main-viewport');
    viewport.innerHTML = `
      <div class="game-view">
        <div class="game-toolbar">
          <div class="game-toolbar-info">
            <button class="nav-btn btn-icon" id="btn-game-back">⬅️</button>
            <h2 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main);">${gameMeta.icon} ${gameMeta.title}</h2>
          </div>

          <div style="display: flex; gap: 12px;">
            <button class="nav-btn" id="btn-game-hint">❓ Hint</button>
            <button class="nav-btn" id="btn-game-voice">🔊 Voice ON</button>
          </div>
        </div>

        <div class="game-canvas-host" id="game-canvas-container"></div>
      </div>
    `;

    document.getElementById('btn-game-back').addEventListener('click', () => {
      globalAudio.playClick();
      this.renderLibraryView();
    });

    document.getElementById('btn-game-hint').addEventListener('click', () => {
      globalAudio.playClick();
      this.gameManager.requestHint();
    });

    const btnVoice = document.getElementById('btn-game-voice');
    btnVoice.addEventListener('click', () => {
      globalAudio.playClick();
      globalAccessibility.toggleVoice();
      btnVoice.innerText = globalAudio.voiceEnabled ? "🔊 Voice ON" : "🔇 Voice OFF";
    });

    // Start Phaser Game Instance
    this.gameManager.startGame(gameId, 'gentle', () => this.showSessionCompleteModal());
  }

  renderMemoryBoxView() {
    this.gameManager.destroyGame();
    this.updateActiveNav('nav-memorybox');

    const viewport = document.getElementById('main-viewport');
    viewport.innerHTML = `
      <div class="library-view">
        <div class="hero-banner">
          <h1 class="hero-title">🖼️ Personal Memory Box</h1>
          <p class="hero-subtitle">Reminiscence album of personal family memories, photographs, and stories.</p>
        </div>

        <div style="margin-bottom: 24px; display: flex; justify-content: flex-end;">
          <button class="nav-btn active" id="btn-add-memory">+ Add New Memory Item</button>
        </div>

        <div class="games-grid">
          ${this.memoryBoxItems.map(item => `
            <div class="game-card memory-item-card" data-mem-id="${item.id}">
              <div class="game-card-icon">${item.icon || '📸'}</div>
              <div class="game-card-title">${item.title}</div>
              <div class="game-card-desc">${item.story}</div>
              <button class="nav-btn btn-primary" style="margin-top: 12px;">🔊 Listen & Tell Story</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('btn-add-memory').addEventListener('click', () => this.openAddMemoryModal());

    viewport.querySelectorAll('.memory-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const memId = card.getAttribute('data-mem-id');
        const item = this.memoryBoxItems.find(m => m.id === memId);
        if (item) {
          globalAudio.speakText(`${item.title}. ${item.story}`);
        }
      });
    });
  }

  openCaregiverModal() {
    const modalHost = document.getElementById('modal-host');
    modalHost.style.display = 'flex';
    modalHost.className = 'modal-overlay';
    modalHost.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">⚙️ Caregiver & Accessibility Suite</h2>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Text Size Scaling</label>
            <select class="form-select" id="select-font-size">
              <option value="normal" ${globalAccessibility.fontSizeMode==='normal'?'selected':''}>Normal (100%)</option>
              <option value="large" ${globalAccessibility.fontSizeMode==='large'?'selected':''}>Large (125%)</option>
              <option value="extra-large" ${globalAccessibility.fontSizeMode==='extra-large'?'selected':''}>Extra Large (150%)</option>
              <option value="max" ${globalAccessibility.fontSizeMode==='max'?'selected':''}>Max Size (175%)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">High Contrast Mode</label>
            <button class="nav-btn" id="btn-toggle-contrast" style="width: 100%;">
              ${globalAccessibility.highContrast ? 'ON' : 'OFF'}
            </button>
          </div>

          <div class="form-group">
            <label class="form-label">Reduced Motion</label>
            <button class="nav-btn" id="btn-toggle-motion" style="width: 100%;">
              ${globalAccessibility.reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button class="nav-btn btn-primary" id="btn-close-modal">Save & Close</button>
        </div>
      </div>
    `;

    document.getElementById('select-font-size').addEventListener('change', (e) => {
      globalAccessibility.setFontSize(e.target.value);
    });

    const btnContrast = document.getElementById('btn-toggle-contrast');
    btnContrast.addEventListener('click', () => {
      globalAccessibility.toggleHighContrast();
      btnContrast.innerText = globalAccessibility.highContrast ? 'ON' : 'OFF';
    });

    const btnMotion = document.getElementById('btn-toggle-motion');
    btnMotion.addEventListener('click', () => {
      globalAccessibility.toggleReducedMotion();
      btnMotion.innerText = globalAccessibility.reducedMotion ? 'ON' : 'OFF';
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => {
      modalHost.style.display = 'none';
    });
  }

  openAddMemoryModal() {
    const modalHost = document.getElementById('modal-host');
    modalHost.style.display = 'flex';
    modalHost.className = 'modal-overlay';
    modalHost.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">🖼️ Add Personal Memory</h2>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Memory Title</label>
            <input type="text" class="form-input" id="input-mem-title" placeholder="e.g. 1965 Summer Vacation">
          </div>
          <div class="form-group">
            <label class="form-label">Memory Story / Caption</label>
            <textarea class="form-textarea" id="input-mem-story" rows="3" placeholder="Describe the warm reminiscence story..."></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button class="nav-btn btn-primary" id="btn-save-mem">Save to Memory Box</button>
          <button class="nav-btn" id="btn-cancel-mem">Cancel</button>
        </div>
      </div>
    `;

    document.getElementById('btn-cancel-mem').addEventListener('click', () => {
      modalHost.style.display = 'none';
    });

    document.getElementById('btn-save-mem').addEventListener('click', () => {
      const title = document.getElementById('input-mem-title').value || 'Memory Story';
      const story = document.getElementById('input-mem-story').value || 'Warm nostalgic reminiscence moment.';
      
      this.memoryBoxItems.push({
        id: `mem_${Date.now()}`,
        title,
        story,
        icon: '📸'
      });
      this._saveMemoryBoxStorage();
      modalHost.style.display = 'none';
      this.renderMemoryBoxView();
    });
  }

  showSessionCompleteModal() {
    globalAudio.playFanfare();
    globalAudio.speakText("Wonderful job! Activity completed.");

    const modalHost = document.getElementById('modal-host');
    modalHost.style.display = 'flex';
    modalHost.className = 'modal-overlay';
    modalHost.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">✨ Wonderful Accomplishment!</h2>
        <p class="modal-body">You engaged with warmth, patience, and focus. Take your time to enjoy the moment!</p>
        
        <div class="modal-actions">
          <button class="nav-btn btn-primary" id="btn-play-again">Play Again</button>
          <button class="nav-btn" id="btn-try-else">Try Something Else</button>
        </div>
      </div>
    `;

    document.getElementById('btn-play-again').addEventListener('click', () => {
      modalHost.style.display = 'none';
      if (this.currentGameId) this.launchGame(this.currentGameId);
    });

    document.getElementById('btn-try-else').addEventListener('click', () => {
      modalHost.style.display = 'none';
      this.renderLibraryView();
    });
  }

  updateActiveNav(activeId) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(activeId);
    if (btn) btn.classList.add('active');
  }
}
