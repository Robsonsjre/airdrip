import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { macros } from '../../constants'

export const policy = {
  amount: {
    missing: () => 'Amount has to be above 0.',
    premiumBug: () => 'Amount restricted due to low pool liquidity.',
    tooLow: (min = 0) => `Amount has to be higher than ${min}.`,
    tooHigh: (max = 0) => `Amount has to be at most ${max}.`,
    wallet: balance => `Your wallet balance is ${balance}.`,
    liquidity: balance => `Only ${balance} available in the liquidity pool.`
  },
  premium: {
    restricted: () => 'The premium may be inaccessible due to low liquidity.',
    tooLow: (min = 0) => `The premium has to be higher than ${min}.`
  },
  allowance: {
    missing: () => 'Allowance has to be granted first.',
    malfunctioning: (code = null) =>
      `The check for token allowance wasn't conclusive. Please refresh the page.${code &&
        ` (${code})`}`
  },
  system: {
    loading: () => 'The form is still computing values. Please wait.',
    warning: () => 'The form still shows warnings. Please resolve those first.',
    values: () =>
      'The form has empty or invalid fields. Please provide data first.'
  }
}

export async function booleanize (guard) {
  const message = await guard()
  return _.isNil(message)
}

export async function interpret (guard, addToast = null) {
  const message = await guard()
  if (!_.isNil(message)) {
    if (addToast) {
      addToast(message, {
        appearance: 'error',
        autoDismiss: true,
        autoDismissTimeout: 2500
      })
    }
    return [false, message]
  }

  return [true, null]
}

export function isAmountValid ({
  value: unsanitized,
  min = 0,
  max,
  context = null
}) {
  const value = new BigNumber(unsanitized)
  const constraints = [new BigNumber(min), new BigNumber(max)]

  if (_.isNil(unsanitized)) return policy.amount.missing()

  if (unsanitized === macros.RESTRICTED_PREMIUM) {
    return policy.amount.premiumBug()
  }

  if (!value.isFinite()) return policy.amount.missing()

  /** Enforce min < value - tight lower bound */
  if (!_.isNil(min) && value.isLessThanOrEqualTo(constraints[0])) {
    return policy.amount.tooLow(constraints[0].toString())
  }
  /** Enforce value <= max */
  if (!_.isNil(max) && value.isGreaterThan(constraints[1])) {
    if (context === 'liquidity') {
      return policy.amount.liquidity(constraints[1].toString())
    }
    return policy.amount.wallet(constraints[1].toString())
  }

  return null
}

export function isPremiumValid ({
  value: unsanitized,
  min = 0,
  max = null,
  context = null
}) {
  if (unsanitized === macros.RESTRICTED_PREMIUM) {
    return policy.premium.restricted()
  }

  const constraints = [new BigNumber(min), new BigNumber(max)]

  const value = new BigNumber(unsanitized)
  if (_.isNil(unsanitized) || !value.isFinite()) {
    return policy.premium.restricted()
  }
  /** Enforce min < value - tight lower bound */
  if (!_.isNil(min) && value.isLessThanOrEqualTo(constraints[0])) {
    if (context === 'liquidity') {
      return policy.amount.premiumBug()
    }
    return policy.premium.tooLow(constraints[0].toString())
  }

  /** Enforce value <= max */
  if (!_.isNil(max) && value.isGreaterThan(constraints[1])) {
    // if (context === 'liquidity') {
    //   return policy.amount.liquidity(constraints[1].toNumber())
    // }
    return policy.amount.wallet(constraints[1].toNumber())
  }

  return null
}

export function isFormValid ({ value: state, soft = false }) {
  const warnings = Object.values(state).filter(
    item => _.has(item, 'warning') && !_.isNil(_.get(item, 'warning'))
  )

  const loaders =
    soft === true
      ? []
      : Object.values(state).filter(
        item => _.has(item, 'isLoading') && _.get(item, 'isLoading') === true
      )

  // Example: allowance = { token: true, option: false, custom: false, ..., isLoading: true} - Remove the control values such as isLoading

  const allowances = _.has(state, 'allowance')
    ? Object.keys(_.get(state, 'allowance'))
      .filter(key => !String(key).startsWith('is'))
      .map(key => _.get(state, `allowance[${key}]`))
      .filter(item => item !== true)
    : []

  const empty = Object.values(state).filter(
    item => _.has(item, 'value') && _.isNilOrEmptyString(_.get(item, 'value'))
  )

  if (_.toArray(allowances).length !== 0) return policy.allowance.missing()

  if (_.toArray(warnings).length !== 0) {
    return policy.system.loading()
  }

  if (_.toArray(loaders).length !== 0) {
    return policy.system.warning()
  }

  if (_.toArray(empty).length !== 0) {
    return policy.system.values()
  }

  return null
}

export function isFormAllowed ({ value: state }) {
  const allowances = _.has(state, 'allowance')
    ? Object.keys(_.get(state, 'allowance'))
      .filter(key => !String(key).startsWith('is'))
      .map(key => _.get(state, `allowance[${key}]`))
      .filter(item => item !== true)
    : []

  if (_.toArray(allowances).length !== 0) return policy.allowance.missing()
  return null
}

export async function isAllowanceValid ({ check, value, tokenAddress }) {
  if (
    _.isNil(check) ||
    !_.isFunction(check) ||
    !_.isFinite(value) ||
    _.isNil(tokenAddress)
  ) {
    return policy.allowance.malfunctioning('#N1')
  }

  if ((await check({ tokenAddress, amount: value })) !== true) {
    return policy.allowance.malfunctioning()
  }

  return null
}
