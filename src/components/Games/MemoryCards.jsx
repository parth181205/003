import React, { useState, useEffect } from 'react';
import { CULTURAL_ITEMS } from '../../data/culturalItems';
import { useCognitive } from '../../context/CognitiveContext';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Sparkles, Volume2, Timer, AlertCircle } from 'lucide-react';

export const MemoryCards = ({ highContrast }) => {
  const { aiLevel, logGameSession } = useCognitive();
  const { t, speakText } = useLanguage();

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hesitations, setHesitations] = useState(0);
  const [lastFlipTime, setLastFlipTime] = useState(null);

  // Initialize Game grid based on AI Adaptive Level
  const initGame = () => {
    // Number of pairs based on difficulty
    const pairCount = aiLevel === 'easy' ? 2 : aiLevel === 'medium' ? 3 : 4;
    const selectedItems = CULTURAL_ITEMS.slice(0, pairCount);
    
    // Duplicate and shuffle
    const deck = [...selectedItems, ...selectedItems]
      .map((item, index) => ({ ...item, uniqueId: index }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStartTime(Date.now());
    setIsGameOver(false);
    setHesitations(0);
    setLastFlipTime(Date.now());
  };

  useEffect(() => {
    initGame();
  }, [aiLevel]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index) || isGameOver) return;

    // Track hesitation time between flips
    const now = Date.now();
    if (lastFlipTime && (now - lastFlipTime) > 6000) {
      setHesitations(prev => prev + 1);
    }
    setLastFlipTime(now);

    const item = cards[index];
    speakText(item.name);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      
      if (cards[firstIdx].id === cards[secondIdx].id) {
        // Match found!
        const newMatched = [...matched, firstIdx, secondIdx];
        setMatched(newMatched);
        setFlipped([]);

        // Play synth match sound
        playBeepTone(587.33);

        if (newMatched.length === cards.length) {
          // All matched! Game completion
          const durationMs = Date.now() - (startTime || Date.now());
          setIsGameOver(true);
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          
          logGameSession({
            gameId: 'memory_cards',
            gameTitle: 'Smriti Matching Cards',
            score: cards.length / 2,
            maxScore: cards.length / 2,
            reactionMs: Math.round(durationMs / Math.max(1, moves)),
            hesitations
          });
        }
      } else {
        // Not a match - flip back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1200);
      }
    }
  };

  const playBeepTone = (freq) => {
    if (!('AudioContext' in window || 'webkitAudioContext' in window)) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };

  return (
    <div className={`p-6 rounded-2xl border transition shadow-xl ${
      highContrast 
        ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
        : 'bg-emerald-950/80 text-white border border-emerald-500/30'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            🧠 {t('game1Title')}
            <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded font-medium">
              AI Adaptive: {cards.length / 2} Pairs
            </span>
          </h3>
          <p className="text-xs opacity-75">{t('game1Desc')}</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-amber-300" />
            <span>Moves: {moves}</span>
          </div>
          <button
            onClick={initGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 font-bold transition"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Game Board Grid */}
      {!isGameOver ? (
        <div className={`grid gap-4 max-w-2xl mx-auto my-4 ${
          cards.length <= 4 ? 'grid-cols-2' : cards.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'
        }`}>
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`h-36 sm:h-44 rounded-2xl flex flex-col items-center justify-center p-3 text-center transition-all duration-300 transform font-bold text-lg shadow-lg border-2 ${
                  isFlipped
                    ? highContrast
                      ? 'bg-yellow-400 text-black border-yellow-300 scale-102'
                      : 'bg-emerald-800 text-white border-amber-300 shadow-amber-400/20 scale-102'
                    : highContrast
                      ? 'bg-slate-900 text-yellow-300 border-yellow-500 hover:border-yellow-300'
                      : 'bg-emerald-900/90 text-emerald-100 border-emerald-600/60 hover:bg-emerald-800 hover:scale-105'
                }`}
              >
                {isFlipped ? (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-4xl sm:text-5xl block">{card.icon}</span>
                    <span className="text-sm font-bold block leading-tight">{card.regionalName}</span>
                    <span className="text-[10px] opacity-80 block text-amber-300">{card.state}</span>
                  </div>
                ) : (
                  <div className="space-y-1 opacity-80">
                    <div className="w-10 h-10 rounded-full bg-emerald-700/50 flex items-center justify-center mx-auto text-amber-300 font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-xs text-emerald-200">Tap Card</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Victory Screen */
        <div className="p-8 text-center bg-emerald-900/40 rounded-2xl border border-amber-400/40 space-y-4 animate-scaleUp">
          <Trophy className="w-16 h-16 text-amber-300 mx-auto animate-bounce" />
          <h4 className="text-2xl font-black text-amber-300">Shabash! Memory Game Completed!</h4>
          <p className="text-sm opacity-90 max-w-md mx-auto">
            You matched all {cards.length / 2} NER cultural items in {moves} moves. Your cognitive response time was logged for doctor analytics.
          </p>
          <button
            onClick={initGame}
            className="px-6 py-3 rounded-xl bg-amber-400 text-emerald-950 font-black text-lg shadow-lg hover:bg-amber-300 transition"
          >
            Play Next Adaptive Level
          </button>
        </div>
      )}
    </div>
  );
};
