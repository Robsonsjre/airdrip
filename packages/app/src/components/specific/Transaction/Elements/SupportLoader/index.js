import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Spinner } from '../../../../atoms'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  background-color: ${props => props.theme.colors.white};
  pointer-events: none;
  opacity: 0;
  transition: opacity 250ms 250ms;

  &[data-active='true'] {
    opacity: 1;
    pointer-events: all;
    transition: opacity 250ms;
  }
`

function Loader ({ isActive }) {
  return (
    <Wrapper data-active={isActive}>
      <Spinner size={40} thickness={1.8} color={c => c.content} />
    </Wrapper>
  )
}

Loader.propTypes = {
  isActive: PropTypes.bool
}

Loader.defaultProps = {
  isActive: true
}

export default Loader
