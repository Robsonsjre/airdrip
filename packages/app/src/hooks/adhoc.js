import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { useCallback, useState, useEffect } from 'react'
import { useOptions } from './data'
import { useWeb3Utilities } from './web3'
import { macros } from '../constants'

export function useTotalSupplies () {
  const { options, isLoading: isLoadingOptions } = useOptions()
  const { provider, signer, networkId } = useWeb3Utilities()

  const [balances, setBalances] = useState({
    list: [],
    isLoading: true
  })

  const fetchHedges = useCallback(
    async ({ provider, options, setBalances }) => {
      const web3NetworkId = ((await provider.getNetwork()) || {}).chainId

      if (
        _.isNil(networkId) ||
        _.isNil(web3NetworkId) ||
        _.toString(networkId) !== _.toString(web3NetworkId)
      ) {
        return
      }

      const instructions = options.map(async option => {
        const result = [
          _.get(option, 'address'),
          await option.getTotalSupply({ provider })
        ]
        return result
      })

      setBalances(prev => ({
        ...prev,
        isLoading: true
      }))

      const result = await Promise.all(instructions)
        .then(list => list.filter(o => !_.isNil(o)))
        .then(list => {
          const owned = list.filter(item => {
            return item[1].isGreaterThan(
              new BigNumber(macros.MINIMUM_BALANCE_AMOUNT)
            )
          })
          setBalances({ list: owned, isLoading: false })
          return owned
        })

      return result
    },
    [networkId]
  )

  useEffect(() => {
    if (provider && signer && options && !isLoadingOptions) {
      fetchHedges({ provider, signer, options, setBalances })
    } else if (!provider && !signer) {
      setBalances(prev => ({
        ...prev,
        isLoading: false
      }))
    }
  }, [provider, options, signer, isLoadingOptions, fetchHedges, setBalances])

  return {
    list: balances.list,
    fetch: fetchHedges,
    isLoading: isLoadingOptions || balances.isLoading
  }
}
