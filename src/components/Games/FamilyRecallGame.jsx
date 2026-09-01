import React, { useState } from 'react';
import { FAMILY_MEMBERS } from '../../data/culturalItems';
import { useCognitive } from '../../context/CognitiveContext';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { Heart, Volume2, CheckCircle, Sparkles, UserCheck } from 'lucide-react';

export const FamilyRecallGame = ({ highContrast }) => {
  const { logGameSession } = useCognitive();
  const { speakText, t } = useLanguage();

  const [selectedMember, setSelectedMember] = useState(null);
  const [recognizedIds, setRecognizedIds] = useState([]);
  const [isSpeakingMessage, setIsSpeakingMessage] = useState(false);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    if (!recognizedIds.includes(member.id)) {
      const updated = [...recognizedIds, member.id];
      setRecognizedIds(updated);

      if (updated.length === FAMILY_MEMBERS.length) {
        confetti({ particleCount: 70, spread: 60 });
        logGameSession({
          gameId: 'family_recall',
          gameTitle: 'Kutumba Family Recall',
          score: 3,
          maxScore: 3,
          reactionMs: 1200,
          hesitations: 0
        });
      }
    }
  };

  const handlePlayVoice = (member) => {
    setIsSpeakingMessage(true);
    speakText(member.regionalVoice || member.voiceText);
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
            👨‍👩‍👧‍👦 {t('game5Title')}
            <span className="text-xs bg-rose-400/20 text-rose-300 border border-rose-400/40 px-2 py-0.5 rounded font-medium">
              Prosopagnosia Prevention
            </span>
          </h3>
          <p className="text-xs opacity-75">{t('game5Desc')}</p>
        </div>

        <div className="bg-rose-500/20 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-500/30 flex items-center gap-1">
          <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
          <span>Recognized: {recognizedIds.length} / {FAMILY_MEMBERS.length}</span>
        </div>
      </div>

      {/* Family Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FAMILY_MEMBERS.map(member => {
          const isSelected = selectedMember?.id === member.id;
          const isRecognized = recognizedIds.includes(member.id);

          return (
            <div
              key={member.id}
              onClick={() => handleMemberSelect(member)}
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-center ${
                isSelected
                  ? highContrast
                    ? 'bg-yellow-400 text-black border-yellow-300 scale-102 shadow-xl'
                    : 'bg-gradient-to-b from-emerald-800 to-teal-900 border-amber-300 scale-102 ring-4 ring-amber-400/20 shadow-2xl'
                  : highContrast
                    ? 'bg-slate-900 text-yellow-300 border-yellow-500 hover:border-yellow-300'
                    : 'bg-emerald-900/60 text-emerald-100 border-emerald-700/60 hover:bg-emerald-800'
              }`}
            >
              <div>
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl mx-auto mb-4 border-2 border-amber-400/40 shadow-inner">
                  {member.photo}
                </div>

                <h4 className="text-lg font-bold flex items-center justify-center gap-1.5">
                  {member.name}
                  {isRecognized && <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />}
                </h4>
                <p className="text-xs text-amber-300 font-semibold">{member.relation}</p>
                <p className="text-[11px] opacity-75 mt-0.5">{member.location}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMemberSelect(member);
                    handlePlayVoice(member);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-bold text-xs flex items-center justify-center gap-2 transition text-white shadow"
                >
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>Listen to Voice Clip</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Member Detail Message */}
      {selectedMember && (
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-amber-400/40 animate-fadeIn flex flex-col md:flex-row items-center gap-4">
          <div className="text-4xl">{selectedMember.photo}</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Voice Message from {selectedMember.name} ({selectedMember.relation}):
            </p>
            <p className="text-base font-medium italic mt-1 text-emerald-100">
              "{selectedMember.regionalVoice || selectedMember.voiceText}"
            </p>
          </div>
          <button
            onClick={() => handlePlayVoice(selectedMember)}
            className="px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow hover:bg-amber-300 transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>Replay Voice</span>
          </button>
        </div>
      )}
    </div>
  );
};
