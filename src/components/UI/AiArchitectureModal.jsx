import React from 'react';
import { AI_MODEL_SPECS } from '../../data/aiDatasetsConfig';
import trainedWeights from '../../data/trainedModelWeights.json';
import { Cpu, Database, Languages, Sparkles, Brain, CheckCircle2, Server, Filter, ShieldCheck, Activity } from 'lucide-react';

export const AiArchitectureModal = ({ isOpen, onClose, highContrast }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className={`max-w-4xl w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl border ${
        highContrast 
          ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
          : 'bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-slate-100 border border-emerald-500/40'
      }`}>
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/40">
                  Custom Trained Local Model
                </span>
                <span className="text-xs text-amber-300 font-bold">Accuracy: {trainedWeights.accuracy}% | RMSE: {trainedWeights.rmse}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-amber-300 mt-0.5">
                {trainedWeights.modelName} (Custom Trained PyTorch/Scikit Ensemble)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition"
          >
            ✕ Close
          </button>
        </div>

        {/* DSP Audio Noise Filtering Section */}
        <div className="p-4 rounded-2xl bg-sky-950/60 border border-sky-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4" />
              DSP Audio & Voice Noise Reduction Pipeline
            </h3>
            <span className="text-[10px] bg-sky-400/20 text-sky-300 px-2 py-0.5 rounded font-bold border border-sky-400/30">
              Filtered RMS: {trainedWeights.noiseFilter.spectralDenoiseRMS}
            </span>
          </div>
          <p className="text-xs opacity-90 leading-relaxed">
            Integrated <strong>{trainedWeights.noiseFilter.bandpass}</strong> and <strong>Spectral Gating Subtraction</strong> to eliminate background monsoon rain hum, static noise, and rural acoustic interference for speech clarity in dementia patients across NER.
          </p>
        </div>

        {/* Feature Importance Weights from Local Training */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Trained Model Feature Weights (Random Forest Ensemble)
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(trainedWeights.featureImportances).map(([feat, val]) => (
              <div key={feat} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="opacity-75 block capitalize">{feat.replace(/_/g, ' ')}</span>
                <span className="text-base font-black text-amber-300">{(val * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Training Datasets */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4" />
            Benchmarked & Fine-Tuned Datasets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
            {AI_MODEL_SPECS.trainingDatasets.map((ds, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:bg-white/10 transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {ds.name}
                  </h4>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-400/30">
                    {ds.domain}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 font-medium">
                  {ds.samples}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
