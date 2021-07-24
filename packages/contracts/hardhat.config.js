const path = require('path')

require('dotenv').config({
  path: path.resolve(__dirname, '.env')
})

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-solhint')

module.exports = {
  solidity: {
    version: '0.8.4'
  },
  networks: {
    hardhat: {
      loggingEnabled: !!(process.env.BUIDLER_LOGGING_ENABLED) || false,
      chainId: 1337,
      hardfork: 'istanbul'
    }
  }
}
