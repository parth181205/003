import React, { useState } from 'react';
import { MemoryCards } from './components/Games/MemoryCards';
import { DailyRoutineGame } from './components/Games/DailyRoutineGame';
import { FocusTargetGame } from './components/Games/FocusTargetGame';
import { SoundTherapyGame } from './components/Games/SoundTherapyGame';
import { FamilyRecallGame } from './components/Games/FamilyRecallGame';
import { MemoryEscapeRoomGame } from './components/Games/MemoryEscapeRoomGame';
import { ReminderHub } from './components/Reminders/ReminderHub';
import { ClinicalDashboard } from './components/CaregiverDashboard/ClinicalDashboard';
import { AaiVoiceCompanion } from './components/VoiceAssistant/AaiVoiceCompanion';
import { PlayZoneGame } from './components/Games/PlayZoneGame';
import { VideoTherapyModule } from './components/Games/VideoTherapyModule';
import { SpotDifferenceGame } from './components/Games/SpotDifferenceGame';
import { BollywoodKaraokeGame } from './components/Games/BollywoodKaraokeGame';
import { HomeParallaxBackground } from './components/UI/HomeParallaxBackground';
import { SosModal } from './components/UI/SosModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CognitiveProvider, useCognitive } from './context/CognitiveContext';
import { TicTacTangoGame } from './components/Games/TicTacTangoGame';
import { Brain, Calendar, Mic, Users, PhoneCall, Key, Layers, Target, Music, Gamepad2, Star, PlaySquare, Search, ArrowRight, Home, HeartHandshake } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeGameId, setActiveGameId] = useState(null);
  const { triggerSOS } = useCognitive();

  // Helper to render the appropriate active screen
  const renderContent = () => {
    // If a game is active, render it
    if (activeGameId) {
      return (
        <div className="p-4 w-full h-full flex flex-col">
          <button 
            onClick={() => setActiveGameId(null)}
            className="mb-4 self-start bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm text-gray-700"
          >
            ← Back to Home
          </button>
          <div className="flex-1 w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-4">
            {activeGameId === 'escape' && <MemoryEscapeRoomGame highContrast={false} onExit={() => setActiveGameId(null)} />}
            {activeGameId === 'memory' && <MemoryCards highContrast={false} />}
            {activeGameId === 'routine' && <DailyRoutineGame highContrast={false} />}
            {activeGameId === 'focus' && <FocusTargetGame highContrast={false} />}
            {activeGameId === 'sound' && <SoundTherapyGame highContrast={false} />}
            {activeGameId === 'family' && <FamilyRecallGame highContrast={false} />}
            {activeGameId === 'phaser' && <PlayZoneGame onExit={() => setActiveGameId(null)} />}
            {activeGameId === 'videos' && <VideoTherapyModule highContrast={false} />}
            {activeGameId === 'spotdiff' && <SpotDifferenceGame onExit={() => setActiveGameId(null)} />}
            {activeGameId === 'karaoke' && <BollywoodKaraokeGame highContrast={false} onExit={() => setActiveGameId(null)} />}
            {activeGameId === 'tictactango' && <TicTacTangoGame onScore={() => {}} />}
          </div>
        </div>
      );
    }

    // Render Tabs
    if (activeTab === 'daily') return <ReminderHub highContrast={false} />;
    if (activeTab === 'voice') return <AaiVoiceCompanion highContrast={false} />;
    if (activeTab === 'family') return <ClinicalDashboard highContrast={false} />;

    // Default Home Screen Dashboard (Option B Implementation)
    return (
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6 relative z-10">
        {/* HERO BANNER */}
        <div 
          className="relative w-full h-64 sm:h-80 rounded-[32px] overflow-hidden shadow-xl flex items-center border border-white/30"
          style={{ backgroundImage: 'url(/images/parallax/ezgif-frame-001.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="relative z-10 p-8 sm:p-12 w-full h-full flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Good Morning! ☀️</h1>
            <p className="text-xl sm:text-2xl font-medium text-white/85">How would you like to spend<br/>your time today?</p>
            <div className="w-16 border-b-4 border-sky-400 mt-4 rounded-full"></div>
          </div>
        </div>
 
        {/* GAME GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { id: 'escape',   title: '1. Mind Escape',      desc: 'Relax & Refresh',      icon: <Key        className="w-10 h-10 text-teal-600" />,   border: 'border-teal-200 shadow-md' },
            { id: 'memory',   title: '2. Memory Cards',     desc: 'Recall & Remember',     icon: <Layers     className="w-10 h-10 text-indigo-500" />, border: 'border-indigo-200 shadow-md' },
            { id: 'routine',  title: '3. Daily Routine',    desc: 'Plan Your Day',         icon: <Calendar   className="w-10 h-10 text-amber-500" />,  border: 'border-amber-200 shadow-md' },
            { id: 'focus',    title: '4. Focus Time',       desc: 'Deep Breathing',        icon: <Target     className="w-10 h-10 text-blue-500" />,   border: 'border-blue-200 shadow-md' },
            { id: 'sound',    title: '5. Calm Therapy',     desc: 'Mind & Mood Care',      icon: <Music      className="w-10 h-10 text-rose-500" />,   border: 'border-rose-200 shadow-md' },
            { id: 'family',   title: '6. Recall',           desc: 'Strengthen Memory',     icon: <Users      className="w-10 h-10 text-emerald-600" />,border: 'border-emerald-200 shadow-md' },
            { id: 'tictactango', title: '7. Shared Play',   desc: 'Play With Family',      icon: <HeartHandshake className="w-10 h-10 text-red-500" />, border: 'border-red-200 shadow-md' },
            { id: 'phaser',   title: '8. Play Zone',        desc: 'Fun Brain Games',       icon: <Gamepad2   className="w-10 h-10 text-purple-500" />, border: 'border-purple-200 shadow-md' },
            { id: 'karaoke',  title: '9. Karaoke',          desc: 'Duet with Aai',         icon: <Star       className="w-10 h-10 text-pink-500" />,   border: 'border-pink-200 shadow-md' },
            { id: 'videos',   title: '10. Watch Videos',    desc: 'Learn & Enjoy',         icon: <PlaySquare className="w-10 h-10 text-cyan-600" />,   border: 'border-cyan-200 shadow-md' },
            { id: 'spotdiff', title: '11. Spot Difference', desc: 'Train Your Brain',      icon: <Search     className="w-10 h-10 text-orange-500" />, border: 'border-orange-200 shadow-md' },
          ].map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveGameId(game.id)}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-white/20 bg-black/50 backdrop-blur-md hover:bg-black/40 hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 group`}
            >
              <div className="bg-white/25 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                {game.icon}
              </div>
              <h3 className="font-bold text-white text-[15px] mb-1 drop-shadow">{game.title}</h3>
              <p className="text-[11px] font-medium text-white/75">{game.desc}</p>
            </button>
          ))}
        </div>

        {/* TAKE A BREAK BUTTON */}
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => setActiveGameId('sound')}
            className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm hover:shadow-md text-sky-700 font-bold px-8 py-3 rounded-full transition-all hover:bg-sky-50"
          >
            <span className="text-xl">🕊️</span> Take a Break <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  const isHomeActive = activeTab === 'home' && !activeGameId;

  return (
    <div className={`min-h-screen font-sans text-gray-800 flex flex-col relative ${
      isHomeActive ? 'bg-transparent' : 'bg-[#f8f9fc]'
    }`}>
      {isHomeActive && <HomeParallaxBackground />}
      {/* ── HEADER NAVIGATION ── */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('home'); setActiveGameId(null); }}>
          <img src="/images/ui/logo.png" alt="Mannsaathi Logo" className="h-16 sm:h-20 w-auto object-contain" />
        </div>

        {/* CENTER TABS */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-full border border-gray-100">
          {[
            { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
            { id: 'daily', label: 'Daily Help', icon: <Calendar className="w-4 h-4" /> },
            { id: 'voice', label: 'Talk to Me', icon: <Mic className="w-4 h-4" /> },
            { id: 'family', label: 'Family Support', icon: <Users className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveGameId(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.id && !activeGameId
                  ? 'bg-white text-[#1a365d] shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
              }`}
            >
              <span className={activeTab === tab.id && !activeGameId ? "text-sky-600" : ""}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          <button 
            onClick={triggerSOS}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            Need Help?
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 flex flex-col items-center">
        {renderContent()}
      </main>

      <SosModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CognitiveProvider>
        <MainApp />
      </CognitiveProvider>
    </LanguageProvider>
  );
}
