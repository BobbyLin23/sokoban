import type { Difficulty } from '../game/types'

type GameHeaderProps = {
  currentDifficulty: Difficulty
  difficultyOptions: Difficulty[]
  levelIndex: number
  levelCount: number
  levelName: string
  onDifficultyChange: (difficulty: Difficulty) => void
  steps: number
  onResetLevel: () => void
  onRestartGame: () => void
}

export function GameHeader({
  currentDifficulty,
  difficultyOptions,
  levelCount,
  levelIndex,
  levelName,
  onDifficultyChange,
  onResetLevel,
  onRestartGame,
  steps,
}: GameHeaderProps) {
  return (
    <header className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-800">Push Box</p>
        <h1 className="mt-1 text-3xl font-black leading-tight text-stone-950 sm:text-5xl">Sokoban</h1>
      </div>

      <div className="grid grid-cols-2 gap-2 text-left sm:grid-cols-3">
        <Stat label="Difficulty" value={currentDifficulty} />
        <Stat label="Level" value={`${levelIndex + 1}/${levelCount}`} />
        <Stat label="Room" value={levelName} />
        <Stat label="Steps" value={steps.toString()} />
      </div>

      <div className="flex flex-col gap-2 sm:self-center">
        <div className="difficulty-toggle" aria-label="Choose difficulty">
          {difficultyOptions.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              className={difficulty === currentDifficulty ? 'is-active' : ''}
              aria-pressed={difficulty === currentDifficulty}
              onClick={() => onDifficultyChange(difficulty)}
            >
              {difficulty}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" className="secondary-button" onClick={onResetLevel}>
            Reset
          </button>
          <button type="button" className="secondary-button" onClick={onRestartGame}>
            Restart
          </button>
        </div>
      </div>
    </header>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-950/10 bg-white/65 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-stone-500">{label}</p>
      <p className="mt-0.5 max-w-28 truncate text-sm font-black text-stone-950">{value}</p>
    </div>
  )
}
