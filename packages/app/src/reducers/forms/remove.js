import useAtomicReducer from '../atoms'

const initial = {
  shares: {
    value: null,
    max: null,
    warning: null,
    isPrimary: true
  },
  tokenA: {
    value: null,
    exposure: null,
    token: null,
    warning: null
  },
  tokenB: {
    value: null,
    exposure: null,
    token: null,
    warning: null
  }
}

export default {
  useReducer: () => useAtomicReducer(initial)
}
