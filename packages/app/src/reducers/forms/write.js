import useAtomicReducer from '../atoms'

const initial = {
  strike: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: true
  },
  underlying: {
    value: null,
    token: null,
    warning: null,
    isPrimary: false
  },
  premium: {
    value: null,
    warning: null,
    isLoading: false
  },
  fees: {
    value: null,
    warning: null,
    isLoading: false
  },
  premiumToken: {
    value: null,
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
