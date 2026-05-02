import type { CellBase, CellView, Direction, GameState, Level, ParsedLevel, Point } from './types'

const directionVectors: Record<Direction, Point> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
}

const pointKey = (point: Point) => `${point.row}:${point.col}`

const samePoint = (a: Point, b: Point) => a.row === b.row && a.col === b.col

const addPoints = (a: Point, b: Point): Point => ({ row: a.row + b.row, col: a.col + b.col })

const isInside = (level: ParsedLevel, point: Point) =>
  point.row >= 0 &&
  point.row < level.map.length &&
  point.col >= 0 &&
  point.col < level.map[point.row].length

export function parseLevel(level: Level): ParsedLevel {
  const width = Math.max(...level.rows.map((row) => row.length))
  let playerStart: Point | undefined
  const boxStarts: Point[] = []
  let targetCount = 0

  const map = level.rows.map((sourceRow, rowIndex) => {
    const cells: CellBase[] = []

    for (let colIndex = 0; colIndex < width; colIndex += 1) {
      const char = sourceRow[colIndex] ?? ' '
      let base: CellBase = 'floor'

      if (char === '#') {
        base = 'wall'
      }

      if (char === '.' || char === '*' || char === '+') {
        base = 'target'
        targetCount += 1
      }

      if (char === '@' || char === '+') {
        playerStart = { row: rowIndex, col: colIndex }
      }

      if (char === '$' || char === '*') {
        boxStarts.push({ row: rowIndex, col: colIndex })
      }

      cells.push(base)
    }

    return cells
  })

  if (!playerStart) {
    throw new Error(`Level "${level.id}" is missing a player start.`)
  }

  if (boxStarts.length === 0 || targetCount < boxStarts.length) {
    throw new Error(`Level "${level.id}" needs at least one target per box.`)
  }

  return {
    id: level.id,
    name: level.name,
    map,
    playerStart,
    boxStarts,
    targetCount,
  }
}

export function createGameState(level: Level): GameState {
  const parsed = parseLevel(level)

  return {
    level: parsed,
    player: parsed.playerStart,
    boxes: [...parsed.boxStarts],
    steps: 0,
    completed: isSolved(parsed, parsed.boxStarts),
    failed: false,
  }
}

export function movePlayer(state: GameState, direction: Direction): GameState {
  if (state.completed || state.failed) {
    return state
  }

  const vector = directionVectors[direction]
  const nextPlayer = addPoints(state.player, vector)

  if (!isWalkable(state.level, nextPlayer)) {
    return state
  }

  const pushedBoxIndex = state.boxes.findIndex((box) => samePoint(box, nextPlayer))

  if (pushedBoxIndex === -1) {
    return {
      ...state,
      player: nextPlayer,
      steps: state.steps + 1,
    }
  }

  const nextBox = addPoints(nextPlayer, vector)

  if (!isWalkable(state.level, nextBox) || state.boxes.some((box) => samePoint(box, nextBox))) {
    return state
  }

  const boxes = state.boxes.map((box, index) => (index === pushedBoxIndex ? nextBox : box))
  const completed = isSolved(state.level, boxes)

  return {
    ...state,
    player: nextPlayer,
    boxes,
    steps: state.steps + 1,
    completed,
    failed: !completed && isFailed(state.level, boxes),
  }
}

export function getBoardView(state: GameState): CellView[][] {
  const boxKeys = new Set(state.boxes.map(pointKey))
  const playerKey = pointKey(state.player)

  return state.level.map.map((row, rowIndex) =>
    row.map((base, colIndex) => {
      const key = `${rowIndex}:${colIndex}`

      return {
        base,
        hasPlayer: key === playerKey,
        hasBox: boxKeys.has(key),
      }
    }),
  )
}

export function getProgressKey(levelIndex: number | string) {
  return `sokoban-progress:${levelIndex}`
}

export function encodeState(state: GameState) {
  return JSON.stringify({
    player: state.player,
    boxes: state.boxes,
    steps: state.steps,
    completed: state.completed,
    failed: state.failed,
  })
}

export function restoreState(level: Level, encoded: string | null): GameState {
  const freshState = createGameState(level)

  if (!encoded) {
    return freshState
  }

  try {
    const saved = JSON.parse(encoded) as Partial<GameState>

    if (
      isPoint(saved.player) &&
      Array.isArray(saved.boxes) &&
      saved.boxes.every(isPoint) &&
      typeof saved.steps === 'number'
    ) {
      const boxes = saved.boxes

      return {
        ...freshState,
        player: saved.player,
        boxes,
        steps: saved.steps,
        completed: isSolved(freshState.level, boxes),
        failed: Boolean(saved.failed) && !isSolved(freshState.level, boxes),
      }
    }
  } catch {
    return freshState
  }

  return freshState
}

function isWalkable(level: ParsedLevel, point: Point) {
  return isInside(level, point) && level.map[point.row][point.col] !== 'wall'
}

function isSolved(level: ParsedLevel, boxes: Point[]) {
  const targetKeys = new Set<string>()

  level.map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 'target') {
        targetKeys.add(`${rowIndex}:${colIndex}`)
      }
    })
  })

  return boxes.every((box) => targetKeys.has(pointKey(box)))
}

function isFailed(level: ParsedLevel, boxes: Point[]) {
  const boxKeys = new Set(boxes.map(pointKey))

  return boxes.some((box) => {
    if (level.map[box.row][box.col] === 'target') {
      return false
    }

    const blockedUp = isBlocked(level, boxKeys, addPoints(box, directionVectors.up))
    const blockedDown = isBlocked(level, boxKeys, addPoints(box, directionVectors.down))
    const blockedLeft = isBlocked(level, boxKeys, addPoints(box, directionVectors.left))
    const blockedRight = isBlocked(level, boxKeys, addPoints(box, directionVectors.right))

    return (blockedUp || blockedDown) && (blockedLeft || blockedRight)
  })
}

function isBlocked(level: ParsedLevel, boxKeys: Set<string>, point: Point) {
  return !isInside(level, point) || level.map[point.row][point.col] === 'wall' || boxKeys.has(pointKey(point))
}

function isPoint(value: unknown): value is Point {
  return (
    typeof value === 'object' &&
    value !== null &&
    'row' in value &&
    'col' in value &&
    typeof value.row === 'number' &&
    typeof value.col === 'number'
  )
}
