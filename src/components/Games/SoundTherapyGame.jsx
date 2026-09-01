import React, { useState, useRef } from 'react';
import { Play, Square, Volume2, Heart, Music2 } from 'lucide-react';

// ─── Verified relaxing music tracks (YouTube IDs) ─────────────────────────────
const TRACKS = [
  {
    id: 't1', emoji: '🌊',
    title: 'Ocean Waves & Piano',
    desc: 'Gentle ocean waves mixed with soft piano. Perfect for deep relaxation.',
    tag: 'Nature + Music',
    color: 'from-sky-50 to-blue-100',
    border: 'border-sky-200',
    wave: '#38bdf8',
    ytId: 'lFcSrYw-ARY',
  },
  {
    id: 't2', emoji: '🌿',
    title: 'Forest Birds & Stream',
    desc: 'Birds chirping beside a gentle stream. Reduces anxiety and promotes calm.',
    tag: 'Nature Therapy',
    color: 'from-emerald-50 to-teal-100',
    border: 'border-emerald-200',
    wave: '#34d399',
    ytId: 'eKFTSSKCfni',
  },
  {
    id: 't3', emoji: '🎹',
    title: 'Calming Piano Melodies',
    desc: 'Slow, soothing piano chosen for relaxation and memory therapy.',
    tag: 'Music Therapy',
    color: 'from-violet-50 to-purple-100',
    border: 'border-violet-200',
    wave: '#a78bfa',
    ytId: '77ZozI0rw7w',
  },
  {
    id: 't4', emoji: '☁️',
    title: 'Soft Rain Sounds',
    desc: 'Gentle rainfall — deeply calming white noise for rest and focus.',
    tag: 'Sleep & Relax',
    color: 'from-slate-50 to-blue-50',
    border: 'border-slate-200',
    wave: '#94a3b8',
    ytId: 'q76bMs-NwRk',
  },
  {
    id: 't5', emoji: '🪗',
    title: 'Indian Classical Flute',
    desc: 'Soothing bansuri flute ragas — familiar and calming for older adults.',
    tag: 'Classical',
    color: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
    wave: '#fb923c',
    ytId: 'a4rk3DR8HXo',
  },
  {
    id: 't6', emoji: '✨',
    title: '528 Hz Healing Frequency',
    desc: 'Therapeutic 528 Hz solfeggio tone for stress relief and clarity.',
    tag: 'Frequency Therapy',
    color: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    wave: '#fb7185',
    ytId: 'FMMVkMWBWCQ',
  },
];

// ─── Animated waveform bars ────────────────────────────────────────────────────
function WaveBars({ color, active }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-12">
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} className="rounded-full w-[3px]" style={{
          background: color,
          height: active ? `${20 + Math.abs(Math.sin(i * 0.6)) * 70}%` : '15%',
          animation: active
            ? `waveBar ${0.6 + (i % 7) * 0.1}s ease-in-out infinite alternate`
            : 'none',
          animationDelay: `${i * 0.04}s`,
          opacity: active ? 0.85 : 0.2,
          transition: 'height 0.3s',
        }} />
      ))}
    </div>
  );
}

export const SoundTherapyGame = ({ highContrast }) => {
  const [active, setActive] = useState(null);
  const iframeKeyRef = useRef(0);

  const play = (track) => {
    iframeKeyRef.current += 1;
    setActive({ ...track, key: iframeKeyRef.current });
  };

  const stop = () => setActive(null);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 px-4 py-2 rounded-full">
          <Heart className="w-5 h-5 text-rose-400" />
          <span className="font-black text-rose-700 text-sm">Calm Music Therapy</span>
        </div>
        <h2 className="text-2xl font-black text-sky-800">Relaxing Sounds</h2>
        <p className="text-sm text-sky-600/80">Choose a sound to help you relax, focus, and feel calm</p>
      </div>

      {/* ── Hidden YouTube iframes (audio only — no video shown) ── */}
      {/* They load in background; we show our own beautiful player UI */}
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none', top: -9999, left: -9999 }}>
        {active && (
          <iframe
            key={active.key}
            src={`https://www.youtube.com/embed/${active.ytId}?autoplay=1&rel=0&controls=0&mute=0`}
            allow="autoplay; encrypted-media"
            title="audio"
          />
        )}
      </div>

      {/* ── Active Now Playing Card ── */}
      {active && (
        <div className={`rounded-3xl border-2 bg-gradient-to-r ${active.color} ${active.border} p-6 shadow-lg space-y-4`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{active.emoji}</div>
            <div className="flex-1">
              <p className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-0.5">Now Playing</p>
              <h3 className="font-black text-sky-800 text-xl">{active.title}</h3>
              <p className="text-sky-600 text-sm">{active.desc}</p>
            </div>
            <button onClick={stop}
              className="px-4 py-2 rounded-2xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 font-bold text-sm flex items-center gap-1 transition">
              <Square className="w-3.5 h-3.5 fill-red-400" /> Stop
            </button>
          </div>

          {/* Animated waveform */}
          <div className="bg-white/60 rounded-2xl p-4 border border-white/80">
            <WaveBars color={active.wave} active={true} />
            <p className="text-center text-xs font-semibold mt-2" style={{ color: active.wave }}>
              ♪ Playing — {active.tag}
            </p>
          </div>

          <p className="text-center text-xs text-sky-400">
            Close this tab or press Stop to end the session
          </p>
        </div>
      )}

      {/* ── Track Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TRACKS.map(t => {
          const isPlaying = active?.id === t.id;
          return (
            <div key={t.id}
              className={`rounded-3xl border-2 bg-gradient-to-br ${t.color} ${t.border} p-5 space-y-3 transition-all shadow-sm hover:shadow-md ${isPlaying ? 'ring-2 ring-offset-2 ring-sky-400' : ''}`}>
              <div className="flex items-start gap-3">
                <span className="text-4xl">{t.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-sky-800">{t.title}</h4>
                    {isPlaying && (
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full animate-pulse">
                        ▶ Playing
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-sky-600 mt-0.5">{t.desc}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-bold bg-white/70 border border-sky-100 text-sky-600 px-2 py-0.5 rounded-full">
                    {t.tag}
                  </span>
                </div>
              </div>

              {/* Mini waveform when playing */}
              {isPlaying && (
                <div className="bg-white/50 rounded-xl px-3 py-2">
                  <WaveBars color={t.wave} active={true} />
                </div>
              )}

              <button
                onClick={() => isPlaying ? stop() : play(t)}
                className={`w-full py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sm'
                }`}>
                {isPlaying
                  ? <><Square className="w-4 h-4 fill-red-400" /> Stop</>
                  : <><Play className="w-4 h-4" /> Play</>}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-sky-400">Requires internet · Audio streams from YouTube</p>

      <style>{`
        @keyframes waveBar { from { transform: scaleY(0.25); } to { transform: scaleY(1); } }
      `}</style>
    </div>
  );
};
