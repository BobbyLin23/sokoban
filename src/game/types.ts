export type Direction = 'up' | 'down' | 'left' | 'right'

export type Point = {
  row: number
  col: number
}

export type Tile = 'wall' | 'floor' | 'target'

export type LevelDefinition = {
  id: number
  title: string
  map: string[]
}

export type ParsedLevel = {
  id: number
  title: string
  rows: number
  cols: number
  tiles: Tile[][]
  targets: Point[]
  initialPlayer: Point
  initialCrates: Point[]
}

export type GameSnapshot = {
  player: Point
  crates: Point[]
  moves: number
  won: boolean
}

export type GameState = GameSnapshot & {
  level: ParsedLevel
  history: GameSnapshot[]
}

export type BestResult = {
  moves: number
  seconds: number
}

export type ProgressState = {
  highestUnlockedLevel: number
  selectedLevel: number
  soundEnabled: boolean
  bestResults: Record<number, BestResult>
}
