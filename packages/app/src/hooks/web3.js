import _ from 'lodash'
import { useMemo, useCallback } from 'react'
import { useWeb3Context, useWeb3Emergency } from '../contexts/Web3'

export function useAccount () {
  const { networkId, address, ens, signer, isExpected } = useWeb3Context()

  const isConnected = useMemo(() => !_.isNil(signer) && !_.isNil(address), [
    address,
    signer
  ])

  const account = useMemo(
    () => ({
      address,
      ens,
      networkId,

      isConnected,
      isExpected
    }),
    [address, ens, networkId, isConnected, isExpected]
  )

  return account
}

export function useNetworkId () {
  const { networkId } = useAccount()
  return networkId
}

export function useWalletModal () {
  const { connect, disconnect } = useWeb3Context()
  return { connect, disconnect }
}

export function useWeb3Provider () {
  const { networkId, provider, signer, address, isExpected } = useWeb3Context()
  const alternative = useWeb3Emergency(networkId)

  const result = useMemo(() => {
    if (
      isExpected &&
      (_.isNil(provider) || _.isNil(signer) || _.isNil(address))
    ) {
      return null
    }
    if (_.isNil(provider)) return alternative
    return provider
  }, [provider, signer, address, alternative, isExpected])

  return result
}

export function useWeb3Signer () {
  const { signer } = useWeb3Context()
  return signer
}

export function useWeb3Utilities () {
  const { networkId, signer } = useWeb3Context()
  const provider = useWeb3Provider()
  return {
    provider,
    signer,
    networkId
  }
}

export function useWalletChainRequest () {
  const { address, provider } = useWeb3Context()

  const request = useCallback(
    chain => {
      try {
        if (!_.isNil(provider) && _.has(provider, 'request')) {
          provider
            .request({
              method: 'wallet_addEthereumChain',
              params: [chain, address]
            })
            .then(result => {
              console.info('Chain support', result)
            })
            .catch(error => {
              console.error('Chain support', error)
            })
        }
      } catch (e) {
        console.error('Chain support', e)
      }
    },
    [address, provider]
  )

  return request
}

export function useWalletTokenRequest ({
  tokenAddress,
  tokenSymbol,
  tokenDecimals
}) {
  const { networkId, provider } = useWeb3Context()

  const request = useCallback(() => {
    try {
      if (
        !_.isNil(provider) &&
        !_.isNil(networkId) &&
        _.has(provider, 'request')
      ) {
        provider
          .request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: tokenAddress,
                symbol: tokenSymbol,
                decimals: tokenDecimals
                // image: tokenImage
              }
            }
          })
          .then(result => {
            console.info('Token support', result)
          })
          .catch(error => {
            console.error('Token support', error)
          })
      }
    } catch (e) {
      console.error('Token support', e)
    }
  }, [networkId, provider, tokenAddress, tokenSymbol, tokenDecimals])

  return request
}
