import useAtomicReducer from '../atoms'

const initial = {
  options: {
    max: null,
    value: null,
    token: null,
    warning: null,
    isPrimary: true
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
    options: false,
    isLoading: false
  }
}

export default {
  useReducer: () => useAtomicReducer(initial)
}
