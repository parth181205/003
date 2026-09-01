/* =====================================================
   ScoreTracker.js — Persistent score + progress tracker
   localStorage-backed; used by all games and caregiver view
   ===================================================== */

const ScoreTracker = (() => {
  const STORAGE_KEY = 'smritiplay_v1';

  function defaultData() {
    return {
      playerName: '',
      difficulty: 'gentle',
      streak: 1,
      lastPlayed: null,
      gamesPlayedToday: 0,
      totalGamesPlayed: 0,
      totalStars: 0,
      weeklyActivity: [0, 0, 0, 0, 0, 0, 0], // Mon–Sun
      games: {
        memory:   { plays: 0, bestStars: 0, totalStars: 0 },
        simon:    { plays: 0, bestStars: 0, totalStars: 0 },
        word:     { plays: 0, bestStars: 0, totalStars: 0 },
        puzzle:   { plays: 0, bestStars: 0, totalStars: 0 },
        sort:     { plays: 0, bestStars: 0, totalStars: 0 },
        spot:     { plays: 0, bestStars: 0, totalStars: 0 },
        garden:   { plays: 0, bestStars: 0, totalStars: 0 },
        numtrail: { plays: 0, bestStars: 0, totalStars: 0 },
      }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultData();
      const data = JSON.parse(raw);
      // Merge defaults for any missing keys
      return Object.assign(defaultData(), data);
    } catch (e) {
      return defaultData();
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* storage full — graceful skip */ }
  }

  function get() { return load(); }

  function setProfile(name, difficulty) {
    const d = load();
    d.playerName = name;
    d.difficulty = difficulty;
    save(d);
  }

  function recordGameResult(gameKey, stars) {
    const d = load();
    const today = new Date();
    const todayStr = today.toDateString();

    // Streak logic
    if (d.lastPlayed) {
      const last = new Date(d.lastPlayed);
      const diff = Math.floor((today - last) / 86400000);
      if (diff === 1) {
        d.streak = (d.streak || 1) + 1;
      } else if (diff > 1) {
        d.streak = 1;
      }
    }

    if (d.lastPlayed !== todayStr) {
      d.gamesPlayedToday = 0;
    }
    d.lastPlayed = todayStr;

    d.gamesPlayedToday = (d.gamesPlayedToday || 0) + 1;
    d.totalGamesPlayed = (d.totalGamesPlayed || 0) + 1;
    d.totalStars = (d.totalStars || 0) + stars;

    // Weekly (0=Mon)
    const dayIndex = (today.getDay() + 6) % 7;
    if (!d.weeklyActivity) d.weeklyActivity = [0,0,0,0,0,0,0];
    d.weeklyActivity[dayIndex] = (d.weeklyActivity[dayIndex] || 0) + 1;

    // Per-game
    if (!d.games[gameKey]) d.games[gameKey] = { plays: 0, bestStars: 0, totalStars: 0 };
    d.games[gameKey].plays++;
    d.games[gameKey].totalStars += stars;
    d.games[gameKey].bestStars = Math.max(d.games[gameKey].bestStars, stars);

    save(d);
    return d;
  }

  function getTodayProgress() {
    const d = load();
    const total = Object.keys(d.games).length; // 8 games
    const played = Object.values(d.games).filter(g => g.plays > 0).length;
    return Math.round((played / total) * 100);
  }

  function getStarsDisplay(gameKey) {
    const d = load();
    const best = d.games[gameKey]?.bestStars || 0;
    return '★'.repeat(best) + '☆'.repeat(3 - best);
  }

  function getDailyChallenge() {
    const games = ['memory','simon','word','puzzle','sort','spot','garden','numtrail'];
    const dayOfYear = Math.floor(Date.now() / 86400000);
    return games[dayOfYear % games.length];
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { get, setProfile, recordGameResult, getTodayProgress, getStarsDisplay, getDailyChallenge, clearAll };
})();
