import useAtomicReducer from '../atoms'

export const initial = {
  /** Options will be listed here in the object by address-key */
}

function useReducer (_initial) {
  return useAtomicReducer(_initial || initial)
}

export default {
  useReducer
}
