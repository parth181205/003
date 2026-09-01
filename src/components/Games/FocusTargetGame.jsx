import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Wind, Play, Square, HeartPulse } from 'lucide-react';

export const FocusTargetGame = ({ highContrast }) => {
  const { t, speakText } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timeLeft, setTimeLeft] = useState(0);

  // Breathing cycle: Inhale (4s) -> Hold (2s) -> Exhale (4s)
  useEffect(() => {
    if (!isActive) return;

    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      // Cycle logic
      if (phase === 'inhale') {
        setPhase('hold');
        setTimeLeft(2);
        speakText("Hold");
      } else if (phase === 'hold') {
        setPhase('exhale');
        setTimeLeft(4);
        speakText("Breathe out slowly");
      } else {
        setPhase('inhale');
        setTimeLeft(4);
        speakText("Deep breath in");
      }
    }

    return () => clearTimeout(timer);
  }, [isActive, phase, timeLeft]);

  const startBreathing = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(4);
    speakText("Deep breath in");
  };

  const stopBreathing = () => {
    setIsActive(false);
    setPhase('idle');
    setTimeLeft(0);
  };

  // Determine circle style based on phase
  let circleScale = 'scale-100';
  let circleColor = 'bg-sky-400/20 border-sky-400';
  let textLabel = 'Ready to Relax';
  
  if (phase === 'inhale') {
    circleScale = 'scale-150';
    circleColor = 'bg-emerald-400/30 border-emerald-400';
    textLabel = 'Breathe In...';
  } else if (phase === 'hold') {
    circleScale = 'scale-150';
    circleColor = 'bg-teal-400/30 border-teal-400';
    textLabel = 'Hold...';
  } else if (phase === 'exhale') {
    circleScale = 'scale-100';
    circleColor = 'bg-blue-400/30 border-blue-400';
    textLabel = 'Breathe Out...';
  }

  return (
    <div className={`p-6 rounded-3xl border transition-all shadow-xl max-w-2xl mx-auto ${
      highContrast 
        ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
        : 'bg-slate-900/90 backdrop-blur text-white border border-slate-700/50'
    }`}>
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-white/10">
        <div className="inline-flex items-center justify-center p-3 bg-sky-500/20 rounded-2xl mb-4 text-sky-400">
          <Wind className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black mb-2 flex items-center justify-center gap-2">
          Deep Breathing
        </h3>
        <p className="text-sm opacity-70">
          Follow the circle to relax your mind and calm your body.
        </p>
      </div>

      {/* Breathing Visualizer */}
      <div className="flex flex-col items-center justify-center min-h-[300px] py-12 overflow-hidden relative">
        
        {/* Pulsing Background Glow (only when active) */}
        {isActive && (
          <div className={`absolute inset-0 m-auto w-48 h-48 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${
            phase === 'inhale' || phase === 'hold' ? 'bg-emerald-400 scale-150' : 'bg-blue-400 scale-100'
          }`} />
        )}

        {/* The Breathing Circle */}
        <div className="relative flex items-center justify-center w-64 h-64 mb-8">
          {/* Expanding/Shrinking Ring */}
          <div 
            className={`absolute inset-0 rounded-full border-[3px] transition-all ease-in-out ${circleColor} ${circleScale}`}
            style={{ transitionDuration: phase === 'inhale' || phase === 'exhale' ? '4000ms' : '500ms' }}
          />
          
          {/* Inner Static Core */}
          <div className="absolute inset-4 rounded-full bg-slate-800/80 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center z-10 shadow-inner">
            <HeartPulse className={`w-8 h-8 mb-2 ${isActive ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-xl font-bold tracking-widest uppercase">{textLabel}</span>
            {isActive && (
              <span className="text-sm font-medium opacity-60 mt-1">{timeLeft}s</span>
            )}
          </div>
        </div>

      </div>

      {/* Controls */}
      <div className="flex justify-center mt-4">
        {!isActive ? (
          <button
            onClick={startBreathing}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-lg shadow-lg hover:scale-105 transition-all"
          >
            <Play className="w-6 h-6" /> Start Exercise
          </button>
        ) : (
          <button
            onClick={stopBreathing}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 border border-slate-600 hover:bg-slate-700 text-white font-bold text-lg shadow-lg transition-all"
          >
            <Square className="w-5 h-5 fill-slate-400 text-slate-400" /> Stop
          </button>
        )}
      </div>

    </div>
  );
};
