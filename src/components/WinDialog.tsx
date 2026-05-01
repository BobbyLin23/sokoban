import { formatSeconds } from '../game/format'

type WinDialogProps = {
  open: boolean
  levelId: number
  isLastLevel: boolean
  moves: number
  seconds: number
  onNext: () => void
  onRetry: () => void
  onLevels: () => void
}

export function WinDialog({
  open,
  levelId,
  isLastLevel,
  moves,
  seconds,
  onNext,
  onRetry,
  onLevels,
}: WinDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <section
        className="w-full max-w-md rounded-2xl border border-emerald-300/30 bg-slate-950 p-6 text-center shadow-[0_0_48px_rgba(52,211,153,0.25)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="win-dialog-title"
      >
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">
          Level {levelId} cleared
        </p>
        <h2 id="win-dialog-title" className="mt-2 text-3xl font-black text-white">
          Shift complete
        </h2>
        <p className="mt-3 text-slate-300">
          {moves} moves in {formatSeconds(seconds)}
        </p>
        <div className="mt-6 grid gap-3">
          {!isLastLevel && (
            <button
              className="rounded-xl bg-emerald-400 px-4 py-3 font-black text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-100"
              type="button"
              onClick={onNext}
            >
              Next Level
            </button>
          )}
          <button
            className="rounded-xl bg-slate-800 px-4 py-3 font-bold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            type="button"
            onClick={onRetry}
          >
            Retry
          </button>
          <button
            className="rounded-xl bg-slate-800 px-4 py-3 font-bold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            type="button"
            onClick={onLevels}
          >
            Level Select
          </button>
        </div>
      </section>
    </div>
  )
}
