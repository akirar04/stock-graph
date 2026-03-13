export interface OHLCVCandle {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

function generateOHLCV(
  ticker: string,
  basePrice: number,
  days: number,
  volatility: number,
): OHLCVCandle[] {
  const candles: OHLCVCandle[] = []
  let price = basePrice
  let seed = 0
  for (const ch of ticker) seed += ch.charCodeAt(0)
  const rng = seededRandom(seed * 137)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    const day = date.getDay()
    if (day === 0 || day === 6) continue

    const changePercent = (rng() - 0.48) * volatility
    const open = price
    const close = open * (1 + changePercent / 100)
    const high = Math.max(open, close) * (1 + rng() * volatility * 0.003)
    const low = Math.min(open, close) * (1 - rng() * volatility * 0.003)
    const volume = Math.floor(1_000_000 + rng() * 50_000_000)

    candles.push({
      time: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    })

    price = close
  }

  return candles
}

const tickerConfig: Record<string, { basePrice: number; volatility: number }> = {
  'AAPL':    { basePrice: 180, volatility: 2.0 },
  'MSFT':    { basePrice: 380, volatility: 1.8 },
  'GOOGL':   { basePrice: 145, volatility: 2.2 },
  'AMZN':    { basePrice: 170, volatility: 2.5 },
  'NVDA':    { basePrice: 500, volatility: 4.0 },
  'BHP.AX':  { basePrice: 42, volatility: 1.5 },
  'CBA.AX':  { basePrice: 115, volatility: 1.2 },
  'VAS.AX':  { basePrice: 98, volatility: 0.8 },
  'VWRL.L':  { basePrice: 105, volatility: 0.9 },
  'TSLA':    { basePrice: 200, volatility: 4.5 },
}

const dataCache = new Map<string, OHLCVCandle[]>()

export function getMockOHLCV(ticker: string): OHLCVCandle[] {
  if (dataCache.has(ticker)) return dataCache.get(ticker)!

  const config = tickerConfig[ticker] ?? { basePrice: 100, volatility: 2.0 }
  const data = generateOHLCV(ticker, config.basePrice, 365, config.volatility)
  dataCache.set(ticker, data)
  return data
}

export function computeSMA(data: OHLCVCandle[], period: number) {
  return data
    .map((candle, i, arr) => {
      if (i < period - 1) return null
      const slice = arr.slice(i - period + 1, i + 1)
      const avg = slice.reduce((sum, c) => sum + c.close, 0) / period
      return { time: candle.time, value: Math.round(avg * 100) / 100 }
    })
    .filter(Boolean) as { time: string; value: number }[]
}

export const allTickers = Object.keys(tickerConfig)
