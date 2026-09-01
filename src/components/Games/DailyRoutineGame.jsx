import React, { useState, useEffect } from 'react';
import { DAILY_ROUTINE_TASKS } from '../../data/culturalItems';
import { useCognitive } from '../../context/CognitiveContext';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCcw, ArrowRight, SunMedium, Clock } from 'lucide-react';

export const DailyRoutineGame = ({ highContrast }) => {
  const { logGameSession } = useCognitive();
  const { t, speakText } = useLanguage();

  const [shuffledSteps, setShuffledSteps] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [errorCount, setErrorCount] = useState(0);

  const initGame = () => {
    // Shuffle the steps
    const shuffled = [...DAILY_ROUTINE_TASKS].sort(() => Math.random() - 0.5);
    setShuffledSteps(shuffled);
    setSelectedSequence([]);
    setIsCompleted(false);
    setStartTime(Date.now());
    setErrorCount(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleSelectTask = (task) => {
    if (selectedSequence.some(s => s.id === task.id) || isCompleted) return;

    speakText(task.title);
    const nextSeq = [...selectedSequence, task];
    setSelectedSequence(nextSeq);

    // Verify order on each tap
    const expectedOrder = nextSeq.length; // 1, 2, 3...
    if (task.order !== expectedOrder) {
      setErrorCount(prev => prev + 1);
    }

    if (nextSeq.length === DAILY_ROUTINE_TASKS.length) {
      // Completed full sequence
      setIsCompleted(true);
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
      
      const durationMs = Date.now() - startTime;
      logGameSession({
        gameId: 'daily_routine',
        gameTitle: 'Niyama Daily Routine Recall',
        score: Math.max(1, 5 - errorCount),
        maxScore: 5,
        reactionMs: Math.round(durationMs / 5),
        hesitations: errorCount
      });
    }
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
            🌅 {t('game2Title')}
            <span className="text-xs bg-sky-400/20 text-sky-300 border border-sky-400/40 px-2 py-0.5 rounded font-medium">
              Daily Sequence Recall
            </span>
          </h3>
          <p className="text-xs opacity-75">{t('game2Desc')}</p>
        </div>

        <button
          onClick={initGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 font-bold transition text-xs"
        >
          <RotateCcw className="w-4 h-4 text-amber-300" />
          <span>Reset Order</span>
        </button>
      </div>

      {/* Selected Sequence Output Pipeline */}
      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Your Arranged Daily Schedule:
        </p>
        
        {selectedSequence.length === 0 ? (
          <p className="text-xs opacity-60 italic py-2">
            Tap the routine tasks below in order from morning to evening...
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {selectedSequence.map((step, idx) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm border ${
                  step.order === idx + 1
                    ? 'bg-emerald-700/80 border-emerald-400 text-white'
                    : 'bg-rose-900/80 border-rose-500 text-rose-200'
                }`}
              >
                <span>{step.icon}</span>
                <span>{idx + 1}. {step.regionalTitle}</span>
                <span className="text-[10px] opacity-75">({step.time})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Cards to Select */}
      {!isCompleted ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {shuffledSteps.map(task => {
            const isSelected = selectedSequence.some(s => s.id === task.id);
            return (
              <button
                key={task.id}
                disabled={isSelected}
                onClick={() => handleSelectTask(task)}
                className={`p-4 rounded-xl flex items-center gap-3 transition-all text-left font-bold border-2 ${
                  isSelected
                    ? 'opacity-40 grayscale cursor-not-allowed border-slate-700 bg-slate-900'
                    : highContrast
                      ? 'bg-slate-900 hover:bg-yellow-400 hover:text-black border-yellow-400 text-yellow-300'
                      : 'bg-emerald-900/90 hover:bg-emerald-800 border-emerald-600 hover:border-amber-300 text-emerald-100 hover:scale-102 shadow-lg'
                }`}
              >
                <span className="text-3xl p-2 rounded-lg bg-white/10">{task.icon}</span>
                <div>
                  <span className="block text-sm font-bold">{task.regionalTitle}</span>
                  <span className="block text-xs opacity-75 text-amber-300">{task.title}</span>
                  <span className="block text-[10px] opacity-60 mt-0.5">{task.time}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Routine Completion Banner */
        <div className="p-6 text-center bg-emerald-900/60 rounded-2xl border border-emerald-400/50 space-y-3">
          <CheckCircle2 className="w-14 h-14 text-emerald-300 mx-auto" />
          <h4 className="text-xl font-bold text-amber-300">Daily Sequence Correctly Mastered!</h4>
          <p className="text-xs opacity-90">
            Great job! Sequence order recall reinforces neuropathways for daily routine independence.
          </p>
          <button
            onClick={initGame}
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-emerald-950 font-black text-sm shadow hover:bg-amber-300 transition"
          >
            Practice Again
          </button>
        </div>
      )}
    </div>
  );
};
