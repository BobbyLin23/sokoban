import { Cell } from './Cell'
import type { CellView } from '../game/types'

type GameBoardProps = {
  board: CellView[][]
}

export function GameBoard({ board }: GameBoardProps) {
  const columns = board[0]?.length ?? 1

  return (
    <section className="board-shell" aria-label="Sokoban board">
      <div className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => <Cell key={`${rowIndex}-${colIndex}`} cell={cell} />),
        )}
      </div>
    </section>
  )
}
