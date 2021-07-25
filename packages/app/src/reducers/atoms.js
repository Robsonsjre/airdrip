import _ from 'lodash'
import { useCallback, useMemo, useReducer } from 'react'

function customizer (addition, source) {
  if (_.isArray(addition)) {
    return addition.concat(source)
  }
}

/**
 *
 * @param {Object} initial - defines the form of the reducer's state and the supported elements
 *
 * elements{}
 *   - will map to a {key: key} object that holds the exact values described in the initial state
 * reducer()
 *   - will employ 3 types of actions: "RESET", "UPDATE" (merge old and new states, *default*), "SET" (override)
 *   - the payload[] array will contain 2 parameters: [element_key, value]
 *   - the element_key (payload[0]) needs to be one from the elements{} object
 *   - the value (payload[1]) should be an object matching the initial state element structure
 * dispatch()
 *   - will simplify the format of the dispatch e.g. reducer.dispatch([key, value], type = "UPDATE")
 *
 */
export default function useAtomicReducer (initial) {
  const elements = useMemo(
    () => Object.keys(initial).reduce((a, c) => ({ ...a, [c]: c }), {}),
    [initial]
  )

  const reducer = useCallback(
    (state = initial, { type, payload, whitelist = [], strict = false }) => {
      try {
        const [key, value, _customizer] = payload || []
        if (type === 'RESET') {
          const result = _.cloneDeep(initial)
          whitelist.forEach(element => {
            result[element] = state[element]
          })
          return result
        }

        if (type === 'UPDATE') {
          if (!strict || _.has(elements, key)) {
            return {
              ...state,
              [key]: {
                ...state[key],
                ...value
              }
            }
          }

          console.warn('Atomic reducer given unknown key for update.')
        }
        if (type === 'SET') {
          if (!strict || _.has(elements, key)) {
            return {
              ...state,
              [key]: value
            }
          }
          console.warn('Atomic reducer given unknown key for set.')
        }

        if (type === 'DEEP_UPDATE') {
          const top = Object.keys(value)
          if (!strict || top.every(topKey => _.has(elements, topKey))) {
            const result = { ...state }
            const element = {
              [key]: value
            }
            _.mergeWith(result, element, _customizer || customizer)
            return result
          }

          console.warn('Atomic reducer given unknown key (path) for update.')
        }

        if (type === 'MULTI_DEEP_UPDATE') {
          const list = payload
          const result = _.cloneDeep(state)
          list.forEach(item => {
            const [key, value, _customizer] = item
            const top = Object.keys(value)
            if (!strict || top.every(topKey => _.has(elements, topKey))) {
              const element = {
                [key]: value
              }
              _.mergeWith(result, element, _customizer || customizer)
            } else {
              console.warn('Atomic reducer given unknown key for deep update.')
            }
          })
          return result
        }

        if (type === 'MULTI_UPDATE') {
          const list = _.toArray(payload)
          const result = _.cloneDeep(state)
          list.forEach(([key, value]) => {
            if (!strict || _.has(elements, key)) {
              result[key] = {
                ...state[key],
                ...value
              }
            } else {
              console.warn('Atomic reducer given unknown key for deep update.')
            }
          })
          return result
        }

        if (type === 'MULTI_SET') {
          const list = _.toArray(payload)
          const result = _.cloneDeep(state)
          list.forEach(element => {
            const [key, value] = element
            result[key] = value
          })
          return result
        }

        console.warn('Atomic reducer given unknown instruction/type.')
        return state
      } catch (e) {
        console.error('Atomic reducer error: ', e)
        return state
      }
    },
    [initial, elements]
  )

  const [state, dispatchToReducer] = useReducer(reducer, initial)

  const dispatch = useCallback(
    (payload = [], type = 'UPDATE', whitelist = [], strict = false) =>
      dispatchToReducer({ type, payload, whitelist, strict }),
    [dispatchToReducer]
  )

  return {
    elements,
    initial,
    state,
    dispatch
  }
}
