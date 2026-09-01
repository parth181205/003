/* =====================================================
   hub.js — Hub screen animations and rendering
   Tile previews, health ring, weekly chart
   ===================================================== */

const Hub = (() => {

  function init() {
    // Draw all tile previews
    const previews = [
      { id: 'preview-memory',   fn: CanvasEngine.drawMemoryPreview      },
      { id: 'preview-simon',    fn: CanvasEngine.drawSimonPreview       },
      { id: 'preview-word',     fn: CanvasEngine.drawWordPreview        },
      { id: 'preview-puzzle',   fn: CanvasEngine.drawPuzzlePreview     },
      { id: 'preview-sort',     fn: CanvasEngine.drawSortPreview       },
      { id: 'preview-spot',     fn: CanvasEngine.drawSpotPreview       },
      { id: 'preview-garden',   fn: CanvasEngine.drawGardenTapPreview  },
      { id: 'preview-numtrail', fn: CanvasEngine.drawNumberTrailPreview },
    ];
    previews.forEach(({ id, fn }) => {
      const c = document.getElementById(id);
      if (c) fn(c);
    });

    // Health ring
    updateHealthRing();
    // Stars
    updateStarDisplays();
    // Stats
    updateStats();
    // Daily challenge
    updateDailyChallenge();
  }

  function updateHealthRing() {
    const canvas  = document.getElementById('health-ring-canvas');
    const label   = document.getElementById('ring-percent');
    if (!canvas) return;
    const pct = ScoreTracker.getTodayProgress();
    CanvasEngine.drawHealthRing(canvas, pct);
    if (label) label.textContent = pct + '%';
  }

  function updateStarDisplays() {
    const games = ['memory','simon','word','puzzle','sort','spot','garden','numtrail'];
    games.forEach(g => {
      const el = document.getElementById(`stars-${g}`);
      if (el) el.textContent = ScoreTracker.getStarsDisplay(g);
    });
  }

  function updateStats() {
    const data = ScoreTracker.get();
    const gp   = document.getElementById('games-played-count');
    const ts   = document.getElementById('total-stars-count');
    const str  = document.getElementById('streak-count');
    const navStr = document.getElementById('today-streak');
    if (gp)  gp.textContent  = data.totalGamesPlayed || 0;
    if (ts)  ts.textContent  = data.totalStars || 0;
    if (str) str.textContent = data.streak || 1;
    if (navStr) navStr.textContent = `🔥 ${data.streak || 1}`;
  }

  function updateDailyChallenge() {
    const gameNames = {
      memory:   'Memory Match',
      simon:    'Rainbow Drumbeat',
      word:     'Word Bloom',
      puzzle:   'Picture Puzzle',
      sort:     'Sort Garden',
      spot:     'Spot It!',
      garden:   'Garden Tap',
      numtrail: 'Number Trail',
    };
    const key = ScoreTracker.getDailyChallenge();
    const el  = document.getElementById('challenge-name');
    if (el) el.textContent = gameNames[key] || 'Memory Match';
  }

  function renderCaregiverDashboard() {
    const data = ScoreTracker.get();

    // Player name
    const nameEl = document.getElementById('dash-player-name');
    if (nameEl) nameEl.textContent = `🌟 ${data.playerName || 'Player'}'s Progress`;

    // Summary
    document.getElementById('dash-total-games').textContent = data.totalGamesPlayed || 0;
    document.getElementById('dash-total-stars').textContent = data.totalStars || 0;
    document.getElementById('dash-streak').textContent      = data.streak || 1;

    // Per-game progress cards
    const container = document.getElementById('progress-cards-container');
    if (container) {
      const gamesMeta = [
        { key:'memory',   emoji:'🃏', name:'Memory Match'     },
        { key:'simon',    emoji:'🌈', name:'Rainbow Drumbeat' },
        { key:'word',     emoji:'🌸', name:'Word Bloom'       },
        { key:'puzzle',   emoji:'🧩', name:'Picture Puzzle'   },
        { key:'sort',     emoji:'🌿', name:'Sort Garden'      },
        { key:'spot',     emoji:'🔍', name:'Spot It!'         },
        { key:'garden',   emoji:'🌼', name:'Garden Tap'       },
        { key:'numtrail', emoji:'🔢', name:'Number Trail'     },
      ];
      container.innerHTML = '';
      gamesMeta.forEach(gm => {
        const g    = data.games[gm.key] || { plays:0, bestStars:0 };
        const best = g.bestStars || 0;
        const stars= '★'.repeat(best) + '☆'.repeat(3-best);
        const card = document.createElement('div');
        card.className = 'progress-card';
        card.innerHTML = `
          <div class="progress-card-icon">${gm.emoji}</div>
          <div class="progress-card-name">${gm.name}</div>
          <div class="progress-card-stars" style="color:#F0A500">${stars}</div>
          <div class="progress-card-plays">${g.plays} session${g.plays!==1?'s':''}</div>
        `;
        container.appendChild(card);
      });
    }

    // Weekly chart
    const chartCanvas = document.getElementById('weekly-chart-canvas');
    if (chartCanvas) {
      chartCanvas.width = chartCanvas.parentElement.clientWidth || 600;
      CanvasEngine.drawWeeklyChart(chartCanvas, data.weeklyActivity || [0,0,0,0,0,0,0]);
    }
  }

  return { init, updateHealthRing, updateStarDisplays, updateStats, renderCaregiverDashboard };
})();
