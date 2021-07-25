const { ethers } = require('hardhat')
const { expect } = require('chai')
const getTimestamp = require('./utils/getTimestamp')

describe('Dripper', () => {
  let Dripper, dripper
  let MintableERC20, underlying, strike

  const underlyingAmount = ethers.BigNumber.from('20000000000000000000')
  const strikePrice = ethers.BigNumber.from('1000000000000000000')

  before(async () => {
    ;[Dripper, MintableERC20] = await Promise.all([
      ethers.getContractFactory('Dripper'),
      ethers.getContractFactory('MintableERC20')
    ])
    ;[underlying, strike] = await Promise.all([
      MintableERC20.deploy('UND', 'Underlying'),
      MintableERC20.deploy('STK', 'Strike')
    ])

    underlying.mint(underlyingAmount)
  })

  beforeEach(async () => {
    dripper = Dripper.deploy('0x9A18627A3de4e4B444fbd9357681490EF07A48be', '0x5eb34b5d5c75ce2119078e5b3f6a3f30e457e46b')
  })

  describe('Option', () => {
    it('creates the option and stream', async () => {
      const timestamp = await getTimestamp()
      const tx = dripper.createCampaign(
        underlying.address,
        strike.address,
        underlyingAmount,
        strikePrice,
        timestamp + 60 * 60 * 24 * 3, // 3 days
        timestamp,
        timestamp + 60 * 60 * 24 * 3, // 3 days
      )

      await expect(tx).to.emit('CreateStream')
      await expect(tx).to.emit('OptionCreated')
    })
  })
})
