import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  max-width: 500px;
`

export function Form ({ className, children, ...props }) {
  return (
    <Wrapper {...props} className={className}>
      {children}
    </Wrapper>
  )
}

export { default as Input } from './Input'
export { default as Label } from './Label'
export { default as Step } from './Step'
