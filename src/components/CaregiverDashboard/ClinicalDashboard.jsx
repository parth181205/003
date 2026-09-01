import React from 'react';
import { useCognitive } from '../../context/CognitiveContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { 
  Activity, ShieldAlert, Download, HeartPulse, Clock, FileSpreadsheet, User, Stethoscope, AlertTriangle, CheckCircle2 
} from 'lucide-react';

export const ClinicalDashboard = ({ highContrast }) => {
  const { patient } = useCognitive();
  const { t } = useLanguage();

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Clinical Header Banner */}
      <div className={`p-6 rounded-2xl border transition shadow-xl ${
        highContrast 
          ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
          : 'bg-emerald-950/90 text-white border border-emerald-500/30'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                MDoNER Tele-Neurology Portal
              </span>
              <span className="text-xs opacity-75">ID: {patient.id}</span>
            </div>
            <h2 className="text-2xl font-black text-amber-300">
              {patient.name} - Cognitive Telemetry & Caregiver Analytics
            </h2>
            <p className="text-xs opacity-80 mt-0.5">
              {patient.diagnosis} | PHC: {patient.phcCenter} | Doctor: {patient.treatingNeurologist}
            </p>
          </div>

          <button
            onClick={handleExportPDF}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition hover:scale-102"
          >
            <Download className="w-4 h-4" />
            <span>{t('downloadReport')}</span>
          </button>
        </div>

        {/* 4 Clinical KPI Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-semibold opacity-75 block">{t('cssScore')}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-300">{patient.currentCSS}</span>
              <span className="text-xs font-bold text-emerald-400">+13 pts baseline</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-semibold opacity-75 block">{t('reactionTime')}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-sky-300">{patient.reactionTimeAvgMs}ms</span>
              <span className="text-xs font-bold text-emerald-400">-230ms faster</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-semibold opacity-75 block">{t('medCompliance')}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-emerald-400">{patient.medicationAdherencePct}%</span>
              <span className="text-xs font-bold text-emerald-400">High</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-semibold opacity-75 block">{t('moodIndex')}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-rose-300">{patient.emotionalCalmPct}%</span>
              <span className="text-xs font-bold text-emerald-400">Calm</span>
            </div>
          </div>
        </div>
      </div>

      {/* BrainTrack Inspired Goal Setting */}
      <div className={`p-6 rounded-2xl border transition shadow-xl ${
        highContrast 
          ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
          : 'bg-emerald-950/80 text-white border border-emerald-500/30'
      }`}>
        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Daily Brain Health Goals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-100">Play 2 Games</p>
                <p className="text-xs opacity-75">1/2 Completed</p>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 text-xs font-bold hover:bg-emerald-600/50">Start</button>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-100">Drink Water</p>
                <p className="text-xs opacity-75">3/8 Glasses</p>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-amber-600/30 text-amber-300 text-xs font-bold hover:bg-amber-600/50">Log</button>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-100">Shared Play</p>
                <p className="text-xs opacity-75">Not started</p>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-rose-600/30 text-rose-300 text-xs font-bold hover:bg-rose-600/50">Play</button>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart: Weekly Cognitive Stability Curve */}
        <div className={`p-6 rounded-2xl border transition shadow-xl ${
          highContrast 
            ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
            : 'bg-emerald-950/80 text-white border border-emerald-500/30'
        }`}>
          <h3 className="text-base font-bold mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-300" />
              Cognitive Stability Score (Weekly Trend)
            </span>
            <span className="text-xs font-normal opacity-75">Target &gt; 70</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patient.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#064e3b', borderColor: '#34d399', borderRadius: '8px', color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cssScore" 
                  name="CSS Index" 
                  stroke="#f59e0b" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#f59e0b' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Response Time & Memory Accuracy */}
        <div className={`p-6 rounded-2xl border transition shadow-xl ${
          highContrast 
            ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
            : 'bg-emerald-950/80 text-white border border-emerald-500/30'
        }`}>
          <h3 className="text-base font-bold mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-300" />
              Memory Accuracy vs Focus Duration
            </span>
            <span className="text-xs font-normal opacity-75">Daily Session Logs</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patient.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#064e3b', borderColor: '#38bdf8', borderRadius: '8px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="memoryAccuracy" name="Memory Accuracy %" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="focusDurationMin" name="Focus Duration (min)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Caregiver Safety Alerts & Medical Contact Tree */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Safety Alert Log */}
        <div className={`md:col-span-2 p-6 rounded-2xl border transition shadow-xl ${
          highContrast 
            ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
            : 'bg-emerald-950/80 text-white border border-emerald-500/30'
        }`}>
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            {t('recentAlerts')}
          </h3>

          <div className="space-y-3">
            {patient.safetyAlerts.map(alert => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">{alert.type}</span>
                    <span className="opacity-60">{alert.timestamp}</span>
                  </div>
                  <p className="opacity-85 mt-1">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor & Caregiver Directory */}
        <div className={`p-6 rounded-2xl border transition shadow-xl ${
          highContrast 
            ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
            : 'bg-emerald-950/80 text-white border border-emerald-500/30'
        }`}>
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-400" />
            Medical Care Network
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="font-bold text-white">Primary Caregiver</p>
              <p className="text-amber-300 font-medium">{patient.primaryCaregiver}</p>
              <p className="opacity-70">{patient.caregiverPhone}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="font-bold text-white">Treating Neurologist</p>
              <p className="text-emerald-300 font-medium">{patient.treatingNeurologist}</p>
              <p className="opacity-70">Gauhati Medical College Hospital</p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="font-bold text-white">PHC Tele-Health Desk</p>
              <p className="text-sky-300 font-medium">Jorhat Rural PHC Unit #4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
