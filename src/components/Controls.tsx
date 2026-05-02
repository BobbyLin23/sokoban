import type { Direction } from '../game/types'

type ControlsProps = {
  onMove: (direction: Direction) => void
}

const controlButtons: Array<{ direction: Direction; label: string; symbol: string; className: string }> = [
  { direction: 'up', label: 'Move up', symbol: '↑', className: 'col-start-2 row-start-1' },
  { direction: 'left', label: 'Move left', symbol: '←', className: 'col-start-1 row-start-2' },
  { direction: 'down', label: 'Move down', symbol: '↓', className: 'col-start-2 row-start-2' },
  { direction: 'right', label: 'Move right', symbol: '→', className: 'col-start-3 row-start-2' },
]

export function Controls({ onMove }: ControlsProps) {
  return (
    <section className="control-pad" aria-label="Movement controls">
      {controlButtons.map((button) => (
        <button
          key={button.direction}
          type="button"
          aria-label={button.label}
          className={`control-button ${button.className}`}
          onClick={() => onMove(button.direction)}
        >
          {button.symbol}
        </button>
      ))}
    </section>
  )
}
