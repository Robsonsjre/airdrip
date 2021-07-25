import _ from 'lodash'
import Pool from './Pool'
import { getInterpretedToken } from '../utils'

/**
 * @typedef IValue
 * @property {BigNumber} raw
 * @property {BigNumber} humanized
 */
export default class Option {
  /**
   * Static Data
   */

  _element = {}
  _isLoading = {}
  _isCurated = {}
  _warning = {}

  _pool = {}

  /**
   * Dynamic Data
   */

  _sellingPrice
  _buyingPrice

  get element () {
    return this._element
  }

  get isLoading () {
    return this._isLoading
  }

  get isCurated () {
    return this._isCurated
  }

  get warning () {
    return this._warning
  }

  get address () {
    return _.get(this._element, 'address')
  }

  get networkId () {
    return _.get(this._element, 'networkId')
  }

  get symbol () {
    return _.get(this._element, 'symbol')
  }

  get decimals () {
    return _.get(this._element, 'decimals')
  }

  get type () {
    return _.get(this._element, 'type')
  }

  get strikePrice () {
    return _.get(this._element, 'strikePrice')
  }

  get underlying () {
    const base = _.get(this._element, 'underlying')
    return getInterpretedToken(base, _.get(this._element, 'networkId'))
  }

  get strike () {
    const base = _.get(this._element, 'strike')
    return getInterpretedToken(base, _.get(this._element, 'networkId'))
  }

  get expiration () {
    return _.get(this._element, 'expiration')
  }

  get exerciseStart () {
    return _.get(this._element, 'exerciseStart')
  }

  get exerciseWindowSize () {
    return _.get(this._element, 'exerciseWindowSize')
  }

  get factoryAddress () {
    return _.get(this._element, 'factoryAddress')
  }

  get poolAddress () {
    return _.get(this._element, 'poolAddress')
  }

  get pool () {
    return this._pool
  }

  set pool (value) {
    this._pool = value
  }

  get sellingPrice () {
    return this._sellingPrice
  }

  set sellingPrice (value) {
    this._sellingPrice = value
  }

  get buyingPrice () {
    return this._buyingPrice
  }

  set buyingPrice (value) {
    this._buyingPrice = value
  }

  /**
   * @typedef OptionParams
   * @property {object} element
   * @property {object} element.value
   * @property {bool} element.isLoading
   * @property {bool} element.isCurated
   * @property {string | null} element.warning
   *
   *
   * @param {OptionParams} source
   */
  constructor ({ value, warning, isLoading, isCurated }) {
    this._element = value || null
    this._isLoading = isLoading || false
    this._isCurated = isCurated || false
    this._warning = warning || null

    this.pool = new Pool(_.get(value, 'pool'))
  }

  fromSDK () {
    return this._element
  }

  getDurations () {
    return this._element ? this._element.getDurations() : {}
  }

  /**
   * Get the current total supply for this option (amount of locked collateral)
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @returns {BigNumber | null} H! total supply
   */
  async getTotalSupply ({ provider }) {
    if (!this._element || !provider) return null
    const supply = await this._element.getTotalSupply({ provider })
    return _.get(supply, 'humanized')
  }

  /**
   * Get the predefined cap for this option (maximum decided for locked collateral)
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @param {string} params.manager Configuration manager address
   * @returns {BigNumber | null} H! current cap
   */
  async getCap ({ provider, manager }) {
    if (!this._element || !provider || _.isNilOrEmptyString(manager)) {
      return null
    }
    const cap = await this._element.getCap({ provider, manager })
    return _.get(cap, 'humanized')
  }

  /**
   * Get the number of minted options by user
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider Provider instance
   * @param {string} params.user User address
   * @returns {BigNumber | null} H! amount
   */
  async getUserMintedOptions ({ provider, user }) {
    try {
      if (!this._element || !provider || _.isNilOrEmptyString(user)) {
        throw new Error('Base or provider are missing.')
      }

      const amount = await this._element.getUserMintedOptions({
        provider,
        user
      })

      return _.get(amount, 'humanized')
    } catch (e) {
      console.error('[Option]', e)
      return null
    }
  }

  /**
   * Get the amount of assets the user can currently withdraw
   * @param {object} params
   * @param {ethers.providers.Provider} params.provider provider instance
   * @param {string} params.user User address
   * @returns {BigNumber | null} H! amount
   */
  async getUserWithdrawBalances ({ provider, user }) {
    try {
      if (!this._element || !provider || _.isNilOrEmptyString(user)) {
        throw new Error('Base or provider are missing.')
      }
      const balances = await this._element.getUserWithdrawBalances({
        provider,
        user
      })
      if (!_.isArray(balances)) {
        throw new Error('Malformed getUserWithdrawBalances response.')
      }
      return {
        underlying: _.get(balances, '0.humanized'),
        strike: _.get(balances, '1.humanized')
      }
    } catch (e) {
      console.error('[Option]', e)
      return null
    }
  }
}
