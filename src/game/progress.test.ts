import { beforeEach, describe, expect, it } from 'vitest'

import { loadProgress } from './progress'

const STORAGE_KEY = 'sokoban-progress-v1'

describe('progress', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns fresh defaults when no saved progress exists', () => {
    const first = loadProgress()
    const second = loadProgress()

    first.bestResults[1] = { moves: 10, seconds: 30 }

    expect(second.bestResults).toEqual({})
  })

  it('drops malformed best result entries from saved progress', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        highestUnlockedLevel: 3,
        selectedLevel: 2,
        soundEnabled: false,
        bestResults: {
          1: { moves: 10, seconds: 40 },
          2: {},
          3: { moves: -1, seconds: 20 },
          4: { moves: 5, seconds: Number.POSITIVE_INFINITY },
          abc: { moves: 1, seconds: 1 },
        },
      }),
    )

    expect(loadProgress()).toEqual({
      highestUnlockedLevel: 3,
      selectedLevel: 2,
      soundEnabled: false,
      bestResults: {
        1: { moves: 10, seconds: 40 },
      },
    })
  })
})
