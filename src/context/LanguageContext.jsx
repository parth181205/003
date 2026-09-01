import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, LANGUAGES } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en'); // Default to English
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  // Pre-load Web Speech Synthesis Voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const playChimeTone = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio healing chime
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn("Chime play skipped:", e);
    }
  };

  const t = (key) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  const speakText = (text, customLang = lang) => {
    if (!text) return;
    
    // Play subtle chime to indicate AI response audio start
    playChimeTone();

    if (!('speechSynthesis' in window)) return;
    
    try {
      window.speechSynthesis.cancel(); // stop prior speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88; // Slower speech for elderly comprehension
      utterance.pitch = 1.05; // Friendly warm tone

      const targetLang = 'en-IN';
      utterance.lang = targetLang;

      // Match voice from preloaded list
      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      
      // 1. Try to find a premium Indian English voice first (Google or Windows native)
      let matchedVoice = voices.find(v => v.lang === 'en-IN' && (v.name.includes('Google') || v.name.includes('Neerja') || v.name.includes('Heera') || v.name.includes('Ravi')));
      
      // 2. Fallback to any Indian English voice
      if (!matchedVoice) {
        matchedVoice = voices.find(v => v.lang === 'en-IN');
      }

      // 3. Last resort fallback to standard English
      if (!matchedVoice) {
         matchedVoice = voices.find(v => v.lang.startsWith('en'));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn("Speech Synthesis Error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech Synth Exception:", err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      t,
      LANGUAGES,
      speakText,
      stopSpeaking,
      isSpeaking
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
