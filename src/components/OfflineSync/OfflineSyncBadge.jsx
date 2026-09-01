import React from 'react';
import { useCognitive } from '../../context/CognitiveContext';
import { useLanguage } from '../../context/LanguageContext';
import { WifiOff, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export const OfflineSyncBadge = () => {
  const { isOffline, setIsOffline, offlineQueue, activeNotification } = useCognitive();
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-3 space-y-2">
      {/* Offline Connectivity Status Bar */}
      <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs font-semibold shadow transition ${
        isOffline 
          ? 'bg-amber-950/90 text-amber-200 border-amber-500/50' 
          : 'bg-emerald-950/60 text-emerald-200 border-emerald-500/30'
      }`}>
        <div className="flex items-center gap-2">
          {isOffline ? (
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          <span>
            {isOffline 
              ? t('offlineActive')
              : 'Network Connected - Realtime Telemetry Sync Active'}
          </span>
          {offlineQueue.length > 0 && (
            <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">
              {offlineQueue.length} items queued
            </span>
          )}
        </div>

        {/* Toggle Simulated Offline Mode button for demonstration */}
        <button
          onClick={() => setIsOffline(!isOffline)}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition text-[11px] font-bold border border-white/10 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3 h-3 text-amber-300" />
          <span>{isOffline ? 'Simulate Online' : 'Simulate NER Low-Network'}</span>
        </button>
      </div>

      {/* Active Toast Notification */}
      {activeNotification && (
        <div className="p-3 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-lg border border-emerald-400 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{activeNotification.message}</span>
        </div>
      )}
    </div>
  );
};
