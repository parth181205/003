import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCognitive } from '../../context/CognitiveContext';
import { generateUniversalAIResponse } from '../../data/aiLlmEngine';
import { MessageSquare, X, Send, Bot, Volume2, VolumeX, Sparkles } from 'lucide-react';

export const PersistentAiChatWidget = ({ highContrast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'aai', text: 'Namaskar! I am Aai, your AI voice companion. Ask me anything about your health, routine, or family!' }
  ]);

  const { speakText, stopSpeaking, isSpeaking } = useLanguage();
  const { patient } = useCognitive();

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setInputQuery('');

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);

    // Generate dynamic AI response
    const aiResp = generateUniversalAIResponse(userText, patient);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'aai', text: aiResp }]);
      speakText(aiResp);
    }, 400);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className={`w-80 sm:w-96 rounded-2xl shadow-2xl border mb-3 flex flex-col overflow-hidden animate-scaleUp ${
          highContrast
            ? 'bg-black border-2 border-yellow-400 text-yellow-300'
            : 'bg-slate-900 border-emerald-500/40 text-white'
        }`} style={{ maxHeight: '480px' }}>
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-900 to-teal-950 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow">
                AAI
              </div>
              <div>
                <h3 className="font-bold text-xs flex items-center gap-1">
                  Aai AI Voice Companion
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </h3>
                <p className="text-[10px] opacity-75">On-Device Conversational Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={isSpeaking ? stopSpeaking : () => speakText(messages[messages.length - 1]?.text || "Hello!")}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-amber-300"
                title="Toggle Voice Output"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs min-h-[220px]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'aai' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-800 flex items-center justify-center text-[10px] shrink-0 text-amber-300 font-bold">
                    🤖
                  </div>
                )}
                <div
                  className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none font-medium'
                      : 'bg-white/10 text-emerald-100 rounded-bl-none border border-white/10'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Input Bar */}
          <form onSubmit={handleSend} className="p-2 border-t border-white/10 bg-slate-950/80 flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Aai anything..."
              className="flex-1 px-3 py-2 rounded-xl bg-white/10 text-xs font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-2xl border border-emerald-400/50 hover:scale-105 transition"
      >
        <Bot className="w-5 h-5 text-amber-300" />
        <span>{isOpen ? 'Close Chat' : 'Ask Aai Anything'}</span>
      </button>
    </div>
  );
};
