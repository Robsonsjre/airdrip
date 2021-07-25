import _ from 'lodash'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

import numeral from 'numeral'
import moment from 'moment'

import { matchPath } from 'react-router'

import {
  tokens,
  networks,
  addresses,
  macros,
  pages,
  ETH_ADDRESS,
  MATIC_ADDRESS
} from '../constants'

dayjs.extend(relativeTime)
dayjs.extend(duration)

/**
 * Returns the date of block in the Ethereum network
 * @param {number} currentBlockNumber
 * @param {number} targetBlockNumber
 * @returns {Date}
 */
export function getBlockDate (
  currentBlockNumber,
  targetBlockNumber,
  networkVersion
) {
  const diffBetweenBlocksInMilliseconds =
    (targetBlockNumber - currentBlockNumber) *
    networks[networkVersion].averageBlockTime *
    1000
  const now = new Date().valueOf()
  const targetDate = new Date(now + diffBetweenBlocksInMilliseconds)

  return targetDate
}

/**
 * Calculate APR in the period
 * @param {number} premium
 * @param {number} principal
 * @param {number} expiration
 * @return {string} percentageAPR
 */
export function getAPR ({ premium, expiration }) {
  try {
    if (premium === macros.RESTRICTED_PREMIUM) {
      throw new Error('Empty pool, revert to restricted.')
    }

    const today = new Date().valueOf()
    const hoursRemaining = moment(expiration * 1000).diff(today, 'hours')

    const apr =
      hoursRemaining === 0
        ? 0
        : new BigNumber(premium)
          .multipliedBy(new BigNumber(365 * 24))
          .dividedBy(hoursRemaining)
          .toNumber()

    return numeral(apr).format('0.[00]%')
  } catch (error) {
    return macros.RESTRICTED_APR
  }
}

/**
 * Reduces a ethereum address to a smaller format
 * @param {string} fullAddress
 * @return {string|null}
 */
export function beautifyAddress (fullAddress, start = 6, end = 6) {
  if (!fullAddress) return null
  const addressSize = 42

  if (end - start >= addressSize) {
    return fullAddress
  }

  const newFullAddress =
    fullAddress.substr(0, start) +
    '...' +
    fullAddress.substr(fullAddress.length - end, fullAddress.length)

  return newFullAddress
}

/**
 * Checks if a address represents ETH native asset or WETH
 * @param {string} address
 * @return {boolean}
 */
export function isEth (address, networkId) {
  if (_.isNil(addresses) || _.isNil(networkId)) return false
  const { weth } = addresses[networkId]
  if (_.isNil(address) || _.isNil(weth)) return false

  return (
    address.toLowerCase() === ETH_ADDRESS.toLowerCase() ||
    address.toLowerCase() === weth.toLowerCase()
  )
}

export function isMatic (address, networkId) {
  if (_.isNil(addresses) || _.isNil(networkId)) return false
  const { wmatic } = addresses[networkId]
  if (_.isNil(address) || _.isNil(wmatic)) return false
  return (
    address.toLowerCase() === MATIC_ADDRESS.toLowerCase() ||
    address.toLowerCase() === wmatic.toLowerCase()
  )
}

export function isEthereumChain (networkId) {
  return ![networks.mumbai, networks.matic].includes(networkId)
}

export function isPolygonChain (networkId) {
  return [networks.mumbai, networks.matic].includes(networkId)
}

export function interpretTimeWindows (option) {
  if (_.isNil(option)) return {}

  const expiration = dayjs(
    new BigNumber(_.get(option, 'expiration')).multipliedBy(1000).toNumber()
  ).format('MMM Do, YYYY')

  const exercising = dayjs(
    new BigNumber(_.get(option, 'exercising')).multipliedBy(1000).toNumber()
  ).format('MMM Do, YYYY')

  const window = new BigNumber(_.get(option, 'exercising'))
    .minus(new BigNumber(_.get(option, 'expiration')))
    .toNumber()

  const windowTime = dayjs.duration(window * 1000).humanize()

  const expirationToToday = new BigNumber(_.get(option, 'expiration'))
    .minus(dayjs().valueOf() / 1000)
    .toNumber()
  const exerciseToToday = expirationToToday + window // macros.EXERCISE_WINDOW

  const isExpired = expirationToToday <= 0
  const isExercised = expirationToToday <= -1 * window // macros.EXERCISE_WINDOW
  const isNotice =
    expirationToToday > 0 && expirationToToday < macros.EXPIRY_NOTICE_TIME

  const expirationFromNow = dayjs(_.get(option, 'expiration') * 1000).fromNow()
  const exerciseEnd = dayjs(_.get(option, 'exercising') * 1000).add(
    window, // macros.EXERCISE_WINDOW,
    'millisecond'
  )
  const exerciseLeft = dayjs.duration(exerciseEnd.diff(dayjs())).humanize(true)

  return {
    expiration,
    exercising,
    window,
    windowTime,
    expirationToToday,
    exerciseToToday,
    expirationFromNow,
    exerciseLeft,
    expirationClassic: _.get(option, 'expiration'),
    exerciseClassic: _.get(option, 'exercising'),
    isNotice,
    isExpired,
    isExercised
  }
}

export function interpretAPR (option) {
  if (_.isNil(option)) return macros.RESTRICTED_APR

  const APR = _.toString(_.get(option, 'apr'))

  if (_.isNil(APR) || APR.toUpperCase().includes('NAN')) {
    return macros.RESTRICTED_APR
  }

  return APR
}

export function interpretPremium (option, price) {
  if (
    _.isNil(option) ||
    _.isNil(price) ||
    _.toString(price)
      .toUpperCase()
      .includes('NAN') ||
    _.toString(price) === macros.RESTRICTED_PREMIUM
  ) {
    return {
      raw: macros.RESTRICTED_PREMIUM,
      formatted: macros.RESTRICTED_PREMIUM,
      complex: macros.RESTRICTED_PREMIUM
    }
  }

  const collateral = _.toString(
    _.get(option, 'premiumAssetSymbol')
  ).toUpperCase()

  return {
    raw: price,
    formatted: toNumeralPrice(price),
    complex: `${toNumeralPrice(price)} ${collateral}`
  }
}

export function capitalize (source) {
  return source.charAt(0).toUpperCase() + source.slice(1)
}

export function getAddresses (networkId) {
  if (!_.isNil(networkId) && _.has(addresses, networkId)) {
    const sanitized = { ...addresses[networkId] }

    return {
      archive: [],
      options: [],
      manager: null,
      ...sanitized
    }
  }
  return {
    archive: [],
    options: [],
    manager: null
  }
}

export function sortOptionsTableByTimeStatus (optionA, optionB) {
  try {
    const optionATimes = _.get(
      optionA,
      `cells[${_.get(optionA, 'cells.length') - 1}].times`
    )
    const optionBTimes = _.get(
      optionB,
      `cells[${_.get(optionA, 'cells.length') - 1}].times`
    )

    if (_.get(optionATimes, 'isExercised')) return 1
    if (_.get(optionBTimes, 'isExercised')) return 0
  } catch (e) {
    console.error('Filtering', e)
  }
  return 0
}

export function sortOptionsTableByExpiration (
  optionA,
  optionB,
  direction = 'ascending'
) {
  try {
    const optionATimes = _.get(
      optionA,
      `cells[${_.get(optionA, 'cells.length') - 1}].times`
    )
    const optionBTimes = _.get(
      optionB,
      `cells[${_.get(optionA, 'cells.length') - 1}].times`
    )

    const distanceA = new BigNumber(_.get(optionATimes, 'expirationClassic'))
    const distanceB = new BigNumber(_.get(optionBTimes, 'expirationClassic'))

    if (distanceA.isEqualTo(distanceB)) return 0
    if (distanceA.isGreaterThan(distanceB)) {
      return direction === 'ascending' ? 1 : -1
    }
    return direction === 'ascending' ? -1 : 1
  } catch (e) {
    console.error('Filtering', e)
  }
  return 0
}

export function isOptionExpired (option) {
  const expirationToToday = new BigNumber(_.get(option, 'expiration'))
    .minus(dayjs().valueOf() / 1000)
    .toNumber()

  return expirationToToday <= 0
}

export function findPageByRoute (route) {
  return Object.values(pages)
    .filter(page => !_.isNil(page.depth) && page.depth === 0)
    .find(
      page =>
        matchPath(route, {
          path: page.route,
          exact: true
        }) !== null
    )
}

/**
 *
 * @param {string|number} source
 * @param {number} [rounding] BigNumber.ROUND_UP | BigNumber.ROUND_DOWN
 * @param {number} [precision]
 * @returns {string}
 */
export function toSignificantInput (
  source,
  rounding = BigNumber.ROUND_UP,
  precision = macros.COMMON_PRECISION
) {
  if (_.isNilOrEmptyString(source)) return ''

  const amount = new BigNumber(source)
  const formatted = amount.toFixed(precision, rounding)

  if (new BigNumber(formatted).isZero()) return ''

  return formatted
}

/**
 *
 * @param {string|number} source
 * @param {number} [rounding] BigNumber.ROUND_UP | BigNumber.ROUND_DOWN
 * @param {number} [precision]
 * @param {number} [fallback]
 * @returns {number}
 */
export function toSignificantInputNumber (
  source,
  rounding = BigNumber.ROUND_UP,
  precision = macros.COMMON_PRECISION,
  fallback = 0
) {
  const formatted = toSignificantInput(source, precision, rounding)
  if (_.isNilOrEmptyString(formatted)) return fallback

  return new BigNumber(formatted).toNumber()
}

export function tokenAddressToTokenKey (address, addresses) {
  const result = Object.keys(addresses).find(
    tokenKey =>
      String(_.get(addresses, `${tokenKey}.address`)).toLowerCase() ===
      String(address).toLowerCase()
  )

  return result === 'WETH' ? 'ETH' : result
}

/**
 *
 * @param {number | string} value
 * @returns
 */
export function toNumeralPrice (value, dollar = true, restrict = false) {
  if (_.isNil(value)) {
    if (restrict) return macros.RESTRICTED_PREMIUM
    return '0'
  }
  if (value === macros.RESTRICTED_PREMIUM) return value
  const instance = new BigNumber(value)

  if (instance.isZero() && restrict) return macros.RESTRICTED_PREMIUM

  if (
    instance.absoluteValue().isLessThan(macros.MINIMUM_BALANCE_AMOUNT) ||
    _.isNaN(value)
  ) { return `${dollar ? '$' : ''}0` }

  if (instance.absoluteValue().isLessThan(new BigNumber(0.001))) {
    return numeral(value).format(`${dollar && '$'}0,0.[000000]`)
  }
  if (instance.absoluteValue().isLessThan(new BigNumber(1))) {
    return numeral(value).format(`${dollar && '$'}0,0.[0000]`)
  }
  return numeral(value).format(`${dollar && '$'}0,0.[00]`)
}

export function zeroIfNaN (v) {
  return _.isNil(v) || (BigNumber.isBigNumber(v) && v.isNaN())
    ? 0
    : v.toNumber()
}

export function getInterpretedToken (item, networkId) {
  if (_.isNil(item) || _.isNil(item, 'symbol')) return null
  const key = String(_.get(item, 'symbol')).toUpperCase()
  const network = _.get(item, 'networkId') || networkId
  const fallback = (() => {
    const general = _.get(tokens.general, key)
    const specific = _.get(tokens[network], key)
    return { ...(general || {}), ...(specific || {}) }
  })()

  const icon = _.attempt(() => _.get(fallback, 'icon')())
  const result = _.cloneDeep(item)

  return Object.assign(result, {
    ...fallback,
    icon: !_.isError(icon) ? icon : null,
    key
  })
}

export function isBalanceInsignificant (source) {
  try {
    if (_.isNilOrEmptyString(source)) {
      return true
    }
    const balance = new BigNumber(source)

    if (
      balance.isZero() ||
      balance.isLessThanOrEqualTo(new BigNumber(macros.MINIMUM_BALANCE_AMOUNT))
    ) {
      return true
    }

    return false
  } catch (e) {
    return true
  }
}
