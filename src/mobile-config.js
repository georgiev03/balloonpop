// Mobile-specific game configuration
export const mobileConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 960,    // Smaller width for mobile (75% of desktop)
        height: 540,   // Maintains 16:9 ratio
        min: {
            width: 800,
            height: 450
        },
        max: {
            width: 960,
            height: 540
        }
    },
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    input: {
        activePointers: 2,
        touch: {
            capture: true,
            preventDefault: true
        }
    }
};

// Mobile-specific UI adjustments
export const mobileUI = {
    // Font sizes (adjusted for smaller screen)
    titleSize: '32px',
    subtitleSize: '24px',
    buttonSize: '20px',
    textSize: '18px',
    wordSize: '22px',  // Size for balloon words
    
    // Spacing
    padding: 15,
    buttonHeight: 40,
    
    // Colors (same as desktop)
    primaryColor: '#4CAF50',
    secondaryColor: '#2196F3',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    
    // Animation durations
    buttonPressDuration: 100,
    transitionDuration: 300
};

// Mobile-specific game adjustments
export const mobileGame = {
    // Balloon settings
    balloonBaseScale: 0.75,     // Slightly smaller balloons
    balloonSpacing: 150,        // Adjusted spacing
    balloonSpeed: {
        min: 80,
        max: 160
    },
    
    // Touch settings
    touchHitArea: 1.3,          // 30% larger hit area for touch
    touchFeedback: {
        duration: 100,
        alpha: 0.3
    }
};

// Mobile-specific scene configurations
export const mobileScenes = {
    // Main menu
    menu: {
        titleY: 0.2,           // Title position from top
        buttonY: 0.7,          // Button position from top
        spacing: 80            // Space between elements
    },
    
    // Game scene
    game: {
        headerY: 20,            // Top UI position
        heartsY: 30,           // Hearts position
        heartsSpacing: 25,     // Space between hearts
        scoreY: 30             // Score/round position
    },
    
    // Game over/Win scenes
    endScreens: {
        titleY: 0.15,          // Title position
        textBoxY: 0.3,         // Text box position
        textBoxWidth: 0.9,     // 90% of screen width
        textBoxHeight: 0.4,    // 40% of screen height
        buttonY: 0.8,          // Button position
        spacing: 40            // Space between elements
    }
}; 