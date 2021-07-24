import _ from 'lodash'
import { getInterpretedToken } from '../utils'

export default class Pool {
  /**
   * Static Data
   */

  _element = {}

  /**
   * Dynamic Data
   */

  _totalBalances = {}

  get address () {
    return _.get(this._element, 'address')
  }

  get networkId () {
    return _.get(this._element, 'networkId')
  }

  get tokenA () {
    const base = _.get(this._element, 'tokenA')
    return getInterpretedToken(base, _.get(this._element, 'networkId'))
  }

  get tokenB () {
    const base = _.get(this._element, 'tokenB')
    return getInterpretedToken(base, _.get(this._element, 'networkId'))
  }

  get factoryAddress () {
    return _.get(this._element, 'factoryAddress')
  }

  get optionAddress () {
    return _.get(this._element, 'optionAddress')
  }

  get totalBalances () {
    return this._totalBalances
  }

  set totalBalances (value) {
    this._totalBalances = value
  }

  constructor (source) {
    this._element = source
  }

  /**
   * Get implied volatility
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @returns {BigNumber | null} H! amount
   */
  async getIV ({ provider }) {
    if (!this._element || !provider) return null
    const amount = await this._element.getIV({ provider })
    return _.get(amount, 'humanized')
  }

  /**
   * Get ABPrice (BS)
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @returns {BigNumber | null} H! amount
   */
  async getABPrice ({ provider }) {
    if (!this._element || !provider) return null
    try {
      const result = await this._element.getABPrice({ provider })
      return {
        value: _.get(result, 'value.humanized')
      }
    } catch (e) {
      console.error('[Pool]', e)
      return null
    }
  }

  /**
   * Get buying price for specified options amount
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @param {BigNumber} params.amount amountOfOptions H! amount of options willing to buy
   * @returns {object | null} H! amounts
   */
  async getBuyingPrice ({ provider, amount }) {
    try {
      if (!this._element || !provider || !amount) return null

      const result = await this._element.getBuyingPrice({
        provider,
        amount
      })

      const fees = _.get(result, 'feesA.humanized').plus(
        _.get(result, 'feesB.humanized')
      )

      return {
        value: _.get(result, 'value.humanized'),
        feesA: _.get(result, 'feesA.humanized'),
        feesB: _.get(result, 'feesB.humanized'),
        fees
      }
    } catch (e) {
      console.error('[Pool]', e)
      return null
    }
  }

  /**
   * Get buying price for estimated investment size
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @param {BigNumber} params.amount amountOfStrike H! amount of tokens (strike) willing to pay
   * @returns { object | null} H! amounts
   */
  async getBuyingEstimateForPrice ({ provider, amount }) {
    try {
      if (!this._element || !provider || !amount) return null
      const result = await this._element.getBuyingEstimateForPrice({
        provider,
        amount
      })

      const fees = _.get(result, 'feesA.humanized').plus(
        _.get(result, 'feesB.humanized')
      )

      return {
        value: _.get(result, 'value.humanized'),
        feesA: _.get(result, 'feesA.humanized'),
        feesB: _.get(result, 'feesB.humanized'),
        fees
      }
    } catch (e) {
      console.error('[Pool]', e)
      return null
    }
  }

  /**
   * Get selling price for specified options amount
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @param {BigNumber} params.amount amountOfOptions H! amount of tokens (strike) willing to pay
   * @returns {object | null} H! amounts
   */
  async getSellingPrice ({ provider, amount }) {
    try {
      if (!this._element || !provider || !amount) return null
      const result = await this._element.getSellingPrice({
        provider,
        amount
      })

      const fees = _.get(result, 'feesA.humanized').plus(
        _.get(result, 'feesB.humanized')
      )

      return {
        value: _.get(result, 'value.humanized'),
        feesA: _.get(result, 'feesA.humanized'),
        feesB: _.get(result, 'feesB.humanized'),
        fees
      }
    } catch (e) {
      console.error('[Pool]', e)
      return null
    }
  }

  /**
   * @typedef TotalBalancesResult
   * @property {BigNumber} tokenA
   * @property {BigNumber} tokenB
   *
   * Get size of the pool for both sides
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @returns {TotalBalancesResult | null[]} H![] total balances
   */
  async getTotalBalances ({ provider }) {
    try {
      if (!this._element || !provider) { throw new Error('Base or provider are missing.') }
      const price = await this._element.getTotalBalances({ provider })
      if (!_.isArray(price)) {
        throw new Error('Malformed getTotalBalances response.')
      }
      return {
        tokenA: _.get(price, '0.humanized'),
        tokenB: _.get(price, '1.humanized')
      }
    } catch (e) {
      console.error('[Pool]', e)
      return null
    }
  }

  /**
   * @typedef FeeBalancesResult
   * @property {BigNumber} tokenA
   * @property {BigNumber} tokenB
   *
   *
   * Get size of the pool for both sides
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @returns {FeeBalancesResult | null[]} H![] fee balances
   */
  async getFeeBalances ({ provider }) {
    try {
      if (!this._element || !provider) { throw new Error('Base or provider are missing.') }
      const price = await this._element.getFeeBalances({ provider })
      if (!_.isArray(price)) {
        throw new Error('Malformed getFeeBalances response.')
      }
      return {
        tokenA: _.get(price, '0.humanized'),
        tokenB: _.get(price, '1.humanized')
      }
    } catch (e) {
      console.error('[Pool]', e)
      return null
    }
  }

  /**
   * Get the predefined cap for this option (maximum decided for locked collateral)
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @param {string} params.manager Configuration manager address
   * @returns {BigNumber | null} H! current cap
   */
  async getCap ({ provider, manager }) {
    if (!this._element || !provider || _.isNilOrEmptyString(manager)) { return null }
    const cap = await this._element.getCap({ provider, manager })
    return _.get(cap, 'humanized')
  }

  /**
   * Get size of user position for both pool sides
   * @typedef UserPositionResult
   * @property {BigNumber} tokenA
   * @property {BigNumber} tokenB
   *
   *
   * Get position of the user
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @param {string} params.user User address
   * @returns {UserPositionResult | null} H! user positions
   */
  async getUserPosition ({ provider, user }) {
    try {
      if (!this._element || !provider) { throw new Error('Base or provider are missing.') }
      const price = await this._element.getUserPosition({ provider, user })
      if (!_.isArray(price)) {
        throw new Error('Malformed getUserPosition response.')
      }
      return {
        tokenA: _.get(price, '0.humanized'),
        tokenB: _.get(price, '1.humanized')
      }
    } catch (e) {
      console.error('[Pool]', e)
      return null
    }
  }
}
