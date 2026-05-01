import type { Direction } from '../game/types'

type ControlsProps = {
  canUndo: boolean
  onMove: (direction: Direction) => void
  onUndo: () => void
  onRestart: () => void
}

const moveButtonClass =
  'flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/15 text-xl font-black text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.22)] transition hover:bg-cyan-400/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-40'

const commandButtonClass =
  'rounded-xl bg-slate-800 px-4 py-3 font-bold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-40'

export function Controls({ canUndo, onMove, onUndo, onRestart }: ControlsProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 md:w-72">
      <div className="grid grid-cols-3 gap-2" aria-label="Movement controls">
        <span aria-hidden="true" />
        <button
          className={moveButtonClass}
          type="button"
          aria-label="Move up"
          onClick={() => onMove('up')}
        >
          ↑
        </button>
        <span aria-hidden="true" />
        <button
          className={moveButtonClass}
          type="button"
          aria-label="Move left"
          onClick={() => onMove('left')}
        >
          ←
        </button>
        <button
          className={moveButtonClass}
          type="button"
          aria-label="Move down"
          onClick={() => onMove('down')}
        >
          ↓
        </button>
        <button
          className={moveButtonClass}
          type="button"
          aria-label="Move right"
          onClick={() => onMove('right')}
        >
          →
        </button>
      </div>
      <div className="grid w-full grid-cols-2 gap-3">
        <button className={commandButtonClass} type="button" onClick={onUndo} disabled={!canUndo}>
          Undo
        </button>
        <button
          className="rounded-xl bg-rose-500/20 px-4 py-3 font-bold text-rose-100 transition hover:bg-rose-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          type="button"
          onClick={onRestart}
        >
          Restart
        </button>
      </div>
    </div>
  )
}
