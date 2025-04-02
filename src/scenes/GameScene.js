class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.lives = 10;
        this.currentRound = 1;
    }

    create() {
        // Set balloon scale based on device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.balloonScale = isMobile ? 0.9 : 0.6; // Reduced mobile scale to 0.9

        // Initialize game state
        this.score = 0;
        this.lives = 10;
        this.currentRound = 1;

        // Create UI
        this.createUI();

        // Create balloons for the current round
        this.createBalloonsForRound();

        // Listen for balloon clicks
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            this.handleBalloonClick(gameObject);
        });
    }

    createBalloonsForRound() {
        const words = this.getWordsForRound(this.currentRound);
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const spacing = isMobile ? 130 : 200; // Reduced spacing for mobile
        const startX = (this.game.config.width - (words.length - 1) * spacing) / 2;
        
        words.forEach((word, index) => {
            const x = startX + index * spacing;
            const y = this.game.config.height / 2;
            const balloon = this.createBalloon(x, y, word);
            
            // Add floating animation
            this.tweens.add({
                targets: balloon,
                y: y - 20,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    createBalloon(x, y, word) {
        const balloon = this.add.image(x, y, 'balloon');
        balloon.setScale(this.balloonScale);
        
        // Adjust text size for mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const textScale = isMobile ? 0.7 : 0.9; // Reduced text scale for mobile
        const text = this.add.text(x, y, word, {
            fontSize: `${32 * textScale}px`,
            fill: '#000000',
            fontFamily: 'Arial',
            align: 'center'
        });
        text.setOrigin(0.5);

        // Group balloon and text
        const container = this.add.container(0, 0, [balloon, text]);
        container.setSize(balloon.width * this.balloonScale, balloon.height * this.balloonScale);

        // Enable input on container with larger hit area for mobile
        const hitAreaScale = isMobile ? 1.3 : 1.0; // Increased hit area for mobile
        container.setInteractive(new Phaser.Geom.Rectangle(
            -balloon.width * this.balloonScale * hitAreaScale / 2,
            -balloon.height * this.balloonScale * hitAreaScale / 2,
            balloon.width * this.balloonScale * hitAreaScale,
            balloon.height * this.balloonScale * hitAreaScale
        ), Phaser.Geom.Rectangle.Contains);

        return container;
    }

    // Rest of the class...
} 