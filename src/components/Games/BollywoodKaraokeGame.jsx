import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, RotateCcw, Star, Play, Pause } from 'lucide-react';

// ─── FULL SONG LYRICS ──────────────────────────────────────────────────────────
const SONGS = [
  {
    id: 'bolly_1',
    title: 'Lag Jaa Gale',
    movie: 'Woh Kaun Thi (1964)',
    singer: 'Lata Mangeshkar',
    emoji: '🌹',
    color: '#be185d',
    grad: 'from-pink-950 via-rose-900 to-slate-900',
    audioFile: '/audio/bolly_1.m4a',
    instFile: '/audio/inst_bolly_1.m4a',
    lyrics: [
      { text: 'Lag jaa gale ke phir haseen' },
      { text: 'Raat ho na ho' },
      { text: 'Shayad phir is janam mein' },
      { text: 'Mulaqaat ho na ho' },
      { text: 'Lag jaa gale' },
      { text: 'Hum ko mili hai aaj' },
      { text: 'Yeh ghadiyaan nasib se' },
      { text: 'Jee bhar ke dekh lo' },
      { text: 'Hum ko na phir yeh zindagi mein' },
      { text: 'Deedar ho na ho' },
      { text: 'Shayad phir is janam mein' },
      { text: 'Mulaqaat ho na ho' },
      { text: 'Lag jaa gale' },
      { text: 'Paas aao ke armaano ki' },
      { text: 'Baat kar le hum' },
      { text: 'Dil mein hai jo baat' },
      { text: 'Bhool jaaye us se pehle kar le hum' },
      { text: 'Shayad phir is janam mein' },
      { text: 'Mulaqaat ho na ho' },
      { text: 'Lag jaa gale' },
    ],
  },
  {
    id: 'bolly_3',
    title: 'Kal Ho Naa Ho',
    movie: 'Kal Ho Na Ho (2003)',
    singer: 'Sonu Nigam',
    emoji: '💛',
    color: '#d97706',
    grad: 'from-amber-950 via-orange-900 to-slate-900',
    audioFile: '/audio/bolly_3.m4a',
    instFile: '/audio/inst_bolly_3.m4a',
    lyrics: [
      { text: 'Har pal yahan jee bhar jiyo' },
      { text: 'Jo hai samaa, kal ho na ho' },
      { text: 'Ye waqt jo hai gungunao' },
      { text: 'Jo beet jaaye, kal ho na ho' },
      { text: 'Kal ho na ho' },
      { text: 'Subah ki roshni aankhon mein bhar lo' },
      { text: 'Pyaasa waqt hai, seene se dhar lo' },
      { text: 'Door nahi teri manzil yahan se' },
      { text: 'Tu to kisi ka nahi, kal ho na ho' },
      { text: 'Har pal yahan jee bhar jiyo' },
      { text: 'Jo hai samaa, kal ho na ho' },
      { text: 'Hum ko yaqeen hai sach bolte hain hum' },
      { text: 'Khul ke jiyo tu, ghum ko bhulao tum' },
      { text: 'Kal ho na ho, kal ho na ho' },
    ],
  },
  {
    id: 'bolly_6',
    title: 'Tum Hi Ho',
    movie: 'Aashiqui 2 (2013)',
    singer: 'Arijit Singh',
    emoji: '🎵',
    color: '#7c3aed',
    grad: 'from-violet-950 via-purple-900 to-slate-900',
    audioFile: '/audio/bolly_6.m4a',
    instFile: '/audio/inst_bolly_6.m4a',
    lyrics: [
      { text: 'Hum tere bin ab reh nahi sakte' },
      { text: 'Tere bina kya wajood mera' },
      { text: 'Tujhse juda gar ho jaayenge' },
      { text: 'Toh khud se hi ho jaayenge judaa' },
      { text: 'Tum hi ho, tum hi ho' },
      { text: 'Ab tum hi ho, ab tum hi ho' },
      { text: 'Teri meri ek jindagi' },
      { text: 'Jab tum nahi, kuch bhi nahi' },
      { text: 'Tum hi ho, tum hi ho' },
      { text: 'Meri jo rahe sukoon ki' },
      { text: 'Aa tujhe roz jagane ki' },
      { text: 'Thodi si jo aankhon ki nami' },
      { text: 'Hum tere bin ab reh nahi sakte' },
      { text: 'Tum hi ho, tum hi ho' },
    ],
  },
  {
    id: 'bolly_7',
    title: 'Kabhi Kabhie',
    movie: 'Kabhi Kabhie (1976)',
    singer: 'Mukesh & Lata Mangeshkar',
    emoji: '🌙',
    color: '#0369a1',
    grad: 'from-sky-950 via-blue-900 to-slate-900',
    audioFile: '/audio/bolly_7.m4a',
    instFile: '/audio/inst_bolly_7.m4a',
    lyrics: [
      { text: 'Kabhi kabhie mere dil mein' },
      { text: 'Khayal aata hai' },
      { text: 'Ke jaise tujhko banaya gaya' },
      { text: 'Hai mere liye' },
      { text: 'Tu ab se pehle sitaron mein' },
      { text: 'Abaad thi kahin' },
      { text: 'Mujhe pata tha, tu aayegi' },
      { text: 'Nazaraat ban ke kahin' },
      { text: 'Kabhi kabhie mere dil mein' },
      { text: 'Khayal aata hai' },
      { text: 'Main pal do pal ka shayar hoon' },
      { text: 'Pal do pal meri kahani hai' },
      { text: 'Pal do pal meri hasti hai' },
      { text: 'Pal do pal meri jawani hai' },
    ],
  },
];

const PHASE = { SELECT: 'select', LISTEN: 'listen', SING: 'sing', DONE: 'done' };
const SING_SECS = 30; // Give user enough time to sing with instrumental

function WaveBars({ active, color = '#a78bfa', count = 20 }) {
  return (
    <div className="flex items-center justify-center gap-0.5 h-10">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-full" style={{
          width: 3, background: color,
          height: active ? `${25 + Math.sin(i * 0.8) * 40}%` : '12%',
          animation: active ? `waveBar ${0.4 + (i % 5) * 0.07}s ease-in-out infinite alternate` : 'none',
          animationDelay: `${i * 0.04}s`, opacity: active ? 0.85 : 0.25,
        }} />
      ))}
    </div>
  );
}

export const BollywoodKaraokeGame = ({ highContrast, onExit }) => {
  const [song, setSong] = useState(null);
  const [phase, setPhase] = useState(PHASE.SELECT);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micAllowed, setMicAllowed] = useState(null);
  const [singTimer, setSingTimer] = useState(SING_SECS);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const timerRef = useRef(null);
  const rafRef = useRef(null);

  const stopAll = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    try { recRef.current?.stop(); } catch {}
    setIsPlaying(false);
    setIsRecording(false);
  }, []);

  useEffect(() => () => stopAll(), [stopAll]);

  const trackTime = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
    rafRef.current = requestAnimationFrame(trackTime);
  };

  // ── LISTEN: play full vocal track ─────────────────────────────────────────
  const startListen = useCallback((s) => {
    stopAll();
    const audio = new Audio(s.audioFile);
    audioRef.current = audio;
    audio.volume = 1;
    audio.onplay = () => { setIsPlaying(true); rafRef.current = requestAnimationFrame(trackTime); };
    audio.onpause = () => { setIsPlaying(false); cancelAnimationFrame(rafRef.current); };
    audio.onended = () => { setIsPlaying(false); cancelAnimationFrame(rafRef.current); };
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.play().catch(() => {});
    setSong(s);
    setPhase(PHASE.LISTEN);
    setCurrentTime(0);
  }, [stopAll]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play();
    else audioRef.current.pause();
  }, []);

  const seekTo = useCallback((e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  }, [duration]);

  // ── SING: play instrumental backing track ────────────────────────────────
  const startSing = useCallback(async (s) => {
    stopAll();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicAllowed(true);
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      rec.start();
      setIsRecording(true);
    } catch { setMicAllowed(false); }

    const inst = new Audio(s.instFile);
    audioRef.current = inst;
    inst.volume = 0.75;
    inst.onplay = () => { setIsPlaying(true); rafRef.current = requestAnimationFrame(trackTime); };
    inst.onpause = () => { setIsPlaying(false); cancelAnimationFrame(rafRef.current); };
    inst.onended = () => { setIsPlaying(false); cancelAnimationFrame(rafRef.current); endSing(); };
    inst.onloadedmetadata = () => setDuration(inst.duration);
    inst.play().catch(() => {});
    setPhase(PHASE.SING);
    setCurrentTime(0);

    // Countdown timer
    let t = SING_SECS;
    setSingTimer(t);
    timerRef.current = setInterval(() => {
      t -= 1;
      setSingTimer(t);
      if (t <= 0) endSing();
    }, 1000);
  }, [stopAll]);

  const endSing = useCallback(() => {
    clearInterval(timerRef.current);
    stopAll();
    try { recRef.current?.stop(); } catch {}
    setIsRecording(false);
    setPhase(PHASE.DONE);
  }, [stopAll]);

  const resetToSelect = useCallback(() => {
    stopAll();
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setSong(null);
    setPhase(PHASE.SELECT);
  }, [stopAll]);

  const fmt = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  // ── SONG SELECT ──────────────────────────────────────────────────────────
  if (phase === PHASE.SELECT) return (
    <div className="w-full max-w-2xl mx-auto space-y-4 text-white">
      <div className="p-4 rounded-2xl border bg-purple-900/60 border-purple-500/40 flex items-center gap-3">
        <span className="text-4xl">🎤</span>
        <div className="flex-1">
          <h2 className="text-xl font-black">Bollywood Karaoke</h2>
          <p className="text-xs opacity-70">Real songs · Full lyrics · Sing along with the music!</p>
        </div>
        {onExit && <button onClick={onExit} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl font-bold">✕ Exit</button>}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {SONGS.map(s => (
          <button key={s.id} onClick={() => startListen(s)}
            className={`w-full text-left p-5 rounded-2xl border-2 bg-gradient-to-r ${s.grad} border-white/10 hover:border-white/40 transition group shadow-xl`}>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{s.emoji}</span>
              <div className="flex-1">
                <h3 className="text-xl font-black">{s.title}</h3>
                <p className="text-sm opacity-75">{s.movie}</p>
                <p className="text-xs opacity-60">Singer: {s.singer}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/20 group-hover:border-white/60 transition" style={{ background: s.color + '44' }}>
                  <Play className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs opacity-50">{s.lyrics.length} lines</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <style>{`@keyframes waveBar { from{transform:scaleY(0.3)} to{transform:scaleY(1)} }`}</style>
    </div>
  );

  // ── DONE SCREEN ──────────────────────────────────────────────────────────
  if (phase === PHASE.DONE) return (
    <div className="w-full max-w-lg mx-auto text-white">
      <div className={`p-8 rounded-3xl text-center space-y-5 bg-gradient-to-br ${song.grad} border-2 border-white/20 shadow-2xl`}>
        <div className="text-6xl">{song.emoji}</div>
        <h2 className="text-3xl font-black">🎤 Bahut Achha!</h2>
        <p className="text-xl opacity-80">{song.title}</p>
        <p className="opacity-60">You sang along with the full song. Wonderful!</p>
        <div className="flex gap-3 justify-center pt-2">
          <button onClick={() => startSing(song)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 font-black px-6 py-3 rounded-2xl transition">
            <Mic className="w-4 h-4" /> Sing Again
          </button>
          <button onClick={() => startListen(song)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 font-bold px-6 py-3 rounded-2xl transition">
            <Play className="w-4 h-4" /> Listen Again
          </button>
          <button onClick={resetToSelect} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 font-bold px-6 py-3 rounded-2xl transition">
            🎵 Pick Song
          </button>
        </div>
      </div>
    </div>
  );

  // ── MAIN GAME SCREEN (LISTEN / SING) ─────────────────────────────────────
  const isListen = phase === PHASE.LISTEN;
  const isSing = phase === PHASE.SING;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3 text-white">

      {/* Top bar */}
      <div className={`p-3 rounded-2xl border flex items-center gap-3 bg-gradient-to-r ${song.grad} border-white/20`}>
        <span className="text-3xl">{song.emoji}</span>
        <div className="flex-1">
          <h2 className="font-black text-base">{song.title}</h2>
          <p className="text-xs opacity-70">{song.movie} · {song.singer}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isListen ? 'bg-purple-500/50' : 'bg-green-500/50'}`}>
          {isListen ? '👂 LISTEN & FOLLOW' : '🎤 SING ALONG'}
        </span>
        <button onClick={resetToSelect} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl font-bold">✕</button>
      </div>

      {/* Audio Player Bar */}
      <div className="bg-black/40 backdrop-blur rounded-2xl border border-white/10 p-4 space-y-2">
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition shrink-0">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <div className="flex-1 space-y-1">
            {/* Seekable progress bar */}
            <div className="w-full h-2 bg-white/10 rounded-full cursor-pointer" onClick={seekTo}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, background: isListen ? '#a78bfa' : '#4ade80' }} />
            </div>
            <div className="flex justify-between text-xs opacity-50">
              <span>{fmt(currentTime)}</span>
              <span>{duration > 0 ? fmt(duration) : '--:--'}</span>
            </div>
          </div>
          <WaveBars active={isPlaying} color={isListen ? '#a78bfa' : '#4ade80'} count={12} />
        </div>

        {isSing && (
          <div className="flex items-center gap-3 pt-1 border-t border-white/10">
            <div className="flex items-center gap-2 text-green-300 font-bold text-sm">
              <Mic className={`w-4 h-4 ${isRecording ? 'animate-bounce' : ''}`} />
              {isRecording ? 'Recording your voice…' : 'Mic off'}
            </div>
            <div className="flex-1" />
            <div className="text-amber-300 font-black text-sm">{fmt(singTimer)} remaining</div>
          </div>
        )}
        {micAllowed === false && isSing && (
          <div className="flex items-center gap-2 text-red-300 text-xs font-bold">
            <MicOff className="w-3 h-3" /> Microphone blocked — allow mic in browser settings.
          </div>
        )}
      </div>

      {/* FULL LYRICS — displayed all at once, continuous scroll */}
      <div className={`rounded-2xl border overflow-hidden bg-gradient-to-b ${song.grad} border-white/10`}>
        <div className="px-4 pt-3 pb-1 border-b border-white/10 flex items-center gap-2">
          <span className="text-sm font-black opacity-60 uppercase tracking-widest">
            {isListen ? '📖 Full Lyrics — Read Along' : '🎤 Full Lyrics — Sing Along!'}
          </span>
        </div>
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
          {song.lyrics.map((line, i) => (
            <div key={i} className="space-y-0.5">
              <p className="font-bold text-base text-white leading-snug">{line.text}</p>
              
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {isListen && (
          <button onClick={() => startSing(song)}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 font-black py-3 rounded-2xl transition shadow-lg">
            <Mic className="w-5 h-5" /> I Know the Song — Sing Now!
          </button>
        )}
        {isSing && (
          <button onClick={endSing}
            className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 font-bold py-3 rounded-2xl transition">
            ✅ I'm Done Singing
          </button>
        )}
        <button onClick={isListen ? resetToSelect : () => startListen(song)}
          className="px-5 py-3 bg-white/10 hover:bg-white/20 font-bold rounded-2xl transition">
          {isListen ? '← Songs' : '👂 Listen Again'}
        </button>
      </div>

      <style>{`@keyframes waveBar { from{transform:scaleY(0.3)} to{transform:scaleY(1)} }`}</style>
    </div>
  );
};

