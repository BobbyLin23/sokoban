# Sokoban

A mobile-friendly Sokoban (Push Box) game built with Vite, React, TypeScript, Tailwind CSS, and PWA support.

## Features

- Classic Sokoban movement: move in four directions and push boxes onto targets.
- Four predefined levels in `src/game/levels.ts`.
- Mobile on-screen controls plus keyboard support for arrow keys and WASD.
- Step counter, level indicator, reset level, restart game, and next-level flow.
- Local progress saved with `localStorage`.
- Offline-capable PWA shell through `public/manifest.webmanifest` and `public/sw.js`.

## Project Structure

```text
src/
  components/
    Cell.tsx
    Controls.tsx
    GameBoard.tsx
    GameHeader.tsx
    WinPanel.tsx
  game/
    engine.ts
    levels.ts
    types.ts
  hooks/
    useSokobanGame.ts
  App.tsx
  main.tsx
  serviceWorkerRegistration.ts
```

## Run Locally

```bash
pnpm install
pnpm dev
```

## Verify

```bash
pnpm lint
pnpm build
```
