import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  max-width: 500px;
  grid-column-gap: 30px;
  grid-row-gap: 20px;
  margin: 0 0 30px 0;
`

const Element = styled.div`
  grid-column: span 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`

const ElementLabel = styled.div`
  flex-shrink: 0;
  & > p {
    font-size: 10pt;
    font-weight: 600;
    color: ${props => props.theme.colors.white};
    margin: 0;
    padding-right: 10px;
    text-align: left;
  }
`

const ElementValue = styled.div`
  flex: 1;
  & > p {
    font-size: 10pt;
    font-weight: 600;
    color: ${props => props.theme.colors.tint(90)};
    margin: 0;
    padding-right: 10px;
    text-align: right;
  }

  &[data-simulated='true'] {
    & > p {
      color: ${props => props.theme.colors.contentMedium};
    }
  }
`

const list = [
  {
    label: 'Stream amount',
    value: '4000 ETH'
  },
  {
    label: 'Streamed amount',
    value: '2020 ETH'
  },
  {
    label: 'Remaining amount',
    value: '1980 ETH'
  },
  {
    label: 'Exercisable amount',
    value: '220 ETH'
  },
  {
    label: 'Exercised amount',
    value: '1800 ETH'
  }
]

export default function Info () {
  return (
    <Wrapper>
      {list.map(element => (
        <Element key={_.get(element, 'label')}>
          <ElementLabel>
            <p>{_.get(element, 'label')}</p>
          </ElementLabel>
          <ElementValue data-simulated={_.get(element, 'isSimulated')}>
            <p>{_.get(element, 'value')}</p>
          </ElementValue>
        </Element>
      ))}
    </Wrapper>
  )
}
