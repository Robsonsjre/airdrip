import _ from 'lodash'
import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

const WrapperPartial = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${props => props.theme.sizes.edge};
  user-select: none;

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
    ${props =>
      !props.isSelfPadded &&
      css`
        padding: 0;
      `}
  }
`

const Icons = styled.div`
  margin-right: 12px;
  display: flex;

  & > img {
    height: 26px;
    width: 26px;
    background-color: ${props => props.theme.colors.platform};
    border-radius: 50%;
    flex-shrink: 0;
    &[src=''],
    &:not([src]) {
      opacity: 0;
    }

    margin-left: -8px;
    &:first-child {
      margin-left: 0;
      z-index: 10;
    }

    &:nth-child(2) {
      z-index: 9;
    }
    &:nth-child(3) {
      z-index: 8;
    }
    &:nth-child(4) {
      z-index: 7;
    }
    &:nth-child(5) {
      z-index: 6;
    }
  }
`

const Wrapper = styled(WrapperPartial)`
  &[data-mini='true'] {
    display: flex;
    height: 100%;
    align-items: center;
    & > p {
      font-weight: 500;
      margin-left: -6px !important;
      flex-wrap: nowrap;
      white-space: nowrap;
    }

    ${Icons} {
      flex-shrink: 0;
      & > img {
        height: 20px;
        width: 20px;
        &:not(:first-child) {
          margin-left: -12px;
        }
      }
    }
  }
`

function TokenMultiDisplay ({ tokens, isSelfPadded, isMini }) {
  const symbols = useMemo(
    () => _.toArray(tokens).map(token => _.get(token, 'symbol')),
    [tokens]
  )
  const icons = useMemo(
    () => _.toArray(tokens).map(token => _.get(token, 'icon')),
    [tokens]
  )

  return (
    <Wrapper
      data-visible={!_.isNil(tokens) && !_.isNil(symbols)}
      data-mini={isMini}
      isSelfPadded={isSelfPadded}
    >
      <Icons>
        {icons.map((icon, index) => (
          <img key={index} src={icon} alt='' />
        ))}
      </Icons>
      <p data-component='token-label'>{symbols.join(':')}</p>
    </Wrapper>
  )
}

TokenMultiDisplay.propTypes = {
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  isSelfPadded: PropTypes.bool,
  isMini: PropTypes.bool
}

TokenMultiDisplay.defaultProps = {
  tokens: [],
  isSelfPadded: true,
  isMini: false
}

export default TokenMultiDisplay
