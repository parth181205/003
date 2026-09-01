import React, { useState } from 'react';
import { Play, Pause, Maximize, Clock, Sparkles } from 'lucide-react';

const VIDEOS = [
  { id: 'v1', title: '6 Memory Games for Recovery', file: 'memory_games_recovery.mp4', desc: 'Therapeutic exercises for stroke and traumatic brain injury cognitive recovery.', emoji: '🧩', length: '5:30' },
  { id: 'v2', title: 'Boost Your Mind: Cognitive Exercises', file: 'boost_your_mind.mp4', desc: 'Scientifically proven cognitive exercises to increase brain capacity.', emoji: '🧠', length: '8:45' },
  { id: 'v3', title: "Memory Test: Alzheimer's Doctor Practice", file: 'memory_test_brain.mp4', desc: 'Guided memory assessment practice designed by an Alzheimer\'s specialist.', emoji: '🏥', length: '4:15' },
  { id: 'v4', title: 'Spot the Difference (Quick)', file: 'spot_difference_short.mp4', desc: 'A quick visual perception challenge — spot what changed!', emoji: '🔍', length: '0:45' },
  { id: 'v5', title: 'Spot the Difference: Brain Training', file: 'spot_difference_long.mp4', desc: 'In-depth spot-the-difference brain training session for visual memory.', emoji: '👁️', length: '10:20' },
];

export const VideoTherapyModule = ({ highContrast }) => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className={`w-full max-w-5xl mx-auto space-y-6 ${highContrast ? 'text-yellow-300' : 'text-slate-200'}`}>

      {/* Header */}
      <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
        highContrast ? 'bg-black border-yellow-400' : 'bg-teal-900/50 border-teal-500/30'
      }`}>
        <span className="text-4xl">🎬</span>
        <div>
          <h2 className={`text-lg font-bold ${highContrast ? 'text-yellow-300' : 'text-teal-100'}`}>
            Cognitive Video Therapy
          </h2>
          <p className="text-xs opacity-75">Guided brain-training and memory exercise videos from clinical specialists</p>
        </div>
        <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-xl border ${
          highContrast ? 'bg-yellow-900/40 border-yellow-400 text-yellow-300' : 'bg-teal-800/60 border-teal-400/40 text-teal-200'
        }`}>
          {VIDEOS.length} Videos
        </span>
      </div>

      {!activeVideo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VIDEOS.map((vid) => (
            <button
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className={`flex flex-col text-left p-0 rounded-2xl border transition group shadow-lg overflow-hidden ${
                highContrast
                  ? 'bg-black border-yellow-400 hover:bg-yellow-900/30'
                  : 'bg-slate-900/70 border-white/10 hover:border-amber-400/50 hover:shadow-amber-400/10 hover:shadow-xl'
              }`}
            >
              {/* Thumbnail */}
              <div className="w-full aspect-video bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 relative flex items-center justify-center">
                <span className="text-5xl">{vid.emoji}</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/0 group-hover:bg-white/20 flex items-center justify-center transition">
                    <Play className="w-6 h-6 text-white/0 group-hover:text-white transition" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {vid.length}
                </span>
              </div>
              {/* Info */}
              <div className="p-3">
                <h3 className={`font-bold text-sm mb-1 leading-tight ${highContrast ? 'text-yellow-300' : 'text-slate-100'}`}>
                  {vid.title}
                </h3>
                <p className="text-xs opacity-70 leading-snug">{vid.desc}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setActiveVideo(null)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2 border ${
              highContrast ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-900/30' : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
          >
            ← Back to Video Gallery
          </button>

          <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-teal-500/30 aspect-video">
            <video
              src={`/videos/therapy/${activeVideo.file}`}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div className={`p-4 rounded-2xl border ${
            highContrast ? 'bg-black border-yellow-400' : 'bg-teal-900/60 border-teal-500/40'
          }`}>
            <h2 className="text-xl font-bold mb-1 flex items-center gap-3">
              <span className="text-3xl">{activeVideo.emoji}</span>
              {activeVideo.title}
            </h2>
            <p className="opacity-80 text-sm">{activeVideo.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
};
