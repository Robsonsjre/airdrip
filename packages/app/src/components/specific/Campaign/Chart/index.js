import _ from 'lodash'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import Element from './Element'
import Theme from '../../../../themes'

import { useMarketPrices, useOptions } from '../../../../hooks'

const Wrapper = styled.div`
  width: 100%;
  border-radius: ${props => props.theme.sizes.baseRadius};
  padding: calc(${props => props.theme.sizes.edge} * 1);
  background-color: ${props => props.theme.colors.tint('10')};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  width: 600px;
  height: 400px;
`

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

export default function Chart () {
  const { historical, spot } = useMarketPrices()
  const { options } = useOptions()
  const underlying = useMemo(() => _.get(options, '0.underlying'), [options])

  const uValues = useMemo(() => {
    if (_.isNil(underlying) || _.isNil(spot)) return [null, null]
    return [
      _.get(spot, _.get(underlying, 'symbol').toUpperCase()),
      _.get(historical, _.get(underlying, 'symbol').toUpperCase())
    ]
  }, [underlying, spot, historical])

  return (
    <Wrapper>
      <Container>
        <Element
          token={underlying}
          color={Theme.colors.primary}
          spot={uValues[0]}
          dataset={uValues[1] || []}
          isRestricted={false}
        />
      </Container>
    </Wrapper>
  )
}
