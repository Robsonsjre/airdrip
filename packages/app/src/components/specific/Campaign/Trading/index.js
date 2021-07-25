import React from 'react'
import styled from 'styled-components'
import TradingViewWidget, { Themes, BarStyles } from 'react-tradingview-widget'

const Wrapper = styled.div`
  width: 100%;
  border-radius: ${props => props.theme.sizes.baseRadius};
  padding: calc(${props => props.theme.sizes.edge} * 1);
  background-color: ${props => props.theme.colors.tint('10')};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;

  height: 400px;
`

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

export default function Chart () {
  return (
    <Wrapper>
      <Container>
        <TradingViewWidget
          symbol='BITSTAMP:ETHUSD'
          theme={Themes.DARK}
          style={BarStyles.AREA}
          interval={180}
          locale='en'
          hide_top_toolbar
          autosize
        />
      </Container>
    </Wrapper>
  )
}
