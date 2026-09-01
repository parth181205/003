import React, { useEffect, useState } from 'react';
import { useCognitive } from '../../context/CognitiveContext';
import { PhoneCall, AlertTriangle, X, ShieldAlert, HeartPulse } from 'lucide-react';

export const SosModal = () => {
  const { sosActive, cancelSOS, patient } = useCognitive();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer = null;
    if (sosActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(c => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sosActive, countdown]);

  if (!sosActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-4 border-rose-600 rounded-3xl max-w-lg w-full p-8 text-white text-center shadow-2xl space-y-6 animate-scaleUp">
        <div className="w-20 h-20 rounded-full bg-rose-600/30 border-4 border-rose-500 flex items-center justify-center mx-auto text-rose-500 animate-ping">
          <PhoneCall className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-3xl font-black text-rose-500 tracking-tight">
            EMERGENCY SOS ALERT
          </h2>
          <p className="text-sm opacity-80 mt-1">
            Dispatching immediate emergency location & distress signal...
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="opacity-75">Patient Name:</span>
            <span className="font-bold text-amber-300">{patient.name} ({patient.patientAge})</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-75">Calling Caregiver:</span>
            <span className="font-bold text-emerald-300">{patient.primaryCaregiver} ({patient.caregiverPhone})</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-75">PHC Unit:</span>
            <span className="font-bold text-sky-300">{patient.phcCenter}</span>
          </div>
        </div>

        <div className="p-4 bg-rose-950/60 rounded-xl border border-rose-500/40">
          <p className="text-sm font-bold text-rose-300">
            {countdown > 0 ? `Auto-Dialing in ${countdown} seconds...` : 'Calling Caregiver & PHC Unit Now!'}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={cancelSOS}
            className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold text-base text-slate-300 border border-slate-600 transition"
          >
            Cancel False Alarm
          </button>
          <a
            href={`tel:${patient.caregiverPhone}`}
            className="flex-1 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 font-black text-base text-white shadow-xl flex items-center justify-center gap-2 transition"
          >
            <PhoneCall className="w-5 h-5 text-yellow-300" />
            <span>Call Now</span>
          </a>
        </div>
      </div>
    </div>
  );
};
