import type { CellView } from '../game/types'

type CellProps = {
  cell: CellView
}

export function Cell({ cell }: CellProps) {
  const classes = [
    'relative aspect-square min-w-0 rounded-[0.45rem] border text-[clamp(1rem,6vw,2.4rem)] transition-transform duration-150',
    cell.base === 'wall'
      ? 'border-stone-950/20 bg-stone-800 shadow-[inset_0_-5px_0_rgba(0,0,0,0.22)]'
      : 'border-stone-950/10 bg-stone-100',
    cell.base === 'target' ? 'bg-amber-100' : '',
    cell.hasBox ? 'box-cell' : '',
    cell.hasPlayer ? 'player-cell' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} aria-label={getCellLabel(cell)}>
      {cell.base === 'target' && (
        <span className="absolute inset-[28%] rounded-full border-2 border-dashed border-amber-500/75" />
      )}
      {cell.hasBox && (
        <span className="absolute inset-[14%] grid place-items-center rounded-[0.35rem] border border-orange-950/25 bg-orange-500 text-[0.55em] font-black text-orange-950 shadow-[inset_0_-5px_0_rgba(124,45,18,0.24),0_8px_16px_rgba(124,45,18,0.16)]">
          {cell.base === 'target' ? '✓' : ''}
        </span>
      )}
      {cell.hasPlayer && (
        <span className="absolute inset-[17%] rounded-full border border-emerald-950/20 bg-emerald-500 shadow-[inset_0_-4px_0_rgba(6,78,59,0.28),0_6px_14px_rgba(6,95,70,0.18)]">
          <span className="absolute left-[28%] top-[28%] h-[13%] w-[13%] rounded-full bg-emerald-950" />
          <span className="absolute right-[28%] top-[28%] h-[13%] w-[13%] rounded-full bg-emerald-950" />
        </span>
      )}
    </div>
  )
}

function getCellLabel(cell: CellView) {
  if (cell.hasPlayer) {
    return 'Player'
  }

  if (cell.hasBox && cell.base === 'target') {
    return 'Box on target'
  }

  if (cell.hasBox) {
    return 'Box'
  }

  if (cell.base === 'target') {
    return 'Target'
  }

  return cell.base === 'wall' ? 'Wall' : 'Floor'
}
