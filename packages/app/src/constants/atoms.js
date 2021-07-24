import _ from 'lodash'
import BigNumber from 'bignumber.js'

BigNumber.config({ EXPONENTIAL_AT: 256 })
export const MAX_UINT = new BigNumber(2).exponentiatedBy(256).minus(1)

export const MODAL_PORTAL = 'defuse-modal__container'

export const modals = {}

export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
export const MATIC_ADDRESS = '0xMmmmmMmmmmMmMmmMmMmMmmMMMmmmmMmmmmmmmMMmM'
export const ETH_DECIMALS = 18
export const MATIC_DECIMALS = 18

export const ___RANDOM_NUMBER = 3

export const ENVIRONMENT = {
  current: String(
    process.env.REACT_APP_PODS_ENV || process.env.NODE_ENV || 'development'
  ).toLowerCase(),
  development: 'development',
  production: 'production',
  staging: 'staging',
  experimental: 'experimental',
  isDevelopment: () => ENVIRONMENT.current === ENVIRONMENT.development,
  isProduction: () => ENVIRONMENT.current === ENVIRONMENT.production,
  isStaging: () => ENVIRONMENT.current === ENVIRONMENT.staging,
  isExperimental: () => ENVIRONMENT.current === ENVIRONMENT.experimental
}

export const networks = {
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
  xDai: 100,
  mumbai: 80001,
  matic: 137,
  local: 1337,
  _data: {
    1: {
      name: 'Mainnet',
      averageBlockTime: 15,
      scanner: 'https://etherscan.io/tx/',
      subgraph: 'https://api.thegraph.com/subgraphs/name/pods-finance/pods',
      subgraphDev:
        'https://api.thegraph.com/subgraphs/name/pods-finance/pods-dev'
    },
    3: {
      name: 'Ropsten',
      averageBlockTime: null,
      scanner: 'ropsten.etherscan.io/tx/'
    },
    4: {
      name: 'Rinkeby',
      averageBlockTime: null,
      scanner: 'rinkeby.etherscan.io/tx/'
    },
    5: {
      name: 'Goerli',
      averageBlockTime: null,
      scanner: 'goerli.etherscan.io/tx/'
    },
    42: {
      name: 'Kovan',
      averageBlockTime: 4,
      scanner: 'https://kovan.etherscan.io/tx/',
      faucet: 'https://faucet.kovan.network/',
      subgraph:
        'https://api.thegraph.com/subgraphs/name/pods-finance/pods-kovan',
      subgraphDev:
        'https://api.thegraph.com/subgraphs/name/pods-finance/pods-kovan-dev'
    },
    100: {
      name: 'xDai',
      averageBlockTime: null,
      scanner: 'https://blockscout.com/poa/xdai/mainnet/tx/'
    },
    137: {
      name: 'Matic',
      averageBlockTime: null,
      scanner: 'https://explorer-mainnet.maticvigil.com/tx/',
      subgraph:
        'https://api.thegraph.com/subgraphs/name/pods-finance/pods-matic',
      subgraphDev:
        'https://api.thegraph.com/subgraphs/name/pods-finance/pods-matic-dev'
    },
    80001: {
      name: 'Mumbai',
      averageBlockTime: 4,
      scanner: 'https://explorer-mumbai.maticvigil.com/tx/',
      faucet: 'https://faucet.matic.network/',
      subgraph:
        'https://api.thegraph.com/subgraphs/name/pods-finance/pods-mumbai',
      subgraphDev:
        'https://api.thegraph.com/subgraphs/name/pods-finance/pods-mumbai-dev'
    },
    1337: {
      name: 'Local',
      averageBlockTime: null,
      scanner: ''
    }
  },
  _supported: [1, 42, 1337, 137, 80001]
}

export const etherscaned = (tx, networkId = networks.kovan) =>
  `${_.get(networks, `_data[${networkId}]scanner`)}${tx}`

export const subgraphed = (networkId = networks.kovan) =>
  ENVIRONMENT.isProduction()
    ? _.get(networks, `_data[${networkId}]subgraph`)
    : _.get(networks, `_data[${networkId}]subgraphDev`)

export const pointToInfura = (networkId, key) => {
  const enpoints = {
    [networks.mainnet]: `https://mainnet.infura.io/v3/${key}`,
    [networks.kovan]: `https://kovan.infura.io/v3/${key}`,
    [networks.matic]: `https://polygon-mainnet.infura.io/v3/${key}`,
    [networks.mumbai]: `https://polygon-mumbai.infura.io/v3/${key}`
  }

  return enpoints[networkId] || enpoints[networks.mainnet]
}

export const faucetLink = (networkId = networks.kovan) =>
  `${_.get(networks, `_data[${networkId}]faucet`)}`

export const networkName = (networkId = networks.kovan) =>
  `${_.get(networks, `_data[${networkId}]name`)}`

export const prefs = {
  isTermsOfServiceAccepted: 'isTermsOfServiceAccepted',
  isAnalyticsEnabled: 'isAnalyticsEnabled',
  isDarkTheme: 'isDarkTheme',
  isAdvancedModeEnabled: 'isAdvancedModeEnabled'
}
