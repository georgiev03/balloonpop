import { mobileConfig, mobileUI, mobileGame, mobileScenes } from './mobile-config.js';
import { BootScene, MainMenuScene, GameScene, GameOverScene, WinScene } from './main.js';

// Add mobile-specific event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Prevent default touch behaviors
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });

    // Add mobile viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
    }

    // Add mobile-specific styles
    const style = document.createElement('style');
    style.textContent = `
        body {
            margin: 0;
            padding: 0;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            touch-action: none;
            -webkit-tap-highlight-color: transparent;
        }
        #game-container {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            touch-action: none;
        }
        * {
            touch-action: none;
            -webkit-tap-highlight-color: transparent;
        }
    `;
    document.head.appendChild(style);
});

class MobileGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MobileGameScene' });
        this.balloons = [];
        this.lives = mobileGame.lives;
        this.round = 0;
        this.wordSets = [];
        this.availableWords = [];
        this.currentWordSet = null;
        this.spawnTimer = null;
    }

    create() {
        // Initialize word sets
        this.loadWords();
        
        // Create UI
        this.createUI();
        
        // Start spawning balloons
        this.spawnBalloons();
        this.createSpawnTimer();
        
        // Add touch input
        this.input.on('pointerdown', this.handleTouch, this);
    }

    loadWords() {
        const wordData = this.cache.json.get('wordList');
        this.allWords = [...wordData];
        this.availableWords = [...this.allWords];
    }

    createUI() {
        // Create header UI (lives and round counter)
        const { game } = mobileScenes;
        
        // Create hearts for lives
        this.healthIcons = [];
        for (let i = 0; i < this.lives; i++) {
            const x = mobileUI.padding.horizontal + (i * game.heartsSpacing);
            const heart = this.add.image(x, game.heartsY, 'heart').setScale(0.8);
            this.healthIcons.push(heart);
        }

        // Add round counter
        this.roundText = this.add.text(
            mobileConfig.scale.width - mobileUI.padding.horizontal,
            game.scoreY,
            'Рунд: 0',
            {
                fontSize: mobileUI.textSize,
                fill: '#000000'
            }
        ).setOrigin(1, 0);
    }

    spawnBalloons() {
        if (this.lives <= 0 || this.availableWords.length === 0) return;

        // Clear existing balloons
        this.clearBalloons();

        // Get random word set
        const randomIndex = Phaser.Math.Between(0, this.availableWords.length - 1);
        this.currentWordSet = this.availableWords[randomIndex];
        this.availableWords.splice(randomIndex, 1);

        // Calculate positions for 2 columns
        const columnWidth = mobileConfig.scale.width / mobileGame.balloonColumns;
        const positions = [];
        
        for (let i = 0; i < mobileGame.balloonColumns; i++) {
            const x = columnWidth * (i + 0.5);
            const y1 = Phaser.Math.Between(
                mobileScenes.game.balloonStart.minY,
                mobileScenes.game.balloonStart.minY + 200
            );
            const y2 = Phaser.Math.Between(
                y1 + mobileGame.balloonSpacing,
                y1 + mobileGame.balloonSpacing + 100
            );
            positions.push({ x, y: y1 }, { x, y: y2 });
        }

        // Shuffle positions
        Phaser.Utils.Array.Shuffle(positions);

        // Create balloons
        const words = [...this.currentWordSet.words];
        for (let i = 0; i < Math.min(words.length, mobileGame.maxBalloonsOnScreen); i++) {
            const word = words[i];
            const pos = positions[i];
            this.createBalloon(word, pos.x, pos.y);
        }
    }

    createBalloon(word, x, y) {
        const balloon = this.add.image(x, y, 'balloon')
            .setScale(mobileGame.balloonBaseScale)
            .setInteractive();
        
        const isIncorrect = word === this.currentWordSet.incorrect;
        balloon.setData('word', word);
        balloon.setData('isIncorrect', isIncorrect);

        // Add word text
        const text = this.add.text(x, y, word, {
            fontSize: mobileUI.wordSize,
            fill: '#000000'
        }).setOrigin(0.5);

        // Group balloon and text
        const container = this.add.container(0, 0, [balloon, text]);
        this.balloons.push(container);

        // Add vertical movement
        const speed = Phaser.Math.Between(
            mobileGame.balloonSpeed.min,
            mobileGame.balloonSpeed.max
        );
        this.tweens.add({
            targets: container,
            y: -200,
            duration: speed * 1000,
            ease: 'Linear',
            onComplete: () => {
                if (isIncorrect) this.loseLife();
                container.destroy();
                this.checkAndSpawn();
            }
        });
    }

    handleTouch(pointer) {
        const touchX = pointer.x;
        const touchY = pointer.y;

        // Check each balloon for touch
        for (const container of this.balloons) {
            const balloon = container.list[0];
            const bounds = balloon.getBounds();
            
            // Expand bounds for touch
            bounds.width *= mobileGame.touchHitArea;
            bounds.height *= mobileGame.touchHitArea;
            bounds.x -= (bounds.width * (mobileGame.touchHitArea - 1)) / 2;
            bounds.y -= (bounds.height * (mobileGame.touchHitArea - 1)) / 2;

            if (bounds.contains(touchX, touchY)) {
                this.handleBalloonTouch(container);
                break;
            }
        }
    }

    handleBalloonTouch(container) {
        const balloon = container.list[0];
        const isIncorrect = balloon.getData('isIncorrect');
        
        // Add touch feedback
        this.createTouchFeedback(container.x, container.y, isIncorrect);

        // Handle game logic
        if (isIncorrect) {
            this.round++;
            this.roundText.setText('Рунд: ' + this.round);
            this.sound.play('success');
        } else {
            this.loseLife();
            this.sound.play('pop');
        }

        // Remove balloon
        container.destroy();
        this.checkAndSpawn();
    }

    createTouchFeedback(x, y, isCorrect) {
        const circle = this.add.circle(x, y, 50, isCorrect ? 0x00ff00 : 0xff0000, 0.5);
        this.tweens.add({
            targets: circle,
            alpha: 0,
            scale: 1.5,
            duration: mobileGame.touchFeedback.duration,
            onComplete: () => circle.destroy()
        });
    }

    loseLife() {
        if (this.lives > 0) {
            this.lives--;
            const heart = this.healthIcons[this.lives];
            heart.setTexture('heart-empty');
            heart.setAlpha(0.3);

            if (this.lives <= 0) {
                this.gameOver();
            }
        }
    }

    checkAndSpawn() {
        if (this.balloons.length === 0) {
            if (this.availableWords.length === 0) {
                this.scene.start('WinScene', {
                    rounds: this.round,
                    wordSets: this.wordSets
                });
            } else {
                this.time.delayedCall(1000, () => {
                    this.spawnBalloons();
                });
            }
        }
    }

    gameOver() {
        this.scene.start('GameOverScene', {
            rounds: this.round,
            wordSets: this.wordSets
        });
    }

    createSpawnTimer() {
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }
        this.spawnTimer = this.time.delayedCall(
            mobileGame.spawnDelay.initial,
            this.checkAndSpawn,
            [],
            this
        );
    }
}

// Initialize mobile game
const game = new Phaser.Game({
    ...mobileConfig,
    scene: [
        BootScene,
        MainMenuScene,
        MobileGameScene,
        GameOverScene,
        WinScene
    ]
});

// Add mobile-specific resize handler
window.addEventListener('resize', () => {
    if (game) {
        const isMobile = window.innerWidth <= 768;
        const width = isMobile ? Math.min(window.innerWidth, 720) : Math.min(window.innerWidth, 1280);
        const height = Math.min(window.innerHeight, 720);
        game.scale.resize(width, height);
        
        // Center the game container
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.position = 'absolute';
            gameContainer.style.left = '50%';
            gameContainer.style.top = '50%';
            gameContainer.style.transform = 'translate(-50%, -50%)';
        }
    }
}); 