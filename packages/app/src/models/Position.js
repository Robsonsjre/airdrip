import _ from 'lodash'
import React from 'react'
import BigNumber from 'bignumber.js'
import Option from './Option'
import { macros, pages } from '../constants'
import { toNumeralPrice, toQuantity } from '../utils'

const h = source => _.get(source, 'humanized')

/**
 * @typedef IValue
 * @property {BigNumber} raw
 * @property {BigNumber} humanized
 */
export default class Position {
  /**
   * Static Data
   */

  _element = {}
  _option = null
  _isValid = false

  _premiumPaid
  _premiumReceived
  _optionsSold
  _optionsBought
  _optionsResold
  _optionsMinted
  _optionsExercised
  _optionsSent
  _optionsReceived
  _underlyingWithdrawn
  _collateralWithdrawn
  _initialOptionsProvided
  _initialTokensProvided
  _finalOptionsRemoved
  _finalTokensRemoved

  get underlyingWithdrawn () {
    return this._underlyingWithdrawn
  }

  get collateralWithdrawn () {
    return this._collateralWithdrawn
  }

  get initialOptionsProvided () {
    return this._initialOptionsProvided
  }

  get initialTokensProvided () {
    return this._initialTokensProvided
  }

  get finalOptionsRemoved () {
    return this._finalOptionsRemoved
  }

  get finalTokensRemoved () {
    return this._finalTokensRemoved
  }

  get optionsResold () {
    return this._optionsResold
  }

  get optionsMinted () {
    return this._optionsMinted
  }

  get optionsExercised () {
    return this._optionsExercised
  }

  get optionsSent () {
    return this._optionsSent
  }

  get optionsReceived () {
    return this._optionsReceived
  }

  get optionsBought () {
    return this._optionsBought
  }

  get optionsSold () {
    return this._optionsSold
  }

  get premiumReceived () {
    return this._premiumReceived
  }

  get premiumPaid () {
    return this._premiumPaid
  }

  get element () {
    return this._element
  }

  get option () {
    return this._option
  }

  get isValid () {
    return this._isValid
  }

  get id () {
    return _.get(this._element, 'id')
  }

  get networkId () {
    return _.get(this._element, 'networkId')
  }

  constructor ({ value }) {
    this._element = value

    if (_.isNil(this._element)) {
      this._isValid = false
      return
    }
    try {
      this._isValid = true
      this._option = new Option({
        value: value.option,
        warning: null,
        isLoading: false
      })

      this._premiumPaid = h(this._element.getPremiumPaidValue())
      this._premiumReceived = h(this._element.getPremiumReceivedValue())

      this._optionsBought = h(this._element.getOptionsBoughtValue())
      this._optionsSold = h(this._element.getOptionsSoldValue())
      this._optionsResold = h(this._element.getOptionsResoldValue())

      this._optionsMinted = h(this._element.getOptionsMintedValue())
      this._optionsUnminted = h(this._element.getOptionsUnmintedValue())
      this._optionsExercised = h(this._element.getOptionsExercisedValue())

      this._optionsSent = h(this._element.getOptionsSentValue())
      this._optionsReceived = h(this._element.getOptionsReceivedValue())

      this._underlyingWithdrawn = h(this._element.getUnderlyingWithdrawnValue())
      this._collateralWithdrawn = h(this._element.getCollateralWithdrawnValue())

      this._initialOptionsProvided = h(
        this._element.getInitialOptionsProvidedValue()
      )
      this._initialTokensProvided = h(
        this._element.getInitialTokensProvidedValue()
      )

      this._finalOptionsRemoved = h(this._element.getFinalOptionsRemovedValue())
      this._finalTokensRemoved = h(this._element.getFinalTokensRemovedValue())
    } catch (error) {
      console.error('Position', error)
    }
  }

  fromSDK () {
    return this._element
  }

  getValues ({ dynamics }) {
    const strike = _.get(this, 'option.strikePrice.humanized')
    const pnl = _.get(this, 'premiumReceived').minus(_.get(this, 'premiumPaid'))

    if (dynamics) {
      const poolPositions = _.get(dynamics, 'userPositions')
      const balance = _.get(dynamics, 'userOptionBalance.humanized')
      const minted = _.get(dynamics, 'userOptionMintedAmount.humanized')
      const price = _.get(dynamics, 'sellingPrice.value.humanized')

      let poolPositionsValue = new BigNumber(0)
      if (
        !_.isNil(_.get(poolPositions, '1.humanized')) &&
        !_.isNil(_.get(poolPositions, '0.humanized'))
      ) {
        const unmintable = BigNumber.min(
          minted,
          _.get(poolPositions, '0.humanized')
        )

        const surplus = _.get(poolPositions, '0.humanized').minus(unmintable)

        poolPositionsValue = _.get(poolPositions, '1.humanized').plus(
          unmintable.times(strike)
        )
        if (surplus && !surplus.isZero() && price && !price.isZero()) {
          poolPositionsValue = poolPositionsValue.plus(surplus.times(price))
        }
      }

      const exits = price && !price.isZero() ? price.times(balance) : null

      return {
        poolPositions,
        poolPositionsValue,
        pnl,
        exits
      }
    } else {
      return {
        pnl
      }
    }
  }

  getSimulatedExercisePNL ({ strike, market, balance }) {
    let result
    if (market && !market.isZero() && strike && !strike.isZero()) {
      if (strike.isLessThanOrEqualTo(market)) result = new BigNumber(-1)
      else if (
        balance &&
        !balance.isZero() &&
        !balance.isLessThan(macros.MINIMUM_BALANCE_AMOUNT)
      ) {
        result = balance.times(strike.minus(market))
      }
    }
    return result
  }

  /**
   * ---------------------------------------------
   * Buy Box - Ongoing, before expiration
   * ---------------------------------------------
   */

  getBoxBuyOngoing ({ market, balance, setOpen, doVisit }) {
    return PositionHelper.getBoxBuyOngoing({
      position: this,
      market,
      balance,
      setOpen,
      doVisit
    })
  }

  getBoxBuyOngoingFallback ({ doVisit }) {
    return PositionHelper.getBoxBuyOngoingFallback({
      position: this,
      doVisit
    })
  }

  /**
   * ---------------------------------------------
   * Sell Box - Ongoing, before expiration
   * ---------------------------------------------
   */

  getBoxSellOngoing ({ tokens, setOpen, doVisit }) {
    return PositionHelper.getBoxSellOngoing({
      position: this,
      tokens,
      setOpen,
      doVisit
    })
  }

  getBoxSellOngoingFallback ({ doVisit }) {
    return PositionHelper.getBoxSellOngoingFallback({
      position: this,
      doVisit
    })
  }

  /**
   * ---------------------------------------------
   * Liquidity Box - Ongoing, before expiration
   * ---------------------------------------------
   */

  getBoxLiquidityOngoing ({ tokens, values, setOpen, doVisit }) {
    return PositionHelper.getBoxLiquidityOngoing({
      position: this,
      tokens,
      values,
      setOpen,
      doVisit
    })
  }

  getBoxLiquidityOngoingFallback ({ doVisit }) {
    return PositionHelper.getBoxLiquidityOngoingFallback({
      position: this,
      doVisit
    })
  }

  /**
   * ---------------------------------------------
   * Buy Box - Ended, after expiration
   * ---------------------------------------------
   */

  getBoxBuyExpired ({ tokens, setOpen, doVisit }) {
    return PositionHelper.getBoxBuyExpired({
      position: this,
      tokens,
      setOpen,
      doVisit
    })
  }

  getBoxBuyExpiredFallback ({ doVisit }) {
    return PositionHelper.getBoxBuyExpiredFallback({
      doVisit
    })
  }

  /**
   * ---------------------------------------------
   * Sell Box - Ended, after expiration
   * ---------------------------------------------
   */

  getBoxSellExpired ({ tokens, setOpen, doVisit }) {
    return PositionHelper.getBoxSellExpired({
      position: this,
      tokens,
      setOpen,
      doVisit
    })
  }

  getBoxSellExpiredFallback ({ doVisit }) {
    return PositionHelper.getBoxSellExpiredFallback({
      doVisit
    })
  }

  /**
   * ---------------------------------------------
   * Liquidity Box - Ended, after expiration
   * ---------------------------------------------
   */

  getBoxLiquidityExpired ({ tokens, values, setOpen, doVisit }) {
    return PositionHelper.getBoxLiquidityExpired({
      position: this,
      tokens,
      setOpen,
      doVisit
    })
  }

  getBoxLiquidityExpiredFallback ({ doVisit }) {
    return PositionHelper.getBoxLiquidityExpiredFallback({
      doVisit
    })
  }
}

export class PositionHelper {
  /**
   * ---------------------------------------------
   * Buy Box - Ongoing, before expiration
   * ---------------------------------------------
   */

  static getBoxBuyOngoingFallback ({ position, doVisit }) {
    const address = _.get(position, 'option.address')
    return {
      title: 'Options bought',
      action: 'Buy options',
      activity: null,
      onActionClick: () => {
        doVisit(pages.transactionHedge.builder(address))
      }
    }
  }

  static getBoxBuyOngoing ({ position, market, balance, setOpen, doVisit }) {
    const address = _.get(position, 'option.address')
    const strike = h(_.get(position, 'option.strikePrice'))
    const simulated = position.getSimulatedExercisePNL({
      strike,
      market,
      balance
    })

    return {
      title: 'Options bought',
      action: 'Buy more',
      activity: [
        {
          label: 'Lifetime buys',
          value: toQuantity(
            toNumeralPrice(_.get(position, 'optionsBought'), false),
            'option'
          )
        },
        {
          label: 'Available options',
          value: toQuantity(toNumeralPrice(balance, false), 'option')
        }
      ],
      total: [
        {
          label: 'Simulated profits',
          value: simulated
            ? simulated.isNegative()
              ? 'Out-of-money'
              : toNumeralPrice(simulated)
            : '-',
          isSimulated: true
        },
        {
          label: 'Total premium paid',
          value: `-${toNumeralPrice(_.get(position, 'premiumPaid'))}`
        }
      ],
      onActionClick: () => {
        doVisit(pages.transactionHedge.builder(address))
      },
      onBreakdownClick: () => {
        setOpen(
          true,
          PositionHelper.getBreakdownBuyOngoing({
            position,
            market,
            strike,
            balance,
            simulated
          })
        )
      }
    }
  }

  static getBreakdownBuyOngoing ({
    position,
    market,
    strike,
    balance,
    simulated
  }) {
    return {
      title: 'Options bought',
      sections: [
        {
          title: 'Lifetime buys',
          description: (
            <>
              Your lifetime buys show how many of these options you have
              acquired. This amount was calculated at{' '}
              <b>
                {toQuantity(
                  toNumeralPrice(_.get(position, 'optionsBought'), false),
                  'option'
                )}
              </b>
              .<br /> As this is a "volume" metric, if you were to do a cycle of
              buy - resell - buy again, the values would add everytime on top of
              this "lifetime" amount.
            </>
          )
        },
        {
          title: 'Available options',
          description: (
            <>
              The available options represent the amount of option tokens you
              currently have <b>in your wallet</b>. This amount was calculated
              at <b>{toQuantity(toNumeralPrice(balance, false), 'option')}</b>.
              If this series ends in the money, you'll be able to exercise these
              options during the 24h window.
            </>
          )
        },
        {
          title: 'Simulated profits',
          description: (
            <>
              Let's imagine that the exercise window would be right now. We
              would exercise and sell immediately at a market price of{' '}
              <b>{toNumeralPrice(market)}</b>. With our{' '}
              <b>{toQuantity(toNumeralPrice(balance, false), 'option')}</b>{' '}
              available,{' '}
              {!simulated || simulated.isNegative() ? (
                <>
                  we wouldn't make a profit because the option is out of the
                  money, with a strike <b>{toNumeralPrice(strike)}</b> lower
                  than the market price
                </>
              ) : (
                <>
                  we would make a profit of <b>{toNumeralPrice(simulated)}</b>{' '}
                  based on the difference between the strike{' '}
                  <b>{toNumeralPrice(strike)}</b> and the higher market price.
                  This options would end in the money.
                </>
              )}
            </>
          )
        },
        {
          title: 'Premium paid',
          description: (
            <>
              For each buy transaction you will have to pay a premium (cost of
              the options).
            </>
          )
        }
      ]
    }
  }

  /**
   * ---------------------------------------------
   * Sell Box - Ongoing, before expiration
   * ---------------------------------------------
   */

  static getBoxSellOngoingFallback ({ position, doVisit }) {
    const address = _.get(position, 'option.address')
    return {
      title: 'Options sold',
      action: 'Sell options',
      activity: null,
      onActionClick: () => {
        doVisit(pages.transactionInvest.builder(address))
      }
    }
  }

  static getBoxSellOngoing ({ position, tokens, setOpen, doVisit }) {
    const address = _.get(position, 'option.address')
    const strike = h(_.get(position, 'option.strikePrice'))

    return {
      title: 'Options sold',
      action: 'Sell more',
      activity: [
        {
          label: 'Resold options',
          value: toQuantity(
            toNumeralPrice(_.get(position, 'optionsResold'), false),
            'option'
          )
        },
        {
          label: 'Written options',
          value: toQuantity(
            toNumeralPrice(_.get(position, 'optionsSold'), false),
            'option'
          )
        }
      ],
      total: [
        {
          label: 'Total premium received',
          value: `+${toNumeralPrice(_.get(position, 'premiumReceived'))}`
        }
      ],
      onActionClick: () => {
        doVisit(pages.transactionInvest.builder(address))
      },
      onBreakdownClick: () => {
        setOpen(
          true,
          PositionHelper.getBreakdownSellOngoing({
            position,
            strike,
            tokens
          })
        )
      }
    }
  }

  static getBreakdownSellOngoing ({ position, strike, tokens }) {
    const locked = _.get(position, 'optionsSold').times(strike)

    return {
      title: 'Options sold',
      sections: [
        {
          title: 'Resold options',
          description: (
            <>You can buy options and resell them later for a profit.</>
          )
        },
        {
          title: 'Written options',
          description: (
            <>
              To become an option writer, you need to lock collateral and mint
              option tokens. These will be sold to the AMM for a premium. Over
              the lifetime of this options, your volume of written options was{' '}
              <b>
                {toQuantity(
                  toNumeralPrice(_.get(position, 'optionsSold'), false),
                  'option'
                )}
              </b>{' '}
              would lock up to{' '}
              <b>
                {toNumeralPrice(locked, false)} ${_.get(tokens, '2.symbol')}
              </b>
              . If you engage in a sell - buy cycle, this <b>volume</b> will
              keep increasing, even though your portfolio situation may be
              different.
            </>
          )
        },
        {
          title: 'Premium received',
          description: (
            <>
              For each sell (either as a writer or as a reseller) you will
              receive a premium.
            </>
          )
        }
      ]
    }
  }

  /**
   * ---------------------------------------------
   * Liquidity Box - Ongoing, before expiration
   * ---------------------------------------------
   */

  static getBoxLiquidityOngoingFallback ({ position, doVisit }) {
    const address = _.get(position, 'option.address')
    return {
      title: 'Liquidity provided',
      action: 'Manage',
      activity: null,
      onActionClick: () => {
        doVisit(pages.transactionPool.builder(address))
      }
    }
  }

  static getBoxLiquidityOngoing ({
    position,
    values,
    tokens,
    setOpen,
    doVisit
  }) {
    const address = _.get(position, 'option.address')
    // const strike = h(_.get(position, 'option.strikePrice'))

    // const volume = _.get(position, 'initialOptionsProvided')
    //   .times(strike)
    //   .plus(_.get(position, 'initialTokensProvided'))

    return {
      title: 'Liquidity provided',
      action: 'Manage',
      activity: [
        {
          label: 'Your deposits',
          value: `${toNumeralPrice(
            _.get(position, 'initialOptionsProvided'),
            false
          )} op. & ${toNumeralPrice(
            _.get(position, 'initialTokensProvided'),
            false
          )} ${_.get(tokens, '2.symbol')}`
        },
        {
          label: 'Your removals',
          value: `${toNumeralPrice(
            _.get(position, 'finalOptionsRemoved'),
            false
          )} op. & ${toNumeralPrice(
            _.get(position, 'finalTokensRemoved'),
            false
          )} ${_.get(tokens, '2.symbol')}`
        }
      ],
      total: [
        {
          label: 'Position value',
          value: `${toNumeralPrice(values.poolPositionsValue, false)} ${_.get(
            tokens,
            '2.symbol'
          )}`,
          isSimulated: true
        },
        {
          label: 'Position comp.',
          value: `${toNumeralPrice(
            _.get(values, 'poolPositions.0.humanized'),
            false
          )} op. & ${toNumeralPrice(
            _.get(values, 'poolPositions.1.humanized'),
            false
          )} ${_.get(tokens, '2.symbol')}`
        }
      ],
      onActionClick: () => {
        doVisit(pages.transactionPool.builder(address))
      },
      onBreakdownClick: () => {
        setOpen(
          true,
          PositionHelper.getBreakdownLiquidityOngoing({
            tokens
          })
        )
      }
    }
  }

  static getBreakdownLiquidityOngoing ({ tokens }) {
    return {
      title: 'Liquidity provided',
      sections: [
        {
          title: 'Your deposit volume',
          description: (
            <>
              Each time you deposit into the pools, this volume will increase.
              If after the intial deposits, you notice a difference between that
              amount and the actual pool position, you may have experienced
              impermanent loss or gain.
            </>
          )
        },
        {
          title: 'Position value',
          description: (
            <>
              The current value of your position in the pool, denominated in{' '}
              <b>{_.get(tokens, '2.symbol')}</b>. To calculate it, we sum the{' '}
              <code>balances of tokenB</code> (stablecoins) with the{' '}
              <code>value</code> of the balance of tokenA in the pool. For the
              latter, we look at how many options you can unmint and convert
              those based on the option strike price. If there's any{' '}
              <code>surplus</code> left, we'll check for how much we could
              resell that (slippage and fees not taken into account).
              <br />
              <br />
              Reminder: when you add liquidity, the protocol will split your{' '}
              <b>{_.get(tokens, '2.symbol')}</b> into a combination of options
              and stablecoins for the AMM to trade.
            </>
          )
        },
        {
          title: 'Position composition',
          description: (
            <>
              The actual amounts you hold in each side of the pool. To convert
              it all back to <b>{_.get(tokens, '2.symbol')}</b> you will need to
              remove liquidity, unmint to unlock collateral and sell any surplus
              to the AMM.
            </>
          )
        }
      ]
    }
  }

  /**
   * ---------------------------------------------
   * Buy Box - Ended, after expiration
   * ---------------------------------------------
   */

  static getBoxBuyExpiredFallback ({ doVisit }) {
    return {
      title: 'Options bought',
      action: 'See more',
      activity: null,
      onActionClick: () => {
        doVisit(pages.hedge.builder())
      }
    }
  }

  static getBoxBuyExpired ({ position, tokens, setOpen, doVisit }) {
    const address = _.get(position, 'option.address')
    const strike = h(_.get(position, 'option.strikePrice'))

    return {
      title: 'Options bought',
      action: 'Buy page',
      activity: [
        {
          label: 'Lifetime buys',
          value: toQuantity(
            toNumeralPrice(_.get(position, 'optionsBought'), false),
            'option'
          )
        },
        {
          label: 'Exercised options',
          value: toQuantity(
            toNumeralPrice(_.get(position, 'optionsExercised'), false),
            'option'
          )
        }
      ],
      total: [
        {
          label: 'Collateral received',
          value: `${toNumeralPrice(
            _.get(position, 'optionsExercised').times(strike),
            false
          )} ${_.get(tokens, '1.symbol')}`
        },
        {
          label: 'Total premium paid',
          value: `-${toNumeralPrice(_.get(position, 'premiumPaid'))}`
        }
      ],
      onActionClick: () => {
        doVisit(pages.transactionHedge.builder(address))
      },
      onBreakdownClick: () => {
        setOpen(
          true,
          PositionHelper.getBreakdownBuyExpired({
            position,
            strike,
            tokens
          })
        )
      }
    }
  }

  static getBreakdownBuyExpired ({ position, strike, tokens }) {
    const durations = _.attempt(() => _.get(position, 'option').getDurations())

    return {
      title: 'Options bought',
      sections: [
        {
          title: 'Lifetime buys',
          description: (
            <>
              Your lifetime buys show how many of these options you have
              acquired. This amount was calculated at{' '}
              <b>
                {toQuantity(
                  toNumeralPrice(_.get(position, 'optionsBought'), false),
                  'option'
                )}
              </b>
              .<br /> As this is a "volume" metric, if you were to do a cycle of
              buy - resell - buy again, the values would add everytime on top of
              this "lifetime" amount.
            </>
          )
        },
        {
          title: 'Exercised options',
          description: (
            <>
              During the exercise window on{' '}
              {_.get(durations, 'exerciseStartFormattedWithHour')} you've
              exercised{' '}
              <b>
                {toQuantity(
                  toNumeralPrice(_.get(position, 'optionsExercised'), false),
                  'option'
                )}
              </b>
              . This means that you've swapped{' '}
              <b>
                {toNumeralPrice(_.get(position, 'optionsExercised'), false)}{' '}
                {_.get(tokens, '0.symbol')}
              </b>{' '}
              for{' '}
              <b>
                {toNumeralPrice(
                  _.get(position, 'optionsExercised').times(strike),
                  false
                )}{' '}
                {_.get(tokens, '1.symbol')}
              </b>{' '}
              at a strike price of <b>{toNumeralPrice(strike)}</b>.
            </>
          )
        },
        {
          title: 'Collateral received',
          description: (
            <>
              To exercise options, you will send option tokens and an amount of
              underlying asset (<b>{_.get(tokens, '0.symbol')}</b>) to receive
              the collateral (<b>{_.get(tokens, '1.symbol')}</b>) in return.
            </>
          )
        },
        {
          title: 'Premium paid',
          description: (
            <>
              For each buy transaction you will have to pay a premium (cost of
              the options).
            </>
          )
        }
      ]
    }
  }

  /**
   * ---------------------------------------------
   * Sell Box - Ended, after expiration
   * ---------------------------------------------
   */

  static getBoxSellExpiredFallback ({ doVisit }) {
    return {
      title: 'Options sold',
      action: 'See more',
      activity: null,
      onActionClick: () => {
        doVisit(pages.invest.builder())
      }
    }
  }

  static getBoxSellExpired ({ position, tokens, setOpen, doVisit }) {
    const address = _.get(position, 'option.address')
    const strike = h(_.get(position, 'option.strikePrice'))
    const withdrawable = _.get(position, 'underlyingWithdrawn').plus(
      _.get(position, 'collateralWithdrawn')
    )

    return {
      title: 'Options sold',
      action: 'Sell page',
      support: 'Withdraw',
      activity: [
        {
          label: 'Resold options',
          value: toQuantity(
            toNumeralPrice(_.get(position, 'optionsResold'), false),
            'option'
          )
        },
        {
          label: 'Written options',
          value: toQuantity(
            toNumeralPrice(_.get(position, 'optionsSold'), false),
            'option'
          )
        }
      ],
      total: [
        {
          label: 'Withdrawn',
          value: `${withdrawable.isZero() ? '🚨' : ''} ${toNumeralPrice(
            _.get(position, 'underlyingWithdrawn'),
            false
          )} ${_.get(tokens, '0.symbol')} & ${toNumeralPrice(
            _.get(position, 'collateralWithdrawn'),
            false
          )} ${_.get(tokens, '1.symbol')} `
        },
        {
          label: 'Total premium received',
          value: `+${toNumeralPrice(_.get(position, 'premiumReceived'))}`
        }
      ],
      onActionClick: () => {
        doVisit(pages.transactionInvest.builder(address))
      },
      onSupportClick: () => {
        doVisit(pages.transactionInvest.builder(address))
      },
      onBreakdownClick: () => {
        setOpen(
          true,
          PositionHelper.getBreakdownSellExpired({
            position,
            strike,
            tokens
          })
        )
      }
    }
  }

  static getBreakdownSellExpired ({ position, strike, tokens }) {
    const locked = _.get(position, 'optionsSold').times(strike)

    return {
      title: 'Options sold',
      sections: [
        {
          title: 'Withdrawn (funds)',
          description: (
            <>
              When you offer to write options, you take on the risk of getting
              exercised. This means the buyers can exercise their options,
              swapping the underlying asset (<b>{_.get(tokens, '0.symbol')}</b>)
              with your collateral (<b>{_.get(tokens, '1.symbol')}</b>) at a
              fixed strike price (<b>{toNumeralPrice(strike)}</b>). <br />
              <br />
              From the same tab, you'll also be able to withdraw collateral that
              was locked when providing liquidity.
            </>
          )
        },
        {
          title: 'Resold options',
          description: (
            <>You can buy options and resell them later for a profit.</>
          )
        },
        {
          title: 'Written options',
          description: (
            <>
              To become an option writer, you need to lock collateral and mint
              option tokens. These will be sold to the AMM for a premium. Over
              the lifetime of this options, your volume of written options was{' '}
              <b>
                {toQuantity(
                  toNumeralPrice(_.get(position, 'optionsSold'), false),
                  'option'
                )}
              </b>{' '}
              would lock up to{' '}
              <b>
                {toNumeralPrice(locked, false)} ${_.get(tokens, '2.symbol')}
              </b>
              . If you engage in a sell - buy cycle, this <b>volume</b> will
              keep increasing, even though your portfolio situation may be
              different.
            </>
          )
        },
        {
          title: 'Premium received',
          description: (
            <>
              For each sell (either as a writer or as a reseller) you will
              receive a premium.
            </>
          )
        }
      ]
    }
  }

  /**
   * ---------------------------------------------
   * Liquidity Box - Ended, after expiration
   * ---------------------------------------------
   */

  static getBoxLiquidityExpiredFallback ({ doVisit }) {
    return {
      title: 'Liquidity provided',
      action: 'See more',
      activity: null,
      onActionClick: () => {
        doVisit(pages.pool.builder())
      }
    }
  }

  static getBoxLiquidityExpired ({ position, tokens, setOpen, doVisit }) {
    const address = _.get(position, 'option.address')

    return {
      title: 'Liquidity provided',
      action: 'Remove',
      support: 'Withdraw',
      activity: [
        {
          label: 'Your deposits',
          value: `${toNumeralPrice(
            _.get(position, 'initialOptionsProvided'),
            false
          )} op. & ${toNumeralPrice(
            _.get(position, 'initialTokensProvided'),
            false
          )} ${_.get(tokens, '2.symbol')}`
        },
        {
          label: 'Your removals',
          value: `${toNumeralPrice(
            _.get(position, 'finalOptionsRemoved'),
            false
          )} op. & ${toNumeralPrice(
            _.get(position, 'finalTokensRemoved'),
            false
          )} ${_.get(tokens, '2.symbol')}`
        }
      ],
      total: [],
      onActionClick: () => {
        doVisit(pages.transactionPool.builder(address))
      },
      onSupportClick: () => {
        doVisit(pages.transactionInvest.builder(address))
      },
      onBreakdownClick: () => {
        setOpen(true, PositionHelper.getBreakdownLiquidityExpired())
      }
    }
  }

  static getBreakdownLiquidityExpired () {
    return {
      title: 'Liquidity provided',
      sections: [
        {
          title: 'Your deposit volume',
          description: (
            <>
              Every time you deposit into the pools, this volume will increase.
              If after the intial deposits, you notice a difference between that
              amount and the actual pool position, you may have experienced
              impermanent loss or gain.
            </>
          )
        },
        {
          title: 'Your removals',
          description: (
            <>
              Every time you remove liquidity, you will get both option tokens
              and stablecoins. If you remove before expiration, during the
              exercise window, it is your duty to <b>unmint</b> option tokens,
              to unlock collateral from them and <b>exercise</b> any surplus
              that you might have received from the AMM.
              <br />
              <br />
              If you remove after expiration, the stablecoin side will be made
              available through the <b>remove liquidity</b> transaction, while
              the collateral locked on the option tokens side will be available
              after you <b>withdraw</b>.
            </>
          )
        }
      ]
    }
  }

  /**
   * ---------------------------------------------
   * ---------------------------------------------
   *
   *  Generic Breakdowns
   *
   * ---------------------------------------------
   * ---------------------------------------------
   */

  static getBreakdownPNL ({ pnl }) {
    return {
      title: 'Full Breakdown: Your current P&L',
      sections: [
        {
          title: 'How do we calculate your P&L?',
          description: (
            <>
              Your concrete P&amp;L was calculated based on the premiums. You
              earn premium when you write/resell options and you have to pay
              premium when you buy options.
            </>
          )
        },
        {
          title: 'How big is your concrete P&L?',
          description: (
            <>
              Based only on the active options tracked by the app, your concrete
              P&amp;L was calculated at <b>{toNumeralPrice(pnl)}</b>.
            </>
          )
        }
      ]
    }
  }

  static getBreakdownPoolPositionsValue ({ poolPositionsValue }) {
    return {
      title: 'Full Breakdown: Your pool positions value',
      sections: [
        {
          title: 'What is your liquidity?',
          description: (
            <>
              As a liquidity provider, you will deposit stablecoins into the
              AMM. The protocol converts these into balanced amounts of options
              and stables, used for trading. Your liquidity shown here is the
              sum of assets you currently have in the pools. If the value is
              different than the amount you've deposited initially, it means you
              may have suffered from impermanent loss/gain.
            </>
          )
        },
        {
          title: 'How much liquidity do you have in pools?',
          description: (
            <>
              Based only on the active pool positions tracked by the app, your
              total amount was calculated at{' '}
              <b>{toNumeralPrice(poolPositionsValue)}</b>.
            </>
          )
        }
      ]
    }
  }
}
