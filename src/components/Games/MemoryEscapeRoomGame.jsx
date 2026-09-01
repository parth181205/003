import React, { useState, useEffect } from 'react';
import { ESCAPE_ROOMS, HINT_MESSAGES } from '../../data/escapeRoomData';
import { useCognitive } from '../../context/CognitiveContext';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { 
  Key, Lock, Unlock, HelpCircle, Volume2, Sparkles, CheckCircle, 
  ArrowRight, RefreshCw, Eye, Lightbulb, ChevronRight, Award, ShieldCheck, Search,
  X, Minimize2, Maximize2
} from 'lucide-react';

export const MemoryEscapeRoomGame = ({ highContrast, onExit }) => {
  const { logGameSession } = useCognitive();
  const { speakText, t } = useLanguage();

  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  // Inspection & Puzzle Pop-Up state (Pops ONLY when an object is clicked)
  const [inspectModalHotspot, setInspectModalHotspot] = useState(null);
  const [codeInput, setCodeInput] = useState('');
  const [patternInput, setPatternInput] = useState([]);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [unlockedHotspotIds, setUnlockedHotspotIds] = useState([]);
  
  // Story Narration Dialogue text for Bottom Bar
  const [storyDialogue, setStoryDialogue] = useState('');
  const [imgErrorMap, setImgErrorMap] = useState({});

  // Hint system
  const [showHintModal, setShowHintModal] = useState(false);
  
  // Completion
  const [escapedRooms, setEscapedRooms] = useState([]);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const room = ESCAPE_ROOMS[currentRoomIndex];

  // Set initial room story narration when room changes
  useEffect(() => {
    const initialText = `Room ${currentRoomIndex + 1}: ${room.description}`;
    setStoryDialogue(initialText);
    setFeedbackMsg('');
  }, [currentRoomIndex]);

  const handleOpenHotspotInspect = (spot) => {
    setInspectModalHotspot(spot);
    setCodeInput('');
    setPatternInput([]);
    setFeedbackMsg(spot.desc);
    
    // Update bottom dialogue bar text
    const dialogue = spot.dialogText || `${spot.name}: ${spot.desc}`;
    setStoryDialogue(dialogue);
    speakText(dialogue);
  };

  const handleCloseInspectModal = () => {
    setInspectModalHotspot(null);
    setCodeInput('');
    setPatternInput([]);
  };

  const handlePickUpItem = (item) => {
    if (item && !inventory.some(i => i.id === item.id)) {
      const updated = [...inventory, item];
      setInventory(updated);
      speakText(`You collected ${item.name}!`);
    }
  };

  const handleCodeSubmit = () => {
    if (!inspectModalHotspot) return;

    if (codeInput === inspectModalHotspot.correctCode) {
      speakText("Correct code! Unlocked!");
      setFeedbackMsg(inspectModalHotspot.unlockedText || "Success! Unlocked.");
      setUnlockedHotspotIds(prev => [...prev, inspectModalHotspot.id]);
      
      if (inspectModalHotspot.givesItem) {
        handlePickUpItem(inspectModalHotspot.givesItem);
      }

      if (inspectModalHotspot.type === 'door_lock') {
        handleEscapeCurrentRoom();
      }
    } else {
      speakText("Incorrect code. Try again.");
      setFeedbackMsg("Incorrect code. Check your clues!");
    }
  };

  const handlePatternClick = (symbol) => {
    const updated = [...patternInput, symbol];
    setPatternInput(updated);

    if (updated.length === inspectModalHotspot.pattern.length) {
      const isMatch = updated.every((sym, i) => sym === inspectModalHotspot.pattern[i]);
      if (isMatch) {
        speakText("Pattern matched! Chest unlocked.");
        setFeedbackMsg(inspectModalHotspot.unlockedText);
        setUnlockedHotspotIds(prev => [...prev, inspectModalHotspot.id]);
        if (inspectModalHotspot.givesItem) {
          handlePickUpItem(inspectModalHotspot.givesItem);
        }
      } else {
        speakText("Pattern incorrect. Try again!");
        setFeedbackMsg("Wrong sequence! Try Tea Leaf -> Rhino -> Jaapi.");
        setPatternInput([]);
      }
    }
  };

  const handleUseItemOnHotspot = () => {
    if (!selectedItemId || !inspectModalHotspot) return;

    if (selectedItemId === inspectModalHotspot.requiredItem) {
      speakText("Item used successfully!");
      setFeedbackMsg(inspectModalHotspot.revealedText || "It worked!");
      setUnlockedHotspotIds(prev => [...prev, inspectModalHotspot.id]);
      
      if (inspectModalHotspot.givesItem) {
        handlePickUpItem(inspectModalHotspot.givesItem);
      }

      if (inspectModalHotspot.type === 'door_lock') {
        handleEscapeCurrentRoom();
      }
    } else {
      speakText("That item doesn't fit here.");
      setFeedbackMsg("That item doesn't work on this object.");
    }
  };

  const handleEscapeCurrentRoom = () => {
    confetti({ particleCount: 100, spread: 90 });
    const roomId = room.id;
    if (!escapedRooms.includes(roomId)) {
      setEscapedRooms(prev => [...prev, roomId]);
    }

    if (currentRoomIndex < ESCAPE_ROOMS.length - 1) {
      setTimeout(() => {
        setCurrentRoomIndex(prev => prev + 1);
        handleCloseInspectModal();
        setSelectedItemId(null);
      }, 1500);
    } else {
      setIsGameComplete(true);
      logGameSession({
        gameId: 'smriti_escape',
        gameTitle: 'Smriti 50 Rooms Memory Escape',
        score: 5,
        maxScore: 5,
        reactionMs: 2500,
        hesitations: 0
      });
    }
  };

  const handleResetGame = () => {
    setCurrentRoomIndex(0);
    setInventory([]);
    setSelectedItemId(null);
    setInspectModalHotspot(null);
    setUnlockedHotspotIds([]);
    setEscapedRooms([]);
    setIsGameComplete(false);
  };

  return (
    /* MANDATORY FULLSCREEN 16:9 VIEWPORT */
    <div className={`fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden font-sans select-none ${
      highContrast ? 'bg-black text-yellow-300' : ''
    }`}>
      
      {/* Top Header Controls Bar (Transparent Overlay Header) */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 backdrop-blur-md flex items-center justify-center text-xl border border-amber-400/40 shadow">
            🗝️
          </div>
          <div>
            <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
              Smriti Story Escape
              <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/40">
                Room {currentRoomIndex + 1} of 3
              </span>
            </h2>
          </div>
        </div>

        {/* Room Navigation & AI Hint */}
        <div className="flex items-center gap-2">
          {ESCAPE_ROOMS.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => {
                if (escapedRooms.includes(ESCAPE_ROOMS[idx - 1]?.id) || idx === 0) {
                  setCurrentRoomIndex(idx);
                  handleCloseInspectModal();
                }
              }}
              className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1 border transition ${
                currentRoomIndex === idx
                  ? 'bg-emerald-600 text-white border-amber-300 shadow'
                  : escapedRooms.includes(r.id)
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                  : 'bg-black/60 text-slate-400 border-white/10 opacity-50'
              }`}
            >
              <span>Room {idx + 1}</span>
              {escapedRooms.includes(r.id) && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          ))}

          <button
            onClick={() => setShowHintModal(true)}
            className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold text-xs flex items-center gap-1 transition"
          >
            <Lightbulb className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>AI Hint</span>
          </button>
          
          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/40 font-bold text-xs flex items-center gap-1 transition ml-2"
            >
              <X className="w-4 h-4 text-rose-300" />
              <span>Quit Game</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN CENTER STAGE: Pristine 16:9 Full Screen Room Artwork */}
      {!isGameComplete ? (
        <div className="relative w-full h-full flex-1 bg-black flex items-center justify-center overflow-hidden">
          
          {/* Room Background Image (Clean wallpaper rendering without any text overlay) */}
          <div className="relative w-full h-full max-w-[1920px] aspect-video mx-auto flex items-center justify-center">
            
            {!imgErrorMap[room.bgImage] ? (
              <img 
                src={room.bgImage} 
                alt={room.title}
                onError={() => setImgErrorMap(prev => ({ ...prev, [room.bgImage]: true }))}
                className="w-full h-full object-cover select-none"
              />
            ) : (
              /* Fallback container ONLY if image file is missing */
              <div className={`w-full h-full bg-gradient-to-br ${room.fallbackTheme} flex flex-col items-center justify-center p-6 text-center`}>
                <div className="text-6xl mb-2">{room.fallbackIcon}</div>
                <h4 className="text-xl font-bold text-amber-300">{room.title}</h4>
                <p className="text-xs text-slate-300 max-w-md mt-1">{room.description}</p>
              </div>
            )}

            {/* MINIMALIST ELEGANT HOTSPOTS: Subtle glowing rings without text clutter */}
            {room.hotspots.map((spot) => {
              const isUnlocked = unlockedHotspotIds.includes(spot.id);
              const isSelected = inspectModalHotspot?.id === spot.id;

              return (
                <button
                  key={spot.id}
                  onClick={() => handleOpenHotspotInspect(spot)}
                  style={{ top: spot.position.top, left: spot.position.left }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group cursor-pointer ${
                    isSelected
                      ? 'scale-125 z-40'
                      : 'hover:scale-110 z-20'
                  }`}
                  title={`Inspect ${spot.name}`}
                >
                  {/* Glowing Ring Effect (No text popping on the image!) */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-2xl transition ${
                    isUnlocked
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40'
                      : 'bg-black/70 border-amber-400 text-amber-300 ring-4 ring-amber-400/30 animate-pulse hover:bg-amber-500 hover:text-black'
                  }`}>
                    <span className="text-lg">{spot.icon}</span>
                  </div>

                  {/* Subtle Tooltip label on Hover only */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-black/90 text-amber-300 text-[11px] font-bold whitespace-nowrap border border-amber-400/40 pointer-events-none shadow-xl">
                    Inspect {spot.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* POP-UP MODAL: Object Close-Up & Puzzles (Pops ONLY when an object is clicked) */}
          {inspectModalHotspot && (
            <div 
              onClick={handleCloseInspectModal}
              className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl max-w-lg w-full p-6 space-y-4 text-slate-100 shadow-2xl relative cursor-default"
              >
                
                {/* Prominent High-Visibility Modal Close Button */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Object Inspector</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseInspectModal();
                    }}
                    className="px-3 py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition border border-amber-400/40"
                  >
                    <X className="w-4 h-4" />
                    <span>Close & Back to Room</span>
                  </button>
                </div>

                {/* Close-Up Inspection Image (Uploaded by User) */}
                {inspectModalHotspot.image && !imgErrorMap[inspectModalHotspot.image] && (
                  <div className="w-full h-52 rounded-2xl overflow-hidden border border-amber-400/40 relative bg-black shadow-inner">
                    <img 
                      src={inspectModalHotspot.image} 
                      alt={inspectModalHotspot.name}
                      onError={() => setImgErrorMap(prev => ({ ...prev, [inspectModalHotspot.image]: true }))}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-[11px] font-bold text-amber-300 border border-amber-400/30">
                      Close-Up View
                    </div>
                  </div>
                )}

                {/* Object Title & Description */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-3xl shrink-0">{inspectModalHotspot.icon}</span>
                  <div>
                    <h4 className="font-bold text-base text-amber-300">{inspectModalHotspot.name}</h4>
                    <p className="text-xs text-slate-300">{inspectModalHotspot.desc}</p>
                  </div>
                </div>

                {/* Feedback readout */}
                {feedbackMsg && (
                  <div className="p-3 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>{feedbackMsg}</span>
                  </div>
                )}

                {/* PUZZLE POP-UP TYPE 1: NUMBER LOCK / KEYPAD */}
                {inspectModalHotspot.type === 'code_lock' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-amber-400/40">
                    <label className="text-xs font-bold text-amber-300 block text-center">
                      Enter 4-Digit Combination Code:
                    </label>
                    <div className="text-2xl font-mono tracking-widest text-center py-2 bg-black rounded-xl border border-amber-400 text-amber-300 font-bold min-h-[44px]">
                      {codeInput || '----'}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {['1','2','3','4','5','6','7','8','9','C','0','✓'].map((key) => (
                        <button
                          key={key}
                          onClick={() => {
                            if (key === 'C') setCodeInput('');
                            else if (key === '✓') handleCodeSubmit();
                            else if (codeInput.length < 4) setCodeInput(prev => prev + key);
                          }}
                          className={`py-2 rounded-xl font-bold text-sm transition ${
                            key === '✓'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white col-span-1'
                              : key === 'C'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : 'bg-white/10 hover:bg-white/20 text-slate-100'
                          }`}
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PUZZLE POP-UP TYPE 2: PATTERN SYMBOL LOCK */}
                {inspectModalHotspot.type === 'pattern_puzzle' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-amber-400/40">
                    <label className="text-xs font-bold text-amber-300 block text-center">
                      Tap Cultural Symbols in Correct Order:
                    </label>
                    <div className="flex justify-center gap-2 py-2 min-h-[44px]">
                      {patternInput.map((sym, idx) => (
                        <span key={idx} className="text-2xl p-1 bg-white/10 rounded-lg border border-amber-400/40">{sym}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {['🍃', '🦏', '👒'].map((sym) => (
                        <button
                          key={sym}
                          onClick={() => handlePatternClick(sym)}
                          className="p-3 rounded-xl bg-white/10 hover:bg-amber-400/20 text-2xl transition border border-white/20"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PUZZLE POP-UP TYPE 3: USE ITEM FROM INVENTORY */}
                {inspectModalHotspot.type === 'use_item' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-amber-400/40 text-center">
                    <p className="text-xs text-amber-200">
                      Select required item from inventory below, then click apply!
                    </p>
                    <button
                      onClick={handleUseItemOnHotspot}
                      disabled={!selectedItemId}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow transition ${
                        selectedItemId
                          ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                          : 'bg-white/10 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Key className="w-4 h-4" />
                      <span>Apply Selected Inventory Item</span>
                    </button>
                  </div>
                )}

                {/* PUZZLE POP-UP TYPE 4: DOOR LOCK */}
                {inspectModalHotspot.type === 'door_lock' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-amber-400/40 text-center">
                    <p className="text-xs text-amber-200">
                      Use exit key from inventory OR enter 4-digit code to unlock room door!
                    </p>
                    <button
                      onClick={handleUseItemOnHotspot}
                      disabled={!selectedItemId}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center justify-center gap-2 shadow transition"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Unlock Door with Key</span>
                    </button>

                    <div className="pt-2 border-t border-white/10">
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Or Enter Door Key Code:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value)}
                          placeholder="Code..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-black border border-amber-400/60 text-amber-300 text-center font-bold font-mono text-sm"
                        />
                        <button
                          onClick={handleCodeSubmit}
                          className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal Action Buttons: Audio Hint & Close Back to Room */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => speakText(`${inspectModalHotspot.name}. ${inspectModalHotspot.desc}. ${inspectModalHotspot.hint}`)}
                    className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs flex items-center justify-center gap-1.5 transition text-amber-200"
                  >
                    <Volume2 className="w-4 h-4 text-amber-300" />
                    <span>Listen Clue</span>
                  </button>

                  <button
                    onClick={handleCloseInspectModal}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs flex items-center justify-center gap-1.5 transition text-white shadow"
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                    <span>Back to Room</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Final Victory Screen */
        <div className="py-16 px-6 text-center space-y-6 max-w-xl mx-auto animate-fadeIn my-auto">
          <div className="w-24 h-24 rounded-full bg-amber-400/20 mx-auto flex items-center justify-center text-6xl border-4 border-amber-400 shadow-2xl">
            🏆
          </div>
          <h3 className="text-3xl font-bold text-amber-300">
            Congratulations! You Escaped All 3 Rooms!
          </h3>
          <p className="text-base text-slate-200">
            You successfully examined all historic rooms, connected every clue chain, and retrieved your golden memory trophies!
          </p>
          <button
            onClick={handleResetGame}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-xl transition flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Escape Rooms Again</span>
          </button>
        </div>
      )}

      {/* STORY MODE BOTTOM NARRATIVE BAR (Classic RPG / Visual Novel Style) */}
      <div className="relative z-30 w-full bg-slate-950/95 border-t border-amber-400/40 p-3 sm:p-4 backdrop-blur-lg shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Character Sprite & Story Dialogue */}
        <div className="flex items-center gap-3 flex-1">
          {/* Character Avatar */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-600 p-0.5 shrink-0 shadow-lg overflow-hidden border border-amber-300">
            <img 
              src="/images/sprites/aai_companion_sprite.png" 
              alt="Aai Sprite" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold bg-amber-950/30">
              👵
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-amber-300">Aai Companion:</span>
              <button 
                onClick={() => speakText(storyDialogue)}
                className="text-slate-400 hover:text-amber-300"
                title="Speak Dialogue"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-medium text-slate-100 mt-0.5 line-clamp-2 leading-relaxed">
              "{storyDialogue}"
            </p>
          </div>
        </div>

        {/* Docked Horizontal Inventory Bar */}
        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-4">
          <span className="text-[11px] font-bold text-emerald-300 shrink-0 flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-amber-300" />
            Items ({inventory.length}):
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs">
            {inventory.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">Inspect objects to find keys & tools</span>
            ) : (
              inventory.map((item) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItemId(isSelected ? null : item.id);
                      speakText(`Selected ${item.name}`);
                    }}
                    className={`p-1.5 rounded-xl border flex items-center gap-1 transition ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold scale-105 shadow'
                        : 'bg-slate-900 text-amber-200 border-emerald-500/40 hover:bg-emerald-800/50'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-[10px] hidden md:inline font-bold whitespace-nowrap">{item.name}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* AI Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl max-w-md w-full p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-bold text-lg text-amber-300 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-300" />
                Aai AI Assistant — Room Hint Guide
              </h4>
              <button onClick={() => setShowHintModal(false)} className="text-sm font-bold text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-emerald-300">Room {currentRoomIndex + 1} Clue Sequence:</p>
              <ul className="space-y-2">
                {HINT_MESSAGES[`room_${currentRoomIndex + 1}`]?.map((hint, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                    {hint}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                const stepHint = HINT_MESSAGES[`room_${currentRoomIndex + 1}`]?.[0] || "Explore objects around the room!";
                speakText(stepHint);
                setShowHintModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Next Step</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
