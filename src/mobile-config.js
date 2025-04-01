// Mobile-specific game configuration
export const mobileConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '80%',
        height: '80%',
        min: {
            width: 320,
            height: 180
        },
        max: {
            width: 2048,
            height: 1152
        },
        expandParent: true,
        autoRound: true
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
            target: document.getElementById('game-container'),
            capture: true
        }
    },
    dom: {
        createContainer: true
    },
    autoMobile: true
};

// Mobile-specific UI adjustments
export const mobileUI = {
    // Font sizes (relative to screen width)
    get titleSize() {
        return Math.max(20, Math.min(32, window.innerWidth * 0.04)) + 'px';
    },
    get subtitleSize() {
        return Math.max(16, Math.min(24, window.innerWidth * 0.03)) + 'px';
    },
    get buttonSize() {
        return Math.max(14, Math.min(20, window.innerWidth * 0.025)) + 'px';
    },
    get textSize() {
        return Math.max(12, Math.min(18, window.innerWidth * 0.022)) + 'px';
    },
    get wordSize() {
        return Math.max(16, Math.min(22, window.innerWidth * 0.028)) + 'px';
    },
    
    // Spacing (relative to screen size)
    get padding() {
        return Math.max(10, Math.min(15, window.innerWidth * 0.02));
    },
    get buttonHeight() {
        return Math.max(30, Math.min(40, window.innerWidth * 0.05));
    },
    
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
    get balloonBaseScale() {
        return Math.max(0.5, Math.min(0.75, window.innerWidth * 0.001));
    },
    get balloonSpacing() {
        return Math.max(100, Math.min(150, window.innerWidth * 0.15));
    },
    balloonSpeed: {
        min: 80,
        max: 160
    },
    
    // Touch settings
    touchHitArea: 1.3,
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
        get headerY() {
            return Math.max(15, Math.min(20, window.innerHeight * 0.04));
        },
        get heartsY() {
            return Math.max(20, Math.min(30, window.innerHeight * 0.06));
        },
        get heartsSpacing() {
            return Math.max(20, Math.min(25, window.innerWidth * 0.03));
        },
        get scoreY() {
            return Math.max(20, Math.min(30, window.innerHeight * 0.06));
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