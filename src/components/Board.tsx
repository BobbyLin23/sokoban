import { getTile, hasCrate } from '../game/gameEngine'
import type { GameState, Point, Tile } from '../game/types'

type BoardProps = {
  game: GameState
}

const pointKey = (point: Point) => `${point.row}:${point.col}`

const isSamePoint = (a: Point, b: Point) => a.row === b.row && a.col === b.col

const getCellLabel = ({
  tile,
  target,
  crate,
  player,
}: {
  tile: Tile
  target: boolean
  crate: boolean
  player: boolean
}) => {
  if (player && target) {
    return 'Player on target'
  }

  if (player) {
    return 'Player'
  }

  if (crate && target) {
    return 'Crate on target'
  }

  if (crate) {
    return 'Crate'
  }

  if (target) {
    return 'Target'
  }

  return tile === 'wall' ? 'Wall' : 'Floor'
}

export function Board({ game }: BoardProps) {
  const targetKeys = new Set(game.level.targets.map(pointKey))

  return (
    <div
      className="grid max-h-[min(68svh,720px)] max-w-[min(92vw,720px)] touch-none gap-1 rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-2 shadow-[0_0_40px_rgba(34,211,238,0.16)]"
      style={{
        gridTemplateColumns: `repeat(${game.level.cols}, minmax(0, 1fr))`,
        aspectRatio: `${game.level.cols} / ${game.level.rows}`,
      }}
      role="grid"
      aria-label={`Level ${game.level.id}: ${game.level.title}`}
    >
      {Array.from({ length: game.level.rows * game.level.cols }, (_, index) => {
        const point = {
          row: Math.floor(index / game.level.cols),
          col: index % game.level.cols,
        }
        const tile = getTile(game.level, point)
        const crate = hasCrate(game, point)
        const target = targetKeys.has(pointKey(point))
        const player = isSamePoint(game.player, point)
        const solvedCrate = crate && target

        const className = [
          'relative aspect-square min-h-0 min-w-0 overflow-hidden rounded-md border transition-transform duration-150',
          tile === 'wall'
            ? 'border-slate-500/30 bg-slate-700 shadow-inner shadow-slate-950/80'
            : 'border-slate-800/80 bg-slate-900',
          target
            ? 'after:absolute after:left-1/2 after:top-1/2 after:h-1/2 after:w-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-emerald-400/70 after:shadow-[0_0_16px_rgba(52,211,153,0.8)]'
            : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div
            key={pointKey(point)}
            className={className}
            role="gridcell"
            aria-label={getCellLabel({ tile, target, crate, player })}
          >
            {crate && (
              <div
                className={[
                  'absolute inset-[12%] z-10 rounded-md border shadow-[0_0_16px_rgba(245,158,11,0.55)]',
                  solvedCrate
                    ? 'border-emerald-100/70 bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.75)]'
                    : 'border-amber-200/50 bg-amber-400',
                ].join(' ')}
              />
            )}
            {player && (
              <div className="absolute inset-[18%] z-20 rounded-full border border-cyan-100/80 bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
            )}
          </div>
        )
      })}
    </div>
  )
}
