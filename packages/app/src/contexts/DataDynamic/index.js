import _ from 'lodash'
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo
} from 'react'

import reducers from '../../reducers'
import {
  useAccount,
  useOptions,
  useVersion,
  useWeb3Utilities
} from '../../hooks'
import { useClient } from '../../apollo/client'
import { initial as initialOption } from '../../reducers/option'

import * as helpers from './helpers'

export const DataDynamicContext = createContext(null)

export default function Provider ({ children }) {
  const general = useGeneralDynamics()
  const user = useUserDynamics()
  const positions = useUserPositions()
  const activity = useUserActivity()

  return (
    <DataDynamicContext.Provider value={{ user, general, activity, positions }}>
      {children}
    </DataDynamicContext.Provider>
  )
}

export function useDataDynamicContext () {
  return useContext(DataDynamicContext)
}

function useGeneralDynamics () {
  const { version } = useVersion()
  const { provider, networkId } = useWeb3Utilities()
  const { options, isLoading } = useOptions()
  const { state, dispatch } = reducers.system.useReducer()

  const updateGeneralDynamics = useCallback(
    ({ options, provider }) => {
      helpers.updateGeneralDynamics({ options, provider, dispatch })
    },
    [dispatch]
  )

  const trackGeneralDynamics = useCallback(
    ({ options, provider, reset = false, isCurated = true }) => {
      if (reset) dispatch([], 'RESET')
      if (_.isNil(options) || !options.length) return

      const shape = option => {
        const item = _.cloneDeep(initialOption)
        item.element.address = option.address
        item.element.isCurated = isCurated
        return item
      }

      dispatch(
        options.map(o => [o.address, shape(o)]),
        'MULTI_SET'
      )

      updateGeneralDynamics({ options, provider })
    },
    [dispatch, updateGeneralDynamics]
  )

  useEffect(() => {
    if (isLoading) return
    if (options && options.length && provider && networkId) {
      /** Additional networkId check because options will update after the provider triggers this effect on-network-change. This prevents pairing old options with the new provider. */
      if (options[0].networkId === networkId) {
        trackGeneralDynamics({
          options,
          provider,
          reset: true
        })
      }
    }
  }, [options, isLoading, provider, networkId, version, trackGeneralDynamics])

  return {
    elements: state,
    trackGeneralDynamics,
    updateGeneralDynamics
  }
}

function useUserDynamics () {
  const { version } = useVersion()
  const { provider, signer, networkId } = useWeb3Utilities()
  const { options, isLoading } = useOptions()
  const { state, dispatch } = reducers.system.useReducer()

  const updateUserDynamics = useCallback(
    ({ options, provider, signer }) => {
      helpers.updateUserDynamics({ options, provider, signer, dispatch })
    },
    [dispatch]
  )

  const trackUserDynamics = useCallback(
    ({ options, provider, signer, reset = false, isCurated = true }) => {
      if (reset) dispatch([], 'RESET')
      if (_.isNil(options) || !options.length) return

      const shape = option => {
        const item = _.cloneDeep(initialOption)
        item.element.address = option.address
        item.element.isCurated = isCurated
        return item
      }

      dispatch(
        options.map(o => [o.address, shape(o)]),
        'MULTI_SET'
      )

      updateUserDynamics({ options, provider, signer })
    },
    [dispatch, updateUserDynamics]
  )

  useEffect(() => {
    if (isLoading) return
    if (options && options.length && provider && signer && networkId) {
      /** Additional networkId check because options will update after the provider triggers this effect on-network-change. This prevents pairing old options with the new provider. */
      if (options[0].networkId === networkId) {
        trackUserDynamics({
          options,
          provider,
          signer,
          reset: true
        })
      }
    }
  }, [
    options,
    isLoading,
    signer,
    provider,
    networkId,
    version,
    trackUserDynamics
  ])

  return {
    elements: state,
    trackUserDynamics,
    updateUserDynamics
  }
}

function useUserActivity () {
  const { version } = useVersion()
  const { isConnected } = useAccount()
  const { options, isLoading } = useOptions()
  const { provider, signer, networkId } = useWeb3Utilities()
  const apollo = useClient(networkId)

  /**
   * -------------------------------
   * User Activity
   * -------------------------------
   */

  const {
    state: optionsState,
    dispatch: optionsDispatch
  } = reducers.system.useReducer()
  const {
    state: userState,
    dispatch: userDispatch,
    elements: userElements
  } = reducers.activity.useReducer()

  const updateUserActivity = useCallback(
    ({ provider, signer, timestamp }) => {
      helpers.updateUserActivity({
        timestamp,
        provider,
        signer,
        apollo,
        dispatch: userDispatch,
        elements: userElements
      })
    },
    [userDispatch, userElements, apollo]
  )
  const trackUserActivity = useCallback(
    ({ signer, provider, timestamp, reset = false }) => {
      if (reset) userDispatch([], 'RESET', [])
      updateUserActivity({ signer, provider, timestamp })
    },
    [userDispatch, updateUserActivity]
  )

  useEffect(() => {
    if (!isConnected) return
    if (provider && signer) {
      trackUserActivity({
        provider,
        signer,
        reset: true,
        timestamp: Math.floor(Date.now() / 1000) + 1
      })
    }
  }, [isConnected, signer, provider, networkId, version, trackUserActivity])

  /**
   * -------------------------------
   * Option Activity
   *
   * The logic for the option activity will live outside the provider because it needs access to useParams
   * It will be triggered by the useOptionActivity() hook, used inside the routes
   * -------------------------------
   */

  const updateOptionsActivity = useCallback(
    ({ options, provider, signer }) => {
      helpers.updateOptionsActivity({
        options,
        dispatch: optionsDispatch,
        apollo,
        provider,
        signer
      })
    },
    [optionsDispatch, apollo]
  )

  const trackOptionsActivity = useCallback(
    ({ options, provider, signer, reset = false, isCurated = true }) => {
      if (reset) optionsDispatch([], 'RESET')
      if (_.isNil(options) || !options.length) return

      const shape = option => {
        const item = _.cloneDeep(initialOption)
        item.element.address = option.address
        item.element.isCurated = isCurated
        return item
      }

      optionsDispatch(
        options.map(o => [o.address, shape(o)]),
        'MULTI_SET'
      )

      updateOptionsActivity({ options, provider, signer })
    },
    [optionsDispatch, updateOptionsActivity]
  )

  useEffect(() => {
    if (isLoading) return
    if (options && options.length && provider && signer && networkId) {
      /** Additional networkId check because options will update after the provider triggers this effect on-network-change. This prevents pairing old options with the new provider. */
      if (options[0].networkId === networkId) {
        trackOptionsActivity({
          options,
          provider,
          signer,
          reset: true
        })
      }
    }
  }, [
    options,
    isLoading,
    signer,
    provider,
    networkId,
    version,
    trackOptionsActivity
  ])

  return useMemo(
    () => ({
      user: userState,
      options: optionsState,

      trackUserActivity,

      updateUserActivity,
      updateOptionsActivity
    }),
    [
      userState,
      optionsState,
      trackUserActivity,
      updateUserActivity,
      updateOptionsActivity
    ]
  )
}

function useUserPositions () {
  const { version } = useVersion()
  const { options, isLoading } = useOptions()
  const { provider, signer, networkId } = useWeb3Utilities()
  const apollo = useClient(networkId)

  const {
    state: activeState,
    dispatch: activeDispatch
  } = reducers.system.useReducer({
    isLoading: { value: false },
    warning: { value: null }
  })
  const {
    state: historicalState,
    dispatch: historicalDispatch
  } = reducers.system.useReducer({
    isLoading: { value: false },
    warning: { value: null }
  })

  /**
   * -----------------
   *
   * User active positions - for tracked options
   *
   * -----------------
   */

  const updateUserActivePositions = useCallback(
    ({ options, provider, signer }) => {
      helpers.updateUserActivePositions({
        options,
        provider,
        signer,
        apollo,
        dispatch: activeDispatch
      })
    },
    [activeDispatch, apollo]
  )

  const trackUserActivePositions = useCallback(
    ({ options, provider, signer, reset = false }) => {
      if (reset) activeDispatch([], 'RESET')
      if (_.isNil(options) || !options.length) return

      const shape = option => {
        const item = _.cloneDeep(initialOption)
        item.element.address = option.address
        item.element.isCurated = true
        item.element.isLoading = true
        return item
      }

      activeDispatch(
        options.map(o => [o.address, shape(o)]),
        'MULTI_SET'
      )

      updateUserActivePositions({ options, provider, signer })
    },
    [activeDispatch, updateUserActivePositions]
  )

  useEffect(() => {
    if (isLoading) return
    if (options && options.length && provider && signer && networkId) {
      /** Additional networkId check because options will update after the provider triggers this effect on-network-change. This prevents pairing old options with the new provider. */
      if (options[0].networkId === networkId) {
        trackUserActivePositions({
          options,
          provider,
          signer,
          reset: true
        })
      }
    }
  }, [
    options,
    isLoading,
    signer,
    provider,
    networkId,
    version,
    trackUserActivePositions
  ])

  /**
   * -----------------
   *
   * User historical positions - for any options with interactions
   *
   * -----------------
   */

  const updateUserHistoricalPositions = useCallback(
    ({ blacklisted, provider, signer }) => {
      helpers.updateUserHistoricalPositions({
        blacklisted,
        provider,
        signer,
        apollo,
        dispatch: historicalDispatch
      })
    },
    [historicalDispatch, apollo]
  )

  const trackUserHistoricalPositions = useCallback(
    ({ blacklisted, provider, signer, reset = false }) => {
      if (reset) historicalDispatch([], 'RESET')
      updateUserHistoricalPositions({ blacklisted, provider, signer })
    },
    [historicalDispatch, updateUserHistoricalPositions]
  )

  useEffect(() => {
    if (isLoading) return
    if (options && options.length && provider && signer && networkId) {
      /** Additional networkId check because options will update after the provider triggers this effect on-network-change. This prevents pairing old options with the new provider. */
      if (options[0].networkId === networkId) {
        trackUserHistoricalPositions({
          blacklisted: options,
          provider,
          signer,
          reset: true
        })
      }
    }
  }, [
    options,
    isLoading,
    signer,
    provider,
    networkId,
    version,
    trackUserHistoricalPositions
  ])

  return useMemo(
    () => ({
      active: activeState,
      historical: historicalState
    }),
    [activeState, historicalState]
  )
}
