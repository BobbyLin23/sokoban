import type {
  Direction,
  GameSnapshot,
  GameState,
  LevelDefinition,
  ParsedLevel,
  Point,
  Tile,
} from './types'

const WALKABLE_TILES = new Set<Tile>(['floor', 'target'])

const DIRECTIONS: Record<Direction, Point> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
}

export function parseLevel(level: LevelDefinition): ParsedLevel {
  if (level.map.length === 0) {
    throw new Error('Level map must not be empty')
  }

  const cols = level.map[0].length

  if (cols === 0) {
    throw new Error('Level map rows must not be empty')
  }

  const tiles: Tile[][] = []
  const targets: Point[] = []
  const crates: Point[] = []
  let player: Point | undefined

  level.map.forEach((line, row) => {
    if (line.length !== cols) {
      throw new Error('Level map must be rectangular')
    }

    const tileRow: Tile[] = []

    Array.from(line).forEach((char, col) => {
      const point = { row, col }

      switch (char) {
        case '#':
          tileRow.push('wall')
          break
        case ' ':
          tileRow.push('floor')
          break
        case '.':
          tileRow.push('target')
          targets.push(point)
          break
        case '$':
          tileRow.push('floor')
          crates.push(point)
          break
        case '*':
          tileRow.push('target')
          targets.push(point)
          crates.push(point)
          break
        case '@':
          if (player) {
            throw new Error('Level map must contain exactly one player')
          }
          tileRow.push('floor')
          player = point
          break
        case '+':
          if (player) {
            throw new Error('Level map must contain exactly one player')
          }
          tileRow.push('target')
          targets.push(point)
          player = point
          break
        default:
          throw new Error(`Invalid level map character: ${char}`)
      }
    })

    tiles.push(tileRow)
  })

  if (!player) {
    throw new Error('Level map must contain exactly one player')
  }

  if (targets.length === 0) {
    throw new Error('Level map must contain at least one target')
  }

  if (crates.length === 0) {
    throw new Error('Level map must contain at least one crate')
  }

  return {
    id: level.id,
    title: level.title,
    rows: level.map.length,
    cols,
    tiles,
    targets,
    initialPlayer: player,
    initialCrates: crates,
  }
}

export function createGame(level: ParsedLevel): GameState {
  const snapshot = createSnapshot(level.initialPlayer, level.initialCrates, 0, isWonByCrates(level, level.initialCrates))

  return {
    ...snapshot,
    level,
    history: [],
  }
}

export function isWon(game: GameState): boolean {
  return isWonByCrates(game.level, game.crates)
}

export function getTile(level: ParsedLevel, point: Point): Tile | undefined {
  return level.tiles[point.row]?.[point.col]
}

export function hasCrate(game: GameState, point: Point): boolean {
  return game.crates.some((crate) => isSamePoint(crate, point))
}

export function movePlayer(game: GameState, direction: Direction): GameState {
  if (game.won) {
    return game
  }

  const delta = DIRECTIONS[direction]
  const nextPlayer = addPoints(game.player, delta)
  const nextTile = getTile(game.level, nextPlayer)

  if (!nextTile || !WALKABLE_TILES.has(nextTile)) {
    return game
  }

  const crateIndex = game.crates.findIndex((crate) => isSamePoint(crate, nextPlayer))
  let nextCrates = game.crates

  if (crateIndex !== -1) {
    const pushedCrate = addPoints(nextPlayer, delta)
    const pushedTile = getTile(game.level, pushedCrate)

    if (!pushedTile || !WALKABLE_TILES.has(pushedTile) || hasCrate(game, pushedCrate)) {
      return game
    }

    nextCrates = game.crates.map((crate, index) => (index === crateIndex ? pushedCrate : crate))
  }

  const previousSnapshot = createSnapshot(game.player, game.crates, game.moves, game.won)
  const won = isWonByCrates(game.level, nextCrates)

  return {
    level: game.level,
    player: nextPlayer,
    crates: nextCrates,
    moves: game.moves + 1,
    won,
    history: [...game.history, previousSnapshot],
  }
}

export function undoMove(game: GameState): GameState {
  const previousSnapshot = game.history.at(-1)

  if (!previousSnapshot) {
    return game
  }

  return {
    level: game.level,
    player: previousSnapshot.player,
    crates: previousSnapshot.crates,
    moves: previousSnapshot.moves,
    won: previousSnapshot.won,
    history: game.history.slice(0, -1),
  }
}

export function restartGame(game: GameState): GameState {
  return createGame(game.level)
}

function createSnapshot(player: Point, crates: Point[], moves: number, won: boolean): GameSnapshot {
  return {
    player: { ...player },
    crates: crates.map((crate) => ({ ...crate })),
    moves,
    won,
  }
}

function isWonByCrates(level: ParsedLevel, crates: Point[]): boolean {
  return level.targets.every((target) => crates.some((crate) => isSamePoint(crate, target)))
}

function addPoints(point: Point, delta: Point): Point {
  return {
    row: point.row + delta.row,
    col: point.col + delta.col,
  }
}

function isSamePoint(a: Point, b: Point): boolean {
  return a.row === b.row && a.col === b.col
}
