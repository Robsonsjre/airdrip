import React from 'react'
import styled from 'styled-components'

import { colors } from '../../../../themes'

export const Gradient = styled.linearGradient.attrs({
  gradientUnits: 'userSpaceOnUse'
})``

function PrimaryGradient () {
  return (
    <Gradient id='primaryGradient'>
      <stop offset='0%' stopColor={colors.primary} />
      <stop offset='100%' stopColor={colors.secondary} />
    </Gradient>
  )
}

export default {
  Primary: PrimaryGradient
}
