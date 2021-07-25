import useAtomicReducer from '../atoms'

const initial = {
  strike: {
    value: null,
    token: null,
    warning: null,
    isPrimary: false
  },
  options: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: true
  }
}

export default {
  useReducer: () => useAtomicReducer(initial)
}
