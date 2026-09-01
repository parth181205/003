// Centralized Content Database & Declarative Game Schemas

export const OBJECT_ITEMS = [
  { id: 'apple', name: 'Apple', category: 'food', icon: '🍎', color: 0xef4444, audioLabel: 'Red Apple', description: 'A crisp red apple' },
  { id: 'banana', name: 'Banana', category: 'food', icon: '🍌', color: 0xeab308, audioLabel: 'Yellow Banana', description: 'A sweet yellow banana' },
  { id: 'bread', name: 'Bread', category: 'food', icon: '🍞', color: 0xd97706, audioLabel: 'Loaf of Bread', description: 'Freshly baked bread' },
  { id: 'cup', name: 'Teacup', category: 'household', icon: '☕', color: 0x8b5cf6, audioLabel: 'Teacup', description: 'A cozy cup of hot tea' },
  { id: 'shirt', name: 'Shirt', category: 'clothing', icon: '👕', color: 0x3b82f6, audioLabel: 'Blue Shirt', description: 'A clean folded shirt' },
  { id: 'hat', name: 'Hat', category: 'clothing', icon: '👒', color: 0xec4899, audioLabel: 'Sun Hat', description: 'A warm summer hat' },
  { id: 'shoe', name: 'Shoe', category: 'clothing', icon: '👞', color: 0x78350f, audioLabel: 'Leather Shoe', description: 'A comfortable leather shoe' },
  { id: 'flower', name: 'Flower', category: 'nature', icon: '🌸', color: 0xf43f5e, audioLabel: 'Rose Flower', description: 'A gentle pink flower' },
  { id: 'tree', name: 'Tree', category: 'nature', icon: '🌳', color: 0x10b981, audioLabel: 'Green Tree', description: 'A shady green oak tree' },
  { id: 'dog', name: 'Dog', category: 'animals', icon: '🐶', color: 0xf59e0b, audioLabel: 'Friendly Dog', description: 'A happy loyal puppy' },
  { id: 'cat', name: 'Cat', category: 'animals', icon: '🐱', color: 0xf97316, audioLabel: 'Cozy Cat', description: 'A sleeping cozy kitten' },
  { id: 'car', name: 'Car', category: 'vehicles', icon: '🚗', color: 0xd97706, audioLabel: 'Red Car', description: 'A vintage red family car' }
];

export const SAYINGS_DATA = [
  {
    id: 'saying_1',
    prompt: 'An apple a day keeps the doctor...',
    options: ['Away', 'Happy', 'Busy'],
    correct: 0,
    hint: 'This word means staying far or distant.'
  },
  {
    id: 'saying_2',
    prompt: 'A stitch in time saves...',
    options: ['Nine', 'Five', 'Ten'],
    correct: 0,
    hint: 'It is the number after eight.'
  },
  {
    id: 'saying_3',
    prompt: 'Early to bed and early to...',
    options: ['Rise', 'Play', 'Sing'],
    correct: 0,
    hint: 'It means waking up early in the morning.'
  },
  {
    id: 'saying_4',
    prompt: 'You are my sunshine, my only...',
    options: ['Sunshine', 'Star', 'Flower'],
    correct: 0,
    hint: 'It repeats the bright sunny word!'
  }
];

export const BOLLYWOOD_SONGS_DATA = [
  {
    id: 'bolly_1',
    title: 'Lag Jaa Gale',
    movie: 'Woh Kaun Thi? (1964)',
    singers: 'Lata Mangeshkar',
    music: 'Madan Mohan',
    audioFile: '/audio/bolly_1.m4a',
    instAudioFile: '/audio/inst_bolly_1.m4a',
    youtubeUrl: 'https://www.youtube.com/watch?v=kcHnaHz7rxc',
    youtubeId: 'kcHnaHz7rxc',
    lyricalYoutubeId: 'kcHnaHz7rxc',
    prompt: 'Lag jaa gale ki phir yeh haseen raat ho na ho,\nShayad phir is janam mein mulaqat ___',
    options: ['Ho na ho', 'Kabhi na ho', 'Raho na ro'],
    correct: 0,
    hint: 'It repeats the phrase "Ho na ho" (whether it happens again or not).',
    freqs: [440, 493.88, 523.25, 587.33, 523.25, 493.88, 440],
    timestampedLyrics: [
      { start: 0, end: 12, text: "🌸 Lag jaa gale ki phir yeh haseen raat ho na ho" },
      { start: 12, end: 25, text: "✨ Shayad phir is janam mein mulaqat ho na ho" },
      { start: 25, end: 38, text: "💖 Humko mili hai aaj yeh ghadiyan naseeb se" },
      { start: 38, end: 52, text: "🌿 Jee bhar ke dekh lijiye humko kareeb se" },
      { start: 52, end: 70, text: "🎶 Phir aapke naseeb mein yeh baat ho na ho" }
    ],
    singAlongSequence: [
      {
        lead: "Lag jaa gale ki phir yeh haseen raat ho na ho,",
        answerText: "Shayad phir is janam mein mulaqat ho na ho",
        options: ["Shayad phir is janam mein mulaqat ho na ho", "Kabhi na milein hum dobara", "Sapna yeh adhura reh na jaaye"],
        correct: 0
      },
      {
        lead: "Humko mili hai aaj yeh ghadiyan naseeb se,",
        answerText: "Jee bhar ke dekh lijiye humko kareeb se",
        options: ["Jee bhar ke dekh lijiye humko kareeb se", "Raat yeh suhaani dhal na jaaye", "Hum toh chale tumko chhod ke"],
        correct: 0
      }
    ],
    triviaQuestion: 'Who sang this timeless soulful gem "Lag Jaa Gale"?',
    triviaOptions: ['Lata Mangeshkar', 'Asha Bhosle', 'Geeta Dutt'],
    triviaCorrect: 0
  },
  {
    id: 'bolly_2',
    title: 'Tujhe Dekha Toh',
    movie: 'Dilwale Dulhania Le Jayenge (1995)',
    singers: 'Kumar Sanu & Lata Mangeshkar',
    music: 'Jatin-Lalit',
    audioFile: '/audio/bolly_2.m4a',
    instAudioFile: '/audio/inst_bolly_2.m4a',
    youtubeUrl: 'https://www.youtube.com/watch?v=cNV5hLSa9H8',
    youtubeId: 'cNV5hLSa9H8',
    lyricalYoutubeId: 'cNV5hLSa9H8',
    prompt: 'Tujhe dekha toh yeh jaana sanam,\nPyaar hota hai ___ sanam',
    options: ['Deewana', 'Suhaana', 'Parwana'],
    correct: 0,
    hint: 'It means feeling crazily in love ("Deewana").',
    freqs: [329.63, 349.23, 392.00, 440.00, 392.00, 349.23],
    timestampedLyrics: [
      { start: 0, end: 10, text: "🌼 Tujhe dekha toh yeh jaana sanam" },
      { start: 10, end: 20, text: "💛 Pyaar hota hai deewana sanam" },
      { start: 20, end: 32, text: "🌾 Ab yahan se kahan jayein hum" },
      { start: 32, end: 50, text: "💫 Teri baahon mein mar jayein hum" }
    ],
    singAlongSequence: [
      {
        lead: "Tujhe dekha toh yeh jaana sanam,",
        answerText: "Pyaar hota hai deewana sanam",
        options: ["Pyaar hota hai deewana sanam", "Sapna bada suhaana sanam", "Pyaar ka ye parwana sanam"],
        correct: 0
      },
      {
        lead: "Ab yahan se kahan jayein hum,",
        answerText: "Teri baahon mein mar jayein hum",
        options: ["Teri baahon mein mar jayein hum", "Dil ke chaman mein kho jayein hum", "Door kahin aasmaan mein jayein"],
        correct: 0
      }
    ],
    triviaQuestion: 'Which iconic romance movie features Shah Rukh Khan & Kajol in yellow mustard fields?',
    triviaOptions: ['Dilwale Dulhania Le Jayenge', 'Kuch Kuch Hota Hai', 'Mohabbatein'],
    triviaCorrect: 0
  },
  {
    id: 'bolly_3',
    title: 'Kal Ho Naa Ho',
    movie: 'Kal Ho Naa Ho (2003)',
    singers: 'Sonu Nigam',
    music: 'Shankar-Ehsaan-Loy',
    audioFile: '/audio/bolly_3.m4a',
    instAudioFile: '/audio/inst_bolly_3.m4a',
    youtubeUrl: 'https://www.youtube.com/watch?v=g0eO74UmRBs',
    youtubeId: 'g0eO74UmRBs',
    lyricalYoutubeId: 'g0eO74UmRBs',
    prompt: 'Har ghadi badal rahi hai roop zindagi,\nChhaav hai kabhi kabhi hai ___',
    options: ['Dhoop', 'Chaand', 'Hawa'],
    correct: 0,
    hint: 'The opposite of shade/shadow ("Chhaav") is sunshine ("Dhoop").',
    freqs: [392.00, 440.00, 493.88, 523.25, 493.88, 440.00],
    timestampedLyrics: [
      { start: 0, end: 11, text: "☀️ Har ghadi badal rahi hai roop zindagi" },
      { start: 11, end: 24, text: "🌅 Chhaav hai kabhi kabhi hai dhoop zindagi" },
      { start: 24, end: 36, text: "🕊️ Har pal yahan jee bhar jiyo" },
      { start: 36, end: 55, text: "✨ Jo hai samaa kal ho naa ho" }
    ],
    singAlongSequence: [
      {
        lead: "Har ghadi badal rahi hai roop zindagi,",
        answerText: "Chhaav hai kabhi kabhi hai dhoop zindagi",
        options: ["Chhaav hai kabhi kabhi hai dhoop zindagi", "Thandi hawa ka roop zindagi", "Chandni raat mein dhoop zindagi"],
        correct: 0
      },
      {
        lead: "Har pal yahan jee bhar jiyo,",
        answerText: "Jo hai samaa kal ho naa ho",
        options: ["Jo hai samaa kal ho naa ho", "Duniya ka sapna khota na ho", "Raat suhaani soona na ho"],
        correct: 0
      }
    ],
    triviaQuestion: 'Who delivered the famous heartfelt vocal performance for this title track?',
    triviaOptions: ['Sonu Nigam', 'Udit Narayan', 'Shaan'],
    triviaCorrect: 0
  },
  {
    id: 'bolly_4',
    title: 'Chaiyya Chaiyya',
    movie: 'Dil Se.. (1998)',
    singers: 'Sukhwinder Singh & Sapna Awasthi',
    music: 'A.R. Rahman',
    audioFile: '/audio/bolly_4.m4a',
    instAudioFile: '/audio/inst_bolly_4.m4a',
    youtubeUrl: 'https://www.youtube.com/watch?v=lZLxjLYyhYQ',
    youtubeId: 'lZLxjLYyhYQ',
    lyricalYoutubeId: 'lZLxjLYyhYQ',
    prompt: 'Jiske sar ho ishq ki chhaav,\nPaaon ke tale ___ chale',
    options: ['Firdous', 'Zameen', 'Aasmaan'],
    correct: 0,
    hint: 'A Persian/Urdu word for paradise ("Firdous").',
    freqs: [440.00, 493.88, 523.25, 587.33, 659.25],
    timestampedLyrics: [
      { start: 0, end: 12, text: "🚂 Jiske sar ho ishq ki chhaav" },
      { start: 12, end: 24, text: "🔥 Paaon ke tale firdous chale" },
      { start: 24, end: 36, text: "💨 Chal chaiyya chaiyya chaiyya chaiyya" },
      { start: 36, end: 55, text: "⚡ Yaar misal-e-os dhale paon ke tale" }
    ],
    singAlongSequence: [
      {
        lead: "Jiske sar ho ishq ki chhaav,",
        answerText: "Paaon ke tale firdous chale",
        options: ["Paaon ke tale firdous chale", "Zameen pe saare sapne chale", "Aasmaan se aage ho chale"],
        correct: 0
      }
    ],
    triviaQuestion: 'Who composed the electrifying music for Chaiyya Chaiyya shot on a moving train?',
    triviaOptions: ['A.R. Rahman', 'Pritam', 'Vishal-Shekhar'],
    triviaCorrect: 0
  },
  {
    id: 'bolly_5',
    title: 'Pyaar Hua Ikrar Hua',
    movie: 'Shree 420 (1955)',
    singers: 'Manna Dey & Lata Mangeshkar',
    music: 'Shankar-Jaikishan',
    audioFile: '/audio/bolly_5.m4a',
    instAudioFile: '/audio/inst_bolly_5.m4a',
    youtubeUrl: 'https://www.youtube.com/watch?v=X3Twhs6Tnws',
    youtubeId: 'X3Twhs6Tnws',
    lyricalYoutubeId: 'X3Twhs6Tnws',
    prompt: 'Pyaar hua ikrar hua hai,\nPyaar se phir kyun ___ hai',
    options: ['Darta', 'Rukta', 'Hastal'],
    correct: 0,
    hint: 'It asks why the heart feels scared ("Darta").',
    freqs: [261.63, 293.66, 329.63, 349.23, 392.00],
    timestampedLyrics: [
      { start: 0, end: 12, text: "☔ Pyaar hua ikrar hua hai" },
      { start: 12, end: 24, text: "💓 Pyaar se phir kyun darta hai dil" },
      { start: 24, end: 36, text: "🌧️ Kehta hai dil rasta mushkil" },
      { start: 36, end: 55, text: "🌃 Maalum nahi hai kahan manzil" }
    ],
    singAlongSequence: [
      {
        lead: "Pyaar hua ikrar hua hai,",
        answerText: "Pyaar se phir kyun darta hai dil",
        options: ["Pyaar se phir kyun darta hai dil", "Pyaar mein aisi baat ho kyun", "Pyaar ka sapna toot na jaaye"],
        correct: 0
      }
    ],
    triviaQuestion: 'Which legendary actor shared the umbrella in the rain in this unforgettable classic?',
    triviaOptions: ['Raj Kapoor', 'Dev Anand', 'Dilip Kumar'],
    triviaCorrect: 0
  },
  {
    id: 'bolly_6',
    title: 'Tum Hi Ho',
    movie: 'Aashiqui 2 (2013)',
    singers: 'Arijit Singh',
    music: 'Mithoon',
    audioFile: '/audio/bolly_6.m4a',
    instAudioFile: '/audio/inst_bolly_6.m4a',
    youtubeUrl: 'https://www.youtube.com/watch?v=Umqb9KENgmk',
    youtubeId: 'Umqb9KENgmk',
    lyricalYoutubeId: 'Umqb9KENgmk',
    prompt: 'Kyunki tum hi ho, ab tum hi ho,\nZindagi ab tum ___ ho',
    options: ['Hi', 'Bhi', 'Se'],
    correct: 0,
    hint: 'It repeats the word "Hi" (You alone are my life).',
    freqs: [293.66, 329.63, 349.23, 392.00, 349.23, 329.63],
    timestampedLyrics: [
      { start: 0, end: 26, text: "🌧️ Hum tere bin ab reh nahi sakte..." },
      { start: 26.7, end: 29.9, text: "🌧️ Hum tere bin ab reh" },
      { start: 29.9, end: 34.0, text: "💔 Nahi sakte tere bina kya" },
      { start: 34.0, end: 51.9, text: "💔 Wajood mera" },
      { start: 51.9, end: 56.0, text: "🥀 Tujh se juda agar ho jayenge" },
      { start: 56.0, end: 64.7, text: "🍃 Toh khud se hi ho jayenge juda" },
      { start: 64.7, end: 68.4, text: "💖 Kyunki tum hi ho, ab tum hi ho" },
      { start: 68.4, end: 73.6, text: "💫 Zindagi ab tum hi ho" },
      { start: 73.6, end: 78.2, text: "🕊️ Chain bhi, mera dard bhi" },
      { start: 78.2, end: 103.9, text: "🌹 Meri aashiqui ab tum hi ho" },
      { start: 103.9, end: 108.3, text: "📜 Tera mera rishta hai kaisa" },
      { start: 108.3, end: 113.6, text: "✨ Ek pal door gavara nahi" },
      { start: 113.6, end: 117.4, text: "⭐ Tere liye har roz hai jeete" },
      { start: 117.4, end: 120.8, text: "🌸 Tujhko diya mera waqt sabhi" },
      { start: 120.8, end: 124.8, text: "🌿 Koi lamha mera na ho tere bina" },
      { start: 124.8, end: 128.2, text: "💓 Har saans pe naam tera" },
      { start: 128.2, end: 138.3, text: "💖 Kyunki tum hi ho, ab tum hi ho" },
      { start: 138.3, end: 143.1, text: "💫 Zindagi ab tum hi ho" },
      { start: 143.1, end: 147.9, text: "🕊️ Chain bhi, mera dard bhi" },
      { start: 147.9, end: 235.6, text: "🌹 Meri aashiqui ab tum hi ho" },
      { start: 235.6, end: 239.8, text: "🌾 Tere saath mera hai naseeb juda" },
      { start: 239.8, end: 247.0, text: "🌼 Tujhe paake adhura na raha" },
      { start: 247.0, end: 255.2, text: "💖 Kyunki tum hi ho, ab tum hi ho" },
      { start: 255.2, end: 259.8, text: "💫 Zindagi ab tum hi ho" },
      { start: 259.8, end: 264.8, text: "🕊️ Chain bhi, mera dard bhi" },
      { start: 264.8, end: 300.0, text: "🌹 Meri aashiqui ab tum hi ho" }
    ],
    singAlongSequence: [
      {
        lead: "Hum tere bin ab reh nahi sakte,",
        answerText: "Tere bina kya wajood mera",
        options: ["Tere bina kya wajood mera", "Tere bina jeena hai sazaa", "Dil mera tanha reh jaaye"],
        correct: 0
      }
    ],
    triviaQuestion: 'This anthem launched which modern romantic singer to global superstardom?',
    triviaOptions: ['Arijit Singh', 'Armaan Malik', 'Atif Aslam'],
    triviaCorrect: 0
  },
  {
    id: 'bolly_7',
    title: 'Kabhi Kabhie Mere Dil Mein',
    movie: 'Kabhie Kabhie (1976)',
    singers: 'Mukesh',
    music: 'Khayyam',
    audioFile: '/audio/bolly_7.m4a',
    instAudioFile: '/audio/inst_bolly_7.m4a',
    youtubeUrl: 'https://www.youtube.com/watch?v=-W2dagktUp0',
    youtubeId: '-W2dagktUp0',
    lyricalYoutubeId: '-W2dagktUp0',
    prompt: 'Kabhi kabhie mere dil mein khayal aata hai,\nKi jaise tujhko banaya gaya hai ___ ke liye',
    options: ['Mere', 'Sabhki', 'Pyaar'],
    correct: 0,
    hint: 'Means created just for me ("Mere").',
    freqs: [220.00, 261.63, 293.66, 329.63, 293.66],
    timestampedLyrics: [
      { start: 0, end: 12, text: "🍂 Kabhi kabhie mere dil mein khayal aata hai" },
      { start: 12, end: 24, text: "🌹 Ki jaise tujhko banaya gaya hai mere liye" },
      { start: 24, end: 36, text: "✨ Tu ab se pehle sitaron mein bas rahi thi kahin" },
      { start: 36, end: 55, text: "📜 Tujhe zameen pe bulaya gaya hai mere liye" }
    ],
    singAlongSequence: [
      {
        lead: "Kabhi kabhie mere dil mein khayal aata hai,",
        answerText: "Ki jaise tujhko banaya gaya hai mere liye",
        options: ["Ki jaise tujhko banaya gaya hai mere liye", "Ki jaise phool khile hain pyaare chaman ke liye", "Ki jaise sapna sajaaya gaya hai mere liye"],
        correct: 0
      }
    ],
    triviaQuestion: 'Which legendary actor recited the famous poetic intro in Kabhie Kabhie?',
    triviaOptions: ['Amitabh Bachchan', 'Dharmendra', 'Rajesh Khanna'],
    triviaCorrect: 0
  },
  {
    id: 'bolly_8',
    title: 'Tere Bina Zindagi Se',
    movie: 'Aandhi (1975)',
    singers: 'Kishore Kumar & Lata Mangeshkar',
    music: 'R.D. Burman',
    audioFile: '/audio/bolly_8.m4a',
    instAudioFile: '/audio/inst_bolly_8.m4a',
    youtubeUrl: 'https://www.youtube.com/watch?v=otSbGQIYgpQ',
    youtubeId: 'otSbGQIYgpQ',
    lyricalYoutubeId: 'otSbGQIYgpQ',
    prompt: 'Tere bina zindagi se koi shikwa toh nahi,\nShikwa nahi, tere bina zindagi bhi lekin ___ nahi',
    options: ['Zindagi', 'Khushi', 'Roshni'],
    correct: 0,
    hint: 'Without you, life itself is not life ("Zindagi").',
    freqs: [293.66, 329.63, 392.00, 440.00, 392.00],
    timestampedLyrics: [
      { start: 0, end: 12, text: "🌙 Tere bina zindagi se koi shikwa toh nahi" },
      { start: 12, end: 25, text: "🍃 Shikwa nahi, tere bina zindagi bhi lekin zindagi nahi" },
      { start: 25, end: 38, text: "⭐ Jee mein aata hai tere daaman mein sar jhuka ke" },
      { start: 38, end: 55, text: "💫 Hum rote rahein, hum rote rahein" }
    ],
    singAlongSequence: [
      {
        lead: "Tere bina zindagi se koi shikwa toh nahi,",
        answerText: "Shikwa nahi, tere bina zindagi bhi lekin zindagi nahi",
        options: ["Shikwa nahi, tere bina zindagi bhi lekin zindagi nahi", "Dil mein basayen hum koi nayi khushi nahi", "Gham toh nahi hai par koi roshni nahi"],
        correct: 0
      }
    ],
    triviaQuestion: 'Who composed the timeless tunes for Aandhi with lyrics by Gulzar?',
    triviaOptions: ['R.D. Burman (Pancham da)', 'Laxmikant-Pyarelal', 'Kalyanji-Anandji'],
    triviaCorrect: 0
  }
];

export const GAMES_LIBRARY = [
  {
    id: 'bollywood_songs',
    title: 'Bollywood Songs & Antakshari',
    category: 'Words',
    icon: '🎬',
    description: 'Listen to iconic Bollywood hits on YouTube, complete classic lyrics, and test your music trivia!',
    badge: 'Bollywood Classics'
  },
  {
    id: 'matching',
    title: 'Card Matching',
    category: 'Memory & Reminiscence',
    icon: '🎴',
    description: 'Flip and pair matching pictures at your own comfortable pace.',
    badge: 'Classic Memory'
  },
  {
    id: 'sorting',
    title: 'Category Sorting',
    category: 'Pictures',
    icon: '🧺',
    description: 'Sort everyday items into Food and Clothing containers.',
    badge: 'Sorting'
  },
  {
    id: 'jigsaw',
    title: 'Picture Jigsaw',
    category: 'Pictures',
    icon: '🧩',
    description: 'Place jigsaw pieces onto a nostalgic photo background.',
    badge: 'Puzzle'
  },
  {
    id: 'dominoes',
    title: 'Gentle Dominoes',
    category: 'Simple Games',
    icon: '🀩',
    description: 'Match numbers and dot patterns with a friendly computer partner.',
    badge: 'Play Together'
  },
  {
    id: 'bingo',
    title: 'Picture Bingo',
    category: 'Pictures',
    icon: '🎰',
    description: 'Mark called pictures on your personal bingo card.',
    badge: 'Bingo'
  },
  {
    id: 'song_lyrics',
    title: 'Nostalgic Song Lyrics',
    category: 'Words',
    icon: '🎵',
    description: 'Listen to classic tunes and complete familiar song lyrics.',
    badge: 'Music'
  },
  {
    id: 'finish_saying',
    title: 'Finish the Saying',
    category: 'Words',
    icon: '💬',
    description: 'Recall timeless proverbs and familiar phrases.',
    badge: 'Proverbs'
  },
  {
    id: 'balloon_tap',
    title: 'Gentle Balloon Tap',
    category: 'Movement',
    icon: '🎈',
    description: 'Tap slowly floating colorful balloons for soothing feedback.',
    badge: 'Relaxing'
  },
  {
    id: 'target_touch',
    title: 'Target Touch',
    category: 'Movement',
    icon: '🎯',
    description: 'Gently touch pulsing geometric shapes.',
    badge: 'Touch'
  },
  {
    id: 'connect_four',
    title: 'Connect Four',
    category: 'Play Together',
    icon: '🔴',
    description: 'Drop smooth tokens into columns to connect 4 in a row.',
    badge: 'Board Game'
  },
  {
    id: 'conversation',
    title: 'Reminiscence Topics',
    category: 'Memory & Reminiscence',
    icon: '🗣️',
    description: 'Explore warm memory conversation cards about family, travel, and food.',
    badge: 'Storytelling'
  },
  // ── Video-Inspired Games ──────────────────────────────────────────────────
  {
    id: 'spot_it',
    title: 'Spot the Difference',
    category: 'Pictures',
    icon: '🔍',
    description: 'Find the hidden differences between two similar pictures. Visual attention & perception training.',
    badge: 'Visual Attention'
  },
  {
    id: 'garden_tap',
    title: 'Garden Tap',
    category: 'Movement',
    icon: '🌻',
    description: 'Tap the sunflowers as they bloom, but avoid the roses! Speed-of-processing reaction training.',
    badge: 'Reaction Speed'
  },
  {
    id: 'number_trail',
    title: 'Number Trail',
    category: 'Memory & Reminiscence',
    icon: '🔢',
    description: 'Remember where the numbers are hidden, then tap them in order. Working memory challenge.',
    badge: 'Working Memory'
  }
];

