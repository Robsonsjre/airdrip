import _ from 'lodash'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes, useTheme } from 'styled-components'
import { rgba } from 'polished'
import { colors } from '../../../themes'

const SpinnerCircleAnimation = keyframes`
    0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`

const SpinnerCircleWrapper = styled.div`
  &[data-visible='false'] {
    visibility: hidden;
  }
  &,
  &:after {
    border-radius: 50%;
    width: ${props => props.size || '20'}px;
    height: ${props => props.size || '20'}px;
  }
  & {
    font-size: ${props => props.thickness || '1.5'}px;
    position: relative;
    text-indent: -9999em;
    border-top: 2em solid ${props => rgba(props.color || colors.white, 0.2)};
    border-right: 2em solid ${props => rgba(props.color || colors.white, 0.2)};
    border-bottom: 2em solid ${props => rgba(props.color || colors.white, 0.2)};
    border-left: 2em solid ${props => props.color || colors.white};
    transform: translateZ(0);
    animation: ${SpinnerCircleAnimation} 1.1s infinite linear;
  }
`

function SpinnerCircle ({ className, color, isVisible, size, thickness }) {
  return (
    <SpinnerCircleWrapper
      data-visible={isVisible}
      className={className}
      color={color}
      size={size}
      thickness={thickness}
    />
  )
}

function Spinner ({
  className,
  color: rawColor,
  type = 'circle',
  ...otherProps
}) {
  const theme = useTheme()

  const color = useMemo(
    () =>
      _.isFunction(rawColor)
        ? rawColor(colors, theme.isDark)
        : _.toString(rawColor),
    [rawColor, theme]
  )

  switch (type) {
    case 'circle':
      return (
        <SpinnerCircle color={color} className={className} {...otherProps} />
      )
    default:
      return <></>
  }
}

Spinner.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  size: PropTypes.number,
  thickness: PropTypes.number,
  type: PropTypes.oneOf(['circle', 'circle-path', 'circle-sized']),
  isVisible: PropTypes.bool
}

Spinner.defaultProps = {
  className: null,
  color: colors.white,
  size: 20,
  thickness: 1.5,
  isVisible: true
}

SpinnerCircle.propTypes = Spinner.propTypes
SpinnerCircle.defaultProps = Spinner.defaultProps

export default Spinner
