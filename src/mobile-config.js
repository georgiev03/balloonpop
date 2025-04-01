// Mobile-specific game configuration
export const mobileConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 540,    // Standard mobile width (good for most phones)
        height: 960,   // 16:9 vertical ratio
        min: {
            width: 320,
            height: 570
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
        activePointers: 2,
        touch: {
            capture: true,
            preventDefault: true
        }
    }
};

// Mobile-specific UI adjustments
export const mobileUI = {
    // Font sizes (larger for better touch)
    titleSize: '48px',
    subtitleSize: '28px',
    buttonSize: '24px',
    textSize: '22px',
    wordSize: '26px',  // Size for balloon words
    
    // Spacing and positioning
    padding: {
        top: 20,
        bottom: 30,
        horizontal: 15
    },
    buttonHeight: 60,
    
    // Layout
    headerHeight: 80,    // Space for score/lives at top
    footerHeight: 60,    // Space at bottom
    balloonArea: {
        top: 100,        // Start of balloon spawn area
        bottom: 200      // Space from bottom for UI
    },
    
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
    balloonBaseScale: 1.2,      // Larger balloons for touch
    balloonSpacing: 180,        // Vertical spacing between balloons
    balloonSpeed: {
        min: 60,                // Slower speed for better control
        max: 120
    },
    balloonColumns: 2,          // 2 columns of balloons
    maxBalloonsOnScreen: 4,     // Fewer balloons at once
    
    // Spawn settings
    spawnDelay: {
        initial: 2000,          // More time between spawns
        min: 1500
    },
    
    // Text settings
    textPadding: 15,
    textScale: 1,
    
    // Gameplay adjustments
    baseTime: 20,              // More time for mobile players
    minTime: 12,
    lives: 10,
    
    // Touch settings
    touchHitArea: 1.4,         // 40% larger hit area for touch
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
        headerY: 30,           // Top UI position
        heartsY: 80,           // Hearts position
        heartsSpacing: 35,     // Space between hearts
        scoreY: 40,            // Score/round position
        balloonStart: {
            minY: 150,         // Minimum spawn height
            maxY: 800          // Maximum spawn height
        }
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