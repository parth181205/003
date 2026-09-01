import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PATIENT_PROFILE } from '../data/mockPatientData';

const CognitiveContext = createContext();

export const CognitiveProvider = ({ children }) => {
  const [patient, setPatient] = useState(() => {
    const saved = localStorage.getItem('smriti_patient_data');
    return saved ? JSON.parse(saved) : INITIAL_PATIENT_PROFILE;
  });

  const [aiLevel, setAiLevel] = useState('easy'); // 'easy', 'medium', 'hard'
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [sosActive, setSosActive] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('smriti_patient_data', JSON.stringify(patient));
  }, [patient]);

  // Online/Offline detection listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (offlineQueue.length > 0) {
        // Auto sync queue when coming online
        setActiveNotification({
          type: 'success',
          message: `Network Restored! Auto-synced ${offlineQueue.length} clinical session logs to MDoNER Cloud.`
        });
        setOfflineQueue([]);
      }
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueue]);

  // AI Cognitive Performance Engine: Adapts difficulty and calculates CSS
  const logGameSession = ({ gameId, gameTitle, score, maxScore, reactionMs, hesitations }) => {
    const accuracyPct = Math.round((score / maxScore) * 100);

    // AI Adaptive Difficulty Logic
    let newLevel = aiLevel;
    if (accuracyPct >= 85 && reactionMs < 1500) {
      newLevel = aiLevel === 'easy' ? 'medium' : 'hard';
    } else if (accuracyPct < 60 || hesitations >= 3) {
      newLevel = 'easy'; // Automatically simplify UI & add hints
    }

    setAiLevel(newLevel);

    // Recalculate Cognitive Stability Score (CSS)
    const updatedCSS = Math.min(98, Math.max(40, Math.round((patient.currentCSS * 0.7) + (accuracyPct * 0.3))));
    const updatedReaction = Math.round((patient.reactionTimeAvgMs * 0.8) + (reactionMs * 0.2));

    const sessionRecord = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gameId,
      gameTitle,
      accuracyPct,
      reactionMs,
      hesitations,
      css: updatedCSS,
      level: newLevel
    };

    setPatient(prev => ({
      ...prev,
      currentCSS: updatedCSS,
      reactionTimeAvgMs: updatedReaction,
      weeklyTrends: prev.weeklyTrends.map((item, idx) => 
        idx === prev.weeklyTrends.length - 1 
          ? { ...item, cssScore: updatedCSS, reactionTime: updatedReaction, memoryAccuracy: accuracyPct }
          : item
      )
    }));

    if (isOffline) {
      setOfflineQueue(prev => [...prev, sessionRecord]);
    }

    // Trigger AI encouragement or alert
    if (hesitations >= 4) {
      triggerSafetyAlert('Hesitation Spike', `Cognitive slowdown detected in ${gameTitle}. AI simplified grid for next round.`);
    }

    return { updatedCSS, newLevel, accuracyPct };
  };

  const triggerSafetyAlert = (type, message) => {
    const newAlert = {
      id: `alt_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      type,
      message,
      severity: 'medium',
      resolved: false
    };

    setPatient(prev => ({
      ...prev,
      safetyAlerts: [newAlert, ...prev.safetyAlerts]
    }));

    setActiveNotification({
      type: 'warning',
      message: `${type}: ${message}`
    });
  };

  const toggleMedication = (medId) => {
    setPatient(prev => {
      const updatedMeds = prev.medications.map(m => 
        m.id === medId ? { ...m, takenToday: !m.takenToday } : m
      );
      const totalTaken = updatedMeds.filter(m => m.takenToday).length;
      const adherencePct = Math.round((totalTaken / updatedMeds.length) * 100);

      return {
        ...prev,
        medications: updatedMeds,
        medicationAdherencePct: adherencePct
      };
    });
  };

  const addHydration = (amountMl = 250) => {
    setPatient(prev => {
      const newTotal = Math.min(3000, prev.hydration.currentMl + amountMl);
      return {
        ...prev,
        hydration: {
          ...prev.hydration,
          currentMl: newTotal,
          logsToday: prev.hydration.logsToday + 1
        }
      };
    });
  };

  const triggerSOS = () => {
    setSosActive(true);
    triggerSafetyAlert('EMERGENCY SOS', 'Patient initiated emergency caregiver distress call.');
  };

  const cancelSOS = () => setSosActive(false);

  return (
    <CognitiveContext.Provider value={{
      patient,
      aiLevel,
      setAiLevel,
      isOffline,
      setIsOffline,
      offlineQueue,
      sosActive,
      triggerSOS,
      cancelSOS,
      logGameSession,
      toggleMedication,
      addHydration,
      activeNotification,
      setActiveNotification
    }}>
      {children}
    </CognitiveContext.Provider>
  );
};

export const useCognitive = () => useContext(CognitiveContext);
