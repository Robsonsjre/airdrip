import React from 'react'
import styled from 'styled-components'

import { Create } from '../../components/specific'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 140px;
  width: 100%;
`

export default function DAO () {
  return (
    <Wrapper>
      <Create />
    </Wrapper>
  )
}
