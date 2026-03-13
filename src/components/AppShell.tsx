import { useRef } from 'react'
import { Layout, Model } from 'flexlayout-react'
import 'flexlayout-react/style/dark.css'
import { defaultLayout } from '@/layout/layoutConfig'
import { panelFactory } from '@/layout/panelRegistry'
import { QuoteStrip } from './QuoteStrip'
import { CommandBar } from './CommandBar'

const model = Model.fromJson(defaultLayout)

export function AppShell() {
  const layoutRef = useRef<Layout>(null)

  return (
    <div className="flex flex-col w-full h-full bg-terminal-bg">
      <QuoteStrip />
      <div className="flex-1 min-h-0 relative">
        <Layout
          ref={layoutRef}
          model={model}
          factory={panelFactory}
        />
      </div>
      <CommandBar />
    </div>
  )
}
