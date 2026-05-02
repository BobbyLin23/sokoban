type FailureModalProps = {
  onRestart: () => void
}

export function FailureModal({ onRestart }: FailureModalProps) {
  return (
    <div className="failure-backdrop" role="presentation">
      <section className="failure-modal" role="dialog" aria-modal="true" aria-labelledby="failure-title">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-800">Level failed</p>
        <h2 id="failure-title" className="mt-2 text-2xl font-black text-stone-950">
          you are failed, please restart the game
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-700">
          A box is locked in a corner and cannot reach any target from here.
        </p>
        <button type="button" className="primary-button mt-5 w-full" autoFocus onClick={onRestart}>
          Restart game
        </button>
      </section>
    </div>
  )
}
