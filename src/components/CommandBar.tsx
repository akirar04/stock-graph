import { Command } from 'cmdk'
import { useEffect, useRef, useState } from 'react'
import { useTerminalStore, type Timeframe } from '@/store/terminalStore'
import { useWatchlistStore } from '@/store/watchlistStore'
import { allTickers } from '@/data/mockData'

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']

export function CommandBar() {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const setActiveTicker = useTerminalStore((s) => s.setActiveTicker)
  const setTimeframe = useTerminalStore((s) => s.setTimeframe)
  const entries = useWatchlistStore((s) => s.entries)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleSubmit() {
    const parts = value.trim().toUpperCase().split(/\s+/)
    if (parts.length === 0 || !parts[0]) return

    const ticker = parts[0]
    setActiveTicker(ticker)

    if (parts[1] && TIMEFRAMES.includes(parts[1] as Timeframe)) {
      setTimeframe(parts[1] as Timeframe)
    }

    setValue('')
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleSelect(ticker: string) {
    setActiveTicker(ticker)
    setValue('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const tickerList = [
    ...entries.map((e) => e.ticker),
    ...allTickers.filter((t) => !entries.find((e) => e.ticker === t)),
  ]

  return (
    <div className="relative shrink-0 border-t border-terminal-border bg-terminal-surface">
      <Command shouldFilter={true} className="w-full">
        <div className="flex items-center h-9 px-3 gap-2">
          <span className="text-terminal-accent font-data text-xs select-none">&gt;</span>
          <Command.Input
            ref={inputRef}
            value={value}
            onValueChange={setValue}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder="Type a ticker... (Cmd+K)"
            className="flex-1 bg-transparent border-none outline-none text-terminal-text-primary
                       font-data text-xs placeholder:text-terminal-text-secondary"
          />
          <span className="text-terminal-text-secondary text-[10px] font-data select-none">
            {open ? 'ESC to close' : '\u2318K'}
          </span>
        </div>
        {open && value.length > 0 && (
          <Command.List className="absolute bottom-full left-0 right-0 max-h-48 overflow-y-auto
                                   bg-terminal-surface border border-terminal-border rounded-t
                                   shadow-lg shadow-black/30">
            <Command.Empty className="px-3 py-2 text-terminal-text-secondary font-data text-xs">
              No matching tickers
            </Command.Empty>
            {tickerList.map((ticker) => (
              <Command.Item
                key={ticker}
                value={ticker}
                onSelect={() => handleSelect(ticker)}
                className="px-3 py-1.5 text-xs font-data text-terminal-text-primary cursor-pointer
                           hover:bg-terminal-surface-hover data-[selected=true]:bg-terminal-surface-hover"
              >
                {ticker}
              </Command.Item>
            ))}
          </Command.List>
        )}
      </Command>
    </div>
  )
}
