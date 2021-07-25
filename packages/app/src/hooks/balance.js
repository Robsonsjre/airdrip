import _ from 'lodash'
import { useCallback, useEffect, useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import SDK from '@pods-finance/sdk'
import { useWeb3Provider, useNetworkId, useAccount } from './web3'
import { useVersion } from './ui'

/**
 * Request balance for a particular token and owner
 * @param {object} params
 * @param {SDK.Token} params.token The token element/shape from the SDK
 * @param {string} params.owner Address of the owner
 * @param {string} [params.address] If token === null, fallback option for token address
 * @param {string} [params.decimals] If token === null, fallback option for token decimals
 * @returns
 */
export function useBalance (params) {
  const [state, setState] = useState({
    value: new BigNumber(0),
    isLoading: false
  })

  const provider = useWeb3Provider()
  const networkId = useNetworkId()
  const { version } = useVersion()

  const { token, owner, address: _address, decimals: _decimals } = useMemo(
    () => params || {},
    [params]
  )

  const fetchBalance = useCallback(
    ({
      owner,
      token,
      address: _address,
      decimals: _decimals,
      external = false
    }) => {
      ;(async () => {
        try {
          if (_.isNil(networkId) || _.isNil(provider)) {
            throw new Error('Balance: missing requirement')
          }

          const decimals = _.get(token, 'decimals') || _decimals
          const address = _.get(token, 'address') || _address

          if (_.isNil(address) || _.isNil(decimals)) {
            throw new Error('Balance: missing requirement')
          }

          if (!external) setState(prev => ({ ...prev, isLoading: true }))

          const placeholder = new SDK.Token({
            symbol: 'TOKEN',
            address,
            networkId,
            decimals
          })

          console.info('[ ---- ] Requesting token balance')
          const balance = await placeholder.getBalance({ provider, owner })
          if (_.isNil(balance)) throw new Error('Balance: unable to fetch')

          const humanized = await SDK.utils.humanize(balance, decimals)
          if (!external) setState({ value: humanized, isLoading: false })
          return humanized
        } catch (e) {
          if (!external) setState({ value: new BigNumber(0), isLoading: false })
        }

        return new BigNumber(0)
      })()
    },
    [networkId, provider]
  )

  useEffect(() => {
    fetchBalance({ owner, token, address: _address, decimals: _decimals })
  }, [token, owner, _address, _decimals, version, fetchBalance])

  return useMemo(
    () => ({
      value: state.value,
      fetch: fetchBalance,
      isLoading: state.isLoading
    }),
    [fetchBalance, state]
  )
}

/**
 * Request balance for a particular token, with owner set to current user wallet
 * @param {object} params
 * @param {SDK.Token} params.token The token element/shape from the SDK
 * @param {string} [params.address] If token === null, fallback option for token address
 * @param {string} [params.decimals] If token === null, fallback option for token decimals
 * @returns
 */
export function useOwnBalance (params) {
  const { token, address: _address, decimals: _decimals } = useMemo(
    () => params || {},
    [params]
  )
  const { address } = useAccount()
  return useBalance({
    token,
    owner: address,
    address: _address,
    decimals: _decimals
  })
}
