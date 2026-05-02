type WinPanelProps = {
  isLastLevel: boolean
  onNextLevel: () => void
  onRestartGame: () => void
  steps: number
}

export function WinPanel({ isLastLevel, onNextLevel, onRestartGame, steps }: WinPanelProps) {
  return (
    <aside className="win-panel" role="status" aria-live="polite">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">Cleared</p>
        <h2 className="mt-1 text-2xl font-black text-stone-950">
          {isLastLevel ? 'Every room is solved.' : 'All boxes are home.'}
        </h2>
        <p className="mt-2 text-sm text-stone-700">Finished in {steps} steps.</p>
      </div>

      <button type="button" className="primary-button" onClick={isLastLevel ? onRestartGame : onNextLevel}>
        {isLastLevel ? 'Play again' : 'Next level'}
      </button>
    </aside>
  )
}
