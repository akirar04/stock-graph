import { useWatchlistStore } from '@/store/watchlistStore'
import { useTerminalStore } from '@/store/terminalStore'

export function QuoteStrip() {
  const entries = useWatchlistStore((s) => s.entries)
  const setActiveTicker = useTerminalStore((s) => s.setActiveTicker)

  return (
    <div className="flex items-center gap-1 pl-20 pr-2 h-9 bg-terminal-surface border-b border-terminal-border overflow-x-auto shrink-0"
         style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      <span className="text-terminal-text-secondary font-ui text-[10px] uppercase tracking-widest mr-2 select-none"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        Terminal
      </span>
      {entries.map((entry) => {
        const isPositive = entry.changePercent >= 0
        return (
          <button
            key={entry.ticker}
            onClick={() => setActiveTicker(entry.ticker)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-data
                       hover:bg-terminal-surface-hover transition-colors cursor-pointer
                       border-none bg-transparent whitespace-nowrap"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <span className="text-terminal-text-primary font-medium">{entry.ticker}</span>
            <span className="text-terminal-text-secondary">{entry.price.toFixed(2)}</span>
            <span className={isPositive ? 'text-terminal-positive' : 'text-terminal-negative'}>
              {isPositive ? '+' : ''}{entry.changePercent.toFixed(2)}%
            </span>
          </button>
        )
      })}
    </div>
  )
}
