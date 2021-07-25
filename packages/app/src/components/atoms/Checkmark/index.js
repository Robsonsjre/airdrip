import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const AnimateBorder = keyframes`
   0% {
        stroke-dasharray: 0,330;
        stroke-dashoffset: 0;
        opacity: 1;
    }

    80% {
        stroke-dasharray: 330,330;
        stroke-dashoffset: 0;
        opacity: 1;
    }

    100%{
        opacity: 1;
    }
`

const AnimateCheck = keyframes`
   0% {
        stroke-dasharray: 49,80;
        stroke-dashoffset: 48;
        opacity: 0;
    }

    50% {
        stroke-dasharray: 49,80;
        stroke-dashoffset: 48;
        opacity: 1;
    }

    100% {
        stroke-dasharray: 130,80;
        stroke-dashoffset: 48;
    }
`

const AnimateFirstLine = keyframes`
    0% {
        stroke-dasharray: 0,56;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 0,56;
        stroke-dashoffset: 0;
    }

    100% {
        stroke-dasharray: 56,330;
        stroke-dashoffset: 0;
    }
`

const AnimateLastLine = keyframes`
        0% {
        stroke-dasharray: 0,55;
        stroke-dashoffset: 1;
    }

    50% {
        stroke-dasharray: 0,55;
        stroke-dashoffset: 1;
    }

    100% {
        stroke-dasharray: 55,0;
        stroke-dashoffset: 70;
    }
`

const Border = styled.svg`
  stroke-dasharray: 330;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  opacity: 1;
  animation: 1.5s ${AnimateBorder} ease-out;
`

const Check = styled.svg`
  stroke-width: 5;
  stroke-linecap: round;
  position: absolute;
  top: 56px;
  left: 49px;
  width: 52px;
  height: 40px;

  & > path {
    animation: 1.5s ${AnimateCheck} ease-out;
  }
`

const Cross = styled.svg`
  stroke-width: 5;
  stroke-linecap: round;
  position: absolute;
  top: 54px;
  left: 54px;
  width: 40px;
  height: 40px;

  path.first-line {
    animation: 0.7s ${AnimateFirstLine} ease-out;
  }

  path.last-line {
    animation: 0.7s ${AnimateLastLine} ease-out;
  }
`

const Box = styled.div`
  display: flex;
  position: relative;
  height: 150px;
  width: 150px;

  &[data-type='success'] {
    svg {
      stroke: #7cb342;
    }
  }

  &[data-type='warning'] {
    svg {
      stroke: #ffc107;
    }
  }

  &[data-type='error'] {
    svg {
      stroke: #ff6245;
    }
  }
`

function Checkmark ({ type }) {
  return (
    <Box data-type={type}>
      <Border>
        <circle
          className='path'
          cx='75'
          cy='75'
          r='50'
          fill='none'
          strokeWidth='4'
          strokeMiterlimit='10'
        />
      </Border>
      {type === 'success' && (
        <Check>
          <g transform='matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-489.57,-205.679)'>
            <path
              fill='none'
              d='M616.306,283.025L634.087,300.805L673.361,261.53'
            />
          </g>
        </Check>
      )}
      {type === 'error' && (
        <Cross>
          <g transform='matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-502.652,-204.518)'>
            <path d='M634.087,300.805L673.361,261.53' fill='none' />
          </g>
          <g transform='matrix(-1.28587e-16,-0.79961,0.79961,-1.28587e-16,-204.752,543.031)'>
            <path d='M634.087,300.805L673.361,261.53' />
          </g>
        </Cross>
      )}
    </Box>
  )
}

Checkmark.propTypes = {
  type: PropTypes.oneOf(['success', 'error'])
}

Checkmark.defaultProps = {
  type: 'success'
}

export default Checkmark
