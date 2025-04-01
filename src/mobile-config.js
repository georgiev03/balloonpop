// Mobile-specific game configuration
export const mobileConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,  // Smaller base width for mobile
        height: 1280, // Taller height for mobile
        min: {
            width: 400,
            height: 600
        },
        max: {
            width: 720,
            height: 1280
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
        activePointers: 1,
        touch: {
            capture: true,
            preventDefault: true
        }
    }
};

// Mobile-specific UI adjustments
export const mobileUI = {
    // Font sizes
    titleSize: '64px',
    subtitleSize: '32px',
    buttonSize: '28px',
    textSize: '20px',
    
    // Spacing
    padding: 20,
    buttonHeight: 50,
    
    // Colors
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
    balloonBaseScale: 0.8,
    balloonSpacing: 0.15,
    balloonSpeed: 1.2,
    
    // Text settings
    textPadding: 10,
    textScale: 0.8,
    
    // Gameplay adjustments
    baseTime: 16, // Slower base time for mobile
    minTime: 10,
    lives: 10,
    
    // Touch hit area multiplier
    touchHitArea: 1.5
};

// Mobile-specific scene configurations
export const mobileScenes = {
    // Main menu
    menuTitleY: 0.2,
    menuButtonY: 0.6,
    
    // Game scene
    uiPadding: 10,
    heartsSpacing: 40,
    
    // Game over/Win scenes
    textBoxWidth: 0.8,
    textBoxHeight: 0.5,
    textBoxY: 0.4,
    buttonY: 0.85
}; 