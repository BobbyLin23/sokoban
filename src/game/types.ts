export type CellBase = 'wall' | 'floor' | 'target'

export type Direction = 'up' | 'down' | 'left' | 'right'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Point = {
  row: number
  col: number
}

export type Level = {
  id: string
  name: string
  rows: string[]
}

export type ParsedLevel = {
  id: string
  name: string
  map: CellBase[][]
  playerStart: Point
  boxStarts: Point[]
  targetCount: number
}

export type GameState = {
  level: ParsedLevel
  player: Point
  boxes: Point[]
  steps: number
  completed: boolean
  failed: boolean
}

export type CellView = {
  base: CellBase
  hasPlayer: boolean
  hasBox: boolean
}
