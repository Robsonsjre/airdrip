import _ from 'lodash'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useToasts } from 'react-toast-notifications'
import { useModal } from '../../hooks'
import { modals } from '../../constants'
import { toQuantity } from '../../utils'

import useAtomicMachine from '../atoms'
import * as guards from '../guards'

export function useMachine () {
  const { addToast, removeAllToasts } = useToasts()
  const { setOpen, updateData } = useModal(modals.transaction)

  const onPrepare = useCallback(async ({ context }) => {
    const state = _.get(context, 'payload.state')

    const form = await guards.booleanize(() =>
      guards.isFormValid({ value: state, soft: true })
    )

    if (!form) return false

    return true
  }, [])

  const onValidate = useCallback(
    async ({ context }) => {
      const state = _.get(context, 'payload.state')

      const form = await guards.interpret(
        () =>
          guards.isFormValid({
            value: state
          }),
        addToast
      )

      if (form[0] === false) throw new Error(form[1])

      const options = await guards.interpret(
        () =>
          guards.isAmountValid({
            value: _.get(state, 'options.value'),
            max: _.get(state, 'options.max')
          }),
        addToast
      )

      if (options[0] === false) throw new Error(options[1])
    },
    [addToast]
  )

  const onProcess = useCallback(
    async ({ context }) => {
      const payload = _.get(context, 'payload') || {}
      const { option, setup, state } = payload

      const optionAmount = new BigNumber(_.get(state, 'options.value'))

      const optionLabel = toQuantity(optionAmount.toString(), 'option')

      const modalLabel = `${optionLabel} of ${_.get(
        option,
        'underlying.symbol'
      )}:${_.get(option, 'strike.symbol')} Put`

      try {
        setOpen(true, {
          state: 'loading',
          tx: null,
          info: `Preparing to exercise ${modalLabel}. Checking allowances...`
        })

        const allowance = await setup.getTokenAllowance({
          ...setup,
          token: _.get(option, 'underlying'),
          amount: _.get(state, 'options.value')
        })

        if (_.isNil(allowance) || _.get(allowance, 'isAllowed') === false) {
          updateData({
            state: 'warning',
            info:
              'It seems that our app is having trouble figuring out your ERC20 allowance. Please reload the page to fix this problem. Thank you for your help and sorry for the inconvenince!'
          })
          return
        }

        updateData({
          info: `Exercising ${modalLabel}.`
        })

        let rejected = null
        const { helper } = setup
        const isUtility =
          option.underlying.isUtility() || option.underlying.isUtilityWrapped()

        if (isUtility) {
          /**
           * Always send the SDK provided _element back to the SDK
           */

          await helper.doExerciseUtility({
            option: option.fromSDK(),
            optionAmount,
            callback: (error, transactionHash) => {
              if (error) rejected = error
              updateData({
                tx: transactionHash
              })
            }
          })
        } else {
          /**
           * Always send the SDK provided _element back to the SDK
           */

          await helper.doExerciseERC20({
            option: option.fromSDK(),
            optionAmount,
            callback: (error, transactionHash) => {
              if (error) rejected = error
              updateData({
                tx: transactionHash
              })
            }
          })
        }

        if (!_.isNil(rejected)) throw rejected

        removeAllToasts()

        updateData({
          state: 'success',
          info: `Exercised ${modalLabel}.`
        })

        addToast(`${optionLabel} successfully exercised!`, {
          appearance: 'success',
          autoDismiss: true,
          autoDismissTimeout: 5000
        })
      } catch (e) {
        removeAllToasts()

        const reason =
          _.get(e, 'code') === 4001
            ? 'Transaction rejected by the user'
            : 'Transaction failed'

        updateData({
          title: reason,
          state: 'error',
          info: `Attempted to exercise ${modalLabel}.`
        })

        addToast(reason, {
          appearance: 'error',
          autoDismiss: true,
          autoDismissTimeout: 5000
        })
        setup.update()
        throw e
      }
      setup.update()
    },
    [addToast, removeAllToasts, setOpen, updateData]
  )

  const machine = useAtomicMachine({
    id: 'exercise',
    onPrepare,
    onValidate,
    onProcess
  })

  return machine
}

export default {
  useMachine
}
