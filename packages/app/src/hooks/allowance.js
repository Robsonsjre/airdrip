import _ from 'lodash'
import { useCallback, useEffect, useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import SDK from '@pods-finance/sdk'
import { useToasts } from 'react-toast-notifications'
import { MAX_UINT } from '../constants'
import { useWeb3Provider, useWeb3Signer, useAccount } from './web3'
import { useHelper } from './data'
import { useVersion } from './ui'

/**
 *
 * Fetch allowance on "tokenAddress" (and spender/owner) updates, check against it on "amount" updates.
 *
 * @param {object} props
 * @param {number} amount Amount to be checked or approved
 * @param {SDK.token} token Token shape
 * @param {string} spender Spender address e.g. the user wallet or the exchange
 * @param {string} owner Forced owner of the tokens - defaults to user wallet
 */
export async function getTokenAllowance ({
  token,
  owner,
  spender,
  provider,
  amount = null
}) {
  try {
    if (_.isNil(token) || _.isNil(owner)) return null
    if (token.isUtility() || token.isUtilityWrapped()) {
      return { allowance: MAX_UINT, decimals: token.decimals }
    }

    console.info('[ ---- ] Requesting token allowance')
    const value = await token.getAllowance({ provider, owner, spender })

    if (!_.isNil(amount)) {
      const check = new BigNumber(amount).multipliedBy(
        10 ** parseInt(token.decimals)
      )

      let isAllowed = false
      if (
        (check.isZero() || check.isNaN()) &&
        !(value.isZero() || value.isNaN())
      ) {
        isAllowed = true
      } else isAllowed = value.isGreaterThanOrEqualTo(check)

      return { allowance: value, decimals: token.decimals, isAllowed }
    }

    return { allowance: value, decimals: token.decimals, isAllowed: undefined }
  } catch (error) {
    console.error('Allowance', error)
    return null
  }
}

export function useApproveTokenAllowance ({ spender, setIsLoading }) {
  const signer = useWeb3Signer()
  const { addToast, removeAllToasts } = useToasts()

  const approve = useCallback(
    async ({ amount, token, onUpdate }) => {
      try {
        if (amount && token) {
          setIsLoading(true)

          addToast('Allowance update in progress...', {
            appearance: 'warning',
            autoDismiss: true,
            autoDismissTimeout: 30000
          })

          const receipt = await SDK.Token.doAllowFor({
            signer,
            spender,
            address: token.address,
            isUtility: false
          })

          if (_.isNil(receipt)) {
            throw new Error('Allowance tx receipt is empty.')
          }

          onUpdate(true)

          removeAllToasts()

          addToast('Allowance update successful!', {
            appearance: 'success',
            autoDismiss: true,
            autoDismissTimeout: 5000
          })
        }
      } catch (error) {
        removeAllToasts()

        addToast('Issue when updating allowance.', {
          appearance: 'error',
          autoDismiss: true,
          autoDismissTimeout: 5000
        })

        console.error('Allowance', { error })
      } finally {
        setIsLoading(false)
      }
    },
    [signer, addToast, removeAllToasts, spender, setIsLoading]
  )

  return approve
}

/**
 *
 * Fetch allowance on "tokenAddress" (and spender/owner) updates, check against it on "amount" updates.
 *
 * @param {object} props
 * @param {number} amount Amount to be checked or approved
 * @param {SDK.token} token Token
 * @param {string} spender Spender address e.g. the user wallet or the exchange
 * @param {string} owner Forced owner of the tokens - defaults to user wallet
 */
export function useTokenAllowance ({
  amount,
  token,
  spender: forceSpender,
  owner: forceOwner
}) {
  const provider = useWeb3Provider()
  const { address } = useAccount()
  const { version } = useVersion()
  const helper = useHelper()
  const owner = useMemo(() => forceOwner || address, [forceOwner, address])
  const spender = useMemo(() => forceSpender || _.get(helper, 'address'), [
    forceSpender,
    helper
  ])

  const [isLoading, setIsLoading] = useState(false)

  const approve = useApproveTokenAllowance({ spender, setIsLoading })

  const [data, setData] = useState({
    allowance: new BigNumber(0),
    decimals: 0
  })

  const fetchAllowance = useCallback(
    async ({ token }) => {
      let value = null
      let decimals = null
      try {
        if (_.isNil(owner) || _.isNil(token) || _.isNil(spender)) {
          ;[value, decimals] = [null, 0]
        } else if (token.isUtility() || token.isUtilityWrapped()) {
          ;[value, decimals] = [MAX_UINT, token.decimals]
        } else {
          setIsLoading(true)
          console.info('[ ---- ] Requesting token allowance')
          const result = await token.getAllowance({ provider, owner, spender })
          ;[value, decimals] = [result, token.decimals]
        }
      } catch (error) {
        console.error('Allowance', error)
      } finally {
        setIsLoading(false)
      }
      setData({ allowance: value, decimals })
      return { allowance: value, decimals }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider, spender, owner]
  )

  useEffect(() => {
    if (token && spender && owner) {
      fetchAllowance({ token })
    }
  }, [token, spender, owner, version, fetchAllowance])

  const checkIsAllowed = useCallback(({ amount, allowance, token }) => {
    if (
      _.isNil(token) ||
      _.isNil(amount) ||
      _.isNilOrEmptyString(amount) ||
      _.isNaN(amount)
    ) {
      return false
    }
    if (token.isUtility() || token.isUtilityWrapped()) return true
    const check = new BigNumber(amount).multipliedBy(
      10 ** parseInt(token.decimals)
    )

    if (
      (check.isZero() || check.isNaN()) &&
      !(allowance.isZero() || allowance.isNaN())
    ) {
      return true
    }

    return allowance && allowance.isGreaterThanOrEqualTo(check)
  }, [])

  const isAllowed = useMemo(() => {
    const { allowance, decimals } = data
    const result = checkIsAllowed({ amount, allowance, decimals, token })
    return result
  }, [amount, data, token, checkIsAllowed])

  /**
   * External check method for special non-hook cases
   */

  const externalCheck = useCallback(
    async ({ amount, token }) => {
      const value = await fetchAllowance({ token })
      const { allowance, decimals } = value
      const result = checkIsAllowed({
        amount,
        allowance,
        decimals,
        token
      })

      return result
    },
    [checkIsAllowed, fetchAllowance]
  )

  const refresh = useCallback(() => fetchAllowance({ token }), [
    fetchAllowance,
    token
  ])

  return {
    approve,
    check: externalCheck,
    refresh,
    value: isAllowed,
    isLoading: isLoading
  }
}

export function useTransactionSetup () {
  const provider = useWeb3Provider()
  const helper = useHelper()
  const { update } = useVersion()
  const { address: owner } = useAccount()

  return useMemo(
    () => ({
      provider,
      owner,
      spender: _.get(helper, 'address'),
      helper,
      update,
      getTokenAllowance
    }),
    [provider, owner, helper, update]
  )
}
