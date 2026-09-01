import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCognitive } from '../../context/CognitiveContext';
import { generateDynamicNeuralResponse } from '../../data/aiNeuralGenerator';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, Bot, Send, PlayCircle, MessageSquare, Cpu } from 'lucide-react';

export const AaiVoiceCompanion = ({ highContrast }) => {
  const { lang, t, speakText, stopSpeaking, isSpeaking } = useLanguage();
  const { patient } = useCognitive();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [manualText, setManualText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Initial welcome greeting
  useEffect(() => {
    const greeting = t('aaiGreeting');
    setAiResponse(greeting);
  }, [lang]);

  const handleSpeakGreeting = () => {
    speakText(aiResponse || t('aaiGreeting'));
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTranscript('Speech recognition API not supported. Using Dynamic Neural NLG Mode...');
      simulateVoiceInput('Tell me something interesting about Assam tea');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'as' ? 'hi-IN' : lang === 'bn' ? 'bn-IN' : 'en-IN';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening... Speak anything to Aai...');
      };

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);

        if (event.results[0].isFinal) {
          setIsListening(false);
          processVoiceCommand(currentText);
        }
      };

      recognition.onerror = (err) => {
        setIsListening(false);
        console.warn('Speech Recognition Error/Fallback:', err);
        setTranscript('Microphone quiet or unpermitted. Simulating unique neural speech query...');
        simulateVoiceInput('What tea is famous in Assam?');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      console.warn('Speech Recognition Start Exception:', err);
      simulateVoiceInput('How does my medicine schedule work?');
    }
  };

  const simulateVoiceInput = (sampleText) => {
    setIsListening(true);
    setTranscript(sampleText);
    setTimeout(() => {
      setIsListening(false);
      processVoiceCommand(sampleText);
    }, 900);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    setTranscript(manualText);
    processVoiceCommand(manualText);
    setManualText('');
  };

  const processVoiceCommand = (cmdText) => {
    // Generate fresh, non-repeating dynamic response using Neural NLG Engine
    const resp = generateDynamicNeuralResponse(cmdText, patient);

    setAiResponse(resp);
    speakText(resp);

    // Append to Chat History
    setChatHistory(prev => [
      ...prev,
      { user: cmdText, ai: resp, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  };

  return (
    <div className={`w-full max-w-6xl mx-auto p-8 rounded-3xl transition shadow-xl bg-white border border-gray-100`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-sky-800 font-black text-xl shadow-sm ring-4 ring-sky-50">
              AAI
            </div>
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-sky-400 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              Aai Voice Companion
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </h2>
            <p className="text-sm font-medium text-gray-500">
              Your friendly voice assistant
            </p>
          </div>
        </div>

        {/* Play/Stop Audio Button */}
        <button
          onClick={isSpeaking ? stopSpeaking : handleSpeakGreeting}
          className={`px-6 py-3 rounded-full flex items-center gap-2 font-bold text-sm transition-all shadow-sm ${
            isSpeaking 
              ? 'bg-rose-100 hover:bg-rose-200 text-rose-700' 
              : 'bg-[#5b9b7a] hover:bg-[#4a8064] text-white' // Soft muted green-blue from mockup
          }`}
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span>{isSpeaking ? 'Stop Voice' : 'Listen to Aai'}</span>
        </button>
      </div>

      {/* Main Interactive AI Voice Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column: Voice Status Avatar & Live Audio Wave */}
        <div className="flex flex-col items-center justify-center p-8 rounded-[32px] bg-gray-50 border border-gray-100 text-center space-y-4">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-transform ${
            isSpeaking 
              ? 'scale-110 ring-8 ring-sky-100 bg-sky-50' 
              : isListening 
                ? 'scale-105 ring-4 ring-indigo-100 bg-indigo-50' 
                : 'bg-white shadow-sm'
          }`}>
            <Bot className="w-16 h-16 text-[#5b9b7a]" />
          </div>

          <h3 className="text-lg font-bold text-gray-800">
            {isSpeaking ? 'Aai is speaking...' : isListening ? 'Listening...' : 'Aai is ready'}
          </h3>
          <p className="text-sm font-medium text-gray-500">
            How can I help you today?
          </p>

          {/* Micro-animation waveform simulation */}
          {(isSpeaking || isListening) && (
            <div className="flex items-center gap-1.5 h-12">
              <span className="w-1.5 h-6 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-10 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-8 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              <span className="w-1.5 h-12 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></span>
              <span className="w-1.5 h-5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></span>
            </div>
          )}
        </div>

        {/* Center & Right Column: Dialogue Box & Conversational Input */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#f6f9f8] border border-gray-100 min-h-[160px] flex flex-col justify-center">
            <div>
              <p className="text-sm font-bold text-[#5b9b7a] flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 fill-[#5b9b7a]" />
                Aai says
              </p>
              <p className="text-xl sm:text-2xl font-semibold leading-relaxed text-gray-800">
                "{aiResponse || t('aaiGreeting')}"
              </p>
            </div>

            {transcript && (
              <p className="text-sm font-medium text-gray-500 italic mt-4 border-t border-gray-200 pt-4 flex items-center justify-between">
                <span>Input: "{transcript}"</span>
                {isListening && <span className="animate-pulse text-sky-600">Processing...</span>}
              </p>
            )}
          </div>

          {/* Big Elderly Touch Microphone Button */}
          <button
            onClick={startListening}
            disabled={isListening}
            className={`w-full flex items-center justify-center gap-3 px-6 py-5 rounded-full font-bold text-xl transition-all shadow-md ${
              isListening
                ? 'bg-sky-100 text-sky-800 border border-sky-200 animate-pulse'
                : 'bg-[#5b9b7a] hover:bg-[#4a8064] text-white'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            <span>{isListening ? 'Listening to You...' : 'Tap & Speak Anything to Aai'}</span>
          </button>

          {/* Natural Conversation Type Bar */}
          <form onSubmit={handleManualSubmit} className="flex gap-3">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Ask Aai anything..."
              className="flex-1 px-6 py-4 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b9b7a]/50"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-full bg-[#f0f6f4] hover:bg-[#e4efe9] font-bold text-sm text-[#5b9b7a] flex items-center gap-2 transition-colors border border-gray-200"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>

          {/* Real Conversational Test Scenarios */}
          <div className="space-y-3 pt-4">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5b9b7a]" />
              Try asking
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '🍃', label: 'What tea is famous in Assam?', prompt: 'What tea is famous in Assam?' },
                { icon: '💊', label: 'How does my medicine log work?', prompt: 'How does my medicine log work?' },
                { icon: '💧', label: 'Why is hydration important?', prompt: 'Why is hydration important for memory?' },
                { icon: '👨‍👩‍👧', label: 'Tell me about my grandson Rahul', prompt: 'Tell me about my grandson Rahul' },
                { icon: '❤️', label: 'I feel a bit confused today', prompt: 'I feel a bit confused today' },
                { icon: '☀️', label: 'Say a warm morning greeting', prompt: 'Say a warm morning greeting' }
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => simulateVoiceInput(q.prompt)}
                  className="px-4 py-3 rounded-full bg-white hover:bg-gray-50 border border-gray-200 transition-colors text-left flex items-center gap-3 shadow-sm"
                >
                  <span className="text-xl shrink-0">{q.icon}</span>
                  <span className="text-sm font-semibold text-gray-700 truncate">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
