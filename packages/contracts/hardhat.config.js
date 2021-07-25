const path = require('path')

require('dotenv').config({
  path: path.resolve(__dirname, '.env')
})

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-solhint')
require('@nomiclabs/hardhat-etherscan')
require('@tenderly/hardhat-tenderly')

require('./tasks/deployDripper')
require('./tasks/createCampaign')

module.exports = {
  solidity: {
    version: '0.8.4'
  },
  networks: {
    hardhat: {
      loggingEnabled: !!(process.env.BUIDLER_LOGGING_ENABLED) || false,
      chainId: 1337,
      hardfork: 'istanbul',
      // forking: {
      //   url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`
      // }
    },
    kovan: {
      accounts: {
        mnemonic: process.env.DEV_MNEMONIC,
        initialIndex: parseInt(process.env.ADDRESS_INDEX),
        count: 1
      },
      url: 'https://kovan.infura.io/v3/' + process.env.INFURA_PROJECT_ID,
      network_id: 42
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_APIKEY
  },
  tenderly: {
    project: 'Pods-mainnet',
    username: 'Pods-tech'
  },
}
