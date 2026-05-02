import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Board } from './components/Board'
import { Controls } from './components/Controls'
import { Hud } from './components/Hud'
import { LevelSelect } from './components/LevelSelect'
import { WinDialog } from './components/WinDialog'
import {
  createGame,
  movePlayer,
  parseLevel,
  restartGame,
  undoMove,
} from './game/gameEngine'
import { LEVELS } from './game/levels'
import {
  loadProgress,
  saveProgress,
  withCompletedLevel,
} from './game/progress'
import type { Direction, GameState, ProgressState } from './game/types'
import './App.css'

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  a: 'left',
  A: 'left',
  s: 'down',
  S: 'down',
  d: 'right',
  D: 'right',
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

let audioContext: AudioContext | undefined

const playTone = (enabled: boolean, frequency: number, duration = 0.06) => {
  if (!enabled) {
    return
  }

  try {
    const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext

    if (!AudioContextConstructor) {
      return
    }

    audioContext ??= new AudioContextConstructor()

    if (audioContext.state === 'suspended' && audioContext.resume) {
      void audioContext.resume().catch(() => undefined)
    }

    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const now = audioContext.currentTime

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start(now)
    oscillator.stop(now + duration)
  } catch {
    // Audio feedback is best-effort; gameplay must continue if Web Audio fails.
  }
}

const findLevelIndex = (levelId: number) => {
  const index = LEVELS.findIndex((level) => level.id === levelId)
  return index === -1 ? 0 : index
}

const PARSED_LEVELS = LEVELS.map(parseLevel)

const getInitialProgress = (): ProgressState => {
  const saved = loadProgress()
  const highestUnlockedLevel = Math.min(
    LEVELS.length,
    Math.max(1, saved.highestUnlockedLevel),
  )
  const selectedLevel = LEVELS.some((level) => level.id === saved.selectedLevel)
    && saved.selectedLevel <= highestUnlockedLevel
    ? saved.selectedLevel
    : LEVELS[0].id

  return {
    ...saved,
    selectedLevel,
    highestUnlockedLevel,
  }
}

const createGameForLevel = (levelId: number): GameState =>
  createGame(PARSED_LEVELS[findLevelIndex(levelId)])

function App() {
  const [progress, setProgress] = useState<ProgressState>(getInitialProgress)
  const [game, setGame] = useState<GameState>(() => createGameForLevel(progress.selectedLevel))
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [levelsOpen, setLevelsOpen] = useState(false)
  const winRecordedRef = useRef(false)

  const currentLevelIndex = useMemo(() => findLevelIndex(game.level.id), [game.level.id])
  const isLastLevel = currentLevelIndex === LEVELS.length - 1

  const setLevel = useCallback((levelId: number) => {
    if (
      levelId > progress.highestUnlockedLevel
      || !LEVELS.some((level) => level.id === levelId)
    ) {
      return
    }

    setGame(createGameForLevel(levelId))
    setElapsedSeconds(0)
    winRecordedRef.current = false
    setLevelsOpen(false)
    setProgress((currentProgress) => {
      if (currentProgress.selectedLevel === levelId) {
        return currentProgress
      }

      return { ...currentProgress, selectedLevel: levelId }
    })
  }, [progress.highestUnlockedLevel])

  const handleMove = useCallback((direction: Direction) => {
    const nextGame = movePlayer(game, direction)

    setGame(nextGame)

    if (nextGame !== game) {
      playTone(progress.soundEnabled, nextGame.won ? 660 : 330, nextGame.won ? 0.16 : 0.06)
    }

    if (!game.won && nextGame.won && !winRecordedRef.current) {
      winRecordedRef.current = true
      setProgress((currentProgress) =>
        withCompletedLevel(
          currentProgress,
          nextGame.level.id,
          elapsedSeconds,
          nextGame.moves,
          LEVELS.length,
        ),
      )
    }
  }, [elapsedSeconds, game, progress.soundEnabled])

  const handleUndo = useCallback(() => {
    setGame((currentGame) => undoMove(currentGame))
  }, [])

  const handleRestart = useCallback(() => {
    setGame((currentGame) => restartGame(currentGame))
    setElapsedSeconds(0)
    winRecordedRef.current = false
  }, [])

  const handleNextLevel = useCallback(() => {
    setLevel(LEVELS[Math.min(currentLevelIndex + 1, LEVELS.length - 1)].id)
  }, [currentLevelIndex, setLevel])

  const handleToggleSound = useCallback(() => {
    setProgress((currentProgress) => ({
      ...currentProgress,
      soundEnabled: !currentProgress.soundEnabled,
    }))
  }, [])

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key]

      if (!direction) {
        return
      }

      event.preventDefault()

      if (levelsOpen) {
        return
      }

      handleMove(direction)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleMove, levelsOpen])

  useEffect(() => {
    if (game.won) {
      return
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [game.won])

  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-[#070a12] text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(7,10,18,1)_58%)]" />
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Hud
          levelTitle={game.level.title}
          levelId={game.level.id}
          moves={game.moves}
          seconds={elapsedSeconds}
          best={progress.bestResults[game.level.id]}
          soundEnabled={progress.soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenLevels={() => setLevelsOpen(true)}
        />

        <section className="grid flex-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="flex min-h-0 justify-center">
            <Board game={game} />
          </div>
          <aside className="flex justify-center lg:justify-end">
            <Controls
              canUndo={game.history.length > 0}
              onMove={handleMove}
              onUndo={handleUndo}
              onRestart={handleRestart}
            />
          </aside>
        </section>
      </div>

      <LevelSelect
        open={levelsOpen}
        levels={LEVELS}
        currentLevel={game.level.id}
        highestUnlockedLevel={progress.highestUnlockedLevel}
        bestResults={progress.bestResults}
        onSelect={setLevel}
        onClose={() => setLevelsOpen(false)}
      />

      <WinDialog
        open={game.won && !levelsOpen}
        levelId={game.level.id}
        isLastLevel={isLastLevel}
        moves={game.moves}
        seconds={elapsedSeconds}
        onNext={handleNextLevel}
        onRetry={handleRestart}
        onLevels={() => setLevelsOpen(true)}
      />
    </main>
  )
}

export default App
