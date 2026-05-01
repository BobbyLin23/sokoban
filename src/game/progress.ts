import type { BestResult, ProgressState } from './types'

const STORAGE_KEY = 'sokoban-progress-v1'

export const defaultProgress: ProgressState = {
  highestUnlockedLevel: 1,
  selectedLevel: 1,
  soundEnabled: true,
  bestResults: {},
}

const normalizeProgress = (value: Partial<ProgressState>): ProgressState => ({
  highestUnlockedLevel:
    typeof value.highestUnlockedLevel === 'number' && value.highestUnlockedLevel >= 1
      ? value.highestUnlockedLevel
      : defaultProgress.highestUnlockedLevel,
  selectedLevel:
    typeof value.selectedLevel === 'number' && value.selectedLevel >= 1
      ? value.selectedLevel
      : defaultProgress.selectedLevel,
  soundEnabled:
    typeof value.soundEnabled === 'boolean' ? value.soundEnabled : defaultProgress.soundEnabled,
  bestResults:
    value.bestResults && typeof value.bestResults === 'object'
      ? value.bestResults
      : defaultProgress.bestResults,
})

export const loadProgress = (): ProgressState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultProgress
    }
    return normalizeProgress(JSON.parse(raw) as Partial<ProgressState>)
  } catch {
    return defaultProgress
  }
}

export const saveProgress = (progress: ProgressState) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Saving progress is best-effort; gameplay should continue if storage is unavailable.
  }
}

export const withCompletedLevel = (
  progress: ProgressState,
  levelId: number,
  elapsedSeconds: number,
  moves: number,
  maxLevel: number,
): ProgressState => {
  const previousBest = progress.bestResults[levelId]
  const nextBest: BestResult =
    !previousBest ||
    moves < previousBest.moves ||
    (moves === previousBest.moves && elapsedSeconds < previousBest.seconds)
      ? { moves, seconds: elapsedSeconds }
      : previousBest

  return {
    ...progress,
    highestUnlockedLevel: Math.min(maxLevel, Math.max(progress.highestUnlockedLevel, levelId + 1)),
    bestResults: {
      ...progress.bestResults,
      [levelId]: nextBest,
    },
  }
}
