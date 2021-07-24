import _ from 'lodash'
import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState
} from 'react'
import SDK from '@pods-finance/sdk'
import reducers from '../../reducers'
import { useWeb3Utilities, useAddresses, useAccount } from '../../hooks'
import { useClient } from '../../apollo/client'
import { initial as initialOption } from '../../reducers/option'

import * as helpers from './helpers'

export const DataStaticContext = createContext(null)

export default function Provider ({ children }) {
  const value = useData()

  return (
    <DataStaticContext.Provider value={value}>
      {children}
    </DataStaticContext.Provider>
  )
}

export function useDataStaticContext () {
  return useContext(DataStaticContext)
}

function useData () {
  const { networkId, signer, provider } = useWeb3Utilities()
  const apollo = useClient(networkId)
  const { isExpected, isConnected } = useAccount()
  const { options: addresses } = useAddresses()
  const { state, dispatch } = reducers.system.useReducer()

  const [helper, setHelper] = useState(null)

  const updateOption = useCallback(
    ({ option }) => {
      helpers.updateOption({ option, dispatch, apollo })
    },
    [dispatch, apollo]
  )

  const updateOptions = useCallback(
    ({ options }) => {
      helpers.updateOptions({ options, dispatch, apollo })
    },
    [dispatch, apollo]
  )

  const trackOption = useCallback(
    ({ option, reset = false, isCurated = false }) => {
      if (reset) dispatch([], 'RESET')
      if (_.isNil(option)) return

      const shape = _.cloneDeep(initialOption)
      shape.element.address = option.address
      shape.element.value = option
      shape.element.isCurated = isCurated
      dispatch([option.address, shape], 'SET')

      updateOption({ option })
    },
    [dispatch, updateOption]
  )

  const trackOptions = useCallback(
    ({ options, reset = false, isCurated = true }) => {
      if (reset) dispatch([], 'RESET')
      if (_.isNil(options) || !options.length) return

      const shape = option => {
        const item = _.cloneDeep(initialOption)
        item.element.address = option.address
        item.element.value = option
        item.element.isCurated = isCurated
        return item
      }

      dispatch(
        options.map(o => [o.address, shape(o)]),
        'MULTI_SET'
      )

      updateOptions({ options })
    },
    [dispatch, updateOptions]
  )

  const trackHelper = useCallback(() => {
    if (_.isNil(apollo) || _.isNil(provider) || _.isNil(signer)) return

    helpers.updateHelper({ apollo, provider, signer, set: setHelper })
  }, [apollo, provider, signer])

  const options = useMemo(() => Object.values(state || {}), [state])

  useEffect(() => {
    if (isExpected && !isConnected) return
    /** Additional networkId check because an old apollo instance may be paired with a new provider on-network-change. */
    if (apollo && apollo.networkId === networkId && addresses) {
      const source = addresses.map(
        address =>
          new SDK.Option({
            address,
            networkId
          })
      )
      trackOptions({ options: source, reset: true })
    }
  }, [networkId, apollo, isConnected, addresses, isExpected, trackOptions])

  useEffect(() => {
    if (provider) trackHelper()
  }, [provider, trackHelper])

  return useMemo(
    () => ({
      options,
      helper,
      trackOption,
      trackOptions,
      updateOption,
      updateOptions
    }),
    [options, helper, trackOption, trackOptions, updateOption, updateOptions]
  )
}
