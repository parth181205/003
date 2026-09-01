import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCognitive } from '../../context/CognitiveContext';
import { 
  Gamepad2, 
  BellRing, 
  Mic, 
  Activity, 
  WifiOff, 
  PhoneCall, 
  Sun, 
  Moon, 
  Languages, 
  Sparkles,
  HeartPulse
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, highContrast, setHighContrast, onOpenAiModal }) => {
  const { lang, setLang, LANGUAGES, t, speakText } = useLanguage();
  const { patient, aiLevel, isOffline, triggerSOS } = useCognitive();

  return (
    <header className={`w-full sticky top-0 z-40 transition-colors shadow-md ${
      highContrast 
        ? 'bg-black border-b-4 border-yellow-400 text-yellow-300' 
        : 'bg-emerald-900 text-white border-b border-emerald-800'
    }`}>
      {/* Top Banner for MDoNER & Patient Profile */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between text-xs md:text-sm border-b border-white/10 gap-2">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="bg-emerald-700/80 px-2 py-0.5 rounded text-[11px] uppercase font-bold tracking-wider text-amber-200">
            {t('mbonerTag')}
          </span>
          <span className="hidden md:inline opacity-80">|</span>
          <span className="font-semibold text-emerald-100 flex items-center gap-1">
            <HeartPulse className="w-4 h-4 text-emerald-300" />
            {patient.name} ({patient.patientAge})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Level Indicator */}
          <div className="flex items-center gap-1.5 bg-emerald-800/80 px-2.5 py-1 rounded-full border border-emerald-600/50 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="text-emerald-200 font-medium">AI Level:</span>
            <span className="font-bold capitalize text-amber-300">
              {aiLevel === 'easy' ? 'Gentle' : aiLevel === 'medium' ? 'Moderate' : 'Active'}
            </span>
          </div>

          {/* Offline Badge */}
          {isOffline && (
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-xs border border-amber-500/40">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline</span>
            </div>
          )}

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 transition text-xs font-bold"
            title="Toggle High Contrast for Elderly Sight"
          >
            {highContrast ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-emerald-200" />}
            <span>{highContrast ? 'Normal' : 'High-Contrast'}</span>
          </button>

          {/* AI Model & Datasets Spec Button */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition text-xs font-bold border border-amber-500/40"
            title="View AI Model Architecture & Training Datasets"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Model & Datasets</span>
          </button>

        </div>
      </div>

      {/* Main Nav Items with Large Elderly Touch Targets */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-emerald-950 font-black text-xl shadow">
            MS
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              {t('appTitle')}
              <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-medium">
                NER Medical AI
              </span>
            </h1>
            <p className="text-xs opacity-75 font-medium hidden sm:block">
              {t('appTagline')}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto py-1">
          {[
            { id: 'games', label: t('navGames'), icon: Gamepad2, color: 'text-amber-400' },
            { id: 'reminders', label: t('navReminders'), icon: BellRing, color: 'text-sky-400' },
            { id: 'voice', label: t('navVoice'), icon: Mic, color: 'text-emerald-400' },
            { id: 'caregiver', label: t('navCaregiver'), icon: Activity, color: 'text-rose-400' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition text-sm sm:text-base border ${
                  isActive
                    ? highContrast
                      ? 'bg-yellow-400 text-black border-yellow-300 shadow-lg scale-105'
                      : 'bg-emerald-700 text-white border-emerald-400 shadow-lg scale-105'
                    : 'bg-emerald-950/40 hover:bg-emerald-800/50 text-emerald-100 border-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* SOS Emergency Call Button (Ultra prominent for elderly users) */}
        <button
          onClick={triggerSOS}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-sm shadow-lg shadow-rose-900/50 border border-rose-400/50 animate-pulse hover:scale-105 transition"
        >
          <PhoneCall className="w-5 h-5 text-yellow-300" />
          <span>{t('sosButton')}</span>
        </button>
      </div>
    </header>
  );
};
