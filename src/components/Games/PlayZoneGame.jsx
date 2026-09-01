import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, RotateCcw, CheckCircle, ArrowRight, Star } from 'lucide-react';

// ─── CALM THEME ────────────────────────────────────────────────────────────────
const card  = 'bg-white/80 backdrop-blur border border-sky-100 rounded-3xl shadow-sm';
const btn   = 'rounded-2xl font-bold transition-all active:scale-95 select-none';
const h1cls = 'text-2xl font-black text-sky-800';
const sub   = 'text-sm text-sky-600/80';

// ─── GAME 1 — COLOR MATCH ──────────────────────────────────────────────────────
const COLORS = [
  { name:'Red',    hex:'#ef4444' },
  { name:'Blue',   hex:'#3b82f6' },
  { name:'Green',  hex:'#22c55e' },
  { name:'Yellow', hex:'#eab308' },
  { name:'Purple', hex:'#a855f7' },
  { name:'Orange', hex:'#f97316' },
];

function ColorMatch({ onScore }) {
  const [word, setWord]       = useState(null);
  const [inkColor, setInk]    = useState(null);
  const [opts, setOpts]       = useState([]);
  const [msg, setMsg]         = useState('');
  const [score, setScore]     = useState(0);
  const [round, setRound]     = useState(0);
  const [done, setDone]       = useState(false);
  const ROUNDS = 8;

  const next = useCallback(() => {
    if (round >= ROUNDS) { setDone(true); onScore(score); return; }
    const w = COLORS[Math.floor(Math.random() * COLORS.length)];
    let ink;
    // 50% chance word matches ink
    if (Math.random() > 0.5) { ink = w; }
    else { do { ink = COLORS[Math.floor(Math.random() * COLORS.length)]; } while (ink.name === w.name); }
    setWord(w); setInk(ink); setMsg('');
    // options = ink name + 3 distractors
    const pool = COLORS.filter(c => c.name !== ink.name).sort(() => Math.random() - 0.5).slice(0,3);
    setOpts([ink, ...pool].sort(() => Math.random() - 0.5));
  }, [round, score, onScore]);

  useEffect(() => { next(); }, []);

  const pick = (c) => {
    if (c.name === inkColor.name) {
      setMsg('✅ Correct!'); setScore(s => s + 1);
    } else {
      setMsg(`❌ It was ${inkColor.name}`);
    }
    setRound(r => r + 1);
    setTimeout(next, 900);
  };

  if (done) return <ScoreCard score={score} max={ROUNDS} label="Color Match" onReplay={() => { setScore(0); setRound(0); setDone(false); next(); }} />;

  return (
    <div className="space-y-6 text-center">
      <p className="text-sky-600 font-semibold text-sm">Round {round + 1} / {ROUNDS} — What COLOR is the ink?</p>
      <div className="py-8">
        <span className="text-6xl sm:text-7xl font-black tracking-tight" style={{ color: inkColor?.hex }}>
          {word?.name}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {opts.map(c => (
          <button key={c.name} onClick={() => pick(c)}
            className={`${btn} py-4 text-white font-black text-lg shadow-md hover:scale-105`}
            style={{ background: c.hex }}>
            {c.name}
          </button>
        ))}
      </div>
      {msg && <p className="font-bold text-lg text-sky-700 animate-pulse">{msg}</p>}
    </div>
  );
}

// ─── GAME 2 — NUMBER MEMORY ────────────────────────────────────────────────────
function NumberMemory({ onScore }) {
  const [phase, setPhase]   = useState('show'); // show | recall
  const [digits, setDigits] = useState([]);
  const [input, setInput]   = useState('');
  const [level, setLevel]   = useState(3);
  const [score, setScore]   = useState(0);
  const [msg, setMsg]       = useState('');
  const [done, setDone]     = useState(false);
  const [round, setRound]   = useState(0);
  const ROUNDS = 6;

  const newRound = useCallback((lv) => {
    const len = lv;
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 10));
    setDigits(arr); setPhase('show'); setInput(''); setMsg('');
    setTimeout(() => setPhase('recall'), 2000 + lv * 400);
  }, []);

  useEffect(() => { newRound(level); }, []);

  const submit = () => {
    if (input === digits.join('')) {
      setMsg('✅ Perfect!'); setScore(s => s + level);
      const next = level + 1;
      setLevel(next); setRound(r => r + 1);
      if (round + 1 >= ROUNDS) { setTimeout(() => { setDone(true); onScore(score + level); }, 800); }
      else setTimeout(() => newRound(next), 1000);
    } else {
      setMsg(`❌ It was: ${digits.join('')}`);
      setRound(r => r + 1);
      if (round + 1 >= ROUNDS) { setTimeout(() => { setDone(true); onScore(score); }, 1200); }
      else setTimeout(() => newRound(level), 1200);
    }
  };

  if (done) return <ScoreCard score={score} max={ROUNDS * 6} label="Number Memory" onReplay={() => { setScore(0); setLevel(3); setRound(0); setDone(false); newRound(3); }} />;

  return (
    <div className="space-y-6 text-center max-w-sm mx-auto">
      <p className="text-sky-600 font-semibold text-sm">Round {round + 1} / {ROUNDS} — Remember the number!</p>
      <div className="py-8 min-h-[100px] flex items-center justify-center">
        {phase === 'show' ? (
          <span className="text-5xl font-black tracking-[0.3em] text-sky-800">{digits.join(' ')}</span>
        ) : (
          <p className="text-sky-400 text-xl font-bold animate-pulse">Now type the number…</p>
        )}
      </div>
      {phase === 'recall' && (
        <div className="space-y-3">
          <input value={input} onChange={e => setInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="w-full text-center text-3xl font-black py-4 rounded-2xl border-2 border-sky-200 focus:border-sky-400 outline-none bg-white/80 text-sky-800"
            placeholder="Type digits…" autoFocus maxLength={digits.length + 2} />
          <button onClick={submit}
            className={`${btn} w-full py-3 bg-sky-500 hover:bg-sky-400 text-white text-lg`}>
            Check ✓
          </button>
        </div>
      )}
      {msg && <p className="font-bold text-lg text-sky-700">{msg}</p>}
    </div>
  );
}

// ─── GAME 3 — PATTERN TAP ─────────────────────────────────────────────────────
const PAT_COLORS = ['#38bdf8','#818cf8','#34d399','#fb923c','#f472b6','#facc15'];

function PatternTap({ onScore }) {
  const [pattern, setPat]     = useState([]);
  const [userSeq, setUser]    = useState([]);
  const [show, setShow]       = useState(false);
  const [active, setActive]   = useState(null);
  const [score, setScore]     = useState(0);
  const [round, setRound]     = useState(0);
  const [msg, setMsg]         = useState('');
  const [done, setDone]       = useState(false);
  const [canTap, setCanTap]   = useState(false);
  const ROUNDS = 6;

  const flash = useCallback((pat) => {
    setShow(true); setCanTap(false); setActive(null);
    let i = 0;
    const iv = setInterval(() => {
      if (i < pat.length) { setActive(pat[i]); i++; }
      else { clearInterval(iv); setActive(null); setShow(false); setCanTap(true); }
    }, 700);
  }, []);

  const startRound = useCallback((rd) => {
    const len = 3 + rd;
    const pat = Array.from({ length: len }, () => Math.floor(Math.random() * 6));
    setPat(pat); setUser([]); setMsg('');
    setTimeout(() => flash(pat), 600);
  }, [flash]);

  useEffect(() => { startRound(0); }, []);

  const tap = (idx) => {
    if (!canTap) return;
    const newSeq = [...userSeq, idx];
    setUser(newSeq);
    if (newSeq[newSeq.length - 1] !== pattern[newSeq.length - 1]) {
      setMsg('❌ Wrong order! Watch again.');
      setCanTap(false);
      setRound(r => r + 1);
      if (round + 1 >= ROUNDS) { setTimeout(() => { setDone(true); onScore(score); }, 1000); }
      else setTimeout(() => startRound(round + 1), 1200);
    } else if (newSeq.length === pattern.length) {
      setMsg('✅ Great!'); setScore(s => s + pattern.length); setCanTap(false);
      setRound(r => r + 1);
      if (round + 1 >= ROUNDS) { setTimeout(() => { setDone(true); onScore(score + pattern.length); }, 1000); }
      else setTimeout(() => startRound(round + 1), 1000);
    }
  };

  if (done) return <ScoreCard score={score} max={45} label="Pattern Tap" onReplay={() => { setScore(0); setRound(0); setDone(false); startRound(0); }} />;

  return (
    <div className="space-y-6 text-center">
      <p className="text-sky-600 font-semibold text-sm">
        {show ? 'Watch the pattern...' : canTap ? `Tap the same pattern! (${userSeq.length}/${pattern.length})` : 'Get ready...'}
      </p>
      <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
        {PAT_COLORS.map((col, i) => (
          <button key={i} onClick={() => tap(i)}
            className={`${btn} aspect-square rounded-3xl shadow-lg hover:scale-110`}
            style={{
              background: col,
              opacity: active === i ? 1 : 0.35,
              transform: active === i ? 'scale(1.15)' : undefined,
              boxShadow: active === i ? `0 0 24px ${col}` : undefined,
            }} />
        ))}
      </div>
      {msg && <p className="font-bold text-lg text-sky-700">{msg}</p>}
    </div>
  );
}

// ─── GAME 4 — WORD SCRAMBLE ────────────────────────────────────────────────────
const WORDS = ['APPLE','CLOUD','RIVER','LIGHT','MUSIC','HAPPY','PEACE','HEART','SMILE','OCEAN','DREAM','BREAD','CHAIR','FLOWER'];

function WordScramble({ onScore }) {
  const [word, setWord]     = useState('');
  const [scrambled, setSc]  = useState('');
  const [input, setInput]   = useState('');
  const [msg, setMsg]       = useState('');
  const [score, setScore]   = useState(0);
  const [round, setRound]   = useState(0);
  const [done, setDone]     = useState(false);
  const [hint, setHint]     = useState(false);
  const ROUNDS = 7;

  const nextWord = useCallback((rd) => {
    if (rd >= ROUNDS) { setDone(true); onScore(score); return; }
    const w = WORDS[rd % WORDS.length];
    const sc = w.split('').sort(() => Math.random() - 0.5).join('');
    setWord(w); setSc(sc); setInput(''); setMsg(''); setHint(false);
  }, [score, onScore]);

  useEffect(() => { nextWord(0); }, []);

  const submit = () => {
    if (input.toUpperCase() === word) {
      const pts = hint ? 1 : 2;
      setMsg(`✅ Correct! +${pts} pts`); setScore(s => s + pts);
    } else {
      setMsg(`❌ The word was: ${word}`);
    }
    setRound(r => r + 1);
    setTimeout(() => nextWord(round + 1), 1100);
  };

  if (done) return <ScoreCard score={score} max={ROUNDS * 2} label="Word Scramble" onReplay={() => { setScore(0); setRound(0); setDone(false); nextWord(0); }} />;

  return (
    <div className="space-y-6 text-center max-w-sm mx-auto">
      <p className="text-sky-600 font-semibold text-sm">Round {round + 1} / {ROUNDS} — Unscramble the word!</p>
      <div className="py-6">
        <p className="text-5xl font-black tracking-widest text-sky-700">{scrambled}</p>
        {hint && <p className="text-sky-400 text-sm mt-2">Hint: starts with <strong>{word[0]}</strong>, {word.length} letters</p>}
      </div>
      <div className="space-y-3">
        <input value={input} onChange={e => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          onKeyDown={e => e.key === 'Enter' && submit()}
          className="w-full text-center text-2xl font-black py-4 rounded-2xl border-2 border-sky-200 focus:border-sky-400 outline-none bg-white/80 text-sky-800"
          placeholder="Your answer…" autoFocus />
        <div className="flex gap-2">
          <button onClick={submit} className={`${btn} flex-1 py-3 bg-sky-500 hover:bg-sky-400 text-white`}>Check ✓</button>
          <button onClick={() => setHint(true)} className={`${btn} px-4 py-3 bg-sky-100 hover:bg-sky-200 text-sky-700`}>Hint?</button>
        </div>
      </div>
      {msg && <p className="font-bold text-lg text-sky-700">{msg}</p>}
    </div>
  );
}

// ─── SHARED SCORE CARD ─────────────────────────────────────────────────────────
function ScoreCard({ score, max, label, onReplay }) {
  const pct = Math.round((score / max) * 100);
  const grade = pct >= 80 ? '🏆 Excellent!' : pct >= 60 ? '⭐ Well Done!' : '💪 Keep Practicing!';
  return (
    <div className="text-center space-y-5 py-6">
      <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '💪'}</div>
      <h3 className="text-2xl font-black text-sky-800">{grade}</h3>
      <p className="text-sky-600">{label} Complete</p>
      <div className="max-w-xs mx-auto space-y-1">
        <div className="flex justify-between text-sm font-bold text-sky-700">
          <span>Score</span><span>{score} / {max}</span>
        </div>
        <div className="w-full bg-sky-100 rounded-full h-4">
          <div className="h-4 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <button onClick={onReplay} className={`${btn} px-8 py-3 bg-sky-500 hover:bg-sky-400 text-white flex items-center gap-2 mx-auto`}>
        <RotateCcw className="w-4 h-4" /> Play Again
      </button>
    </div>
  );
}

// ─── GAME REGISTRY ─────────────────────────────────────────────────────────────
import { TicTacTangoGame } from './TicTacTangoGame';

const GAMES = [
  { id:'tango',   title:'Tic-Tac-Tango (Shared Play)', emoji:'🤝', desc:'Play with a friend or caregiver', component: TicTacTangoGame },
  { id:'color',   title:'Color Match',    emoji:'🎨', desc:'Name the ink color, not the word',    component: ColorMatch   },
  { id:'number',  title:'Number Memory',  emoji:'🔢', desc:'Remember and type the digit sequence', component: NumberMemory },
  { id:'pattern', title:'Pattern Tap',    emoji:'💡', desc:'Repeat the flashing light sequence',   component: PatternTap   },
  { id:'word',    title:'Word Scramble',  emoji:'🔤', desc:'Unscramble the letters to find the word', component: WordScramble },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export const PlayZoneGame = ({ onExit }) => {
  const [selected, setSelected] = useState(null);
  const [gameScore, setGameScore] = useState(null);

  const handleScore = (s) => setGameScore(s);

  if (!selected) return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-2">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 px-4 py-2 rounded-full">
          <Brain className="w-5 h-5 text-sky-500" />
          <span className="font-black text-sky-700 text-sm">Brain Play Zone</span>
        </div>
        <h2 className={h1cls}>Choose Your Brain Game</h2>
        <p className={sub}>Fun, gentle exercises to keep your mind sharp</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GAMES.map(g => (
          <button key={g.id} onClick={() => { setSelected(g); setGameScore(null); }}
            className="text-left p-6 rounded-3xl border-2 border-sky-100 bg-white/70 backdrop-blur hover:border-sky-300 hover:shadow-lg transition-all group">
            <div className="text-4xl mb-3">{g.emoji}</div>
            <h3 className="font-black text-sky-800 text-lg mb-1">{g.title}</h3>
            <p className="text-sky-500 text-sm">{g.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-sky-400 text-xs font-bold group-hover:text-sky-600 transition">
              Play <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>

      {onExit && (
        <div className="text-center">
          <button onClick={onExit} className={`${btn} px-6 py-2 bg-sky-50 border border-sky-200 text-sky-600 hover:bg-sky-100 text-sm`}>
            ← Back to Home
          </button>
        </div>
      )}
    </div>
  );

  const GameComponent = selected.component;

  return (
    <div className="w-full max-w-xl mx-auto p-2 space-y-4">
      {/* Game header */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 border border-sky-100 shadow-sm">
        <span className="text-3xl">{selected.emoji}</span>
        <div className="flex-1">
          <h2 className="font-black text-sky-800">{selected.title}</h2>
          <p className="text-sky-500 text-xs">{selected.desc}</p>
        </div>
        <button onClick={() => setSelected(null)}
          className={`${btn} px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-600 text-xs hover:bg-sky-100`}>
          ← Games
        </button>
      </div>

      {/* Game card */}
      <div className={`${card} p-6`}>
        <GameComponent onScore={handleScore} />
      </div>
    </div>
  );
};
