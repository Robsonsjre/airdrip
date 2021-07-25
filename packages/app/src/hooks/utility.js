import _ from 'lodash'
import { useRef, useEffect, useMemo, useCallback, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { networks } from '../constants'
import { useNetworkId } from './web3'
import { useUI } from './ui'
import { getAddresses, getInterpretedToken } from '../utils'

export function useRefresh () {
  const [version, setVersion] = useState(0)
  const refresh = useCallback(() => {
    setVersion(prev => prev + 1)
  }, [setVersion])
  return {
    refresh,
    version
  }
}

export function useAddresses () {
  const networkId = useNetworkId()
  const list = useMemo(() => getAddresses(networkId), [networkId])
  return list
}

/**
 * If an array is received, it will try to return all the matching tokens
 * @param {SDK.Token | SDK.Token[]} source
 */
export function useToken (source) {
  const networkId = useNetworkId()

  const builder = useCallback(item => getInterpretedToken(item, networkId), [
    networkId
  ])

  const result = useMemo(() => {
    if (_.isArray(source) && source.every(item => _.isString(item))) {
      return source
        .map(item => builder({ symbol: item }))
        .filter(item => !_.isNil(item))
    }

    if (_.isArray(source)) {
      return source.map(item => builder(item)).filter(item => !_.isNil(item))
    }

    if (_.isObject(source)) {
      return builder(source)
    }

    if (_.isString(source)) {
      return builder({ symbol: source })
    }

    return null
  }, [source, builder])

  return { value: result, get: builder }
}

export function useOnClickOutside (handler, reference = null) {
  const temp = useRef()
  const ref = reference || temp

  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])

  return [ref]
}

export function useBackLogic (fallback = '/') {
  const history = useHistory()
  const { entry } = useUI()

  const parent = useMemo(() => {
    if (!_.isNil(entry) && _.has(entry, 'pathname')) {
      return _.get(entry, 'pathname')
    }
    return fallback
  }, [entry, fallback])

  const goBack = useCallback(() => {
    try {
      history.push(parent)
    } catch (e) {
      console.error('Back button', e)
    }
  }, [history, parent])

  return { goBack, parent }
}

export function useWindowSize () {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  })

  useEffect(() => {
    function handleResize () {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export function useSupportedNetwork () {
  const networkId = useNetworkId()
  return networks._supported.includes(networkId) || _.isNil(networkId)
}

export function useLocalStorage (key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Local storage', error)
      return initialValue
    }
  })

  const setValue = useCallback(
    value => {
      try {
        setStoredValue(value)
        if (_.isNil(value)) window.localStorage.removeItem(key)
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error('Local storage', error)
      }
    },
    [key]
  )

  return [storedValue, setValue]
}

export function useRouteId (force = null) {
  const params = useParams()
  const result = useMemo(() => {
    if (
      _.isNilOrEmptyString(force) &&
      (_.isNil(params) || _.isNilOrEmptyString(_.get(params, 'id')))
    ) { return null }
    return String(force || _.get(params, 'id')).toLowerCase()
  }, [params, force])
  return result
}
