// Escape Room & Story Puzzle Data for Dementia Cognitive Therapy
// Inspired by "50 Rooms" escape room gameplay with dementia accessibility

export const ESCAPE_ROOMS = [
  {
    id: 'room_1',
    title: 'Room 1: The Heritage Study Room',
    description: 'Explore the cozy study. Examine the clock, investigate the wooden desk, and find the clues to unlock the exit door.',
    bgImage: '/images/escape_room/room1_study.png',
    fallbackTheme: 'from-amber-950 via-slate-900 to-amber-900',
    fallbackIcon: '🏛️',
    initialObjective: 'Examine the vintage wall clock to find the first time code.',
    exitCode: '1947',
    exitLockType: 'key_or_code', // can use key or enter 1947
    requiredItemToExit: 'exit_key_1',
    hotspots: [
      {
        id: 'clock_1',
        name: 'Vintage Grandfather Clock',
        icon: '🕰️',
        position: { top: '22%', left: '18%' },
        desc: 'An old brass clock ticking gently. The hands are set permanently at 10:25.',
        hint: 'Notice the time on the clock face: 10:25. That might be a code for a lock!',
        dialogText: 'The clock face clearly points to 10:25. Below it is carved: "Time opens locked drawers."',
        givesItem: null,
        type: 'inspect_text',
        image: '/images/escape_room/closeup_clock.png'
      },
      {
        id: 'drawer_1',
        name: 'Locked Wooden Desk Drawer',
        icon: '🗄️',
        position: { top: '60%', left: '35%' },
        desc: 'A heavy teakwood desk drawer secured with a 4-digit number lock.',
        hint: 'Use the time code from the clock (1025) to unlock this drawer.',
        type: 'code_lock',
        correctCode: '1025',
        unlockedText: 'Click! The desk drawer slides open!',
        givesItem: {
          id: 'brass_key',
          name: 'Brass Cabinet Key',
          icon: '🔑',
          desc: 'A antique brass key found inside the desk drawer.',
          image: '/images/escape_room/item_brass_key.png'
        },
        image: '/images/escape_room/closeup_drawer.png'
      },
      {
        id: 'bookshelf_1',
        name: 'Ancestral Bookshelf',
        icon: '📚',
        position: { top: '30%', left: '72%' },
        desc: 'Shelves filled with old leather-bound journals and poetry books.',
        hint: 'Search behind the third book on the middle shelf to find a hidden item.',
        type: 'search_item',
        unlockedText: 'You reached behind the 3rd book and discovered a UV Flashlight!',
        givesItem: {
          id: 'uv_light',
          name: 'UV Secret Flashlight',
          icon: '🔦',
          desc: 'A blue UV light capable of revealing hidden luminescent clues.',
          image: '/images/escape_room/item_uv_light.png'
        },
        image: '/images/escape_room/closeup_books.png'
      },
      {
        id: 'painting_1',
        name: 'Heritage Landscape Painting',
        icon: '🖼️',
        position: { top: '25%', left: '48%' },
        desc: 'A scenic oil painting of Kaziranga tea hills. It looks like something is written in invisible ink.',
        hint: 'Select the UV Flashlight from your inventory and examine the painting!',
        type: 'use_item',
        requiredItem: 'uv_light',
        defaultText: 'The painting looks peaceful, but you need a UV Flashlight to read the secret message.',
        revealedText: 'The UV light reveals shining golden numbers on the canvas: "Door Key Code: 1947" & yields the Brass Exit Key!',
        givesItem: {
          id: 'exit_key_1',
          name: 'Heritage Room Exit Key',
          icon: '🗝️',
          desc: 'The master key that unlocks the door to Room 2.',
          image: '/images/escape_room/item_exit_key.png'
        },
        image: '/images/escape_room/closeup_painting.png'
      },
      {
        id: 'door_1',
        name: 'Room Exit Door',
        icon: '🚪',
        position: { top: '50%', left: '88%' },
        desc: 'The main wooden door leading into the Courtyard Garden.',
        hint: 'Use the Heritage Exit Key (or enter code 1947) to unlock this door!',
        type: 'door_lock',
        correctCode: '1947',
        requiredItem: 'exit_key_1',
        image: '/images/escape_room/closeup_door.png'
      }
    ]
  },
  {
    id: 'room_2',
    title: 'Room 2: The Nostalgic Tea Courtyard',
    description: 'A serene open courtyard surrounded by green tea leaves. Restore the old gramophone to play traditional melodies.',
    bgImage: '/images/escape_room/room2_courtyard.png',
    fallbackTheme: 'from-emerald-950 via-teal-950 to-slate-900',
    fallbackIcon: '🌿',
    initialObjective: 'Examine the garden bench and decorative chest to find music accessories.',
    exitCode: '528',
    exitLockType: 'key_or_code',
    requiredItemToExit: 'exit_key_2',
    hotspots: [
      {
        id: 'chest_2',
        name: 'Carved Wooden Trunk',
        icon: '🧰',
        position: { top: '65%', left: '20%' },
        desc: 'A bamboo & wooden trunk with 3 cultural symbol locks: Tea Leaf (🍃), Rhino (🦏), Jaapi (👒).',
        hint: 'Select the 3 symbols in order: 1. Tea Leaf 🍃, 2. Rhino 🦏, 3. Jaapi 👒.',
        type: 'pattern_puzzle',
        pattern: ['🍃', '🦏', '👒'],
        unlockedText: 'The trunk pops open! Inside you find a Gramophone Needle & Brass Winder!',
        givesItem: {
          id: 'gramophone_needle',
          name: 'Golden Gramophone Needle',
          icon: '🎵',
          desc: 'A shiny brass needle needed to play records on the vintage gramophone.',
          image: '/images/escape_room/item_needle.png'
        },
        image: '/images/escape_room/closeup_chest.png'
      },
      {
        id: 'gramophone_2',
        name: 'Vintage Brass Gramophone',
        icon: '📻',
        position: { top: '35%', left: '50%' },
        desc: 'A classic brass horn record player. It needs a needle to play sweet Bihu music.',
        hint: 'Use the Golden Gramophone Needle from your inventory on the gramophone.',
        type: 'use_item',
        requiredItem: 'gramophone_needle',
        defaultText: 'The gramophone is missing its needle.',
        revealedText: 'The gramophone starts playing soothing Bihu melody (528Hz)! A secret compartment underneath pops open, giving you the Courtyard Exit Key!',
        givesItem: {
          id: 'exit_key_2',
          name: 'Courtyard Exit Key',
          icon: '🗝️',
          desc: 'Key to unlock the Memory Album Gallery.',
          image: '/images/escape_room/item_key_2.png'
        },
        image: '/images/escape_room/closeup_gramophone.png'
      },
      {
        id: 'door_2',
        name: 'Archway Door to Memory Gallery',
        icon: '🚪',
        position: { top: '45%', left: '85%' },
        desc: 'A carved wooden archway leading to the Family Memory Gallery.',
        hint: 'Use the Courtyard Exit Key or enter sound frequency code 528 to pass.',
        type: 'door_lock',
        correctCode: '0528',
        requiredItem: 'exit_key_2',
        image: '/images/escape_room/closeup_door2.png'
      }
    ]
  },
  {
    id: 'room_3',
    title: 'Room 3: The Family Memory Gallery',
    description: 'The final sanctuary filled with family photo frames and warm memories. Match the family photos to complete the escape!',
    bgImage: '/images/escape_room/room3_gallery.png',
    fallbackTheme: 'from-purple-950 via-slate-900 to-rose-950',
    fallbackIcon: '🖼️',
    initialObjective: 'Complete the photo album match to unlock the Golden Memory Trophy.',
    exitCode: '2026',
    exitLockType: 'final_win',
    requiredItemToExit: 'memory_trophy',
    hotspots: [
      {
        id: 'album_3',
        name: 'Family Photo Trunk',
        icon: '👨‍👩‍👧‍👦',
        position: { top: '50%', left: '40%' },
        desc: 'A beautifully preserved velvet album. Match loved ones to their warm voice notes.',
        hint: 'Recognize your daughter, grandson, and health worker to earn the Memory Trophy!',
        type: 'memory_quiz',
        unlockedText: 'All family portraits recognized! You have achieved 100% Reminiscence Mastery!',
        givesItem: {
          id: 'memory_trophy',
          name: 'Golden Smriti Trophy',
          icon: '🏆',
          desc: 'The ultimate symbol of cognitive strength and memory connection.',
          image: '/images/escape_room/item_trophy.png'
        },
        image: '/images/escape_room/closeup_album.png'
      },
      {
        id: 'door_3',
        name: 'Sanctuary Exit Gate',
        icon: '🌟',
        position: { top: '40%', left: '82%' },
        desc: 'The luminous exit gate celebrating your journey.',
        hint: 'Collect the Golden Smriti Trophy to unlock the complete escape!',
        type: 'door_lock',
        correctCode: '2026',
        requiredItem: 'memory_trophy',
        image: '/images/escape_room/closeup_gate.png'
      }
    ]
  }
];

export const HINT_MESSAGES = {
  room_1: [
    "Step 1: Click the vintage wall clock (10:25) to get the code.",
    "Step 2: Enter '1025' into the locked desk drawer to get the Brass Key.",
    "Step 3: Check the ancestral bookshelf to find the UV Flashlight.",
    "Step 4: Use the UV Flashlight on the painting to reveal code 1947 & the exit key!",
    "Step 5: Use the exit key on the door to escape to Room 2."
  ],
  room_2: [
    "Step 1: Click the carved trunk and match symbols: Tea Leaf 🍃 -> Rhino 🦏 -> Jaapi 👒.",
    "Step 2: Take the Gramophone Needle from the trunk.",
    "Step 3: Use the needle on the brass gramophone to play Bihu music.",
    "Step 4: Collect the Courtyard Exit Key and open the Archway door!"
  ],
  room_3: [
    "Step 1: Open the Family Photo Trunk.",
    "Step 2: Match the warm memories to earn the Golden Smriti Trophy!",
    "Step 3: Use the trophy on the luminous exit gate to finish all 3 rooms!"
  ]
};

