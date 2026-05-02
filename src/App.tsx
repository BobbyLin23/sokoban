import { Controls } from './components/Controls'
import { FailureModal } from './components/FailureModal'
import { GameBoard } from './components/GameBoard'
import { GameHeader } from './components/GameHeader'
import { WinPanel } from './components/WinPanel'
import { useSokobanGame } from './hooks/useSokobanGame'

function App() {
  const {
    board,
    changeDifficulty,
    currentDifficulty,
    currentLevel,
    difficultyOptions,
    gameState,
    isLastLevel,
    levelCount,
    levelIndex,
    move,
    nextLevel,
    resetLevel,
    restartGame,
  } = useSokobanGame()

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_15%_10%,oklch(0.91_0.08_150),transparent_30%),linear-gradient(135deg,oklch(0.96_0.035_85),oklch(0.9_0.035_115))] px-4 py-5 text-stone-900 sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100svh-2.5rem)] w-full max-w-6xl flex-col gap-5">
        <GameHeader
          levelCount={levelCount}
          levelIndex={levelIndex}
          levelName={currentLevel.name}
          currentDifficulty={currentDifficulty}
          difficultyOptions={difficultyOptions}
          onDifficultyChange={changeDifficulty}
          onResetLevel={resetLevel}
          onRestartGame={restartGame}
          steps={gameState.steps}
        />

        <div className="grid flex-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <GameBoard board={board} />

          <div className="flex flex-col gap-4 lg:self-center">
            {gameState.completed ? (
              <WinPanel
                isLastLevel={isLastLevel}
                onNextLevel={nextLevel}
                onRestartGame={restartGame}
                steps={gameState.steps}
              />
            ) : (
              <section className="rounded-xl border border-stone-950/10 bg-white/60 p-4 shadow-sm backdrop-blur">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-stone-500">Objective</p>
                <p className="mt-2 text-base font-semibold leading-snug text-stone-800">
                  Push every box onto a dashed target. Use arrow keys, WASD, or the pad below.
                </p>
              </section>
            )}

            <Controls onMove={move} />
          </div>
        </div>
      </div>

      {gameState.failed && <FailureModal onRestart={resetLevel} />}
    </main>
  )
}

export default App
