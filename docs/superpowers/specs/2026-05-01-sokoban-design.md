# Sokoban H5 Game Design

## Overview

Build a polished H5 Sokoban game as a single-page React application. The first release focuses on the classic Sokoban loop: move the player around a grid, push crates onto targets, solve curated levels, and progress through a small campaign.

The visual direction is Neon Arcade: dark high-contrast surfaces, bright targets, clear crate/player states, and a responsive mobile-first layout. Styling will use Tailwind CSS v4.

## Goals

- Replace the starter Vite screen with a playable Sokoban game.
- Provide 12 curated campaign levels.
- Unlock levels sequentially after wins.
- Support keyboard and mobile touch controls.
- Include undo, restart, level select, sound toggle, move counter, timer, win state, and best move/time tracking.
- Persist progress locally with localStorage.

## Non-Goals

- No backend, accounts, leaderboard, or multiplayer.
- No level editor in the first version.
- No dependency-heavy game engine for the first version.
- No procedural level generation.

## Technology Approach

Use the existing Vite React + TypeScript app. Add Tailwind CSS v4 for styling.

The game will use a pure TypeScript rules layer and React UI components:

- `levels.ts` stores compact text-map level definitions.
- `gameEngine.ts` parses levels, validates moves, pushes crates, detects wins, and manages undo history.
- React components render app shell, board, HUD, level picker, controls, and win dialog.
- CSS grid renders the board. Cell visuals are derived from game state and styled with Tailwind classes.

This approach keeps the rules testable and the UI straightforward, while avoiding the extra weight of Canvas or Phaser for a grid-based puzzle game.

## Gameplay

Each level is a rectangular text map using conventional Sokoban semantics:

- Wall
- Floor
- Target
- Crate
- Crate on target
- Player
- Player on target

The player moves one tile at a time. If the destination tile has a crate, the engine checks the tile beyond it. The push succeeds only when the beyond tile is walkable and does not contain another crate. Invalid moves do nothing.

A level is complete when every target contains a crate. On completion, the app shows a win dialog, records best moves/time if improved, and unlocks the next level.

## Progression

The first version uses a curated campaign:

- 12 built-in levels.
- Level 1 starts unlocked.
- Winning a level unlocks the next level.
- Locked levels are visible but not playable.
- Level select shows completion and best results.

## Controls

Desktop:

- Arrow keys and WASD move the player.
- Undo and restart are available through buttons.

Mobile:

- A fixed touch D-pad provides directional movement.
- Buttons expose undo and restart.
- Tap targets should be large enough for comfortable thumb use.

Controls must not scroll the page during play.

## State And Persistence

Runtime state includes:

- Current level id.
- Parsed board state.
- Player position.
- Crate positions.
- Move count.
- Timer start and elapsed time.
- Undo history.
- Win status.

Persistent localStorage state includes:

- Highest unlocked level.
- Selected level.
- Sound setting.
- Per-level best moves and best time.

Malformed or missing localStorage data falls back to safe defaults.

## UI

The app opens directly into the game rather than a marketing landing page.

Layout:

- Header/HUD with game title, current level, moves, timer, and sound toggle.
- Main board area centered in the viewport.
- Controls below or beside the board depending on viewport width.
- Level picker as a compact panel or dialog.
- Win dialog with next level, retry, and level select actions.

Visual treatment:

- Neon Arcade palette with dark base, bright blue player, amber crates, green targets, and subtle glow on solved targets.
- Stable square grid cells using responsive constraints so the board fits mobile and desktop viewports.
- Clear visual difference between crates on floor and crates on targets.
- Avoid decorative elements that distract from the puzzle.

## Accessibility And Responsiveness

- Buttons use semantic elements and visible focus states.
- Keyboard controls are documented through labels/tooltips where needed, not long in-app instructions.
- Board cells include accessible labels where practical.
- Text must fit inside controls across mobile and desktop.
- The layout must avoid overlap and horizontal scrolling on common phone widths.

## Error Handling

- Level parsing validates rectangular maps and required entities.
- Invalid level maps throw clear development errors.
- Undo is disabled when there is no history.
- Restart resets the current level without clearing saved progress.
- Locked levels cannot be selected.
- localStorage read/write failures do not block play.

## Testing And Verification

Add focused automated coverage for the rules layer:

- Movement into empty floor.
- Movement blocked by walls.
- Push crate into empty floor.
- Push blocked by wall or second crate.
- Undo restores player, crates, move count, and win state.
- Restart restores the initial level.
- Win detection succeeds only when all targets have crates.

Verification before completion:

- Run lint.
- Run TypeScript build.
- Run unit tests if a test runner is added.
- Start the Vite dev server.
- Check desktop and mobile browser layouts.

## Implementation Notes

Tailwind CSS v4 should be installed and configured before replacing the starter UI. Keep game rules independent from React so the engine can be tested without rendering components.

The first implementation should stay focused on a polished playable campaign. Features such as level editing, remote saves, leaderboards, and additional level packs can be added later.
