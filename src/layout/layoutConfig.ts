import type { IJsonModel } from 'flexlayout-react'

export const defaultLayout: IJsonModel = {
  global: {
    tabEnableRename: false,
    tabSetEnableSingleTabStretch: false,
    splitterSize: 3,
    splitterExtra: 4,
    tabSetMinHeight: 100,
    tabSetMinWidth: 150,
  },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 25,
        children: [
          {
            type: 'tab',
            name: 'Watchlist',
            component: 'WatchlistPanel',
          },
        ],
      },
      {
        type: 'tabset',
        weight: 75,
        active: true,
        children: [
          {
            type: 'tab',
            name: 'Chart',
            component: 'ChartPanel',
          },
        ],
      },
    ],
  },
}
