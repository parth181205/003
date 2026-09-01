export const DYNAMIC_CONVERSATIONAL_INTENTS = [
  {
    category: "medicine",
    keywords: ["medicine", "pill", "donepezil", "memantine", "tab", "dose", "prescription"],
    responses: [
      "Hello {name}, your morning Donepezil 5mg pill was taken at 8:00 AM. Your next scheduled dose is Memantine at 2:00 PM today.",
      "Good news! Your morning medication log is marked complete. Remember to take your evening pill with a warm glass of water at 8:00 PM.",
      "Don't worry about forgetting! Your primary caregiver and PHC health worker Ratan Das set your pill reminder for 2:00 PM."
    ]
  },
  {
    category: "water",
    keywords: ["water", "hydration", "drink", "glass", "thirsty"],
    responses: [
      "You have logged {waterCurrent} ml of water out of your 2,000 ml daily goal today. Shall I help you log another 250ml glass?",
      "Staying hydrated keeps your brain active and focused! You are doing great today with {waterCurrent} ml recorded.",
      "Drink a fresh glass of water now to stay energized for your afternoon garden walk!"
    ]
  },
  {
    category: "games",
    keywords: ["game", "play", "smriti", "routine", "focus", "sound", "music"],
    responses: [
      "I recommend playing 'Smriti Cards'! Matching the Assamese Jaapi and Manipuri Pung drum will boost your visual spatial memory.",
      "How about listening to 'Swar Sound Therapy'? Hearing the soothing rain on tin roof and Bihu Pepa flute will calm your mind.",
      "Let us practice the 'Niyama Daily Routine' game to keep your morning and evening tasks fresh in your memory."
    ]
  },
  {
    category: "family",
    keywords: ["daughter", "grandson", "ananya", "rahul", "family", "kutumba", "home"],
    responses: [
      "Your daughter Ananya Hazarika sent a warm voice note from Guwahati: 'Deuta, take your morning tea and remember I love you very much!'",
      "Your grandson Rahul is visiting from IIT Guwahati this Sunday with fresh tea leaves and homemade pitha!",
      "You can open the 'Kutumba Recall' tab to see photos of Ananya and Rahul along with their recorded voices."
    ]
  },
  {
    category: "feeling",
    keywords: ["feel", "tired", "anxious", "confused", "forgot", "scared", "sad"],
    responses: [
      "Take a deep, slow breath {name}. You are safe at home in Jorhat. I am right here with you, and your caregiver is watching over you.",
      "It is completely okay to feel a little confused sometimes. Let us listen to gentle bamboo flute soundscapes together to relax.",
      "You are doing wonderfully today! Your Cognitive Stability Score is at a stable {cssScore} points. Be proud of your progress."
    ]
  },
  {
    category: "weather",
    keywords: ["weather", "rain", "sun", "hot", "cold", "jorhat", "assam"],
    responses: [
      "Today in Jorhat, Assam, we have pleasant monsoon showers with a gentle breeze of 24 degrees. Perfect weather for hot tea!",
      "It is sunny and bright outside! Perfect time for your gentle 4:30 PM garden walk to get natural vitamin D.",
      "Listen to the soft rain tapping on the roof—it brings back sweet memories of Assam tea garden mornings."
    ]
  },
  {
    category: "greeting",
    keywords: ["hello", "hi", "namaskar", "aai", "good morning", "good evening"],
    responses: [
      "Namaskar {name}! I am Aai, your AI voice companion. How can I assist you with your memory or routine today?",
      "Good day {name}! I hope you slept well. Would you like to play a quick memory game or listen to calming music?",
      "Greetings! I am here to help you remember your pills, talk with your family, and keep your mind active."
    ]
  },
  {
    category: "joke",
    keywords: ["joke", "story", "smile", "laugh"],
    responses: [
      "Here is a gentle thought: Why did the tea leaf go to school? Because it wanted to be a 'smart tea'! Have a wonderful day, {name}!",
      "Did you know? Kaziranga's rhinos love taking long morning baths just like we enjoy fresh morning chai!"
    ]
  }
];

export const getAIResponse = (userQuery, patientData) => {
  const text = (userQuery || "").toLowerCase();
  
  for (const intent of DYNAMIC_CONVERSATIONAL_INTENTS) {
    if (intent.keywords.some(kw => text.includes(kw))) {
      const idx = Math.floor(Math.random() * intent.responses.length);
      let template = intent.responses[idx];
      
      // Interpolate dynamic variables
      template = template
        .replace(/{name}/g, patientData.name || "Kaka")
        .replace(/{waterCurrent}/g, patientData.hydration?.currentMl || 1250)
        .replace(/{cssScore}/g, patientData.currentCSS || 84);
        
      return template;
    }
  }

  // Fallback for general unmapped queries with high variety
  const generalFallbacks = [
    `I understand you asked: "${userQuery}". You are doing great today, ${patientData.name || 'Kaka'}! Your cognitive score is ${patientData.currentCSS || 84} points.`,
    `That is an interesting thought about "${userQuery}". Let us keep your memory strong by playing a quick matching game!`,
    `Thank you for sharing that with me! Remember, I am always here to remind you of your medicine, family, and daily routine.`,
    `I heard you say "${userQuery}". Would you like me to play calming Bihu flute music or check your water goal?`
  ];
  
  return generalFallbacks[Math.floor(Math.random() * generalFallbacks.length)];
};
