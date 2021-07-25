import useAtomicReducer from '../atoms'

const initial = {
  strike: {
    value: null,
    token: null,
    warning: null,
    isPrimary: false,
    isLoading: false
  },
  underlying: {
    value: null,
    token: null,
    warning: null,
    isPrimary: false,
    isLoading: false
  }
}

export default {
  useReducer: () => useAtomicReducer(initial)
}
