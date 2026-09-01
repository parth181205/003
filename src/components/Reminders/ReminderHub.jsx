import React from 'react';
import { useCognitive } from '../../context/CognitiveContext';
import { useLanguage } from '../../context/LanguageContext';
import { Pill, Droplets, Calendar, CheckCircle, Plus, Bell, Volume2, Sparkles } from 'lucide-react';

export const ReminderHub = ({ highContrast }) => {
  const { patient, toggleMedication, addHydration } = useCognitive();
  const { t, speakText } = useLanguage();

  const handleMedClick = (med) => {
    toggleMedication(med.id);
    if (!med.takenToday) {
      speakText(`Shabash! ${med.name} marked as taken.`);
    }
  };

  const handleHydrationClick = () => {
    addHydration(250);
    speakText('Great job drinking fresh water! 250 milliliters added.');
  };

  const hydrationPct = Math.round((patient.hydration.currentMl / patient.hydration.targetMl) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border transition shadow-xl ${
        highContrast 
          ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
          : 'bg-emerald-950/80 text-white border border-emerald-500/30'
      }`}>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
          🔔 {t('navReminders')} & Daily Health Routine
          <Sparkles className="w-5 h-5 text-sky-300" />
        </h2>
        <p className="text-xs opacity-75">
          Caregiver-synchronized daily prescription schedules, hydration cues & doctor appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medication Pill Box Card */}
        <div className={`p-6 rounded-2xl border transition shadow-xl ${
          highContrast 
            ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
            : 'bg-emerald-950/80 text-white border border-emerald-500/30'
        }`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Pill className="w-5 h-5 text-sky-400" />
              {t('medicineReminders')}
            </h3>
            <span className="text-xs bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-full font-bold border border-sky-500/30">
              {patient.medicationAdherencePct}% Adherence
            </span>
          </div>

          <div className="space-y-3">
            {patient.medications.map(med => (
              <div
                key={med.id}
                onClick={() => handleMedClick(med)}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  med.takenToday
                    ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-white/5 border-amber-400/40 hover:bg-white/10 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    med.takenToday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-400/20 text-amber-300'
                  }`}>
                    {med.takenToday ? <CheckCircle className="w-6 h-6" /> : <Pill className="w-5 h-5" />}
                  </div>

                  <div>
                    <h4 className="font-bold text-base">{med.name}</h4>
                    <p className="text-xs opacity-75">Scheduled: {med.timing}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMedClick(med);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    med.takenToday
                      ? 'bg-emerald-700/60 text-emerald-200 cursor-default'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg'
                  }`}
                >
                  {med.takenToday ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-300" />
                      <span>{t('doseTaken')}</span>
                    </>
                  ) : (
                    <span>{t('takeDose')}</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hydration Tracker Card */}
        <div className={`p-6 rounded-2xl border transition shadow-xl ${
          highContrast 
            ? 'bg-black text-yellow-300 border-2 border-yellow-400' 
            : 'bg-emerald-950/80 text-white border border-emerald-500/30'
        }`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-400" />
              {t('hydrationReminders')}
            </h3>
            <span className="text-xs font-semibold text-sky-300">
              {patient.hydration.currentMl} / {patient.hydration.targetMl} ml
            </span>
          </div>

          {/* Animated Water Gauge Meter */}
          <div className="space-y-4">
            <div className="w-full bg-slate-900 rounded-2xl h-8 p-1 border border-sky-500/30 overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-xl transition-all duration-500 flex items-center justify-end px-3 text-xs font-bold text-slate-950 shadow"
                style={{ width: `${Math.min(100, hydrationPct)}%` }}
              >
                {hydrationPct}%
              </div>
            </div>

            <p className="text-xs opacity-75 text-center font-medium">
              {t('waterGoal')} | Logged {patient.hydration.logsToday} times today
            </p>

            <button
              onClick={handleHydrationClick}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 font-black text-base text-white shadow-lg flex items-center justify-center gap-2 transition hover:scale-102"
            >
              <Plus className="w-5 h-5 text-sky-200" />
              <span>{t('drinkWater')}</span>
            </button>
          </div>

          {/* Doctor Appointment Box */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Upcoming PHC Tele-Neurology Appointment
            </h4>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">Dr. A. K. Sarma, MD (Neurology)</p>
                <p className="opacity-75">Jorhat PHC Tele-Consultation</p>
              </div>
              <span className="bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded font-bold border border-amber-400/30">
                Tomorrow, 11:30 AM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
