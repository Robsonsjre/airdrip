const { waffle } = require('hardhat')
const { deployMockContract } = waffle

module.exports = async function createConfigurationManager ({ priceProvider, ivProvider } = {}) {
  const mockConfigurationManager = await deployMockContract(deployer, )

  return mockConfigurationManager
}
