import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createGameState,
  encodeState,
  getBoardView,
  getProgressKey,
  movePlayer,
  restoreState,
} from '../game/engine'
import { difficultyOptions, levelPacks } from '../game/levels'
import type { Difficulty, Direction, GameState } from '../game/types'

const activeLevelKey = 'sokoban-active-level'
const activeDifficultyKey = 'sokoban-active-difficulty'

function getSavedDifficulty() {
  const saved = window.localStorage.getItem(activeDifficultyKey)

  if (difficultyOptions.includes(saved as Difficulty)) {
    return saved as Difficulty
  }

  return 'easy'
}

function getSavedLevelIndex(difficulty: Difficulty) {
  const saved = Number(window.localStorage.getItem(activeLevelKey))
  const pack = levelPacks[difficulty]

  if (Number.isInteger(saved) && saved >= 0 && saved < pack.length) {
    return saved
  }

  return 0
}

function progressKey(difficulty: Difficulty, levelIndex: number) {
  return getProgressKey(`${difficulty}:${levelIndex}`)
}

function loadState(difficulty: Difficulty, levelIndex: number) {
  return restoreState(levelPacks[difficulty][levelIndex], window.localStorage.getItem(progressKey(difficulty, levelIndex)))
}

export function useSokobanGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>(getSavedDifficulty)
  const [levelIndex, setLevelIndex] = useState(() => getSavedLevelIndex(difficulty))
  const [gameState, setGameState] = useState<GameState>(() => loadState(difficulty, levelIndex))

  const board = useMemo(() => getBoardView(gameState), [gameState])
  const currentPack = levelPacks[difficulty]
  const isLastLevel = levelIndex === currentPack.length - 1

  const changeLevel = useCallback((nextIndex: number) => {
    setLevelIndex(nextIndex)
    setGameState(loadState(difficulty, nextIndex))
  }, [difficulty])

  const changeDifficulty = useCallback((nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty)
    setLevelIndex(0)
    setGameState(loadState(nextDifficulty, 0))
  }, [])

  const move = useCallback((direction: Direction) => {
    setGameState((current) => movePlayer(current, direction))
  }, [])

  const resetLevel = useCallback(() => {
    window.localStorage.removeItem(progressKey(difficulty, levelIndex))
    setGameState(createGameState(currentPack[levelIndex]))
  }, [currentPack, difficulty, levelIndex])

  const restartGame = useCallback(() => {
    difficultyOptions.forEach((option) =>
      levelPacks[option].forEach((_, index) => window.localStorage.removeItem(progressKey(option, index))),
    )
    window.localStorage.removeItem(activeLevelKey)
    setLevelIndex(0)
    setGameState(createGameState(currentPack[0]))
  }, [currentPack])

  const restartAll = useCallback(() => {
    difficultyOptions.forEach((option) =>
      levelPacks[option].forEach((_, index) => window.localStorage.removeItem(progressKey(option, index))),
    )
    window.localStorage.removeItem(activeDifficultyKey)
    window.localStorage.removeItem(activeLevelKey)
    setDifficulty('easy')
    setLevelIndex(0)
    setGameState(createGameState(levelPacks.easy[0]))
  }, [])

  const nextLevel = useCallback(() => {
    const nextIndex = Math.min(levelIndex + 1, currentPack.length - 1)
    changeLevel(nextIndex)
  }, [changeLevel, currentPack.length, levelIndex])

  useEffect(() => {
    window.localStorage.setItem(activeDifficultyKey, difficulty)
  }, [difficulty])

  useEffect(() => {
    window.localStorage.setItem(activeLevelKey, String(levelIndex))
  }, [levelIndex])

  useEffect(() => {
    window.localStorage.setItem(progressKey(difficulty, levelIndex), encodeState(gameState))
  }, [difficulty, gameState, levelIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap: Partial<Record<string, Direction>> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      }
      const direction = keyMap[event.key]

      if (direction) {
        event.preventDefault()
        move(direction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move])

  return {
    board,
    changeDifficulty,
    currentDifficulty: difficulty,
    currentLevel: currentPack[levelIndex],
    difficultyOptions,
    gameState,
    isLastLevel,
    levelCount: currentPack.length,
    levelIndex,
    move,
    nextLevel,
    restartAll,
    resetLevel,
    restartGame,
  }
}
