import React from 'react'
import styled, { css, keyframes } from 'styled-components'

import { colors } from '../../../themes'

// eslint-disable-next-line import/no-named-as-default
import Gradient from './Gradient'

export const progress = keyframes`
  0% {
    stroke-dasharray: 0 100;
  }
`

export const progress0To100Stream = keyframes`
  0% {
    opacity: 0.9;
    stroke-dasharray: 0 100;
  }
  40% {
    opacity: 0.9;
    stroke-dasharray: 100 100;
  }
  50% {
    opacity: 0;
    stroke-dasharray: 100 100;
  }
  100% {
    opacity: 0;
    stroke-dasharray: 100 100;
  }
`

export const progress0To100Withdrawn = keyframes`
  0%,
  40% {
    opacity: 0.8;
    stroke-dasharray: 0 100;
  }
  90% {
    opacity: 0.8;
    stroke-dasharray: 100 100;
  }
  100% {
    opacity: 0;
    stroke-dasharray: 100 100;
  }
`

/**
 * To keep the value proportional to 100%, we choose a CIRCUMFERENCE of 100.
 */
const CIRCUMFERENCE = 100
const RADIUS = CIRCUMFERENCE / (2 * Math.PI)
const DIAMETER = RADIUS * 2
const DIVIDER_STROKE_WIDTH = 0.05
const SPACER = 3
const STROKE_WIDTH = 1

/**
 * The size of the container will be a bit bigger than the actual circle, in order to make room for the stroke
 * (will be centered-to-path).
 */
const CONTAINER_WIDTH = DIAMETER + SPACER
const CONTAINER_HEIGHT = CONTAINER_WIDTH
const POINT_CENTER_X = CONTAINER_WIDTH / 2
const POINT_CENTER_Y = CONTAINER_HEIGHT / 2

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 340px;
  height: 340px;
  z-index: 100;
`

const WhiteCircle = styled.circle.attrs({
  cx: POINT_CENTER_X,
  cy: POINT_CENTER_Y
})`
  stroke: ${props => props.theme.colors.tint(10)};
  stroke-width: ${DIVIDER_STROKE_WIDTH};
`

/* See https://stackoverflow.com/questions/29068088/svg-circle-starting-point */
const ProgressCircle = styled.circle.attrs({
  cx: POINT_CENTER_X,
  cy: POINT_CENTER_Y,
  r: RADIUS,
  transform: `rotate(-90 ${POINT_CENTER_Y} ${POINT_CENTER_Y})`
})`
  animation: ${progress} 2000ms ease-out;
  fill: none;
  stroke-linecap: round;
  transition: stroke-dasharray 400ms ease;
`

const StreamedCircle = styled(ProgressCircle)`
  stroke-width: ${STROKE_WIDTH};

  ${props =>
    props.isGrayscale &&
    css`
      filter: grayscale(100%);
    `}
`

const StreamedAnimatedCircle = styled(ProgressCircle)`
  animation: ${progress0To100Stream} 7500ms ease-in-out infinite;
  stroke-dasharray: 0, 100;
  stroke-opacity: 0.5;
  stroke-width: ${STROKE_WIDTH};
`

const WithdrawnCircle = styled(ProgressCircle)`
  stroke-width: ${STROKE_WIDTH + 0.35};
`

const WithdrawnAnimatedCircle = styled(ProgressCircle)`
  animation: ${progress0To100Withdrawn} 9000ms ease-in-out infinite;
  stroke-dasharray: 0, 100;
  stroke-width: ${STROKE_WIDTH + 0.35};
`

export default function Stream ({
  children: _children,
  streamed = 0,
  withdrawn = 0,
  ...otherProps
}) {
  return (
    <Wrapper {...otherProps}>
      <svg viewBox={`0,0 ${CONTAINER_WIDTH},${CONTAINER_HEIGHT} `}>
        <defs>
          <Gradient.Primary />
        </defs>

        <WhiteCircle fill={colors.tint('05')} r={RADIUS + STROKE_WIDTH / 2} />
        <WhiteCircle fill={colors.tint('05')} r={RADIUS - STROKE_WIDTH / 2} />

        <StreamedAnimatedCircle stroke={colors.tint('10')} />
        <StreamedCircle
          stroke={colors.trading}
          strokeDasharray={Math.max(streamed, 1.25) + ', 100'}
        />

        <svg
          viewBox={`
              -${SPACER}
              -${SPACER}
              ${CONTAINER_WIDTH + SPACER * 2}
              ${CONTAINER_HEIGHT + SPACER * 2}
          `}
        >
          <WithdrawnAnimatedCircle stroke={colors.tint('05')} />

          <WithdrawnCircle
            stroke={colors.orange}
            strokeDasharray={Math.max(withdrawn, 1.25) + ', 100'}
          />
        </svg>
      </svg>
    </Wrapper>
  )
}
