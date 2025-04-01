1. Project Overview

The goal of this project is to develop a web-based grammar game where players must identify the incorrect word among four floating balloons. The game will be built using Phaser.js and deployed as a Progressive Web App (PWA) to ensure compatibility with Windows, Android, and iOS browsers.

Key Features:

Lives System: Players start with 10 lives and lose one when clicking the wrong balloon or when a balloon flies off the screen.

Balloon Interaction: Clicking a balloon shoots an arrow that pops it.

Animations & Sounds: Includes arrow animations and a sound effect when popping a balloon.

Scoring & Progression: Players gain points for correct answers, and difficulty increases over time.

Word Database: Words are stored locally or fetched from Supabase.

Offline Mode: The game can be installed as a PWA for offline play.

2. Functional Requirements

2.1. Game Mechanics

Balloon Generation:

Four balloons appear on the screen in random positions.

Three contain correct words; one contains an incorrect word.

Balloon Movement:

Balloons float upwards and disappear after a few seconds.

Player Interaction:

Clicking a balloon shoots an arrow that pops it.

If the player selects the incorrect balloon, they earn points.

If they select a correct balloon, they lose a life.

If a balloon escapes the screen, they lose a life.

2.2. Scoring & Lives System

Starting Lives: 10 lives.

Points System:

+1 point for selecting the incorrect word.

Game Over Condition: The game ends when lives reach 0.

2.3. Animations & Sounds

Arrow Animation:

When clicking a balloon, an arrow flies towards it.

The arrow disappears upon impact.

Balloon Animation

When an arrow hits it, it pops.

Sound Effects:

A sound plays when a balloon pops.

Optional: Background music.

2.4. Word Database

Predefined Word Lists: Stored locally in JavaScript.

Supabase Integration (Optional):

Fetch words from a hosted database.

Store high scores online.

2.5. UI & Graphics

Start Screen: "Play" button to start the game.

In-Game UI:

Score counter

Lives counter

Timer indicator

Game Over Screen:

Final score display

"Play Again" button

3. Tech Stack

Frontend: JavaScript with Phaser.js for game logic and animations.

Backend (Optional): Supabase for storing words and high scores.

Deployment: Hosted as a PWA on Vercel or Netlify.

4. API Endpoints (If Using Supabase)

4.1. Word Database

GET /words – Fetches a set of words (3 correct + 1 incorrect).

4.2. High Scores

POST /scores – Saves player scores to the database.

GET /scores – Retrieves top scores.

5. Additional Features (Optional)

Power-ups: Slowing time, extra points, etc.

Multiplayer Mode: Compete with other players in real time.

Customization: Different themes, difficulty levels.

6. Next Steps

Set up Phaser.js project.

Implement balloon mechanics and word logic.

Create UI (score, lives, timer, game over screen).

Add arrow animations and sound effects.

Add PWA functionality for offline play.

(Optional) Connect to Supabase for word storage and leaderboards.