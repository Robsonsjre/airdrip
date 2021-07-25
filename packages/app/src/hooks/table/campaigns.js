import _ from 'lodash'
import React, { useMemo } from 'react'
import numeral from 'numeral'
import IconMarket from '@material-ui/icons/TimelineRounded'
import { layout } from '../../components/shared/Table'

import { useMarketPrices } from '../price'
import { useOptions } from '../data'
// import { usePositions } from '../position'
import { useTotalSupplies, useOptionBalances } from '../adhoc'
import { toNumeralPrice, toQuantity } from '../../utils'

export default function useCampaignsTable () {
  const { spot } = useMarketPrices()
  // const { positions } = usePositions()
  const { options, isLoading: isLoadingOptions } = useOptions(true)
  const { list: supplies } = useTotalSupplies()
  const { list: balances } = useOptionBalances()

  const columns = useMemo(
    () => [
      {
        title: 'Campaign',
        layout: layout.PodPair,
        subtitle: 'Asset',
        weight: 3
      },
      {
        title: 'Strike Price',
        layout: layout.Price,
        subtitle: (
          <>
            Market Price <IconMarket />
          </>
        ),
        weight: 2
      },
      {
        title: 'Remaining supply',
        layout: layout.Text,
        weight: 2
      },
      {
        title: 'Balance',
        layout: layout.Text,
        weight: 2
      },
      {
        title: 'Streamed',
        layout: layout.Text,
        weight: 2
      },
      {
        title: 'Expiration',
        layout: layout.Timestamp,
        weight: 2
      },
      {
        title: 'Exercise Window',
        layout: layout.TextDeck,
        weight: 2
      },
      {
        title: '',
        layout: layout.Actions,
        weight: 1
      }
    ],
    []
  )

  const instructions = useMemo(
    () => ({
      onRowClick: () => {}
    }),
    []
  )

  const rows = useMemo(
    () =>
      options.map(option => {
        const durations = option.getDurations()
        const market = _.get(spot, option.underlying.symbol.toUpperCase())

        const supply = _.get(
          supplies.find(item => _.get(item, '0') === _.get(option, 'address')),
          '1'
        )

        const balance = _.get(
          balances.find(item => _.get(item, '0') === _.get(option, 'address')),
          '1'
        )

        return {
          id: option.address,
          cells: [
            {
              value: [option.underlying, option.strike]
            },
            {
              value: numeral(option.strikePrice.humanized).format('$0.[0000]'),
              market: numeral(market).format('$0.[00]')
            },
            {
              value: supply
                ? toQuantity(toNumeralPrice(supply, false), 'option')
                : '0 options'
            },
            {
              value: balance
                ? toQuantity(toNumeralPrice(balance, false), 'option')
                : '0 options'
            },
            {
              value: '0%'
            },
            {
              value: durations.expiration
            },
            {
              value: durations.exerciseStartFormattedWithHour,
              subtitle: durations.exerciseStartToTodayFormatted
            },
            {
              value: 'https://google.com'
            }
          ]
        }
      }),
    [options, spot, supplies, balances]
  )

  return {
    data: {
      columns,
      rows,
      instructions,
      /** Cosmetics */
      isLoading: isLoadingOptions,
      expected: 0
    },
    info: {
      total: _.get(options, 'length'),
      filtered: _.get(options, 'length')
    }
  }
}
