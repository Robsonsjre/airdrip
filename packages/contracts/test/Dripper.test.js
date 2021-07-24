const { ethers } = require('hardhat')
const { expect } = require('chai')

describe('Dripper', () => {
  let Dripper, dripper, configurationManager

  before(async () => {
    Dripper = await ethers.getContractFactory('Dripper')
  })

  beforeEach(async () => {
    dripper = Dripper.deploy(configurationManager.address)
  })

  describe('Option', () => {

  })

  describe('Streaming', () => {

  })
})
