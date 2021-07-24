import useAtomicReducer from '../atoms'

export const initial = {
  element: {
    address: null,
    value: null,
    warning: null,
    isLoading: false,
    isCurated: true
  }
}

export const example = {
  element: {
    value: {
      /** SDK.Option */
      address: '0x'
    },
    warning: null,
    isLoading: null
  }
}

export default {
  useReducer: () => useAtomicReducer(initial)
}
