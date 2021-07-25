import _ from 'lodash'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'

import { useDataDynamicContext } from '../contexts/DataDynamic'
import { useAddresses } from './utility'
import { useOptions, useOptionsDynamics } from './data'
import { useAccount } from './web3'
import Position, { PositionHelper } from '../models/Position'

/**
 *
 * HOOKS
 *
 */

export function usePositions (isCurated = true) {
  const { options: source } = useAddresses()
  const { positions } = useDataDynamicContext()
  const { active } = useMemo(() => positions, [positions])
  const { isConnected } = useAccount()

  const { isLoading: _isLoading, warning, ...raw } = useMemo(
    () => active || {},
    [active]
  )

  const isExpected = useMemo(
    () => source.length && !Object.values(raw).length && isConnected,
    [source, raw, isConnected]
  )

  const isLoading = useMemo(() => {
    return _.get(_isLoading, 'value') || isExpected
  }, [isExpected, _isLoading])

  const count = useMemo(() => Object.values(raw).length, [raw])

  const list = useMemo(() => {
    if (!_.isNilOrEmptyString(_.get(warning, 'value'))) return []
    if (_.get(isLoading, 'value')) return []
    return Object.keys(raw)
      .filter(key => key !== '_')
      .map(key => raw[key])
      .map(item => new Position(_.get(item, 'element')))
      .filter(item => item.isValid)
      .filter(item =>
        isCurated
          ? source.some(s => s.toLowerCase() === _.get(item, 'option.address'))
          : true
      )
      .sort(
        (a, b) => _.get(a, 'option.expiration') < _.get(b, 'option.expiration')
      )
  }, [raw, source, isCurated, isLoading, warning])

  return useMemo(
    () => ({
      positions: list,
      count,
      isLoading,
      warning: _.get(warning, 'value')
    }),
    [list, count, isLoading, warning]
  )
}

export function usePositionsValues () {
  const dynamics = useOptionsDynamics()
  const { positions, isLoading: isLoadingPositions } = usePositions()
  const { isLoading: isLoadingOptions } = useOptions()

  return useMemo(() => {
    const values = {}
    const aggregates = {
      pnl: new BigNumber(0),
      poolPositionsValue: new BigNumber(0),
      simulated: new BigNumber(0)
    }
    try {
      if (positions) {
        positions.forEach(position => {
          const address = _.get(position, 'option.address')
          const dynamic = _.get(dynamics, address)

          if (!_.isNil(dynamic) && !dynamics.isLoading) {
            const item = position.getValues({ dynamics: dynamic })
            values[address] = item

            aggregates.pnl = aggregates.pnl.plus(item.pnl)
            aggregates.poolPositionsValue = aggregates.poolPositionsValue.plus(
              item.poolPositionsValue
            )
          }
        })
      }
    } catch (error) {
      console.error(error)
    }

    const breakdown = {
      pnl: PositionHelper.getBreakdownPNL(aggregates).sections,
      poolPositionsValue: PositionHelper.getBreakdownPoolPositionsValue(
        aggregates
      ).sections
    }

    return {
      aggregates,
      breakdown,
      positions,
      values,
      isLoading: isLoadingOptions || dynamics.isLoading || isLoadingPositions
    }
  }, [positions, dynamics, isLoadingOptions, isLoadingPositions])
}
