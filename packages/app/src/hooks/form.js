import _ from 'lodash'
import { useEffect, useMemo, useCallback, useState } from 'react'
import { useTokenAllowance } from './allowance'
import { macros } from '../constants'
import { guards } from '../machines'

export function useFormValidator ({ state, machine }) {
  const [isValid, setIsValid] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    ;(async () => {
      const loaders = Object.values(state).filter(
        item => _.has(item, 'isLoading') && _.get(item, 'isLoading')
      )
      if (_.get(loaders, 'length') !== 0) return

      const validity = await machine.onPrepare({
        context: { payload: { state } }
      })
      setIsValid(validity)
      setIsAllowed(guards.isFormAllowed({ value: state }) === null)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, setIsValid, setIsAllowed])

  return {
    isValid,
    isAllowed
  }
}

/**
 *
 * @param {object} params
 * @param {number|string|null} params.amount Unsanitized amount of tokens to check allowance for
 * @param {SDK.Token} params.token Token object/shape
 * @param {functions} params.onUpdate Update function onUpdate({isAllowed, isLoading})
 * @param {object} params.spender Spender wallet
 * @param {object} params.spender.address Spender wallet address
 */
export function useFormAssetAllowance ({
  amount: unsanitized,
  token,
  spender,
  onUpdate
}) {
  const amount = useMemo(
    () =>
      _.isNilOrEmptyString(unsanitized)
        ? macros.ARBITRARILY_HIGH_APPROVAL_AMOUNT
        : parseFloat(unsanitized),
    [unsanitized]
  )

  /**
   *
   * The hook will react locally to any "amount" updates.
   * Changing the "token" or using the "refresh" method will trigger a clean fetch on the approved balances
   *
   */

  const { value: isAllowed, isLoading, approve, refresh } = useTokenAllowance({
    token,
    amount,
    spender
  })

  const doApprove = useCallback(() => {
    approve({
      option: 1,
      /** ----- */
      amount,
      token,
      onUpdate: refresh
    })
  }, [approve, amount, token, refresh])

  useEffect(() => {
    onUpdate({ isAllowed, isLoading })
  }, [isAllowed, isLoading, onUpdate])

  return { doApprove, doRefresh: refresh }
}

export function useFormPairAllowance ({
  amountTokenB: unsanitizedAmountTokenB,
  tokenB,
  amountTokenA: unsanitizedAmountTokenA,
  tokenA,
  onUpdate,
  spender
}) {
  const amountTokenB = useMemo(
    () =>
      _.isNilOrEmptyString(unsanitizedAmountTokenB)
        ? macros.ARBITRARILY_HIGH_APPROVAL_AMOUNT
        : parseFloat(unsanitizedAmountTokenB),
    [unsanitizedAmountTokenB]
  )

  const amountTokenA = useMemo(
    () =>
      _.isNilOrEmptyString(unsanitizedAmountTokenA)
        ? macros.ARBITRARILY_HIGH_APPROVAL_AMOUNT
        : parseFloat(unsanitizedAmountTokenA),
    [unsanitizedAmountTokenA]
  )

  /**
   *
   * The hook will react locally to any "amount" updates.
   * Changing the "tokenAddress" or using the "refresh" method will trigger a clean fetch on the approved balances
   *
   */

  const {
    value: isAllowedTokenB,
    isLoading: isLoadingTokenB,
    approve: approveTokenB,
    refresh: doRefreshTokenB
  } = useTokenAllowance({
    token: tokenB,
    amount: amountTokenB,
    spender: _.get(spender, 'address')
  })

  const {
    value: isAllowedTokenA,
    isLoading: isLoadingTokenA,
    approve: approveTokenA,
    refresh: doRefreshTokenA
  } = useTokenAllowance({
    token: tokenA,
    amount: amountTokenA,
    spender: _.get(spender, 'address')
  })

  const doApproveTokenB = useCallback(() => {
    approveTokenB({
      amount: amountTokenB,
      token: tokenB,
      onUpdate: doRefreshTokenB
    })
  }, [approveTokenB, amountTokenB, tokenB, doRefreshTokenB])

  const doApproveTokenA = useCallback(() => {
    approveTokenA({
      amount: amountTokenA,
      token: tokenA,
      onUpdate: doRefreshTokenA
    })
  }, [approveTokenA, amountTokenA, tokenA, doRefreshTokenA])

  useEffect(() => {
    onUpdate({ tokenB: isAllowedTokenB, isLoading: isLoadingTokenB })
  }, [isAllowedTokenB, isLoadingTokenB, onUpdate])

  useEffect(() => {
    onUpdate({ tokenA: isAllowedTokenA, isLoading: isLoadingTokenA })
  }, [isAllowedTokenA, isLoadingTokenA, onUpdate])

  return {
    doApproveTokenA,
    doRefreshTokenA,
    doApproveTokenB,
    doRefreshTokenB
  }
}
