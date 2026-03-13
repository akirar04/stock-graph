import { useEffect, useMemo, useRef, useState } from 'react'
import { Chart, CandlestickSeries, HistogramSeries, LineSeries, PriceScale } from 'lightweight-charts-react-wrapper'
import type { DeepPartial, ChartOptions, IChartApi } from 'lightweight-charts'
import { useTerminalStore, type Timeframe } from '@/store/terminalStore'
import { getMockOHLCV, computeSMA } from '@/data/mockData'
import { colors } from '@/theme/tokens'

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']

const timeframeDays: Record<Timeframe, number> = {
  '1D': 1,
  '1W': 5,
  '1M': 22,
  '3M': 66,
  '1Y': 252,
  '5Y': 1260,
}

const chartOptions: DeepPartial<ChartOptions> = {
  layout: {
    background: { color: colors.surface },
    textColor: colors.textSecondary,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
  },
  grid: {
    vertLines: { color: '#161616' },
    horzLines: { color: '#161616' },
  },
  crosshair: {
    vertLine: { color: '#ff8c0040', labelBackgroundColor: colors.accent },
    horzLine: { color: '#ff8c0040', labelBackgroundColor: colors.accent },
  },
  timeScale: {
    borderColor: colors.border,
    timeVisible: true,
  },
  rightPriceScale: {
    borderColor: colors.border,
  },
}

export function ChartPanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [size, setSize] = useState({ width: 600, height: 400 })

  const activeTicker = useTerminalStore((s) => s.activeTicker)
  const timeframe = useTerminalStore((s) => s.timeframe)
  const setTimeframe = useTerminalStore((s) => s.setTimeframe)

  const ticker = activeTicker

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setSize({ width: Math.floor(width), height: Math.floor(height) - 36 })
        }
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const allData = useMemo(() => getMockOHLCV(ticker), [ticker])

  const visibleData = useMemo(() => {
    const days = timeframeDays[timeframe]
    return allData.slice(-days)
  }, [allData, timeframe])

  const volumeData = useMemo(
    () =>
      visibleData.map((c) => ({
        time: c.time,
        value: c.volume,
        color: c.close >= c.open ? '#00c85325' : '#ff174425',
      })),
    [visibleData],
  )

  const sma20 = useMemo(() => {
    const sma = computeSMA(allData, 20)
    const startTime = visibleData[0]?.time
    return startTime ? sma.filter((s) => s.time >= startTime) : sma
  }, [allData, visibleData])

  const sma50 = useMemo(() => {
    const sma = computeSMA(allData, 50)
    const startTime = visibleData[0]?.time
    return startTime ? sma.filter((s) => s.time >= startTime) : sma
  }, [allData, visibleData])

  const lastCandle = visibleData[visibleData.length - 1]
  const firstCandle = visibleData[0]
  const priceChange = lastCandle && firstCandle
    ? lastCandle.close - firstCandle.open
    : 0
  const priceChangePct = firstCandle
    ? (priceChange / firstCandle.open) * 100
    : 0
  const isPositive = priceChange >= 0

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-terminal-surface">
      <div className="flex items-center justify-between px-3 h-9 border-b border-terminal-border shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-data text-sm font-semibold text-terminal-text-primary">
            {ticker}
          </span>
          {lastCandle && (
            <>
              <span className="font-data text-sm text-terminal-text-primary">
                {lastCandle.close.toFixed(2)}
              </span>
              <span className={`font-data text-xs ${isPositive ? 'text-terminal-positive' : 'text-terminal-negative'}`}>
                {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePct.toFixed(2)}%)
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 text-[11px] font-data rounded cursor-pointer border-none transition-colors
                ${tf === timeframe
                  ? 'bg-terminal-accent text-white'
                  : 'bg-transparent text-terminal-text-secondary hover:text-terminal-text-primary hover:bg-terminal-surface-hover'
                }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Chart
          ref={(api: IChartApi | null) => { chartRef.current = api }}
          width={size.width}
          height={Math.max(size.height, 100)}
          {...chartOptions}
        >
          <PriceScale id="right" scaleMargins={{ top: 0.1, bottom: 0.3 }} />
          <PriceScale id="" scaleMargins={{ top: 0.75, bottom: 0 }} />
          <CandlestickSeries
            data={visibleData}
            upColor={colors.positive}
            downColor={colors.negative}
            borderUpColor={colors.positive}
            borderDownColor={colors.negative}
            wickUpColor={colors.positive}
            wickDownColor={colors.negative}
          />
          <HistogramSeries
            data={volumeData}
            priceScaleId=""
            priceFormat={{ type: 'volume' }}
          />
          <LineSeries
            data={sma20}
            color="#f59e0b"
            lineWidth={1}
            priceLineVisible={false}
            lastValueVisible={false}
          />
          <LineSeries
            data={sma50}
            color="#8b5cf6"
            lineWidth={1}
            priceLineVisible={false}
            lastValueVisible={false}
          />
        </Chart>
      </div>
    </div>
  )
}
