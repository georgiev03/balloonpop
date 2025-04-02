class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.lives = 10;
        this.currentRound = 1;
        
        // Define scaling constants
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.BALLOON_SCALE = isMobile ? 1.2 : 0.6;
        this.TEXT_BASE_SIZE = isMobile ? 40 : 34;
        this.TEXT_SCALE = isMobile ? 0.9 : 0.9;
        this.SPACING = isMobile ? 110 : 200;
    }

    create() {
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
        const startX = (this.game.config.width - (words.length - 1) * this.SPACING) / 2;
        
        words.forEach((word, index) => {
            const x = startX + index * this.SPACING;
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
        balloon.setScale(this.BALLOON_SCALE);
        
        // Create text with larger base size on mobile
        const text = this.add.text(x, y, word, {
            fontSize: `${this.TEXT_BASE_SIZE * this.TEXT_SCALE}px`,
            fill: '#000000',
            fontFamily: 'Arial',
            align: 'center',
            fontStyle: 'bold' // Added bold style for better readability
        });
        text.setOrigin(0.5);

        // Group balloon and text
        const container = this.add.container(0, 0, [balloon, text]);
        container.setSize(balloon.width * this.BALLOON_SCALE, balloon.height * this.BALLOON_SCALE);

        // Enable input on container with larger hit area for mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hitAreaScale = isMobile ? 1.3 : 1.0;
        container.setInteractive(new Phaser.Geom.Rectangle(
            -balloon.width * this.BALLOON_SCALE * hitAreaScale / 2,
            -balloon.height * this.BALLOON_SCALE * hitAreaScale / 2,
            balloon.width * this.BALLOON_SCALE * hitAreaScale,
            balloon.height * this.BALLOON_SCALE * hitAreaScale
        ), Phaser.Geom.Rectangle.Contains);

        return container;
    }

    createUI() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const uiTextScale = isMobile ? 1.5 : 1;
        
        // Add round text
        this.roundText = this.add.text(10, 10, `Рунд: ${this.currentRound}`, {
            fontSize: `${24 * uiTextScale}px`,
            fill: '#000000',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });

        // Create hearts for lives
        this.hearts = [];
        for (let i = 0; i < this.lives; i++) {
            const heart = this.add.image(20 + (i % 5) * 30, 50 + Math.floor(i / 5) * 30, 'heart');
            heart.setScale(0.5);
            this.hearts.push(heart);
        }
    }

    // Rest of the class...
} 