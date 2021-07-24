const { ethers } = require('hardhat')
const { expect } = require('chai')

describe('Defuse', () => {
  let Product, product, configurationManager

  before(async () => {
    Product = await ethers.getContractFactory('Defuse')
  })

  beforeEach(async () => {
    product = Product.deploy(configurationManager.address)
  })

  describe('Option', () => {

  })

  describe('Streaming', () => {

  })

  describe('Trading venue', () => {

  })
})
