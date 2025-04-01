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
        this.load.image('arrow', 'assets/arrow.svg');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('heart-empty', 'assets/heart-empty.png');
        this.load.image('startscreen', 'assets/startscreen.jpg');
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
            const glowText = this.add.text(width / 2, height * 0.2, 'Правописни балони', {
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
        const titleText = this.add.text(width / 2, height * 0.2, 'Правописни балони', {
            fontSize: Math.min(width * 0.08, 84) + 'px',
            fontFamily: 'Arial Black',
            fontWeight: 'bold',
            fill: '#f0f0f0',  // Slightly darker shade of white
            stroke: '#4df3ff',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Add shadow to the title text
        titleText.setShadow(2, 2, '#000000', 2, true, true);
        
        allTextElements.push(titleText);

        // Add pulsing animation to the glow
        this.tweens.add({
            targets: allTextElements.slice(0, -1),
            alpha: '-=0.2',  // Match the button's pulse intensity
            yoyo: true,
            duration: 2000,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Create a container for the button
        const buttonContainer = this.add.container(width / 2, height * 0.6);

        // Add multiple glow layers for button
        const buttonGlowColors = [
            { color: '#4df3ff', alpha: 0.4, thickness: 32 },  // Outermost glow (increased thickness)
            { color: '#4df3ff', alpha: 0.6, thickness: 24 },  // Outer glow
            { color: '#4df3ff', alpha: 0.8, thickness: 16 },  // Inner glow
            { color: '#ffffff', alpha: 0.9, thickness: 12 }   // White core
        ];

        // Add glow layers from outside in
        buttonGlowColors.forEach(({ color, alpha, thickness }) => {
            const buttonGlow = this.add.text(0, 0, 'СТАРТ', {
                fontSize: Math.min(width * 0.06, 72) + 'px',
                fontFamily: 'Arial Black',
                fontWeight: 'bold',
                fill: 'transparent',
                stroke: color,
                strokeThickness: thickness,
                padding: { x: 8, y: 8 }
            }).setOrigin(0.5).setAlpha(alpha);
            
            buttonContainer.add(buttonGlow);
        });

        // Add solid text for button with stroke
        const buttonText = this.add.text(0, 0, 'СТАРТ', {
            fontSize: Math.min(width * 0.06, 72) + 'px',
            fontFamily: 'Arial Black',
            fontWeight: 'bold',
            fill: '#f0f0f0',  // Slightly darker shade of white
            stroke: '#4df3ff',
            strokeThickness: 4,
            padding: { x: 8, y: 8 }
        }).setOrigin(0.5);

        // Add shadow to the button text
        buttonText.setShadow(2, 2, '#000000', 2, true, true);
        
        buttonContainer.add(buttonText);
        buttonText.setInteractive();

        // Add stronger pulsing animation to the button glow
        this.tweens.add({
            targets: buttonContainer.list.slice(0, -1),
            alpha: '-=0.2',  // Increased alpha change for more noticeable pulse
            yoyo: true,
            duration: 2000,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Enhanced button hover effects
        buttonText.on('pointerover', () => {
            // Increase glow intensity on hover
            buttonContainer.list.forEach((glow, index) => {
                if (index < buttonContainer.list.length - 1) {
                    const originalAlpha = buttonGlowColors[index].alpha;
                    glow.setAlpha(originalAlpha + 0.3);  // Increased glow intensity on hover
                }
            });
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        buttonText.on('pointerout', () => {
            // Reset glow intensity
            buttonContainer.list.forEach((glow, index) => {
                if (index < buttonContainer.list.length - 1) {
                    const originalAlpha = buttonGlowColors[index].alpha;
                    glow.setAlpha(originalAlpha);
                }
            });
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        // Start game on click
        buttonText.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Add green particle effects on the sides
        this.addGreenParticles();

        // Add entrance animations
        this.tweens.add({
            targets: allTextElements,
            y: height * 0.2,
            duration: 1500,
            ease: 'Bounce'
        });

        this.tweens.add({
            targets: buttonContainer,
            y: height * 0.6,
            duration: 1000,
            ease: 'Bounce',
            delay: 200
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
        this.mistakeWords = [];
        this.wordSets = [];
        this.currentWordSet = null;
        console.log('GameScene constructor called');
    }

    create() {
        console.log('GameScene create called');
        // Initialize game state
        this.round = 1;
        this.lives = 10;
        this.balloons = [];
        this.baseTime = 14;
        this.minTime = 8;
        
        // Get words from loaded JSON and create available words array
        this.allWords = this.cache.json.get('wordList');
        this.availableWords = [...this.allWords]; // Create a copy of all words
        console.log(`Loaded ${this.availableWords.length} words from JSON file`);

        // Add UI
        this.addUI();
        console.log('UI added');

        // Start balloon spawning
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
        const heartsStartY = this.roundText.y + this.roundText.height + 30;
        this.livesContainer = this.add.container(uiStartX + 25, heartsStartY);
        
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
        // Initial spawn
        this.spawnBalloons();
        this.createSpawnTimer();
    }

    createSpawnTimer() {
        // Clear existing timer if it exists
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }

        // Create new timer as backup in case something goes wrong
        this.spawnTimer = this.time.addEvent({
            delay: 10000,
            callback: () => {
                if (this.balloons.length === 0) {
                    this.spawnBalloons();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    spawnBalloons() {
        console.log('Spawning balloons...');
        if (this.lives <= 0) return;

        // Check if we've used all word sets
        if (this.availableWords.length === 0) {
            this.scene.start('WinScene', { 
                rounds: this.round,
                wordSets: this.wordSets
            });
            return;
        }

        // Clear any existing balloons first
        this.clearBalloons();

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
        const timeReduction = Math.floor(this.round / 2) * 0.25;
        const currentTime = Math.max(this.minTime, this.baseTime - timeReduction);
        
        console.log(`Round ${this.round}, Time to top: ${currentTime} seconds`);

        // Calculate balloon width and total width
        const balloonBaseWidth = Math.min(width, height) * 0.084; // Increased from 0.08 (5% increase)
        const balloonWidth = balloonBaseWidth * (1 + (maxWordLength > 5 ? (maxWordLength - 5) * 0.084 : 0)); // Increased from 0.08
        
        // Calculate base spacing and adjust it based on word length
        const baseSpacing = width * 0.13; // Keep current spacing
        const wordLengthSpacingAdjustment = 1 + (maxWordLength > 5 ? (maxWordLength - 5) * 0.0525 : 0); // Increased from 0.05
        const spacing = baseSpacing * wordLengthSpacingAdjustment;

        // Calculate total width needed
        const totalSpacing = spacing * 3;
        const totalBalloonsWidth = balloonWidth * 4;
        const totalWidth = totalBalloonsWidth + totalSpacing;

        // Position balloons more to the right
        const minStartX = width * 0.35;
        const availableWidth = width * 0.6;
        
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

            // Calculate scale based on longest word length - reduced scaling
            const baseScale = Math.min(width, height) * 0.00152; // Increased from 0.00145
            const wordLengthScale = 1 + (maxWordLength > 5 ? (maxWordLength - 5) * 0.0525 : 0); // Increased from 0.05
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
            const baseFontSize = Math.min(width, height) * 0.026;
            const fontScale = 1 + (maxWordLength > 5 ? (maxWordLength - 5) * 0.0315 : 0);
            const fontSize = Math.floor(baseFontSize * fontScale);

            // Add word text with improved styling
            const text = this.add.text(x, y, word, {
                fontSize: fontSize + 'px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                fill: '#000000',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: { 
                    x: 0, // Remove horizontal padding to let fixedWidth handle it
                    y: fontSize * 0.4 // Increased vertical padding
                },
                fixedWidth: actualBalloonWidth, // Full balloon width
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
                        // Spawn new balloons immediately
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

        // White background for text box with border
        const textBoxBg = this.add.rectangle(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 0xffffff)
            .setOrigin(0)
            .setStrokeStyle(2, 0x000000);

        // Create text content directly without container
        let yPos = textBoxY + 20;
        let xPos = textBoxX + 40;
        let currentLineWidth = 0;
        const availableWidth = textBoxWidth - 80; // 40px padding on each side

        // Filter only the rounds with mistakes (where clicked is not correct)
        const mistakeRounds = this.wordSets.filter(set => 
            set.clicked !== set.correct
        );

        console.log('Processing mistake rounds:', mistakeRounds.length);
        
        mistakeRounds.forEach((set) => {
            // Calculate available width for words
            let xPos = textBoxX + 40;
            let currentLineWidth = 0;

            // Render words with proper wrapping
            set.allWords.forEach((word, wordIndex) => {
                let color = '#000000'; // Default black
                if (word === set.clicked) color = '#ff0000'; // Red for clicked wrong word
                if (word === set.correct) color = '#00ff00'; // Green for correct word

                const wordText = this.add.text(xPos, yPos, word, {
                    fontSize: '22px',
                    fontFamily: 'Arial',
                    fill: color,
                    fontWeight: 'bold'
                });

                // Check if we need to wrap to next line
                if (currentLineWidth + wordText.width + 30 > availableWidth && wordIndex > 0) {
                    yPos += 35; // Move to next line
                    xPos = textBoxX + 40; // Reset x position
                    currentLineWidth = 0; // Reset line width
                    wordText.setPosition(xPos, yPos);
                }

                currentLineWidth += wordText.width + 30;
                xPos += wordText.width + 30;
            });
            
            yPos += 45; // Space between sets
        });

        // If no mistakes were made, show a congratulatory message
        if (mistakeRounds.length === 0) {
            this.add.text(textBoxX + textBoxWidth/2, textBoxY + textBoxHeight/2, 
                'Perfect Score!\nNo mistakes made!', {
                fontSize: '32px',
                fontFamily: 'Arial',
                fill: '#00aa00',
                align: 'center',
                fontWeight: 'bold'
            }).setOrigin(0.5);
        }

        // Create mask for scrolling
        const maskGraphics = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRect(textBoxX, textBoxY, textBoxWidth - 20, textBoxHeight);

        // Create a container for masking
        const maskContainer = this.add.container(0, 0);
        maskContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskGraphics));

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

        // Create text content
        let yPos = textBoxY + 20;
        let xPos = textBoxX + 40;
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
                    let color = '#000000';
                    if (word === set.clicked) color = '#ff0000';
                    if (word === set.correct) color = '#4CAF50';

                    const wordText = this.add.text(xPos, yPos, word, {
                        fontSize: '22px',
                        fontFamily: 'Arial',
                        fill: color,
                        fontWeight: 'bold'
                    });

                    if (currentLineWidth + wordText.width + 30 > availableWidth && wordIndex > 0) {
                        yPos += 35;
                        xPos = textBoxX + 40;
                        currentLineWidth = 0;
                        wordText.setPosition(xPos, yPos);
                    }

                    currentLineWidth += wordText.width + 30;
                    xPos += wordText.width + 30;
                });
                
                yPos += 45;
            });
        } else {
            this.add.text(textBoxX + textBoxWidth/2, textBoxY + textBoxHeight/2, 
                'Перфектен резултат!\nНяма грешки!', {
                fontSize: '32px',
                fontFamily: 'Arial',
                fill: '#4CAF50',
                align: 'center',
                fontWeight: 'bold'
            }).setOrigin(0.5);
        }

        // Create mask for scrolling
        const maskGraphics = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRect(textBoxX, textBoxY, textBoxWidth - 20, textBoxHeight);

        // Create a container for masking
        const maskContainer = this.add.container(0, 0);
        maskContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskGraphics));

        // Add all text objects to the mask container
        this.children.list
            .filter(child => child instanceof Phaser.GameObjects.Text)
            .forEach(text => {
                if (text !== winText && text !== missedWordsText) {
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
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280, // Fixed base width
        height: 720, // Fixed base height
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1280,
            height: 720
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

// Add resize handler with proper centering
window.addEventListener('resize', () => {
    if (game) {
        const width = Math.min(window.innerWidth, 1280);
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

// Start the game
console.log('Initializing game...');
let game;
try {
    game = new Phaser.Game(config);
    console.log('Game initialized successfully!');
} catch (error) {
    console.error('Error initializing game:', error);
} 