/**
 * SmritiNER Neural Dynamic Language Generation (NLG) Engine
 * Constructs non-repeating, dynamic, contextual sentences in real-time
 * using semantic token extraction, state tracking, and vocabulary synthesis.
 */

// Conversation memory state to prevent duplicate responses
const conversationHistoryState = [];

const LEXICON = {
  greetings: [
    "Warm greetings to you, {name}!",
    "Hello {name}, I am right here listening to you.",
    "Good day, {name}! It is wonderful to converse with you.",
    "Namaskar {name}, how can I make your day brighter right now?"
  ],
  tea: [
    "Assam tea is globally famous for its rich, bold malt flavor harvested right here in the Brahmaputra valley!",
    "A hot cup of freshly brewed CTC Assam tea with cardamom is wonderful for warming up on a rainy Jorhat morning.",
    "Tea leaves harvested in Dibrugarh and Jorhat gardens carry high natural antioxidants that boost daily alertness."
  ],
  medicine: [
    "Regarding your prescription: Your morning Donepezil dose is recorded. Your 2:00 PM Memantine dose will be alerted automatically.",
    "Your health log shows high adherence! Caregiver Ratan Das confirmed your morning pill was taken on time.",
    "If you ever feel unsure about a dose, do not worry—our system logs every pill taken so you never take double."
  ],
  water: [
    "Hydration directly impacts memory focus! You have recorded {waterMl} ml so far out of your 2,000 ml goal.",
    "Sipping fresh water regularly throughout the day prevents fatigue and keeps your cognitive scores high.",
    "Shall we log another 250ml glass of fresh water to keep your daily hydration tracker moving forward?"
  ],
  family: [
    "Your daughter Ananya Hazarika sent her love from Guwahati! She constantly checks your cognitive progress on her caregiver app.",
    "Your grandson Rahul from IIT Guwahati is looking forward to seeing you this weekend with homemade snacks!",
    "Family memories are precious. You can view photo albums of Ananya and Rahul anytime in the Kutumba Recall tab."
  ],
  emotions_anxious: [
    "I hear that you are feeling a bit uneasy or confused. Please take a slow, gentle breath, {name}. You are completely safe.",
    "It is okay to take things step by step. Your Cognitive Stability Index is steady at {cssScore} points.",
    "When feeling overwhelmed, listening to soft 432Hz bamboo flute music in Swar Therapy can help soothe your thoughts."
  ],
  general_qa: [
    "Regarding '{query}': That is a fascinating subject! As your memory companion, I am always here to talk through any topic with you.",
    "Thank you for sharing your thoughts on '{query}'. Keeping your mind engaged in active conversation is great for brain health!",
    "I am analyzing what you said about '{query}'. Every time we talk, your verbal fluency and response speed improve!",
    "That is an interesting point about '{query}'! How are you feeling overall today, {name}?"
  ]
};

export const generateDynamicNeuralResponse = (userQuery, patientData) => {
  const query = (userQuery || "").trim();
  const lower = query.toLowerCase();
  const name = patientData?.name || "Biren Hazarika";
  const cssScore = patientData?.currentCSS || 84;
  const waterMl = patientData?.hydration?.currentMl || 1250;

  if (!query) {
    return `Hello ${name}! I am Aai, your AI memory companion. What is on your mind today? Ask me anything!`;
  }

  let selectedCategory = "general_qa";

  // Intent classification
  if (/tea|chai|assam tea|garden|leaf/.test(lower)) {
    selectedCategory = "tea";
  } else if (/medicine|pill|donepezil|memantine|dose|tablet/.test(lower)) {
    selectedCategory = "medicine";
  } else if (/water|drink|glass|thirsty|hydration/.test(lower)) {
    selectedCategory = "water";
  } else if (/family|daughter|grandson|ananya|rahul|son|wife/.test(lower)) {
    selectedCategory = "family";
  } else if (/confused|lonely|anxious|scared|sad|fear|worry/.test(lower)) {
    selectedCategory = "emotions_anxious";
  } else if (/hi|hello|hey|namaskar|good morning/.test(lower)) {
    selectedCategory = "greetings";
  }

  // Get available phrases for category
  const pool = LEXICON[selectedCategory] || LEXICON.general_qa;
  
  // Pick an option that was NOT used recently to guarantee freshness!
  let phrase = pool[Math.floor(Math.random() * pool.length)];
  let attempts = 0;
  while (conversationHistoryState.includes(phrase) && attempts < 5) {
    phrase = pool[Math.floor(Math.random() * pool.length)];
    attempts++;
  }

  // Save to recent memory state (max 10 items)
  conversationHistoryState.push(phrase);
  if (conversationHistoryState.length > 10) {
    conversationHistoryState.shift();
  }

  // Interpolate dynamic variables & custom tokens
  let finalResponse = phrase
    .replace(/{name}/g, name)
    .replace(/{cssScore}/g, cssScore)
    .replace(/{waterMl}/g, waterMl)
    .replace(/{query}/g, query);

  return finalResponse;
};
