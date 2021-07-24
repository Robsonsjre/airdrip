import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { darken } from 'polished'

const WrapperPartial = styled.div``

const Floating = styled.div`
  position: absolute;
  z-index: 999999999;
  order: 2;
  max-height: 300px;
  width: 200px;
  padding: 8px;

  border-radius: 4px;
  background: ${props => props.theme.colors.dark};
  box-shadow: ${props => props.theme.styles.boxShadowHover};
  overflow-y: auto;
  opacity: 0;
  transition: opacity 0ms;
  pointer-events: none;

  &[data-wrapper='true'] {
    width: auto;
  }

  &[data-force='top'] {
    bottom: 40px;
  }

  &[data-force='bottom'] {
    top: 40px;
  }

  &[data-force='left'] {
    right: 100%;
    margin-left: -5px;
  }
  &[data-force='right'] {
    left: 100%;
    margin-left: 5px;
  }

  &[data-force='top-left'] {
    bottom: 40px;
    right: 40px;
  }

  &[data-force='bottom-left'] {
    top: 40px;
    right: 40px;
  }
  &[data-force='bottom-right'] {
    top: 40px;
    left: 36px;
  }
`

const Text = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.white} !important;
  text-align: left;
  font-size: 9pt;
  font-weight: 500;
  user-select: none;
`

const Wrapper = styled(WrapperPartial)`
  position: relative;
  &:hover,
  &:active,
  &:focus {
    & > ${Floating} {
      opacity: 1;
      transition: opacity 150ms;
      pointer-events: all;
    }
  }
`

const Indicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.grayBlueLight};
  transition: background-color 150ms;
  cursor: pointer;

  & > p {
    margin: 0;
    font-size: 11pt;
    font-weight: 700;
    text-align: center;
    color: ${props => props.theme.colors.grayBlueDark};
    user-select: none;
    transition: color 150ms;
  }

  &:hover,
  &:active,
  &:focus {
    background-color: ${props => darken(0.1, props.theme.colors.grayBlueLight)};
    transition: background-color 150ms;
  }
`

function Helper ({ className, children, force, value, isWrapper }) {
  return (
    <Wrapper className={className} data-purpose='helper-wrapper'>
      {children || (
        <Indicator>
          <p>?</p>
        </Indicator>
      )}
      {value && (
        <Floating
          data-force={force}
          data-wrapper={isWrapper}
          data-purpose='helper-box'
        >
          <Text data-parent='helper'>{value}</Text>
        </Floating>
      )}
    </Wrapper>
  )
}

Helper.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  force: PropTypes.oneOf([
    'left',
    'right',
    'top',
    'top-left',
    'bottom',
    'bottom-left',
    'bottom-right'
  ]),
  isWrapper: PropTypes.bool
}

Helper.defaultProps = {
  className: null,
  value: null,
  force: 'right',
  isWrapper: false
}

export default Helper
