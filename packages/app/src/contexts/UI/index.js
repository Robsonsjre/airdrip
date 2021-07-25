import _ from 'lodash'
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo
} from 'react'

import { useLocation } from 'react-router-dom'
import { prefs } from '../../constants'
import { useLocalStorage } from '../../hooks'
import { findPageByRoute } from '../../utils'

export const UIContext = createContext(null)

export default function Provider ({ children }) {
  const controls = useControls()
  const preferences = usePreferences()
  const versioning = useVersioning()

  return (
    <UIContext.Provider value={{ controls, preferences, versioning }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUIContext () {
  return useContext(UIContext)
}

function useControls () {
  const location = useLocation()

  const [drawer, setDrawer] = useState(false)
  const [entry, setEntry] = useState(undefined)
  const openDrawer = useCallback(() => setDrawer(true), [setDrawer])
  const closeDrawer = useCallback(() => setDrawer(false), [setDrawer])
  const toggleDrawer = useCallback(prev => setDrawer(!prev), [setDrawer])

  const modals = useModalsConfiguration()

  useEffect(() => {
    setEntry(prev => {
      const cleanPrev = _.get(prev, 'pathname')
        ? _.toString(_.get(prev, 'pathname')).split('#')[0]
        : null
      const cleanCurrent = _.get(location, 'pathname')
        ? _.toString(_.get(location, 'pathname')).split('#')[0]
        : null

      /** If you run into "tabs" don't push the same page again */
      if (cleanPrev === cleanCurrent) return prev

      /** If current page is not depth-0, don't track it as a back solution */
      if (!findPageByRoute(cleanCurrent)) return prev

      return location
    })
  }, [setEntry, location])

  return {
    drawer,
    openDrawer,
    closeDrawer,
    toggleDrawer,

    entry,

    modals
  }
}

function useModalsConfiguration () {
  const [list, setList] = useState([])

  const send = useCallback(
    (action, payload) => {
      switch (action) {
        case 'open':
          setList(prev => {
            if (_.isNil(prev.find(item => item.id === _.get(payload, 'id')))) {
              return [
                ...prev,
                {
                  id: _.get(payload, 'id'),
                  isOpen: true,
                  data: _.get(payload, 'data')
                }
              ]
            }
            return prev.map(item =>
              item.id === _.get(payload, 'id')
                ? {
                  ...item,
                  isOpen: true,
                  data: _.get(payload, 'data') || item.data
                }
                : item
            )
          })
          break
        case 'close':
          setList(prev => {
            return prev.map(item =>
              item.id === _.get(payload, 'id')
                ? { ...item, isOpen: false }
                : item
            )
          })
          break
        case 'set':
          setList(prev => {
            return prev.map(item =>
              item.id === _.get(payload, 'id')
                ? { ...item, data: _.get(payload, 'data') }
                : item
            )
          })
          break
        case 'update':
          setList(prev => {
            return prev.map(item =>
              item.id === _.get(payload, 'id')
                ? {
                  ...item,
                  data: {
                    ..._.toPlainObject(item.data),
                    ...(_.get(payload, 'data') || {})
                  }
                }
                : item
            )
          })
          break
        default:
          break
      }
    },
    [setList]
  )

  return {
    list,
    send
  }
}

function usePreferences () {
  const initial = {
    [prefs.isTermsOfServiceAccepted]: false,
    [prefs.isDarkTheme]: false,
    [prefs.isAnalyticsEnabled]: false,
    [prefs.isAdvancedModeEnabled]: false
  }

  const [storedPreferences, setStoredPreferences] = useLocalStorage(
    'preferences',
    initial
  )

  const [livePreferences, setLivePreferences] = useState(
    _.isObject(storedPreferences) &&
      Object.keys(initial).every(key =>
        Object.keys(storedPreferences).includes(key)
      )
      ? storedPreferences
      : initial
  )

  const updatePreferences = useCallback(
    (key, value = null) => {
      const result = { ...livePreferences }

      if (_.isString(key) && _.has(result, key)) {
        result[key] = value
      }

      if (_.isObject(key)) {
        Object.keys(key).forEach(innerKey => {
          const innerValue = _.get(key, innerKey)
          if (_.has(result, innerKey)) result[innerKey] = innerValue
        })
      }

      setLivePreferences(result)
      setStoredPreferences(result)
    },
    [livePreferences, setLivePreferences, setStoredPreferences]
  )

  return {
    value: livePreferences,
    update: updatePreferences
  }
}

function useVersioning () {
  const [version, setVersion] = useState(0)
  const update = useCallback(() => setVersion(prev => prev + 1), [])

  return useMemo(
    () => ({
      version,
      update
    }),
    [version, update]
  )
}
