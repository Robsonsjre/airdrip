import React from 'react'
import styled from 'styled-components'
import Stream from '../../../shared/Stream'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: ${props => props.theme.sizes.baseRadius};
  padding: calc(${props => props.theme.sizes.edge} * 1);
  background-color: ${props => props.theme.colors.tint('10')};
  border: 1px solid ${props => props.theme.colors.border};
`

const Container = styled.div`
  width: 100%;
  height: calc(400px - ${props => props.theme.sizes.edge} * 2);
  display: flex;
  justify-content: center;
  align-items: center;
`
const StreamWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
`

const Balances = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`

const Amount = styled.p`
  font-size: 20pt;
  font-weight: 600;
  color: ${props => props.theme.colors.white};
  text-align: center;
  span {
    font-size: 9pt;
    color: ${props => props.theme.colors.tint(80)};
  }
`

export default function Overview () {
  return (
    <Wrapper>
      <Container>
        <StreamWrapper>
          <Stream streamed={50} withdrawn={40} />
          <Balances>
            <Amount>
              2020<span>/4000 ETH</span>
            </Amount>
          </Balances>
        </StreamWrapper>
      </Container>
    </Wrapper>
  )
}
