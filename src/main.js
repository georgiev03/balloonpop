// Remove the import since we're loading Phaser via CDN
// import Phaser from 'phaser';

// Boot Scene - Loads assets
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        console.log('BootScene constructor called');
    }

    preload() {
        console.log('Starting to load assets...');
        
        // Add load progress handler
        this.load.on('progress', (value) => {
            console.log('Loading progress:', Math.round(value * 100) + '%');
        });

        // Load game assets
        this.load.image('balloon', 'assets/balloon.png');
        this.load.image('easy', 'assets/easy.png');
        this.load.image('medium', 'assets/medium.png');
        this.load.image('arrow', 'assets/arrow.svg');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('heart-empty', 'assets/brokenheart.png');
        
        // Load different background based on device
        this.load.image('startscreen', 'assets/startscreen2.jpg');
        
        this.load.audio('pop', 'assets/pop.mp3');
        this.load.audio('success', 'assets/success.mp3');
        this.load.audio('win', 'assets/win.mp3');
        // Load words from JSON file
        this.load.json('wordList', 'assets/words.json');

        // Add load complete handler
        this.load.on('complete', () => {
            console.log('All assets loaded successfully!');
            // Log all available textures
            console.log('Available textures:', Object.keys(this.textures.list));
            this.scene.start('MainMenuScene');
        });

        // Add load error handler
        this.load.on('loaderror', (file) => {
            console.error('Error loading asset:', file.key, file.src);
        });
    }

    create() {
        console.log('BootScene create called');
        // Verify textures are loaded
        console.log('Heart texture exists:', this.textures.exists('heart'));
        console.log('Heart empty texture exists:', this.textures.exists('heart-empty'));
    }
}

// Main Menu Scene
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
        this.selectedDifficulty = null;
    }

    create() {
        const { width, height } = this.scale;
        
        // Add background image
        const bg = this.add.image(width/2, height/2, 'startscreen');
        
        // Scale the background to cover the screen while maintaining aspect ratio
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setAlpha(0.8); // Slightly dim the background

        // Create array to store all text elements
        const allTextElements = [];

        // Add multiple glow layers for stronger effect
        const glowColors = [
            { color: '#4df3ff', alpha: 0.4, thickness: 32 },  // Outermost glow
            { color: '#4df3ff', alpha: 0.6, thickness: 24 },  // Outer glow
            { color: '#4df3ff', alpha: 0.8, thickness: 16 },  // Inner glow
            { color: '#ffffff', alpha: 0.9, thickness: 12 }   // White core
        ];

        // Add glow layers from outside in
        glowColors.forEach(({ color, alpha, thickness }) => {
            const glowText = this.add.text(width / 2, height * 0.2, 'Граматичко', {
                fontSize: Math.min(width * 0.08, 84) + 'px',
                fontFamily: 'Arial Black',
                fontWeight: 'bold',
                fill: 'transparent',
                stroke: color,
                strokeThickness: thickness
            }).setOrigin(0.5).setAlpha(alpha);
            
            allTextElements.push(glowText);
        });

        // Add solid text with neon effect
        const titleText = this.add.text(width / 2, height * 0.2, 'Граматичко', {
            fontSize: Math.min(width * 0.08, 84) + 'px',
            fontFamily: 'Arial Black',
            fontWeight: 'bold',
            fill: '#fdfdfd',  // Slightly darker shade of white
            stroke: '#4df3ff',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Add shadow to the title text
        titleText.setShadow(2, 2, '#000000', 2, true, true);
        
        allTextElements.push(titleText);

        // Add creator credit with glow effect
        const creatorGlowColors = [
            { color: '#4df3ff', alpha: 0.4, thickness: 16 },  // Outermost glow
            { color: '#4df3ff', alpha: 0.5, thickness: 12 },  // Outer glow
            { color: '#4df3ff', alpha: 0.6, thickness: 8 },   // Inner glow
            { color: '#ffffff', alpha: 0.8, thickness: 4 }    // White core
        ];

        // Add glow layers for creator text
        creatorGlowColors.forEach(({ color, alpha, thickness }) => {
            const glowText = this.add.text(width / 2, height * 0.2 + titleText.height + 5, 'от Георги Стаматов', {
                fontSize: Math.min(width * 0.03, 32) + 'px',
                fontFamily: 'Arial Black',
                fontWeight: 'bold',
                fill: 'transparent',
                stroke: color,
                strokeThickness: thickness
            }).setOrigin(0.5).setAlpha(alpha);
            
            allTextElements.push(glowText);
        });

        // Add solid creator text
        const creatorText = this.add.text(width / 2, height * 0.2 + titleText.height + 5, 'от Георги Стаматов', {
            fontSize: Math.min(width * 0.03, 32) + 'px',
            fontFamily: 'Arial Black',
            fontWeight: 'bold',
            fill: '#fdfdfd',
            stroke: '#4df3ff',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Add shadow to creator text
        creatorText.setShadow(1, 1, '#000000', 2, true, true);
        
        allTextElements.push(creatorText);

        // Add help button with permanent cyan glow effect
        const helpButtonSize = Math.min(width * 0.05, 50);
        const helpCircle = this.add.circle(width * 0.92, height * 0.12, helpButtonSize, 0x4df3ff, 0.2)
            .setStrokeStyle(2, 0x4df3ff)
            .setInteractive();

        // Add main help button text
        const helpButton = this.add.text(width * 0.92, height * 0.12, '?', {
            fontSize: helpButtonSize * 1.2 + 'px',
            fontFamily: 'Arial Black',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add subtle hover effect
        helpCircle.on('pointerover', () => {
            helpCircle.setFillStyle(0x4df3ff, 0.3);
        });

        helpCircle.on('pointerout', () => {
            helpCircle.setFillStyle(0x4df3ff, 0.2);
        });

        // Create black overlay for the entire screen
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
            .setOrigin(0)
            .setAlpha(0)
            .setDepth(1)
            .setInteractive();

        // Create modal background with enhanced gradient effect
        const modalWidth = isMobile ? width * 0.85 : width * 0.5;
        const modalHeight = isMobile ? height * 0.4 : height * 0.35;
        const modalBg = this.add.rectangle(0, 0, modalWidth, modalHeight, 0x000000, 0.95)
            .setOrigin(0.5)
            .setAlpha(1)
            .setStrokeStyle(2, 0x4df3ff);

        // Create modal container and position it in the center
        const modalContainer = this.add.container(width/2, height * 0.45);
        modalContainer.setAlpha(0);
        modalContainer.setDepth(2);
        modalContainer.add(modalBg);

        // Add modal text with mobile-optimized styling
        const modalText = this.add.text(0, -modalBg.height * 0.05, 'ИНФОРМАЦИЯ\n\nУцелете балона с грешната дума.\nИграта е от 200 тура,\nимате възможност за 10 несполучливи опита.', {
            fontSize: isMobile ? Math.min(width * 0.045, 32) + 'px' : Math.min(width * 0.025, 25) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: isMobile ? 20 : 15,
            padding: { x: 10, y: 10 }
        }).setOrigin(0.5);

        // Add close button with mobile-optimized styling
        const closeButton = this.add.container(0, modalBg.height * 0.5);
        
        const buttonWidth = isMobile ? 160 : 140;
        const buttonHeight = isMobile ? 55 : 45;
        
        const closeButtonBg = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x000000, 1)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x4df3ff);

        const closeButtonText = this.add.text(0, 0, 'Затвори', {
            fontSize: isMobile ? Math.min(width * 0.04, 28) + 'px' : Math.min(width * 0.022, 24) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        closeButton.add([closeButtonBg, closeButtonText]);
        closeButton.setInteractive(new Phaser.Geom.Rectangle(
            -buttonWidth/2, 
            -buttonHeight/2, 
            buttonWidth, 
            buttonHeight
        ), Phaser.Geom.Rectangle.Contains);

        // Add hover effects
        closeButton.on('pointerover', () => {
            closeButtonBg.setFillStyle(0x4df3ff, 0.3);
            this.tweens.add({
                targets: closeButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        closeButton.on('pointerout', () => {
            closeButtonBg.setFillStyle(0x000000, 1);
            this.tweens.add({
                targets: closeButton,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        // Add elements to modal container
        modalContainer.add([modalText, closeButton]);

        // Store references to difficulty button containers
        const buttonContainers = [];

        // Show modal with enhanced animation
        helpCircle.on('pointerdown', () => {
            modalContainer.setAlpha(0);
            modalContainer.setScale(0.8);
            overlay.setAlpha(0);
            
            // Disable all difficulty buttons
            buttonContainers.forEach(container => {
                container.removeInteractive();
            });
            
            // Fade in overlay with blur effect
            this.tweens.add({
                targets: overlay,
                alpha: 0.7,
                duration: 300,
                ease: 'Power2'
            });
            
            // Pop in modal with bounce effect
            this.tweens.add({
                targets: modalContainer,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 400,
                ease: 'Back.easeOut',
                easeParams: [2.5]
            });
        });

        // Hide modal with enhanced animation
        closeButton.on('pointerdown', () => {
            // Fade out overlay
            this.tweens.add({
                targets: overlay,
                alpha: 0,
                duration: 200,
                ease: 'Power2'
            });
            
            // Fade out and scale down modal
            this.tweens.add({
                targets: modalContainer,
                alpha: 0,
                scaleX: 0.8,
                scaleY: 0.8,
                duration: 300,
                ease: 'Back.easeIn',
                onComplete: () => {
                    // Re-enable all difficulty buttons
                    buttonContainers.forEach(container => {
                        container.setInteractive(new Phaser.Geom.Rectangle(
                            -container.first.width * 0.5,
                            -container.first.height * 0.5,
                            container.first.width,
                            container.first.height
                        ), Phaser.Geom.Rectangle.Contains);
                    });
                }
            });
        });

        // Initially hide the modal and overlay
        modalContainer.setAlpha(0);
        overlay.setAlpha(0);

        // Create difficulty selection buttons
        const difficulties = [
            { key: 'easy', text: 'ЛЕСНО', image: 'easy', timeRange: { min: 17, max: 13 } },
            { key: 'medium', text: 'СРЕДНО', image: 'medium', timeRange: { min: 15, max: 10 } },
            { key: 'hard', text: 'ТРУДНО', image: 'balloon', timeRange: { min: 13, max: 8 } }
        ];

        const buttonSpacing = width * 0.17; // Horizontal spacing between buttons
        const startX = width * 0.30; // Start from 25% of screen width
        const buttonY = height * 0.6; // Fixed Y position for all buttons

        difficulties.forEach((difficulty, index) => {
            const buttonX = startX + (index * buttonSpacing);
            
            // Create button container
            const buttonContainer = this.add.container(buttonX, buttonY);
            buttonContainers.push(buttonContainer);
            
            // Add difficulty image
            const balloonImage = this.add.image(0, 0, difficulty.image)
                .setScale(0.7)
                .setOrigin(0.5); // Center the balloon origin
            buttonContainer.add(balloonImage);

            // Add text centered below balloon with more space
            const buttonText = this.add.text(0, balloonImage.height * 0.7, difficulty.text, {
                fontSize: Math.min(width * 0.04, 48) + 'px',
                fontFamily: 'Arial Black',
                fontWeight: 'bold',
                fill: '#fdfdfd',
                stroke: '#4df3ff',
                strokeThickness: 4
            }).setOrigin(0.5);
            buttonContainer.add(buttonText);

            // Make interactive
            buttonContainer.setInteractive(new Phaser.Geom.Rectangle(
                -balloonImage.width * 0.5,
                -balloonImage.height * 0.5,
                balloonImage.width,
                balloonImage.height
            ), Phaser.Geom.Rectangle.Contains);

            // Add hover effect
            buttonContainer.on('pointerover', () => {
                this.tweens.add({
                    targets: buttonContainer,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 100
                });
            });

            buttonContainer.on('pointerout', () => {
                this.tweens.add({
                    targets: buttonContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            });

            // Add click handler
            buttonContainer.on('pointerdown', () => {
                this.selectedDifficulty = difficulty;
                this.scene.start('GameScene', { difficulty: difficulty });
            });
        });

        // Add entrance animations for buttons
        buttonContainers.forEach((container, index) => {
            // Start from below the screen
            container.y = height + 100;
            
            // Animate to final position with delay based on index
            this.tweens.add({
                targets: container,
                y: buttonY,
                duration: 1500,
                ease: 'Back.easeOut',
                delay: 600 + (index * 200) // Stagger the animations
            });
        });

        // Add green particle effects on the sides
        this.addGreenParticles();

        // Add entrance animations
        // Separate title and creator text elements
        const titleElements = allTextElements.slice(0, 5); // Title and its glow layers
        const creatorElements = allTextElements.slice(5);   // Creator text and its glow layers

        // Set initial positions
        titleElements.forEach(text => {
            text.y = height + 100; // Start from below the screen
        });
        
        creatorElements.forEach(text => {
            text.y = height + 150; // Start from below the screen, slightly lower
        });

        // Animate title elements
        this.tweens.add({
            targets: titleElements,
            y: height * 0.2, // Move to title position
            duration: 1500,
            ease: 'Back.easeOut',
            delay: 200
        });

        // Animate creator elements
        this.tweens.add({
            targets: creatorElements,
            y: height * 0.2 + titleText.height + 5, // Move to position below title
            duration: 1500,
            ease: 'Back.easeOut',
            delay: 400
        });
    }

    addGreenParticles() {
        // Add particles on both sides
        const particles = this.add.particles(0, 0, 'balloon', {
            x: { min: 0, max: this.scale.width },
            y: { min: 0, max: this.scale.height },
            quantity: 1,
            frequency: 500,
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.5, end: 0 },
            tint: 0x00ff00,
            lifespan: 2000,
            gravityY: -50,
            blendMode: 'ADD'
        });
    }
}

// Main Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.balloons = [];
        this.lives = 3;
        this.score = 0;
        this.spawnTimer = null;
        this.difficulty = null;
        this.round = 1;
        this.wordSets = [];
        this.mistakeWords = [];
        this.currentWordSet = null;
        this.isLastRound = false;
    }

    init(data) {
        this.difficulty = data.difficulty || { timeRange: { min: 15, max: 10 } };
        this.baseTime = this.difficulty.timeRange.min;
        this.minTime = this.difficulty.timeRange.max;
    }

    resetGame() {
        this.balloons = [];
        this.lives = 10;
        this.score = 0;
        this.round = 1;
        this.wordSets = [];
        this.mistakeWords = [];
        this.currentWordSet = null;
        this.isLastRound = false;
        this.clearBalloons();
        if (this.spawnTimer) {
            this.spawnTimer.destroy();
        }
        this.startBalloonSpawning();
    }

    create() {
        console.log('GameScene create called');
        // Reset game state when starting a new game
        this.resetGame();
        
        // Get words from loaded JSON and create available words array
        this.allWords = this.cache.json.get('wordList');
        this.availableWords = [...this.allWords]; // Create a fresh copy of all words
        console.log(`Loaded ${this.availableWords.length} words from JSON file`);

        // Add UI
        this.addUI();
        console.log('UI added');

        // Start balloon spawning with difficulty settings
        this.startBalloonSpawning();
        console.log('Balloon spawning started');

        // Add click handler
        this.input.on('pointerdown', this.handleClick, this);
        console.log('Click handler added');
    }

    addUI() {
        const { width, height } = this.scale;
        
        const uiStartX = 10; // Common starting x position for UI elements
        
        // Round counter - positioned in the left corner
        this.roundText = this.add.text(uiStartX, 10, 'Рунд: 1', {
            fontSize: Math.min(width, height) * 0.04 + 'px',
            fill: '#000',
            fontFamily: 'Arial Black',
            fontWeight: 'bold'
        });

        // Lives display - positioned directly below round counter
        const heartsStartY = this.roundText.y + this.roundText.height + 50;
        this.livesContainer = this.add.container(uiStartX + 30, heartsStartY);
        
        // Create health icons vertically with spacing relative to screen height
        this.healthIcons = [];
        const iconSpacing = height * 0.06;
        const heartWidth = 32; // Base width of the heart image
        const heartScale = Math.min(width, height) * 0.0005;
        const scaledHeartWidth = heartWidth * heartScale;

        for (let i = 0; i < 10; i++) {
            const healthIcon = this.add.image(0, i * iconSpacing, 'heart');
            healthIcon.setScale(heartScale);
            this.healthIcons.push(healthIcon);
            this.livesContainer.add(healthIcon);
        }

        // Store the hearts area for balloon spawn calculations
        this.heartsArea = {
            left: uiStartX,
            right: uiStartX + scaledHeartWidth,
            top: heartsStartY,
            bottom: heartsStartY + (iconSpacing * 10)
        };
    }

    startBalloonSpawning() {
        this.createSpawnTimer();
    }

    createSpawnTimer() {
        // Clear any existing timer
        if (this.spawnTimer) {
            this.spawnTimer.destroy();
        }

        // Create a new timer with difficulty-based timing
        this.spawnTimer = this.time.addEvent({
            delay: 1000, // Spawn a new balloon every 2 seconds
            callback: this.spawnBalloons,
            callbackScope: this,
            loop: true
        });
    }

    spawnBalloons() {
        console.log('Spawning balloons...');
        if (this.lives <= 0) return;

        // Only spawn new balloons if there are no active balloons
        if (this.balloons.length > 0) {
            return;
        }

        // Check if we've used all word sets
        if (this.availableWords.length === 0) {
            // Don't start win scene immediately, let the last round play out
            this.isLastRound = true;
            return;
        }

        const { width, height } = this.scale;

        // Get random word set from available words and remove it
        const randomIndex = Phaser.Math.Between(0, this.availableWords.length - 1);
        const wordSet = this.availableWords[randomIndex];
        this.availableWords.splice(randomIndex, 1);
        
        // Store the current word set
        this.currentWordSet = wordSet;

        const correctWords = wordSet.words.filter(word => word !== wordSet.incorrect);
        const incorrectWord = wordSet.incorrect;

        // Randomly choose which balloon will have the incorrect word
        const incorrectIndex = Phaser.Math.Between(0, 3);

        // Shuffle the correct words to ensure random selection without duplicates
        const shuffledCorrectWords = Phaser.Utils.Array.Shuffle([...correctWords]);
        
        // Calculate the longest word length in all words
        const maxWordLength = Math.max(
            ...correctWords.map(word => word.length),
            incorrectWord.length
        );
        
        // Calculate current time to reach top based on round
        const timeReduction = Math.floor(this.round / 3) * 0.25;
        const currentTime = Math.max(this.minTime, this.baseTime - timeReduction);
        
        console.log(`Round ${this.round}, Time to top: ${currentTime} seconds`);

        // Calculate balloon width and total width
        const balloonBaseWidth = Math.min(width, height) * (isMobile ? 0.115 : 0.095); // Increased from 0.095 for mobile
        const balloonWidth = balloonBaseWidth * (1 + (maxWordLength > 5 ? (maxWordLength - 5) * 0.095 : 0));
        
        // Calculate base spacing and adjust it based on word length
        const baseSpacing = width * 0.14; // Increased from 0.13
        const wordLengthSpacingAdjustment = 1 + (maxWordLength > 5 ? (maxWordLength - 5) * 0.06 : 0); // Increased from 0.0525
        const spacing = baseSpacing * wordLengthSpacingAdjustment;

        // Calculate total width needed
        const totalSpacing = spacing * 3;
        const totalBalloonsWidth = balloonWidth * 4;
        const totalWidth = totalBalloonsWidth + totalSpacing;

        // Position balloons more to the right
        const minStartX = width * (isMobile ? 0.3 : 0.35); // Adjusted for mobile
        const availableWidth = width * (isMobile ? 0.65 : 0.6); // Adjusted for mobile
        
        // Center the balloons in the available space
        const startX = minStartX + (availableWidth - totalWidth) / 2 + (balloonWidth / 2);

        const startY = height + 50;
        const endY = -100;

        // Create a set ID for this group of balloons
        const setID = Date.now();

        for (let i = 0; i < 4; i++) {
            // Add some randomness to positions
            const randomXOffset = Phaser.Math.Between(-width * 0.01, width * 0.01);
            const randomYOffset = Phaser.Math.Between(-height * 0.02, height * 0.02);
            const x = startX + (i * spacing) + randomXOffset;
            const y = startY + randomYOffset;
            
            const isIncorrect = i === incorrectIndex;
            // Use incorrect word for incorrect balloon, or take next word from shuffled array
            const word = isIncorrect ? incorrectWord : shuffledCorrectWords[i >= incorrectIndex ? i - 1 : i];

            // Calculate scale based on longest word length - increased scaling for mobile
            const baseScale = Math.min(width, height) * (isMobile ? 0.0022 : 0.0018); // Increased from 0.0018 for mobile
            const wordLengthScale = 1 + (maxWordLength > 5 ? (maxWordLength - 5) * 0.06 : 0);
            const balloonScale = baseScale * wordLengthScale;

            // Create balloon sprite with size relative to screen and longest word length
            const balloon = this.add.sprite(x, y, 'balloon');
            balloon.setScale(balloonScale);
            balloon.setData('word', word);
            balloon.setData('isIncorrect', isIncorrect);
            balloon.setData('setID', setID);
            balloon.setInteractive();

            // Calculate balloon's dimensions at current scale
            const actualBalloonWidth = balloon.width * balloonScale;
            const actualBalloonHeight = balloon.height * balloonScale;

            // Calculate text size based on longest word length - adjusted for better readability
            const baseFontSize = Math.min(width, height) * (isMobile ? 0.032 : 0.029); // Increased from 0.029 for mobile
            const fontScale = 1 + (maxWordLength > 5 ? (maxWordLength - 5) * (isMobile ? 0.04 : 0.035) : 0); // Increased scaling for mobile
            const fontSize = Math.floor(baseFontSize * fontScale);

            // Add word text with improved styling
            const text = this.add.text(x, y, word, {
                fontSize: fontSize + 'px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                fill: '#000000',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: { 
                    x: isMobile ? fontSize * 0.3 : 0, // Added horizontal padding for mobile
                    y: fontSize * (isMobile ? 0.5 : 0.45) // Increased vertical padding for mobile
                },
                fixedWidth: actualBalloonWidth,
                align: 'center'
            }).setOrigin(0.5);

            // Position text at balloon's vertical center
            text.y = y - (actualBalloonHeight * 0.05); // Moved closer to the middle

            // Add a slight shadow effect for better visibility
            text.setShadow(1, 1, 'rgba(0,0,0,0.2)', 2);

            // Store references
            balloon.setData('text', text);
            this.balloons.push(balloon);

            // Create tween for synchronized movement
            const targets = [balloon, text];
            const tween = this.tweens.add({
                targets: targets,
                y: endY,
                duration: currentTime * 1000,
                ease: 'Linear',
                onComplete: () => {
                    // Remove balloon and text
                    text.destroy();
                    balloon.destroy();
                    this.balloons = this.balloons.filter(b => b !== balloon);

                    // Check if this was the last balloon in the set
                    const remainingBalloonsInSet = this.balloons.filter(b => 
                        b.getData('setID') === setID
                    );

                    if (remainingBalloonsInSet.length === 0 && this.currentWordSet) {
                        this.wordSets.push({
                            clicked: null,
                            correct: this.currentWordSet.incorrect,
                            allWords: this.currentWordSet.words
                        });
                        // Increment round when balloons fly out
                        this.round += 1;
                        this.roundText.setText('Рунд: ' + this.round);
                        
                        this.loseLife();

                        // Check if this was the last round
                        if (this.isLastRound) {
                            this.scene.start('WinScene', { 
                                rounds: this.round,
                                wordSets: this.wordSets
                            });
                            return;
                        }

                        // Spawn new balloons immediately if not the last round
                        this.time.delayedCall(100, () => {
                            this.spawnBalloons();
                        });
                    }
                }
            });

            // Store tween reference
            balloon.setData('tween', tween);
        }
    }

    clearBalloons() {
        // Clean up existing balloons
        this.balloons.forEach(balloon => {
            const tween = balloon.getData('tween');
            if (tween) tween.stop();
            balloon.getData('text').destroy();
            balloon.destroy();
        });
        this.balloons = [];
    }

    update() {
        // No need for update check since onComplete handles everything
    }

    handleClick(pointer) {
        const clickedBalloon = this.balloons.find(balloon => {
            const bounds = new Phaser.Geom.Rectangle(
                balloon.x - (balloon.width * balloon.scaleX) / 2,
                balloon.y - (balloon.height * balloon.scaleY) / 2,
                balloon.width * balloon.scaleX + 60,
                balloon.height * balloon.scaleY + 60
            );
            return bounds.contains(pointer.x, pointer.y);
        });

        if (clickedBalloon && this.currentWordSet) {
            const isIncorrect = clickedBalloon.getData('isIncorrect');
            const currentSet = {
                clicked: clickedBalloon.getData('word'),
                correct: isIncorrect ? clickedBalloon.getData('word') : this.currentWordSet.incorrect,
                allWords: this.currentWordSet.words
            };
            this.wordSets.push(currentSet);
            
            // Increment round counter for any balloon click
            this.round += 1;
            this.roundText.setText('Рунд: ' + this.round);
            
            if (isIncorrect) {
                // Visual feedback for correct answer
                this.createParticles(clickedBalloon.x, clickedBalloon.y, '#00ff00');
                this.sound.play('success');
            } else {
                this.loseLife();
                this.createParticles(clickedBalloon.x, clickedBalloon.y, '#ff0000');
                this.sound.play('pop');
                // Add the correct word to mistakes list
                this.mistakeWords.push(clickedBalloon.getData('word'));
            }

            this.createArrowAnimation(pointer, clickedBalloon);

            // Clear all balloons and set up next spawn
            this.clearBalloons();
            
            // Clear the existing spawn timer
            if (this.spawnTimer) {
                this.spawnTimer.remove();
            }

            // Check if this was the last round
            if (this.availableWords.length === 0) {
                this.scene.start('WinScene', { 
                    rounds: this.round,
                    wordSets: this.wordSets
                });
                return;
            }

            // Quick spawn after shooting (1 second)
            this.time.delayedCall(1000, () => {
                if (this.lives > 0) {  // Only spawn if still alive
                    this.spawnBalloons();
                    this.createSpawnTimer();
                }
            });
        }
    }

    createParticles(x, y, color) {
        const particles = this.add.particles(0, 0, 'balloon', {
            x: x,
            y: y,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 500,
            quantity: 10,
            tint: color
        });

        this.time.delayedCall(500, () => {
            particles.destroy();
        });
    }

    createArrowAnimation(from, to) {
        // Start arrow from bottom of screen, aligned with the balloon's x position
        const startX = to.x;
        const startY = this.scale.height; // Bottom of the screen
        const arrow = this.add.sprite(startX, startY, 'arrow');
        
        // Calculate angle between bottom position and balloon
        const angle = Phaser.Math.Angle.Between(startX, startY, to.x, to.y);
        arrow.setRotation(angle);

        this.tweens.add({
            targets: arrow,
            x: to.x,
            y: to.y,
            duration: 200,
            onComplete: () => arrow.destroy()
        });
    }

    loseLife() {
        this.lives -= 1;
        
        if (this.healthIcons[this.lives]) {
            const icon = this.healthIcons[this.lives];
            icon.setTexture('heart-empty');
            icon.setAlpha(0.3);
            
            this.tweens.add({
                targets: icon,
                x: icon.x + 5,
                duration: 50,
                yoyo: true,
                repeat: 2
            });
        }

        this.cameras.main.shake(100, 0.005);

        if (this.lives <= 0) {
            // Clean up before transitioning
            this.clearBalloons();
            if (this.spawnTimer) {
                this.spawnTimer.remove();
            }
            // Stop any ongoing tweens
            this.tweens.killAll();
            
            this.scene.start('GameOverScene', { 
                score: this.round,
                wordSets: this.wordSets
            });
        }
    }
}

// Game Over Scene
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score;
        this.wordSets = data.wordSets || [];
        console.log('GameOverScene initialized with:', {
            score: this.score,
            wordSets: this.wordSets
        });
    }

    create() {
        const { width, height } = this.scale;
        
        // Add dark overlay
        this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
            .setOrigin(0);

        // Game over text
        const gameOverText = this.add.text(width / 2, height * 0.15, 'Играта приключи', {
            fontSize: '96px',
            fontFamily: 'Arial Black',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 4, // Reduced from 8
            shadow: { blur: 8, color: '#ff0000', fill: true }, // Reduced blur from 15
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5);

        // Score text
        const scoreText = this.add.text(width / 2, height * 0.30, `Минати рундове: ${this.score}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create scrollable text box
        const textBoxWidth = width * 0.7;
        const textBoxHeight = height * 0.5;
        const textBoxX = width * 0.15;
        const textBoxY = height * 0.35;

        // Create mask for scrolling
        const maskGraphics = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRect(textBoxX, textBoxY, textBoxWidth - 20, textBoxHeight);

        // Create a container for masking
        const maskContainer = this.add.container(0, 0);
        maskContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskGraphics));

        // Initialize position variables
        let yPos = textBoxY + 20;
        const availableWidth = textBoxWidth - 80;

        // Filter only the rounds with mistakes (where clicked is not correct)
        const mistakeRounds = this.wordSets.filter(set => 
            set.clicked !== set.correct
        );

        console.log('Processing mistake rounds:', mistakeRounds.length);
        
        // Create text content
        mistakeRounds.forEach((set) => {
            let xPos = textBoxX + 40;
            let currentLineWidth = 0;

            set.allWords.forEach((word, wordIndex) => {
                let style = {
                    fontSize: '22px',
                    fontFamily: 'Arial',
                    fill: '#4CAF50' // Softer green for all correct words
                };

                if (word === set.correct) {
                    style.fill = '#ff0000'; // Red for the incorrect word
                }

                const wordText = this.add.text(xPos, yPos, word, style);
                maskContainer.add(wordText);

                if (word === set.clicked) {
                    const underline = this.add.rectangle(
                        xPos,
                        yPos + wordText.height,
                        wordText.width,
                        2,
                        parseInt(style.fill.replace('#', '0x'))
                    );
                    underline.setOrigin(0, 0);
                    maskContainer.add(underline);
                }

                if (currentLineWidth + wordText.width + 30 > availableWidth && wordIndex > 0) {
                    yPos += 35;
                    xPos = textBoxX + 40;
                    currentLineWidth = 0;
                    wordText.setPosition(xPos, yPos);
                    if (word === set.clicked) {
                        const lastUnderline = maskContainer.list[maskContainer.list.length - 1];
                        if (lastUnderline instanceof Phaser.GameObjects.Rectangle) {
                            lastUnderline.setPosition(xPos, yPos + wordText.height);
                        }
                    }
                }

                currentLineWidth += wordText.width + 30;
                xPos += wordText.width + 30;
            });
            
            yPos += 45;
        });

        // If no mistakes were made, show a congratulatory message
        if (mistakeRounds.length === 0) {
            const perfectText = this.add.text(textBoxX + textBoxWidth/2, textBoxY + textBoxHeight/2, 
                'Perfect Score!\nNo mistakes made!', {
                fontSize: '32px',
                fontFamily: 'Arial',
                fill: '#00aa00',
                align: 'center',
                fontWeight: 'bold'
            }).setOrigin(0.5);
            maskContainer.add(perfectText);
        }

        // Add all text objects to the mask container
        this.children.list
            .filter(child => child instanceof Phaser.GameObjects.Text)
            .forEach(text => {
                if (text !== gameOverText && text !== scoreText) {
                    maskContainer.add(text);
                }
            });

        // Scrollbar background
        const scrollBarBg = this.add.rectangle(
            textBoxX + textBoxWidth - 20,
            textBoxY,
            20,
            textBoxHeight,
            0xdddddd
        ).setOrigin(0);

        // Calculate scrollbar height and position
        const contentHeight = yPos - textBoxY;
        const scrollBarHeight = Math.max((textBoxHeight / contentHeight) * textBoxHeight, 50);
        
        // Create scrollbar
        const scrollBar = this.add.rectangle(
            textBoxX + textBoxWidth - 20,
            textBoxY,
            20,
            scrollBarHeight,
            0x666666
        ).setOrigin(0)
            .setInteractive({ draggable: true, useHandCursor: true });

        // Scrolling logic
        const maxScroll = Math.max(0, contentHeight - textBoxHeight);
        const scrollFactor = maxScroll / (textBoxHeight - scrollBarHeight);

        // Update scroll position function
        const updateScrollPosition = () => {
            // Ensure scrollbar stays within bounds
            const maxY = textBoxY + textBoxHeight - scrollBarHeight;
            scrollBar.y = Phaser.Math.Clamp(scrollBar.y, textBoxY, maxY);

            // Update content position
            const scrollPos = (scrollBar.y - textBoxY) * scrollFactor;
            maskContainer.y = -scrollPos;
        };

        // Drag events
        scrollBar.on('drag', (pointer, dragX, dragY) => {
            scrollBar.y = dragY;
            updateScrollPosition();
        });

        // Mouse wheel scrolling
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (pointer.x >= textBoxX && pointer.x <= textBoxX + textBoxWidth &&
                pointer.y >= textBoxY && pointer.y <= textBoxY + textBoxHeight) {
                scrollBar.y += deltaY * 0.5;
                updateScrollPosition();
            }
        });

        // Play Again button
        const playAgainButton = this.add.container(width / 2, height * 0.92);
        
        const buttonBg = this.add.rectangle(0, 0, 200, 60, 0x4444ff, 1)
            .setOrigin(0.5);
        
        const buttonText = this.add.text(0, 0, 'Играй отново', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        playAgainButton.add([buttonBg, buttonText]);
        playAgainButton.setSize(250, 60);
        buttonBg.setSize(250, 60);
        playAgainButton.setInteractive();

        // Button hover effects
        playAgainButton.on('pointerover', () => {
            buttonBg.setFillStyle(0x6666ff);
            this.tweens.add({
                targets: playAgainButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        playAgainButton.on('pointerout', () => {
            buttonBg.setFillStyle(0x4444ff);
            this.tweens.add({
                targets: playAgainButton,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        playAgainButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

// Add new Win Scene
class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    init(data) {
        this.rounds = data.rounds;
        this.wordSets = data.wordSets || [];
    }

    create() {
        const { width, height } = this.scale;
        
        // Add dark overlay with more transparency
        this.add.rectangle(0, 0, width, height, 0x000000, 0.5)
            .setOrigin(0);

        // Play win sound
        this.sound.play('win');

        // Create fireworks emitter first so it's behind everything
        this.createFireworks();

        // Add victory text with reduced effects
        const winText = this.add.text(width / 2, height * 0.15, 'Поздравления!\nТи спечели!', {
            fontSize: '96px',   
            fontFamily: 'Arial Black',
            fill: '#4CAF50',
            stroke: '#ffffff',
            strokeThickness: 4,
            align: 'center',
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5);

        // Create semi-transparent text box
        const textBoxWidth = width * 0.7;
        const textBoxHeight = height * 0.35; // Reduced height
        const textBoxX = width * 0.15;
        const textBoxY = height * 0.45; // Moved down slightly

        // White background for text box with border and transparency
        const textBoxBg = this.add.rectangle(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 0xffffff)
            .setOrigin(0)
            .setStrokeStyle(2, 0x000000)
            .setAlpha(0.9); // Make it slightly transparent

        // Create mask for scrolling
        const maskGraphics = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRect(textBoxX, textBoxY, textBoxWidth - 20, textBoxHeight);

        // Create a container for masking
        const maskContainer = this.add.container(0, 0);
        maskContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskGraphics));

        // Initialize position variables
        let yPos = textBoxY + 20;
        const availableWidth = textBoxWidth - 80;

        // Filter only the rounds with mistakes
        const mistakeRounds = this.wordSets.filter(set => 
            set.clicked !== set.correct
        );

        // Add "Words you missed:" text above the box
        const missedWordsText = this.add.text(textBoxX, textBoxY - 40, 'Объркани думи:', {
            fontSize: '28px',
            fontFamily: 'Arial',
            fill: '#ffffff'
        });

        if (mistakeRounds.length > 0) {
            mistakeRounds.forEach((set) => {
                let xPos = textBoxX + 40;
                let currentLineWidth = 0;

                set.allWords.forEach((word, wordIndex) => {
                    let style = {
                        fontSize: '22px',
                        fontFamily: 'Arial',
                        fill: '#4CAF50', // Softer green for all correct words
                        textDecoration: word === set.clicked ? 'underline' : '' // Underline clicked word
                    };

                    if (word === set.correct) {
                        style.fill = '#ff0000'; // Red for the incorrect word
                    }

                    const wordText = this.add.text(xPos, yPos, word, style);

                    if (word === set.clicked) {
                        // Add underline as a rectangle
                        const underline = this.add.rectangle(
                            xPos,
                            yPos + wordText.height,
                            wordText.width,
                            2,
                            parseInt(style.fill.replace('#', '0x'))
                        );
                        underline.setOrigin(0, 0);
                        maskContainer.add(underline);
                    }

                    if (currentLineWidth + wordText.width + 30 > availableWidth && wordIndex > 0) {
                        yPos += 35;
                        xPos = textBoxX + 40;
                        currentLineWidth = 0;
                        wordText.setPosition(xPos, yPos);
                        if (word === set.clicked) {
                            // Update underline position if word wraps
                            const lastUnderline = maskContainer.list[maskContainer.list.length - 1];
                            if (lastUnderline instanceof Phaser.GameObjects.Rectangle) {
                                lastUnderline.setPosition(xPos, yPos + wordText.height);
                            }
                        }
                    }

                    currentLineWidth += wordText.width + 30;
                    xPos += wordText.width + 30;
                    maskContainer.add(wordText);
                });
                
                yPos += 45;
            });
        } else {
            const perfectText = this.add.text(textBoxX + textBoxWidth/2, textBoxY + textBoxHeight/2, 
                'Перфектен резултат!\nНяма грешки!', {
                fontSize: '32px',
                fontFamily: 'Arial',
                fill: '#4CAF50',
                align: 'center',
                fontWeight: 'bold'
            }).setOrigin(0.5);
            maskContainer.add(perfectText);
        }

        // Add all text objects to the mask container
        this.children.list
            .filter(child => child instanceof Phaser.GameObjects.Text)
            .forEach(text => {
                if (text !== winText && text !== missedWordsText) {
                    maskContainer.add(text);
                }
            });

        // Add underline for clicked word after creating the mask container
        if (this._clickedWordData) {
            const { text, x, y } = this._clickedWordData;
            const underline = this.add.graphics();
            underline.lineStyle(2, parseInt(text.style.color.replace('#', '0x')), 1);
            underline.beginPath();
            underline.moveTo(x, y + text.height + 2);
            underline.lineTo(x + text.width, y + text.height + 2);
            underline.closePath();
            underline.strokePath();
            maskContainer.add(underline);
            delete this._clickedWordData;
        }

        // Scrollbar background
        const scrollBarBg = this.add.rectangle(
            textBoxX + textBoxWidth - 20,
            textBoxY,
            20,
            textBoxHeight,
            0xdddddd
        ).setOrigin(0);

        // Calculate scrollbar height and position
        const contentHeight = yPos - textBoxY;
        const scrollBarHeight = Math.max((textBoxHeight / contentHeight) * textBoxHeight, 50);
        
        // Create scrollbar
        const scrollBar = this.add.rectangle(
            textBoxX + textBoxWidth - 20,
            textBoxY,
            20,
            scrollBarHeight,
            0x666666
        ).setOrigin(0)
            .setInteractive({ draggable: true, useHandCursor: true });

        // Scrolling logic
        const maxScroll = Math.max(0, contentHeight - textBoxHeight);
        const scrollFactor = maxScroll / (textBoxHeight - scrollBarHeight);

        // Update scroll position function
        const updateScrollPosition = () => {
            // Ensure scrollbar stays within bounds
            const maxY = textBoxY + textBoxHeight - scrollBarHeight;
            scrollBar.y = Phaser.Math.Clamp(scrollBar.y, textBoxY, maxY);

            // Update content position
            const scrollPos = (scrollBar.y - textBoxY) * scrollFactor;
            maskContainer.y = -scrollPos;
        };

        // Drag events
        scrollBar.on('drag', (pointer, dragX, dragY) => {
            scrollBar.y = dragY;
            updateScrollPosition();
        });

        // Mouse wheel scrolling
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (pointer.x >= textBoxX && pointer.x <= textBoxX + textBoxWidth &&
                pointer.y >= textBoxY && pointer.y <= textBoxY + textBoxHeight) {
                scrollBar.y += deltaY * 0.5;
                updateScrollPosition();
            }
        });

        // Add styled play again button
        const playAgainButton = this.add.container(width / 2, height * 0.85);
        
        const buttonBg = this.add.rectangle(0, 0, 200, 60, 0x4CAF50, 1)
            .setOrigin(0.5);
        
        const buttonText = this.add.text(0, 0, 'Играй отново', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        playAgainButton.add([buttonBg, buttonText]);
        playAgainButton.setSize(250, 60);
        buttonBg.setSize(250, 60);
        playAgainButton.setInteractive();

        // Button hover effects
        playAgainButton.on('pointerover', () => {
            buttonBg.setFillStyle(0x66BB6A);
            this.tweens.add({
                targets: playAgainButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        playAgainButton.on('pointerout', () => {
            buttonBg.setFillStyle(0x4CAF50);
            this.tweens.add({
                targets: playAgainButton,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        playAgainButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }

    createFireworks() {
        const { width, height } = this.scale;

        // Simplified colors - fewer options to reduce overhead
        const colors = [
            0xff0000, 0x00ff00, 0x0000ff,     // Primary colors
            0xffff00, 0xff00ff, 0x00ffff      // Secondary colors
        ];

        // Launch firework function
        const launchFirework = () => {
            // Random position at bottom of screen
            const startX = Phaser.Math.Between(width * 0.2, width * 0.8);
            const startY = height;

            // Random position for explosion
            const explodeX = Phaser.Math.Between(width * 0.2, width * 0.8);
            const explodeY = Phaser.Math.Between(height * 0.2, height * 0.6);

            // Random colors
            const color = Phaser.Utils.Array.GetRandom(colors);

            // Create simpler rocket
            const rocket = this.add.particles(startX, startY, 'balloon', {
                speed: { min: 100, max: 200 },
                scale: { start: 0.3, end: 0.1 },
                lifespan: 300,
                quantity: 1,
                tint: color,
                blendMode: 'ADD',
                emitting: true
            });

            // Move rocket to explosion point
            this.tweens.add({
                targets: rocket,
                x: explodeX,
                y: explodeY,
                duration: 1000,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    rocket.destroy();
                    
                    // Create explosion
                    const explosion = this.add.particles(explodeX, explodeY, 'balloon', {
                        speed: { min: 200, max: 300 },
                        angle: { min: 0, max: 360 },
                        scale: { start: 0.4, end: 0 },
                        alpha: { start: 1, end: 0 },
                        lifespan: 800,
                        quantity: 30,
                        tint: color,
                        blendMode: 'ADD',
                        emitting: false
                    });

                    // Emit once and cleanup
                    explosion.start();
                    this.time.delayedCall(800, () => explosion.destroy());
                }
            });
        };

        // Launch fireworks timer
        const fireworkTimer = this.time.addEvent({
            delay: 600,
            callback: launchFirework,
            callbackScope: this,
            loop: true
        });

        // Initial fireworks
        for (let i = 0; i < 3; i++) {
            this.time.delayedCall(i * 400, launchFirework, [], this);
        }

        // Stop fireworks after 6 seconds
        this.time.delayedCall(6000, () => {
            fireworkTimer.destroy();
        });
    }
}

// Game configuration
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const scaleFactor = window.devicePixelRatio > 1 ? 1.5 : 1;

const mobileConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth * scaleFactor,
        height: window.innerHeight * scaleFactor
    },
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MainMenuScene, GameScene, GameOverScene, WinScene]
};

const desktopConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth || 800,
        height: window.innerHeight || 450,
        min: {
            width: 320,
            height: 180
        },
        max: {
            width: 1920,
            height: 1080
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
    scene: [BootScene, MainMenuScene, GameScene, GameOverScene, WinScene]
};

// Start the game with appropriate config
console.log('Initializing game...');
let game;
try {
    game = new Phaser.Game(isMobile ? mobileConfig : desktopConfig);
    console.log('Game initialized successfully!');
} catch (error) {
    console.error('Error initializing game:', error);
} 