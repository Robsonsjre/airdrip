import useAtomicReducer from '../atoms'

const initial = {
  underlying: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: true,
    isLoading: false
  },
  premium: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: false,
    isLoading: false
  },
  fees: {
    value: null,
    warning: null,
    isLoading: false
  },
  allowance: {
    strike: false,
    isLoading: false
  },
  exact: {
    value: null
  }
}

export default {
  useReducer: () => useAtomicReducer(initial)
}
