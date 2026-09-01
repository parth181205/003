export const INITIAL_PATIENT_PROFILE = {
  id: 'PAT-NER-2026-88',
  name: 'Biren Hazarika',
  age: 74,
  gender: 'Male',
  nativeLanguage: 'Assamese',
  location: 'Jorhat District, Assam (NER Region)',
  diagnosis: 'Early-Stage Vascular Dementia & MCI (Mild Cognitive Impairment)',
  phcCenter: 'Jorhat Rural Primary Health Centre',
  treatingNeurologist: 'Dr. A. K. Sarma, MD (Neurology, GMCH)',
  primaryCaregiver: 'Ananya Hazarika (Daughter)',
  caregiverPhone: '+91 98640 12345',
  
  // Baseline Cognitive Metrics
  currentCSS: 78, // Cognitive Stability Score (0-100)
  baselineCSS: 65,
  reactionTimeAvgMs: 1420, // Milliseconds
  medicationAdherencePct: 94, // %
  emotionalCalmPct: 88, // %
  
  medications: [
    { id: 1, name: 'Donepezil 5mg', timing: '8:00 AM', takenToday: true, color: 'blue' },
    { id: 2, name: 'Memantine 10mg', timing: '2:00 PM', takenToday: true, color: 'green' },
    { id: 3, name: 'Amlodipine 5mg (BP)', timing: '8:00 PM', takenToday: false, color: 'purple' }
  ],
  
  hydration: {
    currentMl: 1250,
    targetMl: 2000,
    logsToday: 5
  },

  weeklyTrends: [
    { day: 'Mon', cssScore: 72, reactionTime: 1550, memoryAccuracy: 75, focusDurationMin: 12 },
    { day: 'Tue', cssScore: 74, reactionTime: 1480, memoryAccuracy: 78, focusDurationMin: 15 },
    { day: 'Wed', cssScore: 71, reactionTime: 1600, memoryAccuracy: 70, focusDurationMin: 10 },
    { day: 'Thu', cssScore: 76, reactionTime: 1450, memoryAccuracy: 82, focusDurationMin: 18 },
    { day: 'Fri', cssScore: 79, reactionTime: 1390, memoryAccuracy: 85, focusDurationMin: 20 },
    { day: 'Sat', cssScore: 77, reactionTime: 1410, memoryAccuracy: 80, focusDurationMin: 16 },
    { day: 'Sun', cssScore: 82, reactionTime: 1320, memoryAccuracy: 88, focusDurationMin: 22 },
  ],

  safetyAlerts: [
    {
      id: 'alt_01',
      timestamp: '2026-08-27 10:15 AM',
      type: 'Hesitation Spike',
      message: 'Extended hesitation (8.4s) detected during Morning Routine card 2.',
      severity: 'low',
      resolved: true
    },
    {
      id: 'alt_02',
      timestamp: '2026-08-25 08:45 PM',
      type: 'Missed Medication Cue',
      message: 'Evening Amlodipine delayed by 45 minutes before voice prompt answered.',
      severity: 'medium',
      resolved: true
    }
  ]
};
