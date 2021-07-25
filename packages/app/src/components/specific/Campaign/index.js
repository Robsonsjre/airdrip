import React from 'react'
import styled from 'styled-components'

import { ReactComponent as Diamond } from '../../../assets/decorators/diamond.svg'
import Checkout from './Checkout'
import Trading from './Trading'
import Info from './Info'

import Exercise from '../Transaction/Tabs/Hedge/Exercise'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  justify-content: center;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 0 auto;
  width: 100%;
  max-width: ${props => props.theme.sizes.canvasMaxWidth};
`

const Title = styled.h2`
  font-size: 20pt;
  margin: 0 0 30px 0;
  color: ${props => props.theme.colors.white};
`
const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 40px auto;
  & > svg {
    height: 26px;
    width: 26px;
    opacity: 0.8;
  }
`
const Divider = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${props => props.theme.colors.tint(20)};
`

const Playground = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`

const Left = styled.div`
  flex: 1;
`

const Right = styled.div`
  padding-left: calc(${props => props.theme.sizes.edge} * 2);
  width: 460px;
`

function Campaign () {
  return (
    <Wrapper>
      <Container>
        <Row>
          <Divider />
          <Diamond />
          <Divider />
        </Row>
        <Title>Campaign Info</Title>
        <Info />
        <Playground>
          <Left>
            <Trading />
          </Left>
          <Right>
            <Checkout />
          </Right>
        </Playground>
        <Row />
        <Title>Checkout</Title>
        <Exercise />
        <Row>
          <Divider />
          <Diamond />
          <Divider />
        </Row>
      </Container>
    </Wrapper>
  )
}

export default Campaign
