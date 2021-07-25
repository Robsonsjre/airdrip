import useAtomicReducer from '../atoms'

const initial = {
  options: {
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
    isLoading: false,
    isPrimary: false
  },
  strike: {
    value: null,
    token: null,
    warning: null,
    isLoading: false,
    isPrimary: false
  },
  allowance: {
    underlying: false,
    isLoading: false
  }
}

export default {
  useReducer: () => useAtomicReducer(initial)
}
