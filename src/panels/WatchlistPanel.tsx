import { useWatchlistStore } from '@/store/watchlistStore'
import { useTerminalStore } from '@/store/terminalStore'

export function WatchlistPanel() {
  const entries = useWatchlistStore((s) => s.entries)
  const activeTicker = useTerminalStore((s) => s.activeTicker)
  const setActiveTicker = useTerminalStore((s) => s.setActiveTicker)

  return (
    <div className="flex flex-col h-full bg-terminal-surface overflow-hidden">
      <div className="flex items-center px-3 h-8 border-b border-terminal-border shrink-0">
        <span className="font-ui text-[10px] uppercase tracking-widest text-terminal-text-secondary">
          Watchlist
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs font-data border-collapse">
          <thead>
            <tr className="text-terminal-text-secondary">
              <th className="text-left px-3 py-1.5 font-medium sticky top-0 bg-terminal-surface">Ticker</th>
              <th className="text-right px-3 py-1.5 font-medium sticky top-0 bg-terminal-surface">Last</th>
              <th className="text-right px-3 py-1.5 font-medium sticky top-0 bg-terminal-surface">Chg%</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isPositive = entry.changePercent >= 0
              const isActive = entry.ticker === activeTicker
              return (
                <tr
                  key={entry.ticker}
                  onClick={() => setActiveTicker(entry.ticker)}
                  className={`cursor-pointer transition-colors border-b border-terminal-border/30
                    ${isActive
                      ? 'bg-terminal-accent/10'
                      : 'hover:bg-terminal-surface-hover'
                    }`}
                >
                  <td className="px-3 py-1.5">
                    <div className="flex flex-col">
                      <span className={`font-medium ${isActive ? 'text-terminal-accent' : 'text-terminal-text-primary'}`}>
                        {entry.ticker}
                      </span>
                      <span className="text-[10px] text-terminal-text-secondary truncate max-w-[120px]">
                        {entry.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-3 py-1.5 text-terminal-text-primary tabular-nums">
                    {entry.price.toFixed(2)}
                  </td>
                  <td className={`text-right px-3 py-1.5 tabular-nums ${isPositive ? 'text-terminal-positive' : 'text-terminal-negative'}`}>
                    {isPositive ? '+' : ''}{entry.changePercent.toFixed(2)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
