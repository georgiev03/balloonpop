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

// Initialize mobile game
let game;
try {
    game = new Phaser.Game(mobileConfig);
    console.log('Mobile game initialized successfully!');
} catch (error) {
    console.error('Error initializing mobile game:', error);
}

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