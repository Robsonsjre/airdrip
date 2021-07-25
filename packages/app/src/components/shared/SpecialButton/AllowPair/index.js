import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from '../../../atoms'
import IconCheck from '@material-ui/icons/CheckRounded'

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > svg {
    position: absolute;
    font-size: 14pt;
  }
`

const Bubble = styled.span`
  background-color: ${props => props.theme.colors.white};
  border-radius: 8px;
  font-size: 9pt;
  color: ${props => props.theme.colors.dark};
  font-weight: 700;
  height: 16px;
  width: 16px;
  margin-left: 6px;
  text-align: center;
  flex-shrink: 0;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${props => props.theme.medias.small} {
    margin-top: -2px;
  }

  &[data-inactive='true'] {
    opacity: 0.5;
    z-index: 2;
  }

  &:nth-of-type(2) {
    margin-left: -6px;
  }
`

/**
 *
 *
 *
 */

function AllowPair ({
  titleTokenA,
  titleTokenB,
  isAllowedTokenA,
  isAllowedTokenB,
  isLoadingTokenA,
  isLoadingTokenB,
  onApproveTokenA,
  onApproveTokenB
}) {
  if (isAllowedTokenA && isAllowedTokenB) {
    return (
      <Button
        title='Allowed (2/2)'
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

  if (!isAllowedTokenB) {
    return (
      <Button
        title={
          <>
            {titleTokenB}
            <Bubble>1</Bubble>
            <Bubble data-inactive>2</Bubble> of 2
          </>
        }
        appearance={a => a.gradient}
        accent={a => a.dark}
        type={t => t.button}
        isLoading={isLoadingTokenB}
        onClick={onApproveTokenB}
        isFullWidth
        isDisabledSoft={isLoadingTokenB}
      />
    )
  }

  return (
    <Button
      title={
        <>
          {titleTokenA}
          <Bubble data-inactive>1</Bubble>
          <Bubble>2</Bubble> of 2
        </>
      }
      appearance={a => a.gradient}
      accent={a => a.dark}
      type={t => t.button}
      isLoading={isLoadingTokenA}
      onClick={onApproveTokenA}
      isFullWidth
      isDisabledSoft={isLoadingTokenA}
    />
  )
}

AllowPair.propTypes = {
  titleTokenA: PropTypes.string,
  titleTokenB: PropTypes.string,
  isAllowedTokenA: PropTypes.bool,
  isAllowedTokenB: PropTypes.bool,
  isLoadingTokenA: PropTypes.bool,
  isLoadingTokenB: PropTypes.bool,
  onApproveTokenA: PropTypes.func,
  onApproveTokenB: PropTypes.func
}

AllowPair.defaultProps = {
  titleTokenA: 'Allow options',
  titleTokenB: 'Allow token',
  isAllowedTokenA: false,
  isAllowedTokenB: false,
  isLoadingTokenA: false,
  isLoadingTokenB: false,
  onApproveTokenA: () => {},
  onApproveTokenB: () => {}
}

export default AllowPair
