import BigNumber from 'bignumber.js'

import tokens from './tokens'
import * as atoms from './atoms'

export * from './addresses'
export * from './atoms'
export * from './pages'
export { tokens }

const COMMON_PRECISION = 10

export const macros = {
  ETH_ADDRESS: atoms.ETH_ADDRESS,

  ARBITRARILY_HIGH_APPROVAL_AMOUNT: 100000000,
  PREMIUM_TOKEN_SYMBOL: 'USDC',
  EXERCISE_WINDOW: 60 * 60 * 24 * 1,
  EXPIRY_NOTICE_TIME: 60 * 60 * 24 * 4,
  EXPIRY_NOTICE_TIME_LONG: 60 * 60 * 24 * 7,

  RESTRICTED_APR: '-',
  RESTRICTED_PREMIUM: '-',

  SUPPORTED_UNDERLYING: [
    tokens.keys.WBTC,
    tokens.keys.ETH,
    tokens.keys.LINK,
    tokens.keys.MATIC
  ],
  SUPPORTED_COLLATERAL: [
    tokens.keys.ADAI,
    tokens.keys.AUSDC,
    tokens.keys.DAI,
    tokens.keys.USDC
  ],
  DEFAULT_SLIPPAGE: 0.05,
  DEFAULT_TIMEOUT: 60 * 20, // 20 minutes

  WEB3_MODAL_IDENTIFIER: 'WEB3_CONNECT_CACHED_PROVIDER',

  COMMON_PRECISION,
  MINIMUM_BALANCE_AMOUNT: new BigNumber(0.1).pow(COMMON_PRECISION).toNumber(),

  ACTIVITY_PAGINATOR: 15,
  DEFAULT_NETWORK_ID: 137
}
