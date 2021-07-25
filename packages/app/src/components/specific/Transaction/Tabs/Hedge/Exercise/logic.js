import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { guards } from '../../../../../../machines'
import { isBalanceInsignificant } from '../../../../../../utils'

function onInitialize ({
  elements,
  dispatch,

  underlying,
  strike,
  balanceExercisable
}) {
  dispatch([], 'RESET', [elements.allowance])
  dispatch([elements.underlying, { token: _.get(underlying, 'symbol') }])
  dispatch([elements.strike, { token: _.get(strike, 'symbol') }])

  dispatch([
    elements.options,
    {
      max: !isBalanceInsignificant(balanceExercisable)
        ? balanceExercisable.toString()
        : null,
      token: [_.get(underlying, 'symbol'), _.get(strike, 'symbol')]
    }
  ])
}

function onChangeAmount ({
  amount,
  dispatch,
  elements,
  option,
  balanceExercisable
}) {
  let warning = null
  if (!_.isNilOrEmptyString(amount)) {
    warning = guards.isAmountValid({
      value: amount,
      max: balanceExercisable
    })
  }

  dispatch([
    elements.options,
    {
      value: String(amount).trim(),
      warning
    }
  ])

  dispatch([
    elements.underlying,
    {
      value: amount
    }
  ])

  let value = null
  if (!_.isNilOrEmptyString(amount)) {
    value = new BigNumber(amount)
      .multipliedBy(option.strikePrice.humanized)
      .toString()
  }

  dispatch([
    elements.strike,
    {
      value
    }
  ])
}

function onTransact ({ machine, state, option, setup, signer }) {
  machine.send(machine.events.save, {
    payload: {
      state,
      option,
      setup,
      signer
    }
  })
}

export default {
  onInitialize,
  onChangeAmount,
  onTransact
}
