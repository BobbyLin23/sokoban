import type { BestResult, ProgressState } from './types'

const STORAGE_KEY = 'sokoban-progress-v1'

export const defaultProgress: ProgressState = {
  highestUnlockedLevel: 1,
  selectedLevel: 1,
  soundEnabled: true,
  bestResults: {},
}

export const createDefaultProgress = (): ProgressState => ({
  ...defaultProgress,
  bestResults: {},
})

const isFiniteNonNegativeNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0

const normalizeBestResults = (value: unknown): Record<number, BestResult> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, result]) => {
      const levelId = Number(key)
      if (!Number.isInteger(levelId) || levelId < 1 || !result || typeof result !== 'object') {
        return []
      }

      const { moves, seconds } = result as Partial<BestResult>
      return isFiniteNonNegativeNumber(moves) && isFiniteNonNegativeNumber(seconds)
        ? [[levelId, { moves, seconds }]]
        : []
    }),
  )
}

const normalizeProgress = (value: Partial<ProgressState>): ProgressState => {
  const fallback = createDefaultProgress()

  return {
    highestUnlockedLevel:
      typeof value.highestUnlockedLevel === 'number' && value.highestUnlockedLevel >= 1
        ? value.highestUnlockedLevel
        : fallback.highestUnlockedLevel,
    selectedLevel:
      typeof value.selectedLevel === 'number' && value.selectedLevel >= 1
        ? value.selectedLevel
        : fallback.selectedLevel,
    soundEnabled:
      typeof value.soundEnabled === 'boolean' ? value.soundEnabled : fallback.soundEnabled,
    bestResults: normalizeBestResults(value.bestResults),
  }
}

export const loadProgress = (): ProgressState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createDefaultProgress()
    }
    return normalizeProgress(JSON.parse(raw) as Partial<ProgressState>)
  } catch {
    return createDefaultProgress()
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
