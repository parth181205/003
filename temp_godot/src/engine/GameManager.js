// Reusable Phaser 3 GameManager & Scene Loader
import Phaser from 'phaser';
import { MatchingScene } from '../games/MatchingGame.js';
import { SortingScene } from '../games/SortingGame.js';
import { JigsawScene } from '../games/JigsawGame.js';
import { DominoesScene } from '../games/DominoesGame.js';
import { BingoScene } from '../games/BingoGame.js';
import { SongLyricsScene } from '../games/SongLyricsGame.js';
import { SayingsScene } from '../games/SayingsGame.js';
import { BalloonTapScene } from '../games/BalloonTapGame.js';
import { TargetTouchScene } from '../games/TargetTouchGame.js';
import { ConnectFourScene } from '../games/ConnectFourGame.js';
import { ConversationScene } from '../games/ConversationGame.js';
import { BollywoodSongScene } from '../games/BollywoodSongGame.js';
// Video-inspired games
import { SpotItScene } from '../games/SpotItGame.js';
import { GardenTapScene } from '../games/GardenTapGame.js';
import { NumberTrailScene } from '../games/NumberTrailGame.js';

export class GameManager {
  constructor(hostElementId) {
    this.hostId = hostElementId;
    this.game = null;
    this.currentScene = null;
    this.onGameComplete = null;
  }

  startGame(gameId, difficultyMode = 'gentle', onCompleteCb = null) {
    this.destroyGame();
    this.onGameComplete = onCompleteCb;

    const hostElem = document.getElementById(this.hostId);
    if (!hostElem) return;

    const width = Math.min(1280, hostElem.clientWidth || 1024);
    const height = Math.min(720, hostElem.clientHeight || 640);

    const config = {
      type: Phaser.AUTO,
      parent: this.hostId,
      width: width,
      height: height,
      backgroundColor: '#12100E',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
      },
      scene: [
        this.getSceneClass(gameId)
      ]
    };

    this.game = new Phaser.Game(config);

    // Pass data payload into active scene
    this.game.events.once('ready', () => {
      const activeScene = this.game.scene.getScenes(true)[0];
      if (activeScene) {
        this.currentScene = activeScene;
        activeScene.initData({
          gameId,
          difficultyMode,
          onComplete: () => {
            if (this.onGameComplete) this.onGameComplete();
          }
        });
      }
    });
  }

  getSceneClass(gameId) {
    switch (gameId) {
      case 'bollywood_songs': return BollywoodSongScene;
      case 'matching': return MatchingScene;
      case 'sorting': return SortingScene;
      case 'jigsaw': return JigsawScene;
      case 'dominoes': return DominoesScene;
      case 'bingo': return BingoScene;
      case 'song_lyrics': return SongLyricsScene;
      case 'finish_saying': return SayingsScene;
      case 'balloon_tap': return BalloonTapScene;
      case 'target_touch': return TargetTouchScene;
      case 'connect_four': return ConnectFourScene;
      case 'conversation': return ConversationScene;
      // Video-inspired games
      case 'spot_it': return SpotItScene;
      case 'garden_tap': return GardenTapScene;
      case 'number_trail': return NumberTrailScene;
      default: return BollywoodSongScene;
    }
  }

  requestHint() {
    const activeScene = this.game?.scene.getScenes(true)[0];
    if (activeScene && typeof activeScene.triggerHint === 'function') {
      activeScene.triggerHint();
    }
  }

  destroyGame() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
      this.currentScene = null;
    }
  }
}
