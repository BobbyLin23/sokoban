You are a senior frontend engineer. Help me build a mobile-friendly Sokoban (Push Box) game as a web app.

## Tech Stack
- Vite
- React (with hooks)
- TypeScript
- PWA (Progressive Web App support)
- Tailwind CSS (for styling)

## Requirements

### 1. Core Gameplay
- Implement a classic Sokoban game:
  - A player can move in four directions (up, down, left, right)
  - The player can push boxes (but not pull them)
  - Boxes can be pushed only if the next cell is empty
  - The goal is to push all boxes onto target spots

### 2. Game Map
- Represent the map as a 2D grid (array)
- Include:
  - Wall
  - Floor
  - Player
  - Box
  - Target
  - Box on target
- Support at least 3 predefined levels
- Allow easy extension for more levels

### 3. Controls
- Mobile-first design:
  - On-screen buttons (up/down/left/right)
- Also support keyboard input for desktop:
  - Arrow keys

### 4. Game State
- Track:
  - Number of steps
  - Current level
  - Completion status
- Provide:
  - Reset level
  - Restart game
  - Go to next level when completed

### 5. UI / UX
- Clean and minimal UI
- Responsive layout (optimized for mobile screens)
- Show:
  - Step counter
  - Level indicator
  - Win message when completed

### 6. PWA Features
- Add manifest.json
- Enable service worker for offline support
- Make it installable on mobile devices

### 7. Code Structure
- Use component-based architecture:
  - GameBoard
  - Cell
  - Controls
  - GameHeader
- Keep logic modular:
  - Separate game engine logic from UI
- Use TypeScript types for game state

### 8. Bonus (if possible)
- Add simple animations (box movement)
- Add sound effects
- Save progress in localStorage

## Output Expectations
- Provide full project structure
- Include all key files:
  - main.tsx
  - App.tsx
  - components
  - game logic module
  - PWA config (manifest + service worker)
- Include instructions to run:
  - npm install
  - npm run dev
  - npm run build

Focus on clean, maintainable code and a good mobile user experience.

Think step by step and implement this project incrementally:
1. First scaffold the project
2. Then implement game logic
3. Then build UI
4. Then add PWA support
