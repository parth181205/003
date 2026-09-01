// Difficulty Manager (Gentle, Comfortable, Challenge Modes)
export class DifficultyManager {
  static getSettings(mode = 'gentle') {
    switch (mode.toLowerCase()) {
      case 'gentle':
        return {
          mode: 'gentle',
          pairCount: 3,
          sortItemCount: 4,
          dominoCount: 3,
          jigsawPieces: 4,
          cardScale: 1.2,
          autoAssist: true,
          timerEnabled: false
        };
      case 'comfortable':
        return {
          mode: 'comfortable',
          pairCount: 5,
          sortItemCount: 6,
          dominoCount: 5,
          jigsawPieces: 6,
          cardScale: 1.0,
          autoAssist: false,
          timerEnabled: false
        };
      case 'challenge':
        return {
          mode: 'challenge',
          pairCount: 8,
          sortItemCount: 8,
          dominoCount: 7,
          jigsawPieces: 9,
          cardScale: 0.9,
          autoAssist: false,
          timerEnabled: false
        };
      default:
        return this.getSettings('gentle');
    }
  }
}
