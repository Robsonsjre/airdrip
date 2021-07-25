import _ from 'lodash'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from '../../../atoms'
import IconCheck from '@material-ui/icons/CheckRounded'
import { macros } from '../../../../constants'

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  & > svg {
    position: absolute;
    font-size: 14pt;
  }
`

/**
 *
 * @param {object} props
 * @param {number|string|null} params.amount Unsanitized amount of tokens for visual checks
 * @param {string} props.action Describing the context: hedge, invest, pool (design mostly)
 * @param {string} props.title Title/label for the button
 * @param {bool} props.isAllowed Boolean for controlled state of token allowance button
 * @param {bool} props.isLoading Boolean for loading state
 * @param {function} props.onApprove Function to approve new allowance
 */
function AllowToken ({
  amount,
  action,
  title,
  isAllowed,
  isLoading,
  onApprove
}) {
  const isInvalid = useMemo(
    () =>
      (!_.isNil(amount) && _.toString(amount) === '') ||
      _.toString(amount) === macros.RESTRICTED_PREMIUM,
    [amount]
  )

  if (isInvalid || isAllowed) {
    return (
      <Button
        title='Allowed'
        appearance={a => a.outline}
        accent={a => a.contentMedium}
        childrenLeft={
          <Left>
            <IconCheck />
          </Left>
        }
        type={t => t.button}
        onClick={() => {}}
        isFullWidth
        isDisabledSoft
      />
    )
  }

  return (
    <Button
      title={title || 'Allow'}
      titleShort='Allow'
      appearance={a => a.gradient}
      accent={(a, c) => (c ? a.primary : a.dark)}
      type={t => t.button}
      isLoading={isLoading}
      onClick={onApprove}
      isDisabledSoft={isLoading}
      isFullWidth
    />
  )
}

AllowToken.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  isAllowed: PropTypes.bool,
  isLoading: PropTypes.bool,
  onApprove: PropTypes.func
}

AllowToken.defaultProps = {
  amount: null,
  title: null,
  isAllowed: false,
  isLoading: false,
  onApprove: () => {}
}

export default AllowToken
