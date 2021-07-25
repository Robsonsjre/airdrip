import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo
} from 'react'
import SDK from '@pods-finance/sdk'
import { macros } from '../../constants'

import * as config from './config'
import _ from 'lodash'

export const Context = createContext({
  account: null,
  modal: null,
  connect: () => {},
  provider: null,
  signer: null
})

export default function Provider ({ children }) {
  const { state, connect, disconnect } = config.useSetup()

  const networkId = useMemo(() => {
    if (_.isNil(state.networkId)) return macros.DEFAULT_NETWORK_ID
    return state.networkId
  }, [state.networkId])

  const context = useMemo(
    () => ({
      ...state,
      networkId,
      connect,
      disconnect
    }),
    [networkId, state, connect, disconnect]
  )

  return <Context.Provider value={context}>{children}</Context.Provider>
}

export function useWeb3Context () {
  return useContext(Context)
}

export function useWeb3Emergency (networkId) {
  const [instance, setInstance] = useState()
  useEffect(() => {
    if (networkId) {
      const infura = SDK.clients.provider.getBaseProvider(networkId, {
        infura: process.env.REACT_APP_INFURA_ID || ''
      })
      setInstance(infura)
    }
  }, [networkId])
  return instance
}
