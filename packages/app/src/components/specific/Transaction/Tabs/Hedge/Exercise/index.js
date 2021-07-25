import _ from 'lodash'
import React, { useMemo, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { ContentBox, ContentSection, ContentSummary } from '../../../Elements'
import {
  Form as FormPartial,
  Step as StepPartial,
  Label,
  Input
} from '../../../../../shared/Form'

import { SpecialButton } from '../../../../../shared'

import reducers from '../../../../../../reducers'
import machines from '../../../../../../machines'

import {
  useOptionInfo,
  useOwnBalance,
  useTransactionSetup,
  useFormValidator,
  useFormAssetAllowance
} from '../../../../../../hooks'

import logic from './logic'
import BigNumber from 'bignumber.js'

const Wrapper = styled.div`
  width: 100%;
  padding-top: calc(${props => props.theme.sizes.edge} * 1);
  & > * {
    margin-bottom: calc(${props => props.theme.sizes.edge} * 3 / 2);
    &:last-child {
      margin-bottom: 0;
    }
  }
  ${props => props.theme.medias.minSmall} {
    div[data-step='actions'] {
      & > div:first-child {
        min-width: 238px;
      }
    }
  }
`
const Form = styled(FormPartial)`
  max-width: 500px;
`

const Info = styled.p``

const Step = styled(StepPartial)`
  ${Info} {
    min-width: 110px;
  }
`

function Exercise () {
  /**
   * --------------------------------------
   * Required data and utilities
   * --------------------------------------
   */
  const machine = machines.exercise.useMachine()
  const setup = useTransactionSetup()
  const { elements, state, dispatch } = reducers.exercise.useReducer()
  const {
    option,
    helper,
    underlying,
    strike,
    isLoading: isOptionLoading
  } = useOptionInfo()

  const {
    value: balanceUnderlying,
    isLoading: isBalanceUnderlyingLoading
  } = useOwnBalance(underlying)

  const {
    value: balanceOptions,
    isLoading: isBalanceOptionsLoading
  } = useOwnBalance({
    address: _.get(option, 'address'),
    decimals: _.get(option, 'decimals')
  })

  const isLoading = useMemo(
    () =>
      isOptionLoading || isBalanceUnderlyingLoading || isBalanceOptionsLoading,
    [isOptionLoading, isBalanceUnderlyingLoading, isBalanceOptionsLoading]
  )

  const balanceExercisable = useMemo(() => {
    if (
      isBalanceOptionsLoading ||
      isBalanceUnderlyingLoading ||
      _.isNil(balanceOptions) ||
      _.isNil(balanceUnderlying)
    ) {
      return new BigNumber(0)
    }
    const max = BigNumber.min(balanceOptions, balanceUnderlying)

    const result = max.isGreaterThan(0.000001)
      ? underlying && (underlying.isUtility() || underlying.isUtilityWrapped())
        ? max.minus(0.01)
        : max
      : new BigNumber(0)

    return result
  }, [
    underlying,
    balanceOptions,
    balanceUnderlying,
    isBalanceUnderlyingLoading,
    isBalanceOptionsLoading
  ])

  const { isValid: isFormValid, isAllowed: isFormAllowed } = useFormValidator({
    state,
    machine
  })

  /**
   * --------------------------------------
   *  Methods and state updaters
   * --------------------------------------
   */

  const doAllowanceUpdate = useCallback(
    ({ isAllowed, isLoading }) => {
      dispatch([elements.allowance, { underlying: isAllowed, isLoading }])
    },
    [elements, dispatch]
  )

  const onChangeAmount = useCallback(
    amount =>
      logic.onChangeAmount({
        amount,
        dispatch,
        elements,
        option,
        balanceExercisable
      }),
    [dispatch, elements, option, balanceExercisable]
  )

  const onTransact = useCallback(
    () => logic.onTransact({ machine, state, option, setup }),
    [machine, state, option, setup]
  )

  const {
    doApprove: doAllowanceApprove,
    doRefresh: doAllowanceRefresh
  } = useFormAssetAllowance({
    amount: _.get(state, 'underlying.value'),
    token: underlying,
    spender: _.get(helper, 'address'),
    onUpdate: doAllowanceUpdate
  })

  useEffect(() => {
    if (!isLoading) {
      logic.onInitialize({
        elements,
        dispatch,
        underlying,
        strike,
        balanceExercisable
      })

      doAllowanceRefresh()
    }
  }, [
    elements,
    dispatch,
    isLoading,
    underlying,
    strike,
    balanceExercisable,
    doAllowanceRefresh
  ])

  return (
    <ContentBox hash='exercise' isLoading={isLoading}>
      <Wrapper>
        <ContentSection
          title='Exercise your options'
          isContained
          isDisabled={[
            machine.states.validate,
            machine.states.process
          ].includes(machine.current.value)}
        >
          <Form>
            <Step>
              <Label>Step 1. Amount to exercise</Label>
              <Input.Amount
                {...state.options}
                placeholder='Enter amount'
                onChange={e => onChangeAmount(_.get(e, 'target.value'))}
              />
              <Step>
                <Info style={{ whiteSpace: 'nowrap' }}>Enable selling of</Info>
                <Input.Amount
                  {...state.underlying}
                  placeholder='0'
                  isViewOnly
                />
              </Step>
              <Step>
                <Info style={{ whiteSpace: 'nowrap' }}>In exchange for</Info>
                <Input.Amount {...state.strike} placeholder='0' isViewOnly />
              </Step>
            </Step>
            <ContentSummary
              index={2}
              data={{
                option,
                max: balanceExercisable
              }}
              allow={
                <SpecialButton.AllowToken
                  amount={_.get(state, 'underlying.value')}
                  title={`Allow ${_.get(underlying, 'symbol')}`}
                  isAllowed={_.get(state, 'allowance.underlying')}
                  isLoading={_.get(state, 'allowance.isLoading')}
                  onApprove={doAllowanceApprove}
                />
              }
              transact={
                <SpecialButton.Transact
                  title='Exercise Options'
                  isDisabled={!isFormValid}
                  isAllowed={isFormAllowed}
                  isLoading={[
                    machine.states.validate,
                    machine.states.process
                  ].includes(machine.current.value)}
                  onClick={onTransact}
                />
              }
            />
          </Form>
        </ContentSection>
      </Wrapper>
    </ContentBox>
  )
}

export default Exercise
