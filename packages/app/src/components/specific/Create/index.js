import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { ReactComponent as Diamond } from '../../../assets/decorators/diamond.svg'
import { Label, Input } from '../../shared/Form'
import { Button } from '../../atoms'
import reducers from '../../../reducers'

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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 30px;
  grid-row-gap: 15px;
`

const Item = styled.div`
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  &[data-button='true'] {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    grid-gap: 15px;
    & > * {
      width: auto;
    }
  }
  &[data-amount='true'] {
    grid-column: span 2;
  }
`

function Create () {
  const { elements, state, dispatch } = reducers.create.useReducer()

  return (
    <Wrapper>
      <Container>
        <Row>
          <Divider />
          <Diamond />
          <Divider />
        </Row>
        <Title>Create a new campaign</Title>
        <Playground>
          <Item>
            <Label>Campaign name</Label>
            <Input.Text
              {...state.name}
              placeholder='e.g. Sushi Vesting'
              onChange={e => {
                dispatch([
                  elements.name,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item>
            <Label>Underlying asset address</Label>
            <Input.Text
              {...state.underlying}
              placeholder='e.g. 0x123...'
              onChange={e => {
                dispatch([
                  elements.underlying,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item>
            <Label>Strike asset address</Label>
            <Input.Text
              {...state.strike}
              placeholder='e.g. 0x456...'
              onChange={e => {
                dispatch([
                  elements.strike,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item>
            <Label>Strike price in $</Label>
            <Input.Text
              {...state.price}
              placeholder='e.g. 2000'
              onChange={e => {
                dispatch([
                  elements.price,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item>
            <Label>Expiration data</Label>
            <Input.Text
              {...state.expiration}
              placeholder='e.g. 20.05.2022'
              onChange={e => {
                dispatch([
                  elements.expiration,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item>
            <Label>Exercise window length (in hours)</Label>
            <Input.Text
              {...state.exercise}
              placeholder='e.g. 48'
              onChange={e => {
                dispatch([
                  elements.exercise,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item data-amount>
            <Label>Campaign Amount</Label>
            <Input.Amount
              {...state.amount}
              placeholder='e.g. 100000'
              onChange={e => {
                dispatch([
                  elements.amount,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item data-button>
            <Button
              title='Allow token'
              appearance={a => a.outline}
              accent={a => a.white}
              type={t => t.button}
              onClick={() => {}}
            />
            <Button
              title='Create token campaign'
              appearance={a => a.gradient}
              accent={a => a.primary}
              type={t => t.button}
              onClick={() => {}}
            />
          </Item>
        </Playground>
        <Row />
        <Row>
          <Divider />
          <Diamond />
          <Divider />
        </Row>
      </Container>
    </Wrapper>
  )
}

export default Create
