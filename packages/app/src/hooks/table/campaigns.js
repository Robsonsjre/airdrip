import _ from 'lodash'
import React, { useMemo } from 'react'
import numeral from 'numeral'
import IconMarket from '@material-ui/icons/TimelineRounded'
import { layout } from '../../components/shared/Table'

import { useMarketPrices } from '../price'
import { useOptions } from '../data'
// import { usePositions } from '../position'
import { useTotalSupplies } from '../adhoc'
import { toNumeralPrice, toQuantity } from '../../utils'

export default function useCampaignsTable () {
  const { spot } = useMarketPrices()
  // const { positions } = usePositions()
  const { options, isLoading: isLoadingOptions } = useOptions(true)
  const { list: supplies } = useTotalSupplies()

  const columns = useMemo(
    () => [
      {
        title: 'Campaign',
        layout: layout.PodPair,
        subtitle: 'Asset'
      },
      {
        title: 'Strike Price',
        layout: layout.Price,
        subtitle: (
          <>
            Market Price <IconMarket />
          </>
        )
      },
      {
        title: 'Remaining supply',
        layout: layout.Text
      },
      {
        title: 'Expiration',
        layout: layout.Timestamp
      },
      {
        title: 'Exercise Window',
        layout: layout.TextDeck
      },
      {
        title: '',
        layout: layout.Actions
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

        const size = _.get(
          supplies.find(item => _.get(item, '0') === _.get(option, 'address')),
          '1'
        )

        console.log(size)

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
              value: size
                ? toQuantity(toNumeralPrice(size, false), 'option')
                : '0 options'
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
    [options, spot, supplies]
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
