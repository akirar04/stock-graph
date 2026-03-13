import { create } from 'zustand'

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'

interface TerminalState {
  activeTicker: string
  timeframe: Timeframe
  commandBarFocused: boolean
  setActiveTicker: (ticker: string) => void
  setTimeframe: (tf: Timeframe) => void
  setCommandBarFocused: (focused: boolean) => void
}

export const useTerminalStore = create<TerminalState>((set) => ({
  activeTicker: 'AAPL',
  timeframe: '1Y',
  commandBarFocused: false,
  setActiveTicker: (ticker) => set({ activeTicker: ticker }),
  setTimeframe: (tf) => set({ timeframe: tf }),
  setCommandBarFocused: (focused) => set({ commandBarFocused: focused }),
}))
