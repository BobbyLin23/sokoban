import { describe, expect, it } from 'vitest'

import {
  createGame,
  movePlayer,
  parseLevel,
  restartGame,
  undoMove,
} from './gameEngine'
import type { Direction, LevelDefinition } from './types'

const makeLevel = (map: string[]): LevelDefinition => ({
  id: 1,
  title: 'Test Level',
  map,
})

const startGame = (map: string[]) => createGame(parseLevel(makeLevel(map)))

const move = (map: string[], direction: Direction) => movePlayer(startGame(map), direction)

describe('gameEngine', () => {
  it('moves player into empty floor', () => {
    const game = move(['######', '#@  $#', '#  . #', '######'], 'right')

    expect(game.player).toEqual({ row: 1, col: 2 })
    expect(game.crates).toEqual([{ row: 1, col: 4 }])
    expect(game.moves).toBe(1)
    expect(game.history).toHaveLength(1)
  })

  it('blocks movement into walls', () => {
    const game = startGame(['######', '#@  $#', '#  . #', '######'])
    const blocked = movePlayer(game, 'left')

    expect(blocked).toBe(game)
    expect(blocked.player).toEqual({ row: 1, col: 1 })
    expect(blocked.moves).toBe(0)
    expect(blocked.history).toHaveLength(0)
  })

  it('pushes a crate into empty floor', () => {
    const game = move(['######', '#@$ .#', '######'], 'right')

    expect(game.player).toEqual({ row: 1, col: 2 })
    expect(game.crates).toEqual([{ row: 1, col: 3 }])
    expect(game.moves).toBe(1)
    expect(game.history).toHaveLength(1)
  })

  it('blocks a crate push into a wall or second crate', () => {
    const wallGame = startGame(['######', '#@$###', '# .  #', '######'])
    const wallBlocked = movePlayer(wallGame, 'right')

    expect(wallBlocked).toBe(wallGame)
    expect(wallBlocked.player).toEqual({ row: 1, col: 1 })
    expect(wallBlocked.crates).toEqual([{ row: 1, col: 2 }])
    expect(wallBlocked.moves).toBe(0)
    expect(wallBlocked.history).toHaveLength(0)

    const crateGame = startGame(['######', '#@$$.#', '######'])
    const crateBlocked = movePlayer(crateGame, 'right')

    expect(crateBlocked).toBe(crateGame)
    expect(crateBlocked.player).toEqual({ row: 1, col: 1 })
    expect(crateBlocked.crates).toEqual([
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ])
    expect(crateBlocked.moves).toBe(0)
    expect(crateBlocked.history).toHaveLength(0)
  })

  it('detects a win when all targets contain crates', () => {
    const game = move(['#####', '#@$.#', '#####'], 'right')

    expect(game.won).toBe(true)
    expect(game.crates).toEqual([{ row: 1, col: 3 }])
    expect(movePlayer(game, 'left')).toBe(game)
  })

  it('undo restores previous player, crates, moves, and history length', () => {
    const game = startGame(['######', '#@  $#', '#  . #', '######'])
    const movedOnce = movePlayer(game, 'right')
    const movedTwice = movePlayer(movedOnce, 'right')
    const undone = undoMove(movedTwice)

    expect(undone.player).toEqual(movedOnce.player)
    expect(undone.crates).toEqual(movedOnce.crates)
    expect(undone.moves).toBe(movedOnce.moves)
    expect(undone.won).toBe(movedOnce.won)
    expect(undone.history).toHaveLength(1)
  })

  it('restart restores initial player/crates/moves/history', () => {
    const game = startGame(['######', '#@  $#', '#  . #', '######'])
    const moved = movePlayer(movePlayer(game, 'right'), 'right')
    const restarted = restartGame(moved)

    expect(restarted.level).toBe(game.level)
    expect(restarted.player).toEqual({ row: 1, col: 1 })
    expect(restarted.crates).toEqual([{ row: 1, col: 4 }])
    expect(restarted.moves).toBe(0)
    expect(restarted.history).toHaveLength(0)
    expect(restarted.won).toBe(false)
  })
})
