import _ from 'lodash'

export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const NOOP = () => {}

export function toQuantity (amount = 0, source) {
  if (_.isNaN(amount) || amount === 'NaN') amount = 0
  if (_.toString(amount) === '1') return `${amount} ${source}`
  return `${amount} ${toPlural(source)}`
}

export function toPlural (source) {
  switch (source) {
    default:
      return `${source}s`
  }
}

export function shortenAddress (address, start, end) {
  const initial = _.toString(address)
  const final = _.attempt(
    () => `${initial.substr(0, start)}...${initial.substr(-end, end)}`
  )
  return _.isError(final) ? initial : _.toString(final)
}

export function localStorageAccessSync (key, initial) {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initial
  } catch (error) {
    console.error('Local storage', error)
    return initial
  }
}
