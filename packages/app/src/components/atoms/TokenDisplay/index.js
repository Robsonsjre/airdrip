import _ from 'lodash'
import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${props => props.theme.sizes.edge};
  user-select: none;

  & > img {
    height: 26px;
    width: 26px;
    margin-right: 12px;
    background-color: ${props => props.theme.colors.platform};
    border-radius: 50%;
    flex-shrink: 0;
    &[src=''],
    &:not([src]) {
      opacity: 0;
    }
  }

  & > p {
    font-size: 11pt;
    font-weight: 600;
    color: ${props => props.theme.colors.dark};
    margin: 0 !important;
  }

  &[data-visible='false'] {
    display: none;
  }

  ${props =>
    !props.isSelfPadded &&
    css`
      padding: 0;
    `}

  ${props => props.theme.medias.medium} {
    padding: 0 calc(${props => props.theme.sizes.edge} * 1 / 2);
    & > img {
      height: 26px;
      width: 26px;
      margin-right: 8px;
    }
    ${props =>
      !props.isSelfPadded &&
      css`
        padding: 0;
      `}
  }
`

function TokenDisplay ({ token, isSelfPadded }) {
  const symbol = useMemo(() => _.get(token, 'symbol'), [token])
  const icon = useMemo(() => _.get(token, 'icon'), [token])

  return (
    <Wrapper
      data-visible={!_.isNil(token) && !_.isNil(symbol)}
      isSelfPadded={isSelfPadded}
    >
      <img src={icon} alt='' /> <p data-component='token-label'>{symbol}</p>
    </Wrapper>
  )
}

TokenDisplay.propTypes = {
  token: PropTypes.shape({
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  isSelfPadded: PropTypes.bool
}

TokenDisplay.defaultProps = {
  token: null,
  isSelfPadded: true
}

export default TokenDisplay
