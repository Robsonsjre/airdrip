import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import IconArrow from '@material-ui/icons/ArrowDownwardRounded'
const Wrapper = styled.div`
  grid-column: span 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const Visit = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.tint(10)};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: none;
  transition: box-shadow 150ms;
  cursor: pointer;

  & > svg {
    font-size: 16pt;
    color: ${props => props.theme.colors.white};
    transform: translateY(0px);
    transition: transform 150ms;
  }

  &:hover,
  &:active {
    box-shadow: ${props => props.theme.styles.boxShadowHover};
    transition: box-shadow 250ms;
    & > svg {
      color: ${props => props.theme.colors.primary};
      transform: translateY(2px);
      transition: transform 250ms;
    }
  }
`

function Actions ({ data, column }) {
  const { value } = data

  return (
    <Wrapper size={_.get(column, 'weight')}>
      <Visit to={value} data-component='action-visit'>
        <IconArrow />
      </Visit>
    </Wrapper>
  )
}

export default Actions
