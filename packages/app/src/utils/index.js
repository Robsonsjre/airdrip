import _ from 'lodash'
export * from './interpret'
export * from './ens'
export * from './atoms'

function isNilOrEmptyString (value) {
  return _.isNil(value) || _.toString(value).length === 0
}

async function attemptAsync (func, ...args) {
  try {
    return await func(...args)
  } catch (e) {
    return e
  }
}

export function _config () {
  _.mixin({ isNilOrEmptyString })
  _.mixin({ attemptAsync })
}
