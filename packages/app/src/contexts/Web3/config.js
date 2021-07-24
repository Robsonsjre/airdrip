import _ from 'lodash'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useLocalStorage } from '../../hooks'
import { NOOP, resolveAddressToENS } from '../../utils'
import { macros } from '../../constants'

const initial = {
  provider: undefined,
  signer: undefined,
  address: undefined,
  networkId: undefined,
  isLoading: true,
  isExpected: false,
  ens: {
    value: undefined,
    isResolved: false,
    isLoading: false
  }
}

const options = {}

/**
 *
 * Configuration Helper Functions
 *
 */

function cleanup () {
  if (
    !_.isNil(window) &&
    _.has(window, 'ethereum') &&
    _.has(window, 'ethereum.autoRefreshOnNetworkChange')
  ) {
    window.ethereum.autoRefreshOnNetworkChange = false
  }
}

export async function leave ({ modal, reset = NOOP }) {
  try {
    await modal.clearCachedProvider()
  } catch (e) {
    console.error('Web3 Modal', e)
  } finally {
    reset()
    window.location.reload()
  }
}

async function setup ({ modal, update, reset }) {
  try {
    const web3Provider = await modal.connect()

    const reactOnChange = async (web3Provider, first = false) => {
      cleanup()
      const provider = new ethers.providers.Web3Provider(web3Provider)
      const signer = provider.getSigner()
      const networkId = ((await provider.getNetwork()) || {}).chainId
      const address = await signer.getAddress()

      update({
        ...(first ? initial : {}),
        modal,
        signer,
        provider,
        address,
        networkId,
        isLoading: false,
        isExpected: true,
        ens: {
          value: null,
          isLoading: false,
          isResolved: false
        }
      })
    }

    if (web3Provider) {
      web3Provider.on('accountsChanged', () => reactOnChange(web3Provider))
      web3Provider.on('chainChanged', () => reactOnChange(web3Provider))
      await reactOnChange(web3Provider, true)
    }
  } catch (e) {
    console.error('Web3', e)
    leave({ modal, reset })
  }
}

export function useENS ({ state, update }) {
  useEffect(() => {
    ;(async () => {
      if (
        !_.isNil(state.provider) &&
        !_.isNilOrEmptyString(state.address) &&
        state.ens.isLoading === false &&
        state.ens.isResolved === false
      ) {
        update({
          ens: {
            value: undefined,
            isLoading: true,
            isResolved: false
          }
        })

        const ens = await resolveAddressToENS(state.address, state.provider)

        update({
          ens: {
            value: ens,
            isLoading: false,
            isResolved: true
          }
        })
      }
    })()
  }, [state, update])
}

export function useSetup () {
  /**
   * Instantiate the Web3 Modal
   */
  const modal = new Web3Modal({
    cacheProvider: true,
    providerOptions: options
  })

  /**
   * Prepare the state
   */

  const [isExpected] = useLocalStorage(macros.WEB3_MODAL_IDENTIFIER, null)

  const initialized = useMemo(
    () => ({
      ...initial,
      isExpected: !_.isNilOrEmptyString(isExpected)
    }),
    [isExpected]
  )

  const [state, setState] = useState(initialized)

  /**
   * Prepare the helper methods
   */

  const reset = useCallback(() => {
    setState({ ...initialized, isExpected: false })
  }, [setState, initialized])

  const update = useCallback(
    body => {
      setState(prev => ({
        ...prev,
        ...body
      }))
    },
    [setState]
  )

  const connect = useCallback(() => {
    setup({ modal, update, reset })
  }, [modal, update, reset])

  const disconnect = useCallback(() => {
    leave({ modal: state.modal, reset })
  }, [state.modal, reset])

  /**
   * Trigger effects
   */

  useENS({ state, update })

  /**
   * The master effect should not depend on modal. It is enough to create it and use that initial instance.
   */
  useEffect(() => {
    if (modal.cachedProvider) {
      setup({ modal, update, reset })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, reset])

  return {
    state,
    connect,
    disconnect
  }
}
