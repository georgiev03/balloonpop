# Граматичко (Gramatichko)

An educational game for learning Bulgarian word spelling. Players need to identify the incorrectly spelled word among a set of words.

🎮 **[Play the game now](https://gramatichko.netlify.app)**

## Features

- Educational gameplay focused on Bulgarian spelling
- Three difficulty levels (Easy, Medium, Hard)
- Adaptive difficulty with increasing speed every 3 rounds
- Mobile-optimized touch controls and responsive design
- Visual and audio feedback for correct/incorrect answers
- Lives system with 10 hearts
- Detailed mistake tracking and end-game feedback
- Beautiful particle effects and animations
- Victory celebration with fireworks
- Supports both desktop and mobile devices
- Automatic scaling and positioning for all screen sizes

## How to Play

1. Select your preferred difficulty level:
   - Easy: More time to think (17-13 seconds)
   - Medium: Balanced challenge (15-10 seconds)
   - Hard: Fast-paced gameplay (13-8 seconds)
2. Click/tap the balloon containing the incorrectly spelled word
3. You have 10 lives (hearts) to complete all word sets
4. The game gets progressively faster every 3 rounds
5. Each round presents 4 words, with one being incorrect
6. Green words in the feedback are correct, red words are incorrect
7. Try to complete all word sets without losing your lives

## Technical Details

### Requirements

- Modern web browser with JavaScript enabled
- Support for Phaser 3 game framework
- Touch screen for mobile devices (optional)

### Live Version

The game is hosted and playable at: [https://gramatichko.netlify.app](https://gramatichko.netlify.app)

### Local Development

If you want to run the game locally:

1. Clone the repository:
```bash
git clone https://github.com/georgiev03/balloonpop.git
cd balloonpop
```

2. Serve the files using a web server. You can use any of these methods:
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve`
   - PHP: `php -S localhost:8000`
   - Or any other web server of your choice

3. Open in your browser:
   - Local: `http://localhost:8000`

### Deployment

The game is currently deployed on Netlify with automatic updates from the main branch. For your own deployment:

1. Fork the repository
2. Connect your fork to Netlify or any static hosting service
3. Deploy from the main branch

### Testing

To test the game:

1. Browser Compatibility:
   - Test in Chrome, Firefox, Safari, and Edge
   - Test on both desktop and mobile devices
   - Verify touch controls on mobile devices

2. Game Features:
   - Verify all animations work smoothly
   - Check sound effects play correctly
   - Test responsive design at different screen sizes
   - Verify text is readable on all devices

3. Gameplay Testing:
   - Test with different word sets
   - Verify scoring system works correctly
   - Check lives system decrements properly
   - Verify end game conditions (both win and lose)
   - Test scrolling in feedback screens

4. Performance Testing:
   - Monitor frame rate during particle effects
   - Test memory usage during extended play
   - Verify smooth balloon animations
   - Check load times for assets

## Credits

- Framework: Phaser 3
- Assets: Custom designed for this project

## License

This project is licensed under the MIT License - see the LICENSE file for details. 