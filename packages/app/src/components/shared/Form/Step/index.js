import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const WrapperPartial = styled.div`
  position: relative;
  grid-column: span 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: calc(${props => props.theme.sizes.edge} * 3 / 2 * 2 - 13px);
  width: 100%;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 3px;
    z-index: 10;
    height: 13px;
    width: 13px;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.white};
  }

  &:after {
    content: '';
    position: absolute;
    left: 6px;
    top: 3px;
    height: 100%;
    z-index: 5;
    border-right: 1px dashed ${props => props.theme.colors.white};
  }

  &[data-last='true'] {
    &:after {
      display: none;
    }
  }
`

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
`

const Wrapper = styled(WrapperPartial)`
  padding-bottom: calc(${props => props.theme.sizes.edge} * 1 / 2);
  &:last-child {
    padding-bottom: 0;
  }
  ${WrapperPartial}, div[data-component="step"] {
    padding-top: calc(${props => props.theme.sizes.edge} * 1 / 2);
    padding-left: calc(${props => props.theme.sizes.edge} * 2 - 13px);
    margin-left: calc(${props => props.theme.sizes.edge} * 1);
    width: calc(100% - ${props => props.theme.sizes.edge});

    &:before {
      bottom: calc(50%);
      top: auto;
      border: 1px solid ${props => props.theme.colors.content};
      background: ${props => props.theme.colors.platform};
    }

    &:after {
      height: 100%;
    }

    &:last-of-type {
      &:before {
        bottom: calc(50% - 4px);
      }
      &:after {
        height: calc(50% - 8px);
      }
    }

    & > ${Content} {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      & > p {
        font-size: 10pt;
        font-weight: 600;
        word-break: none;
        color: ${props => props.theme.colors.white};
        margin: -16px 12px 0 12px;
      }
    }
  }

  ${props => props.theme.medias.medium} {
    padding: 0;
    width: 100%;
    div[data-component='step'] {
      padding-left: 0;
      width: 100%;
    }

    &:before,
    &:after {
      display: none;
    }
    ${WrapperPartial}, div[data-component="step"] {
      padding-left: 8px;
      margin-left: 0;

      &:before,
      &:after {
        display: inherit;
      }
    }
  }
`

function Step ({ className, children, isLast }) {
  return (
    <Wrapper className={className} data-component='step' data-last={isLast}>
      <Content>{children}</Content>
    </Wrapper>
  )
}

Step.propTypes = {
  isLast: PropTypes.bool
}

Step.defaultProps = {
  isLast: false
}

export default Step
