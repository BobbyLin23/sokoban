import { formatSeconds } from '../game/format'
import type { BestResult } from '../game/types'

type HudProps = {
  levelTitle: string
  levelId: number
  moves: number
  seconds: number
  best?: BestResult
  soundEnabled: boolean
  onToggleSound: () => void
  onOpenLevels: () => void
}

const statClass = 'rounded-xl bg-slate-900 px-3 py-2'
const buttonStatClass =
  'rounded-xl bg-slate-900 px-3 py-2 text-left transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300'

export function Hud({
  levelTitle,
  levelId,
  moves,
  seconds,
  best,
  soundEnabled,
  onToggleSound,
  onOpenLevels,
}: HudProps) {
  return (
    <header className="flex w-full flex-col gap-4 rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4 shadow-[0_0_32px_rgba(59,130,246,0.14)] md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Sokoban
        </p>
        <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">
          {levelId}. {levelTitle}
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-slate-200 sm:grid-cols-4">
        <div className={statClass}>
          <span className="block text-xs text-slate-400">Moves</span>
          <strong>{moves}</strong>
        </div>
        <div className={statClass}>
          <span className="block text-xs text-slate-400">Time</span>
          <strong>{formatSeconds(seconds)}</strong>
        </div>
        <button className={buttonStatClass} type="button" onClick={onOpenLevels}>
          <span className="block text-xs text-slate-400">Best</span>
          <strong>{best ? `${best.moves} / ${formatSeconds(best.seconds)}` : 'New'}</strong>
        </button>
        <button
          className={buttonStatClass}
          type="button"
          aria-pressed={soundEnabled}
          onClick={onToggleSound}
        >
          <span className="block text-xs text-slate-400">Sound</span>
          <strong>{soundEnabled ? 'On' : 'Off'}</strong>
        </button>
      </div>
    </header>
  )
}
