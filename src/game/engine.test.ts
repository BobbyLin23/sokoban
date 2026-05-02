import { describe, expect, test } from 'vitest'
import { createGameState, movePlayer, parseLevel } from './engine'
import { difficultyOptions, levelPacks, levels } from './levels'
import type { Level } from './types'

describe('levels', () => {
  test('ships 20 playable predefined levels across three difficulty packs', () => {
    expect(levels).toHaveLength(20)
    expect(() => levels.forEach(parseLevel)).not.toThrow()
    expect(difficultyOptions).toEqual(['easy', 'medium', 'hard'])
    expect(levelPacks.easy).toHaveLength(6)
    expect(levelPacks.medium).toHaveLength(7)
    expect(levelPacks.hard).toHaveLength(7)
  })

  test('medium and hard packs use more complex box layouts than easy levels', () => {
    const easyBoxCounts = levelPacks.easy.map((level) => parseLevel(level).boxStarts.length)
    const mediumBoxCounts = levelPacks.medium.map((level) => parseLevel(level).boxStarts.length)
    const hardBoxCounts = levelPacks.hard.map((level) => parseLevel(level).boxStarts.length)

    expect(Math.max(...easyBoxCounts)).toBeLessThanOrEqual(2)
    expect(Math.max(...mediumBoxCounts)).toBeGreaterThanOrEqual(3)
    expect(Math.min(...hardBoxCounts)).toBeGreaterThanOrEqual(3)
  })
})

describe('failure detection', () => {
  test('marks a level as failed when a box is pushed into a non-target corner', () => {
    const level: Level = {
      id: 'dead-corner',
      name: 'Dead Corner',
      rows: ['#####', '#@$ #', '#   #', '##..#', '#####'],
    }

    const state = createGameState(level)
    const failedState = movePlayer(state, 'right')

    expect(failedState.failed).toBe(true)
    expect(failedState.completed).toBe(false)
  })

  test('does not mark a level as failed when a box is pushed onto a target corner', () => {
    const level: Level = {
      id: 'target-corner',
      name: 'Target Corner',
      rows: ['#####', '#@$.#', '#   #', '#####'],
    }

    const state = createGameState(level)
    const completedState = movePlayer(state, 'right')

    expect(completedState.failed).toBe(false)
    expect(completedState.completed).toBe(true)
  })
})
