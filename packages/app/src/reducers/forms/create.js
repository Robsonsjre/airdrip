import useAtomicReducer from '../atoms'

const initial = {
  start: {
    value: null,
    warning: null,
    isPrimary: true
  },
  end: {
    value: null,
    warning: null,
    isPrimary: true
  },
  amount: {
    value: null,
    warning: null,
    isPrimary: true
  },
  underlying: {
    value: null,
    warning: null,
    isPrimary: true
  },
  strike: {
    value: null,
    warning: null,
    isPrimary: true
  },
  price: {
    value: null,
    warning: null,
    isPrimary: true
  },
  expiration: {
    value: null,
    warning: null,
    isPrimary: true
  },
  exercise: {
    value: null,
    warning: null,
    isPrimary: true
  }
}

export default {
  useReducer: () => useAtomicReducer(initial)
}
