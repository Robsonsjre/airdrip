import useAtomicReducer from '../atoms'

const initial = {
  name: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: true
  },
  amount: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: true
  },
  underlying: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: true
  },
  strike: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: true
  },
  price: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: true
  },
  expiration: {
    value: null,
    max: null,
    token: null,
    warning: null,
    isPrimary: true
  },
  exercise: {
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
