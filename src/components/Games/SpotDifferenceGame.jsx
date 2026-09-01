import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Unlock, Lock, Play, Settings2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const LEVELS = {
  1: [
    { id: 'r1_g1', label: 'Game 1' },
    { id: 'r1_g2', label: 'Game 2' },
    { id: 'r1_g3', label: 'Game 3' },
    { id: 'r1_g4', label: 'Game 4' },
    { id: 'r1_g5', label: 'Game 5' }
  ],
  2: [
    { id: 'r2_g1', label: 'Game 1' },
    { id: 'r2_g2', label: 'Game 2' },
    { id: 'r2_g3', label: 'Game 3' }
  ],
  3: [
    { id: 'r3_g1', label: 'Game 1' },
    { id: 'r3_g2', label: 'Game 2' },
    { id: 'r3_g3', label: 'Game 3' }
  ]
};

// WE NEED TO FILL THESE! The user will click and provide them.
const DIFFERENCE_SPOTS = {
  'r1_g1': [
    { x: 819, y: 388 },
    { x: 326, y: 801 },
    { x: 431, y: 211 }
  ],
  'r1_g2': [
    { x: 840, y: 503 },
    { x: 458, y: 700 },
    { x: 72, y: 856 }
  ],
  'r1_g3': [
    { x: 533, y: 240 },
    { x: 177, y: 296 },
    { x: 791, y: 859 },
    { x: 177, y: 740 },
    { x: 131, y: 582 },
    { x: 610, y: 224 }
  ],
  'r1_g4': [
    { x: 852, y: 486 },
    { x: 172, y: 666 },
    { x: 154, y: 790 },
    { x: 191, y: 240 },
    { x: 47, y: 220 },
    { x: 568, y: 286 }
  ],
  'r1_g5': [
    { x: 473, y: 637 },
    { x: 740, y: 651 },
    { x: 805, y: 631 },
    { x: 117, y: 835 }
  ],
  'r2_g1': [
    { x: 563, y: 521 },
    { x: 207, y: 298 },
    { x: 642, y: 279 },
    { x: 851, y: 816 },
    { x: 886, y: 571 }
  ],
  'r2_g2': [
    { x: 563, y: 256 },
    { x: 686, y: 380 },
    { x: 789, y: 628 },
    { x: 721, y: 866 },
    { x: 235, y: 738 },
    { x: 147, y: 380 },
    { x: 200, y: 221 }
  ],
  'r2_g3': [
    { x: 784, y: 298 },
    { x: 359, y: 849 },
    { x: 103, y: 276 }
  ],
  'r3_g1': [
    { x: 754, y: 492 },
    { x: 552, y: 704 },
    { x: 622, y: 701 },
    { x: 910, y: 798 },
    { x: 917, y: 721 }
  ],
  'r3_g2': [
    { x: 701, y: 245 },
    { x: 505, y: 756 },
    { x: 619, y: 773 },
    { x: 187, y: 660 }
  ],
  'r3_g3': [
    { x: 196, y: 700 },
    { x: 266, y: 582 },
    { x: 445, y: 523 },
    { x: 575, y: 759 },
    { x: 644, y: 769 },
    { x: 668, y: 622 },
    { x: 838, y: 438 },
    { x: 794, y: 251 }
  ]
};

// Flattens the order for "Next Level" progression
const LEVEL_SEQUENCE = [
  'r1_g1', 'r1_g2', 'r1_g3', 'r1_g4', 'r1_g5',
  'r2_g1', 'r2_g2', 'r2_g3',
  'r3_g1', 'r3_g2', 'r3_g3'
];

export const SpotDifferenceGame = ({ onExit }) => {
  const [viewMode, setViewMode] = useState('level-select'); // 'level-select' | 'playing'
  const [activeLevelId, setActiveLevelId] = useState(null);
  
  // Progression State
  const [unlockedLevels, setUnlockedLevels] = useState(['r1_g1']);
  const [devMode, setDevMode] = useState(false); // Let's user unlock all
  
  // Game State
  const [foundSpots, setFoundSpots] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [clickLogs, setClickLogs] = useState([]); 
  const imageRef = useRef(null);

  // Reset game state when switching levels
  useEffect(() => {
    setFoundSpots([]);
    setIsWon(false);
    setClickLogs([]);
  }, [activeLevelId]);

  const playCorrectSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1); 
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { console.error("Audio failed", e); }
  };

  const playWinSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime); 
      osc.frequency.setValueAtTime(554, ctx.currentTime + 0.1); 
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.2); 
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3); 
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch (e) {}
  };

  const handleLevelSelect = (levelId) => {
    if (unlockedLevels.includes(levelId) || devMode) {
      setActiveLevelId(levelId);
      setViewMode('playing');
    }
  };

  const handleImageClick = (e) => {
    if (isWon || !imageRef.current || !activeLevelId) return;

    const rect = imageRef.current.getBoundingClientRect();
    
    // Scale factor to map clicks correctly to the 1920x1080 source image.
    const scaleX = 1920 / rect.width;
    const scaleY = 1080 / rect.height;

    const relativeX = (e.clientX - rect.left) * scaleX;
    const relativeY = (e.clientY - rect.top) * scaleY;

    // Log the click for coordinate collection
    const newLog = { x: Math.round(relativeX), y: Math.round(relativeY) };
    setClickLogs(prev => [...prev, newLog]);

    // Check hit
    const HIT_RADIUS = 120; // Highly forgiving hit box for accessibility on a 1080p scale
    const spotsForLevel = DIFFERENCE_SPOTS[activeLevelId] || [];
    
    const hitSpotIndex = spotsForLevel.findIndex(spot => {
      const dx = spot.x - relativeX;
      const dy = spot.y - relativeY;
      return Math.sqrt(dx * dx + dy * dy) < HIT_RADIUS;
    });

    if (hitSpotIndex !== -1 && !foundSpots.includes(hitSpotIndex)) {
      const newFound = [...foundSpots, hitSpotIndex];
      setFoundSpots(newFound);
      playCorrectSound();

      if (newFound.length >= 3 && spotsForLevel.length > 0) {
        setIsWon(true);
        triggerWin();
      }
    }
  };

  const triggerWin = () => {
    playWinSound();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#f59e0b', '#10b981']
    });

    // Unlock next level
    if (activeLevelId) {
      const currentIndex = LEVEL_SEQUENCE.indexOf(activeLevelId);
      if (currentIndex !== -1 && currentIndex + 1 < LEVEL_SEQUENCE.length) {
        const nextLevelId = LEVEL_SEQUENCE[currentIndex + 1];
        if (!unlockedLevels.includes(nextLevelId)) {
          setUnlockedLevels(prev => [...prev, nextLevelId]);
        }
      }
    }
  };

  // --- RENDERERS ---

  if (viewMode === 'level-select') {
    return (
      <div className="w-full max-w-6xl mx-auto h-[800px] flex flex-col bg-[#eef6ff] rounded-[32px] overflow-hidden shadow-2xl border border-sky-100 relative">
        {/* Header */}
        <div className="bg-white p-6 shadow-sm border-b border-sky-100 flex items-center justify-between z-10 relative">
          <button 
            onClick={onExit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </button>
          
          <h1 className="text-2xl font-black text-sky-900 tracking-tight flex items-center gap-2">
            🔍 Spot the Difference
          </h1>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDevMode(!devMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition ${
                devMode ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <Settings2 className="w-4 h-4" /> 
              {devMode ? "Dev Unlock: ON" : "Dev Unlock: OFF"}
            </button>
          </div>
        </div>

        {/* Level Grid */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <SearchIcon className="w-64 h-64 text-sky-900" />
          </div>

          <div className="max-w-4xl mx-auto space-y-12 pb-12 relative z-10">
            {[1, 2, 3].map(roundNum => (
              <div key={roundNum} className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-black text-sky-800">Round {roundNum}</h2>
                  <div className="h-px bg-sky-200 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {LEVELS[roundNum].map(level => {
                    const isUnlocked = unlockedLevels.includes(level.id) || devMode;
                    const isCompleted = unlockedLevels.indexOf(level.id) < unlockedLevels.length - 1 && !devMode; // Rough heuristic

                    return (
                      <button
                        key={level.id}
                        onClick={() => handleLevelSelect(level.id)}
                        disabled={!isUnlocked}
                        className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                          isUnlocked
                            ? 'bg-white border-sky-300 hover:border-sky-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                            : 'bg-gray-100/50 border-gray-200 cursor-not-allowed opacity-75'
                        }`}
                      >
                        {isCompleted && (
                          <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                        
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${
                          isUnlocked ? 'bg-sky-100 text-sky-600 group-hover:bg-sky-500 group-hover:text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isUnlocked ? <Play className="w-6 h-6 ml-1" /> : <Lock className="w-6 h-6" />}
                        </div>
                        
                        <span className={`font-bold ${isUnlocked ? 'text-sky-900' : 'text-gray-500'}`}>
                          {level.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- PLAYING MODE ---
  
  return (
    <div className="w-full max-w-6xl mx-auto h-[800px] flex flex-col bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-slate-800">
      
      {/* Header */}
      <div className="bg-slate-950 p-4 shadow-md flex items-center justify-between shrink-0">
        <button 
          onClick={() => setViewMode('level-select')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition shadow-sm border border-white/5"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Levels
        </button>
        
        <div className="flex items-center gap-6">
          <div className="px-6 py-2 rounded-full bg-amber-400 text-amber-950 font-black tracking-widest uppercase shadow-[0_0_15px_rgba(251,191,36,0.3)] border-2 border-amber-300">
            Find 3 Differences
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
          <span className="font-bold text-slate-300">Found:</span>
          <span className="text-xl font-black text-emerald-400">{foundSpots.length}/3</span>
        </div>
      </div>

      {/* Game Arena */}
      <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden p-6">
        <div className="relative inline-block shadow-2xl rounded-2xl overflow-hidden border-4 border-slate-800 bg-slate-900 max-h-full max-w-full">
          
          <img 
            ref={imageRef}
            src={`/images/spot_diff/${activeLevelId}.png`} 
            alt="Spot the Difference"
            className="block max-h-full max-w-full object-contain select-none cursor-crosshair"
            onClick={handleImageClick}
            draggable={false}
            style={{ maxHeight: '650px' }} // Ensure it fits the container
          />

          {/* Found Spot Overlay Markers */}
          {foundSpots.map((spotIndex) => {
            const spot = DIFFERENCE_SPOTS[activeLevelId]?.[spotIndex];
            if (!spot) return null;
            
            const leftPct = (spot.x / 1920) * 100;
            const topPct = (spot.y / 1080) * 100;
            
            return (
              <div 
                key={spotIndex}
                className="absolute pointer-events-none border-[6px] border-red-500 rounded-full transition-all duration-300"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: '6%',
                  aspectRatio: '1/1',
                  transform: 'translate(-50%, -50%) scale(1)',
                  boxShadow: '0 0 20px rgba(239,68,68,0.8), inset 0 0 10px rgba(239,68,68,0.5)',
                  backgroundColor: 'rgba(239,68,68,0.15)'
                }}
              />
            );
          })}

          {/* Win Overlay */}
          {isWon && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-fadeIn z-50">
              <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)] border-4 border-white animate-bounce">
                <CheckCircle className="w-20 h-20 text-white" />
              </div>
              <h2 className="text-5xl font-black text-white mb-8 drop-shadow-lg tracking-tight">Level Complete!</h2>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setViewMode('level-select')}
                  className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:scale-105 transition shadow-xl"
                >
                  Level Select
                </button>
                <button 
                  onClick={() => {
                    const nextIndex = LEVEL_SEQUENCE.indexOf(activeLevelId) + 1;
                    if (nextIndex < LEVEL_SEQUENCE.length) {
                      setActiveLevelId(LEVEL_SEQUENCE[nextIndex]);
                    } else {
                      setViewMode('level-select');
                    }
                  }}
                  className="px-8 py-4 rounded-full bg-amber-400 text-amber-950 font-black text-lg hover:scale-105 transition shadow-xl flex items-center gap-2"
                >
                  Next Level <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Developer Coordinate Collector */}
      {devMode && (
        <div className="bg-slate-950 p-4 border-t border-slate-800 font-mono text-xs text-amber-400 h-32 overflow-y-auto shrink-0 flex gap-4">
          <div className="w-64 shrink-0 border-r border-slate-800 pr-4">
            <p className="font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Dev Coords Tool
            </p>
            <p className="text-slate-400 leading-tight">
              Level: {activeLevelId}<br/>
              Click exactly on the differences on the right side of the image to generate coordinates.
            </p>
            <button 
              onClick={() => setClickLogs([])}
              className="mt-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 transition"
            >
              Clear Clicks
            </button>
          </div>
          
          <div className="flex-1 whitespace-pre-wrap select-all">
            {clickLogs.length === 0 ? (
              <span className="text-slate-600 italic">No coordinates collected yet...</span>
            ) : (
              `[\n${clickLogs.map(log => `  { x: ${log.x}, y: ${log.y} }`).join(',\n')}\n]`
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Dummy search icon to prevent import errors if lucide Search fails
function SearchIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}
