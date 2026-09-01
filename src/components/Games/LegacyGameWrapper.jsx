import React from 'react';
import { X, ExternalLink } from 'lucide-react';

export const LegacyGameWrapper = ({ gameUrl, title, onExit, highContrast }) => {
  return (
    <div className={`fixed inset-0 z-50 flex flex-col overflow-hidden font-sans ${
      highContrast ? 'bg-black' : 'bg-slate-950'
    }`}>
      {/* Top Header Controls Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 flex items-center justify-between bg-black/80 backdrop-blur-md pointer-events-auto border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center text-xl border border-amber-400/40">
            🕹️
          </div>
          <div>
            <h2 className="text-base font-bold text-amber-300">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onExit && (
            <button
              onClick={onExit}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg"
            >
              <X className="w-4 h-4" />
              <span>Quit & Return to Menu</span>
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Iframe Engine */}
      <div className="w-full h-full pt-16 bg-black">
        <iframe 
          src={gameUrl} 
          title={title}
          className="w-full h-full border-none outline-none"
          allow="autoplay; fullscreen; microphone"
        />
      </div>
    </div>
  );
};
