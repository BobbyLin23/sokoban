import { formatSeconds } from '../game/format'
import type { BestResult, LevelDefinition } from '../game/types'

type LevelSelectProps = {
  open: boolean
  levels: LevelDefinition[]
  currentLevel: number
  highestUnlockedLevel: number
  bestResults: Record<number, BestResult>
  onSelect: (levelId: number) => void
  onClose: () => void
}

export function LevelSelect({
  open,
  levels,
  currentLevel,
  highestUnlockedLevel,
  bestResults,
  onSelect,
  onClose,
}: LevelSelectProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 p-4"
      role="presentation"
    >
      <section
        className="max-h-[86svh] w-full max-w-2xl overflow-auto rounded-2xl border border-cyan-400/20 bg-slate-950 p-5 shadow-[0_0_50px_rgba(34,211,238,0.22)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-select-title"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="level-select-title" className="text-xl font-black text-white">
            Campaign
          </h2>
          <button
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {levels.map((level) => {
            const locked = level.id > highestUnlockedLevel
            const best = bestResults[level.id]
            const stateLabel = locked
              ? 'Locked'
              : currentLevel === level.id
                ? 'Current'
                : 'Unlocked'

            return (
              <button
                key={level.id}
                className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left text-white transition hover:border-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
                type="button"
                disabled={locked}
                aria-current={currentLevel === level.id ? 'true' : undefined}
                onClick={() => onSelect(level.id)}
              >
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  {stateLabel}
                </span>
                <strong className="mt-1 block">
                  {level.id}. {level.title}
                </strong>
                <span className="mt-2 block text-sm text-slate-400">
                  {best
                    ? `Best ${best.moves} moves / ${formatSeconds(best.seconds)}`
                    : 'No clear yet'}
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
