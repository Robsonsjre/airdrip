import _ from 'lodash'
import { useMemo, useCallback, useEffect } from 'react'
import { useDataStaticContext } from '../contexts/DataStatic'
import { useDataDynamicContext } from '../contexts/DataDynamic'
import { Option } from '../models'
import { useMarketPrices } from './price'
import { useAddresses, useToken } from './utility'

/**
 * --------------------------------------
 * Static data and write utilities
 * --------------------------------------
 */

export function useHelper () {
  const { helper } = useDataStaticContext()
  return helper
}

export function useOptions (isCurated = false) {
  const { options: source } = useAddresses()
  const { options: raw } = useDataStaticContext()

  const isExpected = useMemo(() => source.length > raw.length, [source, raw])

  const isLoading = useMemo(() => {
    return isExpected || raw.some(item => item.element.isLoading === true)
  }, [isExpected, raw])

  const count = useMemo(() => raw.length, [raw])

  const options = useMemo(
    () =>
      raw
        .filter(
          item =>
            !item.element.isLoading &&
            !_.isNil(item.element.value) &&
            _.isNilOrEmptyString(item.element.warning)
        )
        .filter(item => !isCurated || item.element.isCurated)
        .map(item => new Option(_.get(item, 'element') || {})),
    [raw, isCurated]
  )

  return { options, count, isLoading }
}

export function useOption (force = null) {
  const { options: source } = useAddresses()
  const id = useMemo(() => _.get(source, '0'), [source])
  const { options: raw } = useDataStaticContext()

  const isExpected = useMemo(() => source.length > raw.length, [source, raw])

  const isLoading = useMemo(() => {
    const item = raw.find(option => _.get(option, 'element.address') === id)
    return isExpected || !item || item.element.isLoading === true
  }, [raw, id, isExpected])

  const option = useMemo(() => {
    const item = raw.find(option => _.get(option, 'element.address') === id)

    if (
      _.isNil(item) ||
      item.element.isLoading === true ||
      !_.isNilOrEmptyString(item.element.warning)
    ) {
      return null
    }
    return new Option(_.get(item, 'element') || {})
  }, [raw, id])

  const warning = useMemo(() => {
    const item = raw.find(option => _.get(option, 'element.address') === id)
    return item ? item.element.warning : null
  }, [raw, id])

  return { option, warning, isLoading }
}

/**
 * ---------------------------------
 * This hook will try to resolve an options that isn't officially curated (not included in the initial list)
 * It is important that
 *  1. This hook is called inside a route (so it can access the route parameters - option address in URL)
 *  2. This hook is called only one time per route/page (INSTANCE) - to minimize the risk of trigerring the request twice
 *
 *
 * @param {string} force Force optiona address to be used instead of route id
 */
export function useOptionResolverINSTANCE (force = null) {
  const { options: source } = useAddresses()
  const id = useMemo(() => _.get(source, '0'), [source])
  const { isLoading } = useOptions()
  const { options: raw, trackOption: track } = useDataStaticContext()

  useEffect(() => {
    if (isLoading || _.isNilOrEmptyString(id)) return
    const item = raw.find(option => _.get(option, 'element.address') === id)
    const preparing = source.find(address => address.toLowerCase() === id)
    if (_.isNil(item) && !preparing) {
      track({
        option: {
          address: id
        }
      })
    }
  }, [raw, id, track, source, isLoading])
}

// TOOD http://localhost:5002/buy/0xFdea2F7E2526DFAea1a349bBCf2f7b6b2eFDe939X/#buy

/**
 * --------------------------------------
 * Data (dynamics)
 * --------------------------------------
 */

export function useOptionsDynamics () {
  const { user: userSource, general: generalSource } = useDataDynamicContext()
  const { elements: generalDB } = useMemo(() => generalSource || {}, [
    generalSource
  ])
  const { elements: userDB } = useMemo(() => userSource || {}, [userSource])

  const itemizer = useCallback(
    address => {
      const general = _.get(generalDB, `${address}.element.value`)
      const user = _.get(userDB, `${address}.element.value`)

      const sellingPrice = _.get(general, 'sellingPrice')
      const buyingPrice = _.get(general, 'buyingPrice')
      const abPrice = _.get(general, 'abPrice')
      const totalBalances = _.get(general, 'totalBalances')
      const IV = _.get(general, 'IV')

      const userPositions = _.get(user, 'userPositions')
      const userOptionWithdrawAmounts = _.get(user, 'userOptionWithdrawAmounts')
      const userOptionMintedAmount = _.get(user, 'userOptionMintedAmount')
      const userOptionBalance = _.get(user, 'userOptionBalance')

      return {
        sellingPrice,
        buyingPrice,
        abPrice,
        totalBalances,
        IV,
        userPositions,
        userOptionWithdrawAmounts,
        userOptionMintedAmount,
        userOptionBalance
      }
    },
    [generalDB, userDB]
  )

  const grouped = useMemo(() => {
    const result = {
      isLoadingUserDynamics: _.get(
        Object.values(userDB || {}),
        '0.element.isLoading'
      ),
      isLoadingGeneralDynamics: _.get(
        Object.values(generalDB || {}),
        '0.element.isLoading'
      )
    }

    result.isLoading =
      result.isLoadingUserDynamics || result.isLoadingGeneralDynamics
    if (_.isNil(generalDB)) return result
    Object.keys(generalDB).forEach(address => {
      result[address] = itemizer(address)
    })
    return result
  }, [itemizer, generalDB, userDB])

  return grouped
}

export function useOptionDynamics (force = null) {
  const { option, isLoading: isOptionLoading } = useOption(force)
  const dynamics = useOptionsDynamics()

  const isLoading = useMemo(
    () =>
      (!_.isNil(option) && isOptionLoading) ||
      (!_.isNil(dynamics) && dynamics.isLoading),
    [option, isOptionLoading, dynamics]
  )

  const item = useMemo(() => {
    if (_.isNil(option) || _.isNil(dynamics) || isLoading) return null
    const address = option.address
    return _.get(dynamics, address)
  }, [option, dynamics, isLoading])

  const result = useMemo(() => ({ ...(item || {}), isLoading }), [
    item,
    isLoading
  ])

  return result
}

/**
 * --------------------------------------
 * Data aggregators and formatters
 * --------------------------------------
 */

export function useOptionTokens () {
  const { option, isLoading } = useOption()
  const { get } = useToken()

  return useMemo(() => {
    if (_.isNil(option) || isLoading || !_.isNilOrEmptyString(option.warning)) {
      return {
        underlying: null,
        strike: null,
        tokenA: null,
        tokenB: null
      }
    }

    return {
      underlying: get(option.underlying),
      strike: get(option.strike),
      tokenA: get(option.pool.tokenA),
      tokenB: get(option.pool.tokenB)
    }
  }, [get, option, isLoading])
}

export function useOptionInfo (force = null) {
  const { spot } = useMarketPrices()
  const { option, isLoading, warning } = useOption(force)
  const helper = useHelper()
  const tokens = useOptionTokens()

  const isWarned = useMemo(() => !_.isNilOrEmptyString(warning), [warning])
  const isReady = useMemo(() => !_.isNil(option) && !isLoading, [
    option,
    isLoading
  ])
  const isRestricted = useMemo(() => (isReady && _.isNil(option)) || isWarned, [
    isReady,
    option,
    isWarned
  ])

  const address = useMemo(() => isReady && option.address, [option, isReady])
  const durations = useMemo(() => (isReady ? option.getDurations() : {}), [
    option,
    isReady
  ])

  const market = useMemo(
    () => isReady && _.get(spot, option.underlying.symbol.toUpperCase()),
    [spot, option, isReady]
  )

  return useMemo(
    () => ({
      ...tokens,
      address,
      option,
      helper,
      market,
      durations,
      warning,
      isLoading,
      isWarned,
      isReady,
      isRestricted
    }),
    [
      address,
      tokens,
      option,
      helper,
      market,
      durations,
      warning,
      isLoading,
      isWarned,
      isReady,
      isRestricted
    ]
  )
}
