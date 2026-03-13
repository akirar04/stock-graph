import { create } from 'zustand'

export interface WatchlistEntry {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  exchange: string
}

interface WatchlistState {
  entries: WatchlistEntry[]
  addEntry: (entry: WatchlistEntry) => void
  removeEntry: (ticker: string) => void
}

const defaultWatchlist: WatchlistEntry[] = [
  { ticker: 'AAPL', name: 'Apple Inc', price: 213.40, change: 2.61, changePercent: 1.24, exchange: 'NASDAQ' },
  { ticker: 'MSFT', name: 'Microsoft Corp', price: 415.80, change: -1.93, changePercent: -0.46, exchange: 'NASDAQ' },
  { ticker: 'GOOGL', name: 'Alphabet Inc', price: 174.20, change: 3.14, changePercent: 1.84, exchange: 'NASDAQ' },
  { ticker: 'AMZN', name: 'Amazon.com Inc', price: 198.60, change: 1.42, changePercent: 0.72, exchange: 'NASDAQ' },
  { ticker: 'NVDA', name: 'NVIDIA Corp', price: 875.30, change: 12.50, changePercent: 1.45, exchange: 'NASDAQ' },
  { ticker: 'BHP.AX', name: 'BHP Group', price: 43.80, change: 0.38, changePercent: 0.87, exchange: 'ASX' },
  { ticker: 'CBA.AX', name: 'Commonwealth Bank', price: 128.50, change: -0.72, changePercent: -0.56, exchange: 'ASX' },
  { ticker: 'VAS.AX', name: 'Vanguard Aus Shares', price: 104.20, change: -0.32, changePercent: -0.31, exchange: 'ASX' },
  { ticker: 'VWRL.L', name: 'Vanguard FTSE All-World', price: 112.35, change: 0.85, changePercent: 0.76, exchange: 'LSE' },
  { ticker: 'TSLA', name: 'Tesla Inc', price: 248.90, change: -5.30, changePercent: -2.08, exchange: 'NASDAQ' },
]

export const useWatchlistStore = create<WatchlistState>((set) => ({
  entries: defaultWatchlist,
  addEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
  removeEntry: (ticker) => set((s) => ({ entries: s.entries.filter((e) => e.ticker !== ticker) })),
}))
