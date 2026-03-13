import type { TabNode } from 'flexlayout-react'
import { ChartPanel } from '@/panels/ChartPanel'
import { WatchlistPanel } from '@/panels/WatchlistPanel'

export function panelFactory(node: TabNode) {
  const component = node.getComponent()

  switch (component) {
    case 'ChartPanel':
      return <ChartPanel />
    case 'WatchlistPanel':
      return <WatchlistPanel />
    default:
      return (
        <div className="flex items-center justify-center h-full text-terminal-text-secondary font-data text-sm">
          Unknown panel: {component}
        </div>
      )
  }
}
