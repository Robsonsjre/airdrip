import _ from 'lodash'

import SDK from '@pods-finance/sdk'

import { networks } from './atoms'

import IconETH from '../assets/tokens/ETH.png'
import IconWBTC from '../assets/tokens/WBTC.png'
import IconLINK from '../assets/tokens/LINK.png'
import IconDAI from '../assets/tokens/DAI.png'
import IconUSDC from '../assets/tokens/USDC.png'
import IconADAI from '../assets/tokens/ADAI.png'
import IconAUSDC from '../assets/tokens/AUSDC.png'
import IconMATIC from '../assets/tokens/MATIC.png'

export const trust = address =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${_.get(
    address,
    'address'
  )}/logo.png`

const keys = {
  LINK: 'LINK',
  WBTC: 'WBTC',
  ETH: 'ETH',
  WETH: 'WETH',
  USDC: 'USDC',
  DAI: 'DAI',
  AUSDC: 'AUSDC',
  ADAI: 'ADAI',
  PMDAI: 'PMDAI',
  PMUSDC: 'PMUSDC',
  AMUSDC: 'PMUSDC',
  WMATIC: 'WMATIC',
  MATIC: 'MATIC'
}

const tokens = {
  keys,
  general: {
    [keys.ETH]: {
      icon: () => IconETH,
      title: 'Ethereum',
      tag: 'underlying',
      decimals: 18
    },
    [keys.WETH]: {
      icon: () => IconETH,
      title: 'Wrapped Ethereum',
      tag: 'underlying'
    },
    [keys.MATIC]: {
      icon: () => IconMATIC,
      title: 'Matic',
      tag: 'underlying'
    },
    [keys.WMATIC]: {
      icon: () => IconMATIC,
      title: 'Wrapped Matic',
      tag: 'underlying'
    },
    [keys.WBTC]: {
      icon: () => IconWBTC,
      title: 'Wrapped Bitcoin',
      tag: 'underlying'
    },
    [keys.LINK]: {
      icon: () => IconLINK,
      title: 'Chainlink',
      tag: 'underlying'
    },
    [keys.USDC]: {
      icon: () => IconUSDC,
      title: 'USD Coin',
      tag: 'collateral'
    },
    [keys.DAI]: {
      icon: () => IconDAI,
      title: 'DAI Stablecoin',
      tag: 'collateral'
    },
    [keys.AUSDC]: {
      icon: () => IconAUSDC,
      title: 'Aave USD Coin',
      tag: 'collateral'
    },
    [keys.ADAI]: {
      icon: () => IconADAI,
      title: 'Aave DAI Stablecoin',
      tag: 'collateral'
    }
  },
  [networks.mainnet]: {
    [keys.WETH]: {
      symbol: SDK.constants.networks.mainnet.token.symbol,
      address: SDK.constants.networks.mainnet.token.utility[0]
    }
  },
  [networks.kovan]: {
    [keys.WETH]: {
      symbol: SDK.constants.networks.kovan.token.symbol,
      address: SDK.constants.networks.kovan.token.utility[0]
    }
  },
  [networks.matic]: {
    [keys.WMATIC]: {
      symbol: SDK.constants.networks.matic.token.symbol,
      address: SDK.constants.networks.matic.token.utility[0]
    }
  },
  [networks.mumbai]: {
    [keys.WMATIC]: {
      symbol: SDK.constants.networks.mumbai.token.symbol,
      address: SDK.constants.networks.mumbai.token.utility[0]
    },
    [keys.PMUSDC]: {
      icon: () => IconAUSDC,
      title: 'Pods Aave USD Coin',
      tag: 'collateral'
    },
    [keys.PMDAI]: {
      icon: () => IconADAI,
      title: 'Pods Aave DAI Stablecoin',
      tag: 'collateral'
    }
  }
}

export default tokens
