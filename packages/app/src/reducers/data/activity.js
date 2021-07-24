import useAtomicReducer from '../atoms'

export const initial = {
  store: {
    value: []
  },
  manager: {
    warning: null,
    isLoading: true,
    isFinished: false
  }
}

export default {
  useReducer: () => useAtomicReducer(initial)
}
