import useAtomicReducer from '../atoms'

const initial = {
  strike: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: true
  },
  tokenA: {
    value: null,
    token: null,
    warning: null
  },
  tokenB: {
    value: null,
    token: null,
    warning: null
  },
  allowance: {
    strike: false,
    isLoading: false
  }
}

export default {
  useReducer: () => useAtomicReducer(initial)
}
