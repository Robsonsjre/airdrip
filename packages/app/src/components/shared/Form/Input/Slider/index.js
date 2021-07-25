import _ from 'lodash'
import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useToken } from '../../../../../hooks'
import {
  TokenDisplay,
  TokenMultiDisplay,
  Warning,
  Spinner
} from '../../../../atoms'
import BigNumber from 'bignumber.js'

const WrapperPartial = styled.div`
  display: flex;
  flex-direction: column;
  flex-direction: flex-start;
  align-items: flex-start;
  width: 100%;
  position: relative;
`

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 8px;
  width: 100%;
  position: relative;
  background-color: ${props => props.theme.colors.white};
  min-height: 54px;
`

const Highlight = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  z-index: 200;
  left: 0;
  top: 0;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.borderMedium};
  overflow: hidden;

  &:before {
    content: '';
    left: 0;
    bottom: 0;
    height: 8px;
    width: 8px;
    z-index: 10;
    position: absolute;
    pointer-events: none;
    opacity: 0;
    border-top-right-radius: 6px;
    background-color: ${props => props.theme.colors.borderMedium};
  }
`

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 200;
  height: 30px;
  width: 30px;
  border-radius: 6px;
  background-color: ${props => props.theme.colors.platform};
  margin-right: 6px;
  &[data-neighbour-right='true'] {
    margin-right: -8px;
  }
`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 calc(${props => props.theme.sizes.edge} * 1);
`

const Input = styled.input`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
  cursor: pointer;

  &:focus {
    outline: none;
  }
  &::-moz-focus-outer {
    border: 0;
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background: ${props =>
      props.theme.isDark
        ? props.theme.colors.whiteAbsolute
        : props.theme.gradients.darkReverse};
    border-radius: 100%;
    border: none;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.white};
    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1),
        0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }
  &::-moz-range-thumb {
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background: ${props =>
      props.theme.isDark
        ? props.theme.colors.whiteAbsolute
        : props.theme.gradients.darkReverse};
    border-radius: 100%;
    border: none;
    color: ${props => props.theme.colors.white};
    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1),
        0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }
  &::-ms-thumb {
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background: ${props =>
      props.theme.isDark
        ? props.theme.colors.whiteAbsolute
        : props.theme.gradients.darkReverse};
    border-radius: 100%;
    color: ${props => props.theme.colors.white};
    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1),
        0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }
  &::-webkit-slider-runnable-track {
    background: ${props =>
      props.theme.isDark
        ? props.theme.colors.whiteAbsolute
        : props.theme.colors.grayBlueLight};
    height: 2px;
  }
  &::-moz-range-track {
    background: ${props =>
      props.theme.isDark
        ? props.theme.colors.whiteAbsolute
        : props.theme.colors.grayBlueLight};
    height: 2px;
  }
  &::-ms-track {
    width: 100%;
    border-color: transparent;
    color: transparent;
    background: ${props =>
      props.theme.isDark
        ? props.theme.colors.whiteAbsolute
        : props.theme.colors.grayBlueLight};
    height: 2px;
  }
  &::-ms-fill-lower {
    background: ${props =>
      props.theme.isDark
        ? props.theme.colors.whiteAbsolute
        : props.theme.colors.grayBlueLight};
  }
  &::-ms-fill-upper {
    background: ${props =>
      props.theme.isDark
        ? props.theme.colors.whiteAbsolute
        : props.theme.colors.grayBlueLight};
  }

  &:focus {
    & ~ ${Highlight} {
      border: 1px solid ${props => props.theme.colors.contentMedium};
    }
  }
`

const Display = styled.p`
  z-index: 100;
  text-align: right;
  position: relative;
  font-size: 13pt;
  color: ${props => props.theme.colors.dark};
  font-weight: 600;
  padding: calc(${props => props.theme.sizes.edge} * 1);
  margin: 0;
  flex: 1;
  &:empty {
    &:after{
      content: "${props => props.placeholder}";
      color: ${props => props.theme.colors.content};
      font-size: 12pt;
      font-weight: 500;
      opacity: 1;
    }
  }

  &:not([data-single="true"]){
   flex: none;
   padding-left: 2px;
   padding-right: calc(${props => props.theme.sizes.edge} * 1);
   min-width: 52px;
  }

`

const Wrapper = styled(WrapperPartial)`
  &[data-primary='false'] > ${Box} {
    background-color: transparent;

    ${Highlight} {
      border: 1px solid ${props => props.theme.colors.borderMedium};
    }

    ${Input} {
      pointer-events: none;
      &:focus {
        & ~ ${Highlight} {
          border: 1px solid ${props => props.theme.colors.borderMedium};
        }
      }
    }
  }

  &[data-primary='false'][data-viewonly='false'] {
    & > ${Box} > ${Highlight} {
      &:before {
        opacity: 0.5;
        transition: opacity 150ms;
      }
    }
  }

  ${props => props.theme.medias.medium} {
    ${Input}, ${Display} {
      padding: calc(${props => props.theme.sizes.edge} * 1)
        calc(${props => props.theme.sizes.edge} * 1 / 2);
    }
  }
`

function Slider ({
  id,
  placeholder,
  token,
  min,
  max,
  step,
  value,
  warning,
  onChange,
  onClick,
  isPrimary,
  isViewOnly,
  isLoading
}) {
  const { value: requested } = useToken(token)
  const sanitized = useMemo(() => (!_.isNil(value) ? _.toString(value) : 0), [
    value
  ])
  const reference = useRef()

  return (
    <Wrapper
      data-primary={isPrimary}
      data-viewonly={isViewOnly}
      onClick={e => {
        onClick(e)
        if (!isViewOnly && !_.isNil(reference) && !_.isNil(reference.current)) {
          reference.current.focus()
        }
      }}
    >
      <Box>
        {!isViewOnly ? (
          <>
            <InputWrapper>
              <Input
                size={30}
                type='range'
                aria-labelledby='input slider'
                id={id}
                ref={reference}
                placeholder={placeholder}
                value={sanitized}
                step={step}
                min={min}
                max={max}
                onChange={e => {
                  const value = e.target.value
                  const BN = new BigNumber(value)

                  if (
                    isPrimary &&
                    (_.isNil(value) ||
                      String(value).length === 0 ||
                      BN.isFinite())
                  ) {
                    onChange(e)
                  }
                }}
              />
            </InputWrapper>
            <Display placeholder={placeholder}>{sanitized}%</Display>
          </>
        ) : (
          <Display data-single placeholder={placeholder}>
            {sanitized}%
          </Display>
        )}
        {isLoading && (
          <Loader data-neighbour-right={!_.isNil(requested)}>
            <Spinner color={c => c.content} size={20} />
          </Loader>
        )}
        {!_.isNil(requested) &&
          (_.isArray(requested) ? (
            <TokenMultiDisplay tokens={requested} />
          ) : (
            <TokenDisplay token={requested} />
          ))}
        <Highlight />
      </Box>
      <Warning value={warning} />
    </Wrapper>
  )
}

Slider.propTypes = {
  id: PropTypes.string,
  token: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  isPrimary: PropTypes.bool,
  isViewOnly: PropTypes.bool,
  isLoading: PropTypes.bool,
  warning: PropTypes.string
}

Slider.defaultProps = {
  id: null,
  token: null,
  max: 100,
  min: 0,
  step: 1,
  value: null,
  onChange: () => {},
  onClick: () => {},
  isPrimary: false,
  isViewOnly: false,
  isLoading: false,
  warning: null
}

export default Slider
